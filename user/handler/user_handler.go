package handler

import (
	"log"
	"net/http"

	"user/repository"
	"user/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type UserHandler struct {
	userRepo *repository.UserRepository
}

func NewUserHandler(userRepo *repository.UserRepository) *UserHandler {
	return &UserHandler{
		userRepo: userRepo,
	}
}

func (h *UserHandler) GetUserByEmail (c *gin.Context) {
	email := c.Param("email")
	user, err := h.userRepo.GetUserByEmail(email)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}
	log.Printf("User: %v", user)
	c.JSON(http.StatusOK, user)
}

func (h *UserHandler) CreateUser (c *gin.Context) {
	var user models.User

	if err := c.ShouldBind(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := h.userRepo.CreateUser(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	user.ID = result.InsertedID.(bson.ObjectID)
	c.JSON(http.StatusCreated, user)
}
