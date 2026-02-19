package main

import (
	"log"
	"context"
	"os"
	"os/signal"
	"syscall"
	"time"
	"net/http"

	"user/config"
	"user/handler"
	"user/repository"
	"user/route"

	"github.com/gin-gonic/gin"
)

func main() {
	client := config.ConnectDB()

	/*
	defer func() {
		if err := client.Disconnect(context.TODO()); err != nil {
			log.Fatal(err)
		}
		log.Println("Disconnected from MongoDB")
	}()
	*/

	collection  := config.GetCollection(client, "project_go", "users")
	userRepo    := repository.NewUserRepo(collection)
	userHandler := handler.NewUserHandler(userRepo)

	router := gin.Default()
	route.Setup(router, userHandler)

	srv := &http.Server{
		Addr: ":8080",
		Handler: router,
	}

	go func() {
		log.Println("Server starting on :8080")
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed to start: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)

	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	sig := <-quit
	log.Printf("Received signal: %v. Shutting down gracefully...", sig)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Sever forced to shutdown: %v", err)
	}
	log.Println("Server stopped accepting requests")

	if err := client.Disconnect(ctx); err != nil {
		log.Fatalf("Failed to disconnect MongoDB: %v", err)
	}
	log.Println("MongoDB connection closed")

	log.Println("Shutdown complete")
}
