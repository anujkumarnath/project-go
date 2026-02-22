package route

import (
	"user/handler"

	"github.com/gin-gonic/gin"
)

func Setup(router *gin.Engine, userHandlers *handler.UserHandler) {
	{
		user := router.Group("/users")

		user.GET("/",          userHandlers.GetUsers)
		user.GET("/:email",    userHandlers.GetUserByEmail)
		user.POST("/",         userHandlers.CreateUser)
		user.PUT("/:email",    userHandlers.UpdateUser)
		user.DELETE("/:email", userHandlers.DeleteUser)
	}
}
