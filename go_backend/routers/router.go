package router

import (
	"encoding/json"
	"fmt"
	"go_backend/database"
	"go_backend/handler/tasks"
	"go_backend/handler/user"
	"go_backend/utils"
	"net/http"

	"github.com/gorilla/mux"
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

	// Tasks
	r.HandleFunc(BASE_PATH+"api/createTask", tasks.CreateTaskHandler).Methods("POST")
	r.HandleFunc(BASE_PATH+"api/deleteTask/{taskId}", tasks.DeleteTaskHandler).Methods("POST")
	r.HandleFunc(BASE_PATH+"api/toggleStatus/{taskId}", tasks.ToggleTaskStatus).Methods("POST")
	r.HandleFunc(BASE_PATH+"api/retrieveTasks", tasks.GetTasksHandler).Methods("GET")
	r.HandleFunc(BASE_PATH+"api/retrieveCategories", tasks.GetCategoriesHandler).Methods("GET")

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
