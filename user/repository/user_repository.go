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

func (r *UserRepository) CreateUser(user *models.User) (*mongo.InsertOneResult, error) {
	result, err := r.userCollection.InsertOne(context.Background(), user)
	return result, err
}

func (r *UserRepository) Delete(email string) (*mongo.DeleteResult, error) {
	result, err := r.userCollection.DeleteOne(context.Background(), bson.D{{"email", email}})
	return result, err
}
