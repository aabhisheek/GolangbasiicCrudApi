package main

import (
	"log"

	"github.com/kiit/products-api/internal/config"
	"github.com/kiit/products-api/internal/database"
	"github.com/kiit/products-api/internal/routes"
)

func main() {
	cfg := config.Load()

	db := database.Connect(cfg.DSN())

	r := routes.Setup(db, cfg.JWTSecret)

	log.Printf("Server starting on port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
