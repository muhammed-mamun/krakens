package repository

import (
	"context"
	"time"

	"github.com/nesohq/backend/internal/domain"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type DomainRepository struct {
	collection *mongo.Collection
}

func NewDomainRepository(db *mongo.Database) *DomainRepository {
	return &DomainRepository{
		collection: db.Collection("domains"),
	}
}

func (r *DomainRepository) Create(ctx context.Context, d *domain.Domain) error {
	d.CreatedAt = time.Now()
	d.UpdatedAt = time.Now()
	result, err := r.collection.InsertOne(ctx, d)
	if err != nil {
		return err
	}
	d.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *DomainRepository) FindByID(ctx context.Context, id primitive.ObjectID) (*domain.Domain, error) {
	var d domain.Domain
	err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&d)
	if err != nil {
		return nil, err
	}
	return &d, nil
}

func (r *DomainRepository) FindByUserID(ctx context.Context, userID primitive.ObjectID) ([]*domain.Domain, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var domains []*domain.Domain
	if err := cursor.All(ctx, &domains); err != nil {
		return nil, err
	}
	return domains, nil
}

func (r *DomainRepository) Update(ctx context.Context, d *domain.Domain) error {
	d.UpdatedAt = time.Now()
	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"_id": d.ID},
		bson.M{"$set": d},
	)
	return err
}

func (r *DomainRepository) Delete(ctx context.Context, id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(ctx, bson.M{"_id": id})
	return err
}
