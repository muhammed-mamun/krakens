package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nesohq/backend/internal/domain"
	"github.com/nesohq/backend/internal/service"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type DomainHandler struct {
	domainService *service.DomainService
}

func NewDomainHandler(domainService *service.DomainService) *DomainHandler {
	return &DomainHandler{domainService: domainService}
}

func (h *DomainHandler) Create(c *gin.Context) {
	userID := c.GetString("user_id")
	objID, _ := primitive.ObjectIDFromHex(userID)

	var req domain.CreateDomainRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	d, err := h.domainService.Create(c.Request.Context(), objID, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, d)
}

func (h *DomainHandler) List(c *gin.Context) {
	userID := c.GetString("user_id")
	objID, _ := primitive.ObjectIDFromHex(userID)

	domains, err := h.domainService.List(c.Request.Context(), objID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, domains)
}

func (h *DomainHandler) GetByID(c *gin.Context) {
	id, _ := primitive.ObjectIDFromHex(c.Param("id"))

	d, err := h.domainService.GetByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "domain not found"})
		return
	}

	c.JSON(http.StatusOK, d)
}

func (h *DomainHandler) Update(c *gin.Context) {
	id, _ := primitive.ObjectIDFromHex(c.Param("id"))

	var req domain.UpdateDomainRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	d, err := h.domainService.Update(c.Request.Context(), id, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, d)
}

func (h *DomainHandler) Delete(c *gin.Context) {
	id, _ := primitive.ObjectIDFromHex(c.Param("id"))

	if err := h.domainService.Delete(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
