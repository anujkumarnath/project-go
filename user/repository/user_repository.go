package repository

import (
	"log"
	"context"

	"user/models"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type UserRepository struct {
	userCollection *mongo.Collection
}

func NewUserRepository(userCollection *mongo.Collection) *UserRepository {
	return &UserRepository{
		userCollection: userCollection,
	}
}

func (r *UserRepository) GetUserByEmail(email string) (*models.User, error) {
	filter := bson.D{{Key: "email", Value: email}} 

	var user models.User
	err := r.userCollection.FindOne(context.Background(), filter).Decode(&user)

	if err != nil {
		log.Println("no user found")
		return nil, err
	}

	return &user, nil
} 
