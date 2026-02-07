package handler

import (
	"bytes"
	"fmt"
	"net/http"
	"text/template"

	"github.com/gin-gonic/gin"
	"github.com/nesohq/backend/internal/service"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type BadgeHandler struct {
	trackingService *service.TrackingService
}

func NewBadgeHandler(trackingService *service.TrackingService) *BadgeHandler {
	return &BadgeHandler{
		trackingService: trackingService,
	}
}

const badgeTemplate = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="20">
  <rect width="70" height="20" fill="#555"/>
  <rect x="70" width="50" height="20" fill="#4c1"/>
  <text x="5" y="14" fill="#fff" font-family="Arial" font-size="11">Live Users</text>
  <text x="75" y="14" fill="#fff" font-family="Arial" font-size="11" font-weight="bold">{{.Count}}</text>
</svg>`

func (h *BadgeHandler) GetLiveBadge(c *gin.Context) {
	domainIDStr := c.Param("domain_id")
	domainID, err := primitive.ObjectIDFromHex(domainIDStr)
	if err != nil {
		c.String(http.StatusBadRequest, "Invalid domain ID")
		return
	}

	count, err := h.trackingService.GetActiveVisitorCount(c.Request.Context(), domainID)
	if err != nil {
		// Log error but display 0
		fmt.Printf("Error getting active count for badge: %v\n", err)
		count = 0
	}

	tmpl, err := template.New("badge").Parse(badgeTemplate)
	if err != nil {
		c.String(http.StatusInternalServerError, "Template error")
		return
	}

	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, map[string]interface{}{
		"Count": count,
	}); err != nil {
		c.String(http.StatusInternalServerError, "Template execution error")
		return
	}

	c.Header("Content-Type", "image/svg+xml")
	// Cache for 30 seconds to prevent abuse but keep it relatively live
	c.Header("Cache-Control", "public, max-age=30")
	c.String(http.StatusOK, buf.String())
}
