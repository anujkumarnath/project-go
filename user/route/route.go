package route

import (
	"user/handler"

	"github.com/gin-gonic/gin"
)

func SetRouteHandlers(userHandlers *handler.UserHandler) *gin.Engine {
	router := gin.Default()
	{
		user := router.Group("/users")

		user.GET("/:email",    userHandlers.GetUserByEmail)
		user.POST("/",         userHandlers.CreateUser)
		user.DELETE("/:email", userHandlers.DeleteUser)
	}

	return router
}
