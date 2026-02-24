package models

import "gorm.io/gorm"

type SpiceCategory struct {
	gorm.Model
	Name        string `gorm:"not null" json:"name"`
	Description string `json:"description"`
	UserID      uint   `gorm:"not null;index" json:"user_id"`
}

type SpiceCategoryRequest struct {
	Name        string `json:"name"        binding:"required"`
	Description string `json:"description"`
}
