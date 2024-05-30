package utils

import (
	"fmt"
	"os"

	"go_backend/database"
	"go_backend/models"

	"github.com/joho/godotenv"
)

// Retrieve list of tasks from tasks table based on a specific criteria
func GetTasksByCriteria(column string, value string) ([]models.Tasks, error) {
	// Connect to Database
	var db = database.GetDB();
	godotenv.Load(".env")
	tasksTable := os.Getenv("DB_TASKS_TABLE")
	if tasksTable == "" {
		return nil, fmt.Errorf("tasksTable is not set in the environment: %v")
	}

	// Execute query and store the result set in rows
	query := fmt.Sprintf("SELECT * FROM %s WHERE %s = \"%s\"", tasksTable, column, value)
	rows, err := db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("Internal Server Error: \n%v", err)
	}
	defer rows.Close()

	tasks, err := ScanRowsToTasks(rows)
	if err != nil {
		return nil, fmt.Errorf("Internal Server Error: \n%v", err)
	}

	return tasks, nil
}