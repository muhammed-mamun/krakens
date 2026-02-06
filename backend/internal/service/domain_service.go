package service

import (
	"context"

	"github.com/nesohq/backend/internal/domain"
	"github.com/nesohq/backend/internal/repository"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type DomainService struct {
	domainRepo *repository.DomainRepository
}

func NewDomainService(domainRepo *repository.DomainRepository) *DomainService {
	return &DomainService{
		domainRepo: domainRepo,
	}
}

func (s *DomainService) Create(ctx context.Context, userID primitive.ObjectID, req *domain.CreateDomainRequest) (*domain.Domain, error) {
	d := &domain.Domain{
		UserID:   userID,
		Domain:   req.Domain,
		Verified: false,
		Settings: domain.DomainSettings{
			AnonymizeIP:      true,
			RateLimit:        1000,
			TrackQueryParams: false,
			SessionTimeout:   1800,
			Timezone:         "UTC",
		},
	}

	if err := s.domainRepo.Create(ctx, d); err != nil {
		return nil, err
	}

	return d, nil
}

func (s *DomainService) List(ctx context.Context, userID primitive.ObjectID) ([]*domain.Domain, error) {
	return s.domainRepo.FindByUserID(ctx, userID)
}

func (s *DomainService) GetByID(ctx context.Context, id primitive.ObjectID) (*domain.Domain, error) {
	return s.domainRepo.FindByID(ctx, id)
}

func (s *DomainService) Update(ctx context.Context, id primitive.ObjectID, req *domain.UpdateDomainRequest) (*domain.Domain, error) {
	d, err := s.domainRepo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	d.Settings = req.Settings

	if err := s.domainRepo.Update(ctx, d); err != nil {
		return nil, err
	}

	return d, nil
}

func (s *DomainService) Delete(ctx context.Context, id primitive.ObjectID) error {
	return s.domainRepo.Delete(ctx, id)
}
