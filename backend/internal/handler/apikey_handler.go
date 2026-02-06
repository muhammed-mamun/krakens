package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nesohq/backend/internal/domain"
	"github.com/nesohq/backend/internal/service"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type APIKeyHandler struct {
	apiKeyService *service.APIKeyService
}

func NewAPIKeyHandler(apiKeyService *service.APIKeyService) *APIKeyHandler {
	return &APIKeyHandler{apiKeyService: apiKeyService}
}

func (h *APIKeyHandler) Create(c *gin.Context) {
	userID := c.GetString("user_id")
	objID, _ := primitive.ObjectIDFromHex(userID)

	var req domain.CreateAPIKeyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	apiKey, err := h.apiKeyService.Create(c.Request.Context(), objID, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, apiKey)
}

func (h *APIKeyHandler) List(c *gin.Context) {
	userID := c.GetString("user_id")
	objID, _ := primitive.ObjectIDFromHex(userID)

	apiKeys, err := h.apiKeyService.List(c.Request.Context(), objID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, apiKeys)
}

func (h *APIKeyHandler) Revoke(c *gin.Context) {
	id, _ := primitive.ObjectIDFromHex(c.Param("id"))

	if err := h.apiKeyService.Revoke(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
