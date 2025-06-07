package tasks

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"go_backend/database"
	"go_backend/models"
	"go_backend/utils"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func GetTasksHandler(w http.ResponseWriter, r *http.Request) {
	// Only GET
	if r.Method != http.MethodGet {
		utils.RespondWithError(w, http.StatusMethodNotAllowed, "Invalid request method")
		return
	}

	// Get details from request url
	params := r.URL.Query()
	category := params.Get("category")
	username := params.Get("username")

	var tasks []models.Tasks
	var err error

	if category != "" {
		tasks, err = utils.GetTasksByCriteria("category", category, username)
	} else if username != "" {
		tasks, err = utils.GetTasksByCriteria("username", username, username)
	}

	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Internal Server Error: \n%v", err))
		return
	}

	// Respond with the list of tasks in JSON format
	utils.RespondWithJSON(w, http.StatusOK, tasks)
}

func GetCategoriesHandler(w http.ResponseWriter, r *http.Request) {
	// Only GET
	if r.Method != http.MethodGet {
		utils.RespondWithError(w, http.StatusMethodNotAllowed, "Invalid request method")
		return
	}

	// Get details from request url
	username := r.URL.Query().Get("username")

	var cats []string
	var err error

	cats, err = utils.GetCategories(username)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Internal Server Error: \n%v", err))
		return
	}

	// Respond with the list of categories in JSON format
	utils.RespondWithJSON(w, http.StatusOK, cats)
}

func ToggleTaskStatus(w http.ResponseWriter, r *http.Request) {
	// Only POST method is allowed
	if r.Method != http.MethodPost {
		utils.RespondWithError(w, http.StatusMethodNotAllowed, "Invalid request method")
		return
	}

	var db = database.GetDB()
	w.Header().Set("Content-Type", "application/json")
	godotenv.Load(".env")
	tasksTable := os.Getenv("DB_TASKS_TABLE")
	if tasksTable == "" {
		log.Fatal("tasksTable is not set in the environment")
	}

	vars := mux.Vars(r)
	taskId := vars["taskId"]

	var requestBody map[string]interface{}
	err := json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Unable to decode JSON")
		return
	}
	completed, ok := requestBody["completed"].(float64) // JSON numbers are decoded as float64
	if !ok {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid 'completed' value")
		return
	}
	completedStatus := int(completed)

	query := fmt.Sprintf("UPDATE %s SET Completed = %d WHERE id = \"%s\"", tasksTable, completedStatus, taskId)
	stmt, err := db.Prepare(query)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Internal Server Error: \n%v", err))
		return
	}
	_, err = stmt.Exec()
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Internal Server Error: \n%v", err))
		return
	}

	// Respond with success message
	utils.RespondWithJSON(w, http.StatusCreated, struct{ Message string }{"Username updated successfully"})
}
