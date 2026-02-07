package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nesohq/backend/internal/utils"
)

type AvatarHandler struct{}

func NewAvatarHandler() *AvatarHandler {
	return &AvatarHandler{}
}

func (h *AvatarHandler) GetAvatar(c *gin.Context) {
	seed := c.Param("seed")
	if seed == "" {
		c.String(http.StatusBadRequest, "Seed required")
		return
	}

	svg := utils.GenerateIdenticon(seed)

	c.Header("Content-Type", "image/svg+xml")
	// Cache for 1 year since it's deterministic based on seed
	c.Header("Cache-Control", "public, max-age=31536000")
	c.String(http.StatusOK, svg)
}
