package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kiit/products-api/internal/models"
	"gorm.io/gorm"
)

type SpiceCategoryHandler struct {
	db *gorm.DB
}

func NewSpiceCategoryHandler(db *gorm.DB) *SpiceCategoryHandler {
	return &SpiceCategoryHandler{db: db}
}

func (h *SpiceCategoryHandler) List(c *gin.Context) {
	userID := c.MustGet("userID").(uint)
	var spices []models.SpiceCategory
	if err := h.db.Where("user_id = ?", userID).Find(&spices).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch spice categories"})
		return
	}
	c.JSON(http.StatusOK, spices)
}

func (h *SpiceCategoryHandler) Create(c *gin.Context) {
	userID := c.MustGet("userID").(uint)

	var req models.SpiceCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	spice := models.SpiceCategory{
		Name:        req.Name,
		Description: req.Description,
		UserID:      userID,
	}
	if err := h.db.Create(&spice).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create spice category"})
		return
	}

	c.JSON(http.StatusCreated, spice)
}

func (h *SpiceCategoryHandler) Get(c *gin.Context) {
	userID := c.MustGet("userID").(uint)
	var spice models.SpiceCategory
	if err := h.db.Where("id = ? AND user_id = ?", c.Param("id"), userID).First(&spice).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "spice category not found"})
		return
	}
	c.JSON(http.StatusOK, spice)
}

func (h *SpiceCategoryHandler) Update(c *gin.Context) {
	userID := c.MustGet("userID").(uint)
	var spice models.SpiceCategory
	if err := h.db.Where("id = ? AND user_id = ?", c.Param("id"), userID).First(&spice).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "spice category not found"})
		return
	}

	var req models.SpiceCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	h.db.Model(&spice).Updates(models.SpiceCategory{
		Name:        req.Name,
		Description: req.Description,
	})

	c.JSON(http.StatusOK, spice)
}

func (h *SpiceCategoryHandler) Delete(c *gin.Context) {
	userID := c.MustGet("userID").(uint)
	var spice models.SpiceCategory
	if err := h.db.Where("id = ? AND user_id = ?", c.Param("id"), userID).First(&spice).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "spice category not found"})
		return
	}

	h.db.Delete(&spice)
	c.JSON(http.StatusOK, gin.H{"message": "spice category deleted"})
}
