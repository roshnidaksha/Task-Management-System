package user

import (
	"encoding/json"
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"log"
	
	"go_backend/database"
	"go_backend/utils"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

type UpdateRequestData struct {
	New string `json:"new"`
	Username string `json:"username"`
	Password string `json:"password"`
}

func UpdateUserHandler(w http.ResponseWriter, r *http.Request) {
	// Only POST
	var db = database.GetDB();
	var err error

	w.Header().Set("Content-Type", "application/json")

	// Connect to Database
	godotenv.Load(".env")
	usersTable := os.Getenv("DB_USERS_TABLE")
	if usersTable == "" {
		log.Fatal("usersTable is not set in the environment")
	}

	// Get username and password from request
	var data UpdateRequestData
	err = json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}
	
	new := data.New
	username := data.Username
	password := data.Password

	// Check if username exists
	var result int
	q := fmt.Sprintf("SELECT COUNT(*) FROM %s WHERE username = \"%s\"", usersTable, new)
	err = db.QueryRow(q).Scan(&result)
	if err != nil {
		if err == sql.ErrNoRows {
			utils.RespondWithError(w, http.StatusBadRequest, "Internal Server Error: \n%v")
			return
		} else {
			utils.RespondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Internal Server Error: \n%v", err))
			return
		}
	}

	if (result >= 1) {
		utils.RespondWithError(w, http.StatusBadRequest, fmt.Sprintf("Username already exists"))
		return
	}

	// Case 1: Update Username: Only password is empty
	// username contains old username and new contains the new username to be updated
	if (password == "") {

		// Check if new username given is valid
		isValid, str := utils.IsValidUsername(new)
		if (!isValid) {
			utils.RespondWithError(w, http.StatusBadRequest, str)
			return
		}

		// Check if new username already exists
		cnt := utils.CountUsernames(new)
		if (cnt == -1) {
			utils.RespondWithError(w, http.StatusInternalServerError, fmt.Sprintf("Internal Server Error: \n%v", err))
			return
		} else if (cnt >= 1) {
			utils.RespondWithError(w, http.StatusBadRequest, fmt.Sprintf("Username already exists"))
			return
		}

		// Update to new username
		query := fmt.Sprintf("UPDATE %s SET username = \"%s\" WHERE username = \"%s\"", usersTable, new, username)
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
		return
	}

	// Case 2: Update Password: password is not empty
	// new contains the new password of the user username
	if (password != "") {

		// Check if new password given is valid
		isValid, str := utils.IsValidPassword(new)
		if (!isValid) {
			utils.RespondWithError(w, http.StatusBadRequest, str)
			return
		}

		query := fmt.Sprintf("UPDATE %s SET password = \"%s\" WHERE username = \"%s\"", usersTable, new, username)
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
		utils.RespondWithJSON(w, http.StatusCreated, struct{ Message string }{"Password updated successfully"})
		return
	}
}