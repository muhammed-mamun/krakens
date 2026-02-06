package repository

import (
	"context"
	"time"

	"github.com/nesohq/backend/internal/domain"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type APIKeyRepository struct {
	collection *mongo.Collection
}

func NewAPIKeyRepository(db *mongo.Database) *APIKeyRepository {
	return &APIKeyRepository{
		collection: db.Collection("api_keys"),
	}
}

func (r *APIKeyRepository) Create(ctx context.Context, apiKey *domain.APIKey) error {
	apiKey.CreatedAt = time.Now()
	result, err := r.collection.InsertOne(ctx, apiKey)
	if err != nil {
		return err
	}
	apiKey.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *APIKeyRepository) FindByKey(ctx context.Context, key string) (*domain.APIKey, error) {
	var apiKey domain.APIKey
	err := r.collection.FindOne(ctx, bson.M{"key": key, "revoked": false}).Decode(&apiKey)
	if err != nil {
		return nil, err
	}
	return &apiKey, nil
}

func (r *APIKeyRepository) FindByUserID(ctx context.Context, userID primitive.ObjectID) ([]*domain.APIKey, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var apiKeys []*domain.APIKey
	if err := cursor.All(ctx, &apiKeys); err != nil {
		return nil, err
	}
	return apiKeys, nil
}

func (r *APIKeyRepository) Revoke(ctx context.Context, id primitive.ObjectID) error {
	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"_id": id},
		bson.M{"$set": bson.M{"revoked": true}},
	)
	return err
}
