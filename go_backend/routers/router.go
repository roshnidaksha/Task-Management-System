package router

import (
	"github.com/gorilla/mux"
	"net/http"
	"database/sql"
	"go_backend/handler/user"
	"encoding/json"
)

var BASE_PATH = "/"
var db *sql.DB

// SetupRouter Sets up the router for the server
func SetupRouter() *mux.Router {
	r := mux.NewRouter()

	// Routes
	// Authentication
	r.HandleFunc(BASE_PATH+"api/signup", user.SignupHandler).Methods("POST")

	// Handle GET requests to the '/api' route
	r.HandleFunc("/api", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "Hello from server!"})
	}).Methods("GET")

	r.HandleFunc("/checkDB", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		var result string
		err := db.QueryRow("SELECT 'Database connected' as result").Scan(&result)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"message": result})
	}).Methods("GET")

	return r
}