package main

import (
	"net/http"
	

	"github.com/go-chi/chi"
)

const port = ":3001"

func main() {
	r := chi.NewRouter()

	// Serve static files from the 'client/build' directory
	r.Handle("/*", http.FileServer(http.Dir("./client/build")))

	// Handle GET requests to the '/api' route
	r.Get("/api", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"message": "Hello from server!"}`))
	})

	// Start the server
	http.ListenAndServe(port, r)
}
