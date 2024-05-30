package tasks

import (
	"net/http"
	"fmt"

	"go_backend/utils"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

func GetTasksHandler(w http.ResponseWriter, r *http.Request) {
	// Only GET

	// Get details from request url
	vars := mux.Vars(r)
	username := vars["username"]

	tasks, err := utils.GetTasksByCriteria("username", username)

	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Internal Server Error: \n%v", err))
		return
	}

	// Respond with the list of threads in JSON format
	utils.RespondWithJSON(w, http.StatusOK, tasks)
}