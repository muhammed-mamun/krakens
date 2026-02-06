package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nesohq/backend/internal/domain"
	"github.com/nesohq/backend/internal/service"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TrackingHandler struct {
	trackingService *service.TrackingService
	apiKeyService   *service.APIKeyService
}

func NewTrackingHandler(trackingService *service.TrackingService, apiKeyService *service.APIKeyService) *TrackingHandler {
	return &TrackingHandler{
		trackingService: trackingService,
		apiKeyService:   apiKeyService,
	}
}

func (h *TrackingHandler) Track(c *gin.Context) {
	apiKey := c.GetHeader("X-API-Key")
	if apiKey == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "API key required"})
		return
	}

	// Validate API key
	key, err := h.apiKeyService.Validate(c.Request.Context(), apiKey)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid API key"})
		return
	}

	var req domain.TrackRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get domain ID (use first domain for now)
	if len(key.DomainIDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "no domains associated with API key"})
		return
	}

	domainID := key.DomainIDs[0]
	ip := c.ClientIP()
	userAgent := c.GetHeader("User-Agent")

	if err := h.trackingService.Track(c.Request.Context(), domainID, &req, ip, userAgent); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "tracked"})
}

func (h *TrackingHandler) GetRealtimeStats(c *gin.Context) {
	domainID, _ := primitive.ObjectIDFromHex(c.Query("domain_id"))

	stats, err := h.trackingService.GetRealtimeStats(c.Request.Context(), domainID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, stats)
}

func (h *TrackingHandler) GetOverviewStats(c *gin.Context) {
	domainID, _ := primitive.ObjectIDFromHex(c.Query("domain_id"))

	stats, err := h.trackingService.GetOverviewStats(c.Request.Context(), domainID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, stats)
}
