package domain

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type APIKey struct {
	ID        primitive.ObjectID   `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID   `bson:"user_id" json:"user_id"`
	Key       string               `bson:"key" json:"key"`
	DomainIDs []primitive.ObjectID `bson:"domain_ids" json:"domain_ids"`
	Revoked   bool                 `bson:"revoked" json:"revoked"`
	CreatedAt time.Time            `bson:"created_at" json:"created_at"`
}

type CreateAPIKeyRequest struct {
	DomainIDs []string `json:"domain_ids"`
}
