package service

import (
	"context"

	"github.com/nesohq/backend/internal/domain"
	"github.com/nesohq/backend/internal/repository"
	"github.com/nesohq/backend/internal/utils"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type APIKeyService struct {
	apiKeyRepo *repository.APIKeyRepository
}

func NewAPIKeyService(apiKeyRepo *repository.APIKeyRepository) *APIKeyService {
	return &APIKeyService{
		apiKeyRepo: apiKeyRepo,
	}
}

func (s *APIKeyService) Create(ctx context.Context, userID primitive.ObjectID, req *domain.CreateAPIKeyRequest) (*domain.APIKey, error) {
	key, err := utils.GenerateAPIKey()
	if err != nil {
		return nil, err
	}

	domainIDs := make([]primitive.ObjectID, len(req.DomainIDs))
	for i, id := range req.DomainIDs {
		domainIDs[i], _ = primitive.ObjectIDFromHex(id)
	}

	apiKey := &domain.APIKey{
		UserID:    userID,
		Key:       key,
		DomainIDs: domainIDs,
		Revoked:   false,
	}

	if err := s.apiKeyRepo.Create(ctx, apiKey); err != nil {
		return nil, err
	}

	return apiKey, nil
}

func (s *APIKeyService) List(ctx context.Context, userID primitive.ObjectID) ([]*domain.APIKey, error) {
	return s.apiKeyRepo.FindByUserID(ctx, userID)
}

func (s *APIKeyService) Validate(ctx context.Context, key string) (*domain.APIKey, error) {
	return s.apiKeyRepo.FindByKey(ctx, key)
}

func (s *APIKeyService) Revoke(ctx context.Context, id primitive.ObjectID) error {
	return s.apiKeyRepo.Revoke(ctx, id)
}
