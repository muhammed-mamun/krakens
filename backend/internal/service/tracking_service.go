package service

import (
	"context"
	"fmt"
	"time"

	"github.com/nesohq/backend/internal/domain"
	"github.com/nesohq/backend/internal/infrastructure/cache"
	"github.com/nesohq/backend/internal/infrastructure/queue"
	"github.com/nesohq/backend/internal/repository"
	"github.com/nesohq/backend/internal/utils"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TrackingService struct {
	eventRepo *repository.EventRepository
	cache     *cache.RedisCache
	queue     *queue.NATSQueue
}

func NewTrackingService(
	eventRepo *repository.EventRepository,
	cache *cache.RedisCache,
	queue *queue.NATSQueue,
) *TrackingService {
	return &TrackingService{
		eventRepo: eventRepo,
		cache:     cache,
		queue:     queue,
	}
}

func (s *TrackingService) Track(ctx context.Context, domainID primitive.ObjectID, req *domain.TrackRequest, ip, userAgent string) error {
	// Parse user agent
	uaInfo := utils.ParseUserAgent(userAgent)

	// Create event
	event := &domain.Event{
		DomainID:  domainID,
		Path:      req.Path,
		Referrer:  req.Referrer,
		UserAgent: userAgent,
		IPHash:    utils.HashIP(ip),
		Browser:   uaInfo.Browser,
		Device:    uaInfo.Device,
		Country:   "Unknown", // TODO: Add GeoIP
		VisitorID: req.VisitorID,
	}

	// Publish to queue for async processing
	if err := s.queue.Publish("events", event); err != nil {
		return err
	}

	// Increment real-time counters
	activeKey := fmt.Sprintf("active:%s", domainID.Hex())
	visitorKey := fmt.Sprintf("visitor:%s:%s", domainID.Hex(), req.VisitorID)

	// Mark visitor as active
	if err := s.cache.Set(ctx, visitorKey, "1", 5*time.Minute); err != nil {
		return err
	}

	// Increment active counter
	if err := s.cache.Incr(ctx, activeKey); err != nil {
		return err
	}

	// Publish real-time update
	s.cache.Publish(ctx, fmt.Sprintf("realtime:%s", domainID.Hex()), event)

	return nil
}

func (s *TrackingService) GetRealtimeStats(ctx context.Context, domainID primitive.ObjectID) (*domain.RealtimeStats, error) {
	// Get active visitors count
	activeKey := fmt.Sprintf("active:%s", domainID.Hex())
	activeStr, err := s.cache.Get(ctx, activeKey)
	activeVisitors := 0
	if err == nil {
		fmt.Sscanf(activeStr, "%d", &activeVisitors)
	}

	// Get recent events
	events, err := s.eventRepo.GetRecentEvents(ctx, domainID, 60)
	if err != nil {
		return nil, err
	}

	// Aggregate stats
	stats := &domain.RealtimeStats{
		ActiveVisitors: activeVisitors,
		HitsPerMinute:  []domain.HitsPerMinute{},
		TopPages:       []domain.PageStats{},
		TopReferrers:   []domain.ReferrerStats{},
		Countries:      make(map[string]int),
		Devices:        make(map[string]int),
		Browsers:       make(map[string]int),
	}

	// Aggregate data
	pageHits := make(map[string]int)
	referrerHits := make(map[string]int)

	for _, event := range events {
		pageHits[event.Path]++
		if event.Referrer != "" {
			referrerHits[event.Referrer]++
		}
		stats.Countries[event.Country]++
		stats.Devices[event.Device]++
		stats.Browsers[event.Browser]++
	}

	// Convert to slices
	for path, hits := range pageHits {
		stats.TopPages = append(stats.TopPages, domain.PageStats{Path: path, Hits: hits})
	}
	for referrer, hits := range referrerHits {
		stats.TopReferrers = append(stats.TopReferrers, domain.ReferrerStats{Referrer: referrer, Hits: hits})
	}

	return stats, nil
}

func (s *TrackingService) GetOverviewStats(ctx context.Context, domainID primitive.ObjectID) (*domain.OverviewStats, error) {
	totalHits, err := s.eventRepo.CountTotal(ctx, domainID)
	if err != nil {
		return nil, err
	}

	since := time.Now().Add(-24 * time.Hour)
	uniqueVisitors, err := s.eventRepo.CountUnique(ctx, domainID, since)
	if err != nil {
		return nil, err
	}

	return &domain.OverviewStats{
		TotalHits:      totalHits,
		UniqueVisitors: uniqueVisitors,
		AvgSessionTime: 0, // TODO: Calculate
		BounceRate:     0, // TODO: Calculate
	}, nil
}
