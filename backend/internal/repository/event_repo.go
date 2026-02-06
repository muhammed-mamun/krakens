package repository

import (
	"context"
	"time"

	"github.com/nesohq/backend/internal/domain"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type EventRepository struct {
	collection *mongo.Collection
}

func NewEventRepository(db *mongo.Database) *EventRepository {
	return &EventRepository{
		collection: db.Collection("events"),
	}
}

func (r *EventRepository) Create(ctx context.Context, event *domain.Event) error {
	event.Timestamp = time.Now()
	_, err := r.collection.InsertOne(ctx, event)
	return err
}

func (r *EventRepository) GetRecentEvents(ctx context.Context, domainID primitive.ObjectID, minutes int) ([]*domain.Event, error) {
	since := time.Now().Add(-time.Duration(minutes) * time.Minute)

	cursor, err := r.collection.Find(
		ctx,
		bson.M{
			"domain_id": domainID,
			"timestamp": bson.M{"$gte": since},
		},
		options.Find().SetSort(bson.D{{Key: "timestamp", Value: -1}}),
	)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var events []*domain.Event
	if err := cursor.All(ctx, &events); err != nil {
		return nil, err
	}
	return events, nil
}

func (r *EventRepository) CountTotal(ctx context.Context, domainID primitive.ObjectID) (int64, error) {
	return r.collection.CountDocuments(ctx, bson.M{"domain_id": domainID})
}

func (r *EventRepository) CountUnique(ctx context.Context, domainID primitive.ObjectID, since time.Time) (int64, error) {
	pipeline := mongo.Pipeline{
		{{Key: "$match", Value: bson.M{
			"domain_id": domainID,
			"timestamp": bson.M{"$gte": since},
		}}},
		{{Key: "$group", Value: bson.M{
			"_id": "$visitor_id",
		}}},
		{{Key: "$count", Value: "total"}},
	}

	cursor, err := r.collection.Aggregate(ctx, pipeline)
	if err != nil {
		return 0, err
	}
	defer cursor.Close(ctx)

	var result []bson.M
	if err := cursor.All(ctx, &result); err != nil {
		return 0, err
	}

	if len(result) > 0 {
		return int64(result[0]["total"].(int32)), nil
	}
	return 0, nil
}
