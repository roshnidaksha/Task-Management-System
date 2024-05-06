package user

import (
	"encoding/json"
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"log"
	"go_backend/models"
	"go_backend/database"
	"go_backend/utils"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var db = database.GetDB();
	var err error

	w.Header().Set("Content-Type", "application/json")
	godotenv.Load(".env")
	usersTable := os.Getenv("DB_USERS_TABLE")
	if usersTable == "" {
		log.Fatal("usersTable is not set in the environment")
	}

	var data models.User
	err = json.NewDecoder(r.Body).Decode(&data)
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

	// SQL query to search for the username
	var result string
	query := fmt.Sprintf("SELECT password FROM %s WHERE username = \"%s\"", usersTable, username)
	err = db.QueryRow(query).Scan(&result)
	if err != nil {
		if err == sql.ErrNoRows {
			utils.RespondWithError(w, http.StatusBadRequest, "Username not found")
			return
		} else {
			utils.RespondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Error retrieving passwordHash: %v", err))
			return
		}
	}

	// Check if the password matches the hashed password in the database
	if result != password {
		utils.RespondWithError(w, http.StatusBadRequest, "Wrong password")
		return
	}

	// Respond with success message
	utils.RespondWithJSON(w, http.StatusOK, username)
}