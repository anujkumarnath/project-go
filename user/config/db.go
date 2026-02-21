package config

import (
	"log"
	"time"
	"context"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

const mongoDbUri = "mongodb://rgs:rgsdev@windows.mshome.net:27017/?authSource=admin&directConnection=true"

func ConnectDB() (*mongo.Client) {
	clientOptions := options.Client().ApplyURI(mongoDbUri)

	client, err := mongo.Connect(clientOptions)

	if err != nil {
		log.Fatal("Failed to connect to mongodb")
		return nil
	}

	context, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err = client.Ping(context, nil); err != nil {
		log.Fatal("Failed to ping mongodb")
	}
	log.Println("MongoDb ping successful")

	return client
}

func GetCollection(
	client *mongo.Client,
	dbName string,
	collectionName string,
) *mongo.Collection {
	return client.Database(dbName).Collection(collectionName)
}
