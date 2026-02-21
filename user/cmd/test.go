package main

import (
	"log"
	"context"

	"user/config"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func main() {
	client := config.ConnectDB()
	defer func(){
		if err := client.Disconnect(context.Background()); err != nil {
			log.Fatal(err)
		}
	}()

	collection := config.GetCollection(client, "project_go", "users");

	opts := options.Count().SetHint("_id_")
	count, err := collection.CountDocuments	(context.Background(), bson.D{}, opts)
	if err != nil {
		panic(err)
	}

	log.Printf("Found: %d users", count)
}	
