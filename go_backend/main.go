package main

import (
	"encoding/json"
	"net/http"
	"go_backend/routers"
)

const port = ":3001"

func main() {
	r := router.SetupRouter()

	// Handle GET requests to the '/api' route
	r.HandleFunc("/api", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "Hello from server!"})
	}).Methods("GET")

	// Run the server
	http.Handle("/", r)

	// Start the server
	http.ListenAndServe(port, r)
}
