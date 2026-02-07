package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/nesohq/backend/internal/config"
	"github.com/nesohq/backend/internal/domain"
	"github.com/nesohq/backend/internal/handler"
	"github.com/nesohq/backend/internal/infrastructure/cache"
	"github.com/nesohq/backend/internal/infrastructure/db"
	"github.com/nesohq/backend/internal/infrastructure/queue"
	"github.com/nesohq/backend/internal/middleware"
	"github.com/nesohq/backend/internal/repository"
	"github.com/nesohq/backend/internal/service"
)

func main() {
	// Load config
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Failed to load config:", err)
	}

	// Initialize MongoDB
	mongodb, err := db.NewMongoDB(cfg.MongoDBURI, cfg.MongoDBDatabase)
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}
	defer mongodb.Close()

	// Initialize Redis
	redisCache, err := cache.NewRedisCache(cfg.RedisURL)
	if err != nil {
		log.Fatal("Failed to connect to Redis:", err)
	}
	defer redisCache.Close()

	// Initialize NATS
	natsQueue, err := queue.NewNATSQueue(cfg.NATSURL)
	if err != nil {
		log.Fatal("Failed to connect to NATS:", err)
	}
	defer natsQueue.Close()

	// Initialize repositories
	userRepo := repository.NewUserRepository(mongodb.Database)
	domainRepo := repository.NewDomainRepository(mongodb.Database)
	apiKeyRepo := repository.NewAPIKeyRepository(mongodb.Database)
	eventRepo := repository.NewEventRepository(mongodb.Database)

	// Initialize services
	authService := service.NewAuthService(userRepo, cfg.JWTSecret)
	domainService := service.NewDomainService(domainRepo)
	apiKeyService := service.NewAPIKeyService(apiKeyRepo)
	trackingService := service.NewTrackingService(eventRepo, redisCache, natsQueue)

	// Initialize handlers
	authHandler := handler.NewAuthHandler(authService)
	domainHandler := handler.NewDomainHandler(domainService)
	apiKeyHandler := handler.NewAPIKeyHandler(apiKeyService)
	trackingHandler := handler.NewTrackingHandler(trackingService, apiKeyService)
	badgeHandler := handler.NewBadgeHandler(trackingService)
	avatarHandler := handler.NewAvatarHandler()

	// Start event worker
	go startEventWorker(natsQueue, eventRepo)

	// Setup router
	router := gin.Default()

	// Tracking endpoint (with permissive CORS - needs to accept requests from any website)
	router.OPTIONS("/api/track", middleware.TrackingCORSMiddleware())
	router.POST("/api/track", middleware.TrackingCORSMiddleware(), trackingHandler.Track)

	// Public Assets (Badges, Avatars) - accessible from any origin
	router.OPTIONS("/api/badges/:domain_id/live.svg", middleware.PublicGetCORSMiddleware())
	router.GET("/api/badges/:domain_id/live.svg", middleware.PublicGetCORSMiddleware(), badgeHandler.GetLiveBadge)

	router.OPTIONS("/api/avatars/:seed", middleware.PublicGetCORSMiddleware())
	router.GET("/api/avatars/:seed", middleware.PublicGetCORSMiddleware(), avatarHandler.GetAvatar)

	// Public routes (with restricted CORS)
	router.OPTIONS("/api/auth/register", middleware.CORSMiddleware(cfg.FrontendURL))
	router.OPTIONS("/api/auth/login", middleware.CORSMiddleware(cfg.FrontendURL))

	public := router.Group("/api")
	public.Use(middleware.CORSMiddleware(cfg.FrontendURL))
	{
		public.POST("/auth/register", authHandler.Register)
		public.POST("/auth/login", authHandler.Login)
	}

	// Protected routes
	router.OPTIONS("/api/stats/realtime", middleware.CORSMiddleware(cfg.FrontendURL))
	router.OPTIONS("/api/stats/overview", middleware.CORSMiddleware(cfg.FrontendURL))
	router.OPTIONS("/api/domains", middleware.CORSMiddleware(cfg.FrontendURL))
	router.OPTIONS("/api/domains/:id", middleware.CORSMiddleware(cfg.FrontendURL))
	router.OPTIONS("/api/api-keys", middleware.CORSMiddleware(cfg.FrontendURL))
	router.OPTIONS("/api/api-keys/:id", middleware.CORSMiddleware(cfg.FrontendURL))

	protected := router.Group("/api")
	protected.Use(middleware.CORSMiddleware(cfg.FrontendURL))
	protected.Use(middleware.AuthMiddleware(cfg.JWTSecret))
	{
		// Domains
		protected.GET("/domains", domainHandler.List)
		protected.POST("/domains", domainHandler.Create)
		protected.GET("/domains/:id", domainHandler.GetByID)
		protected.PUT("/domains/:id", domainHandler.Update)
		protected.DELETE("/domains/:id", domainHandler.Delete)

		// API Keys
		protected.GET("/api-keys", apiKeyHandler.List)
		protected.POST("/api-keys", apiKeyHandler.Create)
		protected.DELETE("/api-keys/:id", apiKeyHandler.Revoke)

		// Stats
		protected.GET("/stats/realtime", trackingHandler.GetRealtimeStats)
		protected.GET("/stats/overview", trackingHandler.GetOverviewStats)
	}

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Start server
	addr := fmt.Sprintf(":%s", cfg.Port)
	log.Printf("Server starting on %s", addr)
	if err := router.Run(addr); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func startEventWorker(natsQueue *queue.NATSQueue, eventRepo *repository.EventRepository) {
	log.Println("Starting event worker...")

	_, err := natsQueue.Subscribe("events", func(data []byte) {
		var event domain.Event
		if err := json.Unmarshal(data, &event); err != nil {
			log.Printf("Failed to unmarshal event: %v", err)
			return
		}

		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		if err := eventRepo.Create(ctx, &event); err != nil {
			log.Printf("Failed to save event: %v", err)
		}
	})

	if err != nil {
		log.Fatal("Failed to subscribe to events:", err)
	}
}
