package route

import (
	"net/http"

	"user/handler"

	"github.com/gin-gonic/gin"
)



func Setup(router *gin.Engine, userHandler *handler.UserHandler) {
	router.HandleMethodNotAllowed = false
	router.Use(cors())
	users := router.Group("/users")
	{
		users.GET    ("",         userHandler.GetUsers)
		users.GET    ("/:email",  userHandler.GetUser)
		users.POST   ("",         userHandler.CreateUser)
		users.PUT    ("/:email",  userHandler.UpdateUser)
		users.DELETE ("/:email",  userHandler.DeleteUser)
	}
}

func cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}
