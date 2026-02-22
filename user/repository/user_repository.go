package repository

import (
	"log"
	"time"
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

/* LEARN: should I return pointer? Won't it cause dangling pointer issue after function exits? */ 
func (r *UserRepository) GetUserByEmail(email string) (*models.User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	/* LEARN: difference with bson.D */
	filter := bson.M{"email": email} 

	var user models.User
	err := r.userCollection.FindOne(ctx, filter).Decode(&user)

	if err != nil {
		log.Println("no user found")
		return nil, err
	}

	return &user, nil
} 

/* LEARN: why to user pointer and why to use struct directly? */
func (r *UserRepository) CreateUser(user *models.User) (*mongo.InsertOneResult, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := r.userCollection.InsertOne(ctx, user)
	return result, err
}

func (r *UserRepository) Update(email string, updateData bson.M) (*mongo.UpdateResult, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.D{{"email", email}}
	update := bson.D{{"$set", updateData}}
	result, err := r.userCollection.UpdateOne(ctx, filter, update)
	return result, err;
}

func (r *UserRepository) Delete(email string) (*mongo.DeleteResult, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := r.userCollection.DeleteOne(ctx, bson.D{{"email", email}})
	return result, err
}
