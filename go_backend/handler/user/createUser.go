package user

import (
	"encoding/json"
	"fmt"
	"go_backend/database"
	"go_backend/models"
	"go_backend/utils"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

func SignupHandler(w http.ResponseWriter, r *http.Request) {
	// Only POST
	var db = database.GetDB()

	w.Header().Set("Content-Type", "application/json")

	// Connect to Database
	godotenv.Load(".env")
	usersTable := os.Getenv("DB_USERS_TABLE")
	if usersTable == "" {
		log.Fatal("usersTable is not set in the environment")
	}

	// Get username and password from request
	var data models.User
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Unable to Decode JSON")
		return
	}

	username := data.Username
	password := data.Password

	// Check if username and password given are valid
	isValid, str := utils.IsValidPassword(password)
	if !isValid {
		utils.RespondWithError(w, http.StatusBadRequest, str)
		return
	}

	isValid, str = utils.IsValidUsername(username)
	if !isValid {
		utils.RespondWithError(w, http.StatusBadRequest, str)
		return
	}

	// Check if username exists
	cnt := utils.CountUsernames(username)
	if cnt == -1 {
		utils.RespondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Internal Server Error: \n%v", err))
		return
	} else if cnt >= 1 {
		utils.RespondWithError(w, http.StatusBadRequest, "Username already exists")
		return
	}

	// Construct and execute SQL query to insert new user
	stmt := fmt.Sprintf("INSERT INTO %s (username, password) VALUES (?, ?)", usersTable)
	query, err := db.Prepare(stmt)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Internal Server Error: \n%v", err))
		return
	}
	_, err = query.Exec(username, password)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Internal Server Error: \n%v", err))
		return
	}

	// Respond with success message
	utils.RespondWithJSON(w, http.StatusCreated, struct{ Message string }{"User created successfully"})
}
