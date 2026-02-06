package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Event struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	DomainID  primitive.ObjectID `bson:"domain_id" json:"domain_id"`
	Timestamp time.Time          `bson:"timestamp" json:"timestamp"`
	IPHash    string             `bson:"ip_hash" json:"ip_hash"`
	UserAgent string             `bson:"user_agent" json:"user_agent"`
	Path      string             `bson:"path" json:"path"`
	Referrer  string             `bson:"referrer" json:"referrer"`
	Country   string             `bson:"country" json:"country"`
	Device    string             `bson:"device" json:"device"`
	Browser   string             `bson:"browser" json:"browser"`
	VisitorID string             `bson:"visitor_id" json:"visitor_id"`
}

type TrackRequest struct {
	Path      string `json:"path" binding:"required"`
	Referrer  string `json:"referrer"`
	UserAgent string `json:"user_agent"`
	VisitorID string `json:"visitor_id"`
}

type RealtimeStats struct {
	ActiveVisitors int             `json:"active_visitors"`
	HitsPerMinute  []HitsPerMinute `json:"hits_per_minute"`
	TopPages       []PageStats     `json:"top_pages"`
	TopReferrers   []ReferrerStats `json:"top_referrers"`
	Countries      map[string]int  `json:"countries"`
	Devices        map[string]int  `json:"devices"`
	Browsers       map[string]int  `json:"browsers"`
}

type HitsPerMinute struct {
	Minute string `json:"minute"`
	Hits   int    `json:"hits"`
}

type PageStats struct {
	Path string `json:"path"`
	Hits int    `json:"hits"`
}

type ReferrerStats struct {
	Referrer string `json:"referrer"`
	Hits     int    `json:"hits"`
}

type OverviewStats struct {
	TotalHits      int64   `json:"total_hits"`
	UniqueVisitors int64   `json:"unique_visitors"`
	AvgSessionTime float64 `json:"avg_session_time"`
	BounceRate     float64 `json:"bounce_rate"`
}
