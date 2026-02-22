package main

import (
	"log"
	"context"
	"net/http"
	"time"
	"os/signal"
	"syscall"

	"user/config"
	"user/route"
	"user/repository"
	"user/handler"
)

func main() {
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	mongoClient    := config.ConnectDB()
	userCollection := config.GetCollection(mongoClient, "project_go", "users")
	userRepo       := repository.NewUserRepository(userCollection) 
	userHandler    := handler.NewUserHandler(userRepo)
	router         := route.SetRouteHandlers(userHandler)

	server := &http.Server{
		Addr:              ":8080",
		Handler:           router,
		ReadHeaderTimeout: 5 * time.Second,
	}

	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Error starting server: %s\n", err)
		}
	}()

	<-ctx.Done()

	// Restore default behavior on the interrupt signal and notify user of shutdown.
	// This allow accepting another Ctrl+C -> force quit
	stop()
	log.Println("Shutting down gracefully, press Ctrl+C again to force")

	shutdownCtx, cancel := context.WithTimeout(context.Background(), 15 * time.Second)
	defer cancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Fatal("Server forced to shutdown: ", err)
	}
	log.Println("Server stopped accepting requests")

	if err := mongoClient.Disconnect(shutdownCtx); err != nil {
		log.Fatalf("Failed to disconnect MongoDB: %v", err)
	}
	log.Println("MongoDB connection closed")

	log.Println("Shutdown complete")
}
