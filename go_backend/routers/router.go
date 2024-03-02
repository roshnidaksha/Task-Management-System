package router

import (
	"github.com/gorilla/mux"
	"net/http"
	"go_backend/handler/user"
)

var BASE_PATH = "/api/v1/"

// SetupRouter Sets up the router for the server
func SetupRouter() *mux.Router {
	r := mux.NewRouter()

	// Routes
	// Authentication
	http.HandleFunc(BASE_PATH+"signup", user.SignupHandler)

	return r
}