package utils

import (
	"strings"
	"os"
	"log"
	"fmt"

	"go_backend/database"

	"github.com/joho/godotenv"
	_ "github.com/go-sql-driver/mysql"
)

// Checks if username given by the user is valid
func IsValidUsername(username string) (bool, string) {
	if (username == "") {
		return false, "Username is required"
	}
	if (len(username) > 30) {
		return false, "Username is too long"
	}
	if (strings.Contains(username, " ")) {
		return false, "Username cannot contain spaces"
	}
	return true, "Valid Username"
}

// Checks if password given by the user is valid
func IsValidPassword(password string) (bool, string) {
	if (len(password) < 6) {
		return false, "Password is too short"
	}
	if (strings.Contains(password, " ")) {
		return false, "Password cannot contain spaces"
	}
	return true, "Valid Password"
}

// Count number of usernames present in database
func CountUsernames(username string) (int) {
	// Connect to Database
	var db = database.GetDB();
	godotenv.Load(".env")
	usersTable := os.Getenv("DB_USERS_TABLE")
	if usersTable == "" {
		log.Fatal("usersTable is not set in the environment")
	}

	var cnt int
	q := fmt.Sprintf("SELECT COUNT(*) FROM %s WHERE username = \"%s\"", usersTable, username)
	err := db.QueryRow(q).Scan(&cnt)
	if err != nil {
		return -1
	}

	return cnt
}
