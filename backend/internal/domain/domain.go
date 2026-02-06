package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Domain struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID `bson:"user_id" json:"user_id"`
	Domain    string             `bson:"domain" json:"domain"`
	Verified  bool               `bson:"verified" json:"verified"`
	Settings  DomainSettings     `bson:"settings" json:"settings"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updated_at"`
}

type DomainSettings struct {
	AnonymizeIP      bool   `bson:"anonymize_ip" json:"anonymize_ip"`
	RateLimit        int    `bson:"rate_limit" json:"rate_limit"`
	TrackQueryParams bool   `bson:"track_query_params" json:"track_query_params"`
	SessionTimeout   int    `bson:"session_timeout" json:"session_timeout"`
	Timezone         string `bson:"timezone" json:"timezone"`
}

type CreateDomainRequest struct {
	Domain string `json:"domain" binding:"required"`
}

type UpdateDomainRequest struct {
	Settings DomainSettings `json:"settings"`
}
