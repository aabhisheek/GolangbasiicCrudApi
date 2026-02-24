package routes

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/kiit/products-api/internal/handlers"
	"github.com/kiit/products-api/internal/middleware"
	"gorm.io/gorm"
)

func Setup(db *gorm.DB, jwtSecret string) *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false,
	}))

	authHandler := handlers.NewAuthHandler(db, jwtSecret)
	productHandler := handlers.NewProductHandler(db)

	api := r.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
		}

		products := api.Group("/products")
		products.Use(middleware.AuthRequired(jwtSecret))
		{
			products.GET("", productHandler.List)
			products.POST("", productHandler.Create)
			products.GET("/:id", productHandler.Get)
			products.PUT("/:id", productHandler.Update)
			products.DELETE("/:id", productHandler.Delete)
		}
	}

	return r
}
