package user

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"log"
	"go_backend/models"
	"go_backend/database"
	"go_backend/utils"

	"github.com/joho/godotenv"
)

func SignupHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	godotenv.Load(".env")
	usersTable := os.Getenv("DB_USERS_TABLE")
	if usersTable == "" {
		log.Fatal("usersTable is not set in the environment")
	}

	var data models.User
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	username := data.Username
	password := data.Password

	// Check for empty name or description
	if (username == "" || password == "") {
		utils.RespondWithError(w, http.StatusBadRequest, "name is required")
		return
	}

	// Construct and execute SQL query to insert new user
	query := fmt.Sprintf("INSERT INTO %s (username, password) VALUES ($1, $2)", usersTable)
	_, err = database.GetDB().Exec(query, username, "normal")
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Internal Server Error: \n%v", err))
		return
	}

	// Respond with success message
	utils.RespondWithJSON(w, http.StatusCreated, struct{ Message string }{"User created successfully"})
}