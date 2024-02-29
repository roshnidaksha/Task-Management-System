package database

import (
	"database/sql"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

var db *sql.DB

// InitDB initializes the database connection.
func InitDB() {
	connectionString := os.Getenv("DB_CONNECTION_STRING") // Or use a configuration file
	var err error
	db, err = sql.Open("mysql", connectionString)
	if err != nil {
		log.Fatal(err)
	}

	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Connected to the database")
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