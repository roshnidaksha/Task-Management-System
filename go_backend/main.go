package main

import (
	"net/http"
	"go_backend/routers"
	"go_backend/database"
	"github.com/gorilla/handlers"
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
	http.Handle("/", r)

	// Start the server
	http.ListenAndServe(port, handlers.CORS(headers, methods, origins)(r))
}
