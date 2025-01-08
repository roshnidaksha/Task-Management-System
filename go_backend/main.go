package main

import (
	"github.com/gorilla/handlers"
	"go_backend/database"
	"go_backend/routers"
	"log"
	"net/http"
)

const port = ":3001"

func main() {
	database.InitDB()
	defer database.CloseDB()

	r := router.SetupRouter()

	headers := handlers.AllowedHeaders([]string{"Content-Type"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	origins := handlers.AllowedOrigins([]string{"http://localhost:3000"})

	// Run the server
	//http.Handle("/", r)

	// Start the server
	log.Printf("Server is listening on port %s...", port)
	http.ListenAndServe(port, handlers.CORS(headers, methods, origins)(r))
}
