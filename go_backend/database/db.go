package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

var db *sql.DB

// InitDB initializes the database connection.
func InitDB() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Retrieve environment variables
	dbUsername := os.Getenv("DB_USERNAME")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	// Construct the database connection string
	dbSource := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", dbUsername, dbPassword, dbHost, dbPort, dbName)

	// Open a connection to the database
	database, err := sql.Open("mysql", dbSource)
	if err != nil {
		log.Fatal("Error connecting to the database:", err)
	}

	// Check if the database connection is successful
	err = database.Ping()
	if err != nil {
		log.Fatal("Error pinging the database:", err)
	}

	// Set the global 'db' variable
	db = database
}

// GetDB returns the database instance.
func GetDB() *sql.DB {
	return db
}

// Close closes the database connection.
func Close() {
    if db != nil {
        db.Close()
    }
}