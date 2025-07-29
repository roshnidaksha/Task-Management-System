package tasks

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"go_backend/database"
	"go_backend/utils"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func DeleteTaskHandler(w http.ResponseWriter, r *http.Request) {
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

	query := fmt.Sprintf("DELETE FROM %s WHERE id = \"%s\"", tasksTable, taskId)
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
	utils.RespondWithJSON(w, http.StatusOK, struct{ Message string }{"Task deleted successfully"})
}
