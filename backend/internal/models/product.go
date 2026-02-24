package models

import "gorm.io/gorm"

type Product struct {
	gorm.Model
	Name        string  `gorm:"not null"     json:"name"`
	Description string  `json:"description"`
	Price       float64 `gorm:"not null"     json:"price"`
	Stock       int     `gorm:"default:0"    json:"stock"`
}

type ProductRequest struct {
	Name        string  `json:"name"        binding:"required"`
	Description string  `json:"description"`
	Price       float64 `json:"price"       binding:"required,gt=0"`
	Stock       int     `json:"stock"       binding:"min=0"`
}
