package router

import (
	"github.com/gorilla/mux"
	"fmt"
	"net/http"
	"go_backend/handler/user"
	"go_backend/database"
	"go_backend/utils"
	"encoding/json"
)

var BASE_PATH = "/"

// SetupRouter Sets up the router for the server
func SetupRouter() *mux.Router {
	var db = database.GetDB()
	
	r := mux.NewRouter()

	// Routes
	// Authentication
	r.HandleFunc(BASE_PATH+"api/signup", user.SignupHandler).Methods("POST")
	r.HandleFunc(BASE_PATH+"api/login", user.LoginHandler).Methods("POST")

	// Update username/password
	r.HandleFunc(BASE_PATH+"api/updateUserDetails", user.UpdateUserHandler).Methods("POST")
	
	// Handle GET requests to the '/api' route
	r.HandleFunc(BASE_PATH+"api", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "Hello from server!"})
	}).Methods("GET")

	r.HandleFunc(BASE_PATH+"checkDB", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		var result string

		err := db.QueryRow("SELECT 'Database connected' as result").Scan(&result)
		if err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Internal Server Error: \n%v", err))
			json.NewEncoder(w).Encode(map[string]string{"message": "Error"})
			return
		}
		json.NewEncoder(w).Encode(map[string]string{"message": result})
	}).Methods("GET")

	return r
}