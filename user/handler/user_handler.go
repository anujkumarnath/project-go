package handler

import (
	"log"
	"net/http"

	"user/repository"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userRepo *repository.UserRepository
}

func NewUserHandler(userRepo *repository.UserRepository) *UserHandler {
	return &UserHandler{
		userRepo: userRepo,
	}
}

func (r *UserHandler) GetUserByEmail (c *gin.Context) {
	email := c.Param("email")
	user, err := r.userRepo.GetUserByEmail(email)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}
	log.Printf("User: %v", user)
	c.JSON(http.StatusOK, user)
}
