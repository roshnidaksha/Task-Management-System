package tasks

import (
	"net/http"
	"fmt"

	"go_backend/utils"
	"go_backend/models"

	_ "github.com/go-sql-driver/mysql"
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

	if (category != "") {
		tasks, err = utils.GetTasksByCriteria("category", category, username)
	} else if (username != "") {
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