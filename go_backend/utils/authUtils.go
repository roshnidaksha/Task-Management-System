package utils

import (
	"strings"
)

// Checks if username and password given by the user are valid
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

func IsValidPassword(password string) (bool, string) {
	if (len(password) < 6) {
		return false, "Password is too short"
	}
	if (strings.Contains(password, " ")) {
		return false, "Password cannot contain spaces"
	}
	return true, "Valid Password"
}
