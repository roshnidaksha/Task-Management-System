package user

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"log"
	"backend/models"

	"github.com/joho/godotenv"
)

func SignupHandler(w http.ResponseWriter, r *http.Request) {
	godotenv.Load(".env")
	usersTable := os.Getenv("DB_USERS_TABLE")

	var data models.User
	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		util.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	// Construct and execute SQL query to insert new user
	username := strings.TrimSpace(data.Username)
	password := data.Password

	query := fmt.Sprintf("INSERT INTO %s (username, password) VALUES ($1, $2)", usersTable)
	_, err = database.GetDB().Exec(query, requestData.Name, "normal")
	if err != nil {
		util.RespondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Internal Server Error: \n%v", err))
		return
	}

	// Respond with success message
	util.RespondWithJSON(w, http.StatusCreated, struct{ Message string }{"User created successfully"})
}