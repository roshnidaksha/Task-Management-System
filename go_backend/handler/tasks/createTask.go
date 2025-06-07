package tasks

import (
	"encoding/json"
	"fmt"
	"go_backend/database"
	"go_backend/models"
	"go_backend/utils"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/google/uuid"
	"github.com/joho/godotenv"
)

func CreateTaskHandler(w http.ResponseWriter, r *http.Request) {
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

	var task models.Tasks
	err := json.NewDecoder(r.Body).Decode(&task)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Unable to decode JSON")
		return
	}

	taskID := uuid.New().String()
	task.ID = taskID

	// Validate task fields
	if task.Title == "" || task.Category == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "Missing required fields")
		return
	}

	startDate, err := time.Parse("2006-01-02T15:04:05", task.StartDate)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid startDate format")
		return
	}

	endDate, err := time.Parse("2006-01-02T15:04:05", task.EndDate)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid endDate format")
		return
	}

	if startDate.After(endDate) {
		utils.RespondWithError(w, http.StatusBadRequest, "EndDate cannot be earlier than StartDate")
		return
	}

	// Prepare SQL query to insert new task
	stmt := fmt.Sprintf("INSERT INTO %s (id, username, title, category, description, completed, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", tasksTable)
	query, err := db.Prepare(stmt)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Internal Server Error: \n%v", err))
		return
	}
	_, err = query.Exec(task.ID, task.Username, task.Title, task.Category, task.Description, task.Completed, task.StartDate, task.EndDate)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Internal Server Error: \n%v", err))
		return
	}

	utils.RespondWithJSON(w, http.StatusCreated, struct{ Message string }{"Task created successfully"})
}
