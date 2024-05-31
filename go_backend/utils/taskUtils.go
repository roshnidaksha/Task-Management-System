package utils

import (
	"database/sql"
	"fmt"
    "time"
    "os"

    "go_backend/database"
	"go_backend/models"

    "github.com/joho/godotenv"
)

// Retrieve list of tasks from tasks table based on a specific criteria
func GetTasksByCriteria(column string, value string, username string) ([]models.Tasks, error) {
	// Connect to Database
	var db = database.GetDB();
	godotenv.Load(".env")
	tasksTable := os.Getenv("DB_TASKS_TABLE")
	if tasksTable == "" {
		return nil, fmt.Errorf("tasksTable is not set in the environment: %v")
	}

	// Execute query and store the result set in rows
    var rows *sql.Rows
    var err error
    if (column == "username") {
        query := fmt.Sprintf("SELECT * FROM %s WHERE %s = \"%s\"", tasksTable, column, value)
        rows, err = db.Query(query)
    } else {
        query := fmt.Sprintf("SELECT * FROM %s WHERE (%s = \"%s\" AND username = \"%s\")", tasksTable, column, value, username)
        rows, err = db.Query(query)
    }
	
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

// Retrieve list of categories from tasks table for a particular username
func GetCategories(username string) ([]string, error) {
    // Connect to Database
	var db = database.GetDB();
	godotenv.Load(".env")
	tasksTable := os.Getenv("DB_TASKS_TABLE")
	if tasksTable == "" {
		return nil, fmt.Errorf("tasksTable is not set in the environment: %v")
	}

    // Execute query and store the result set in rows
	query := fmt.Sprintf("SELECT DISTINCT(category) FROM %s WHERE username = \"%s\"", tasksTable, username)
	rows, err := db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("Internal Server Error: \n%v", err)
	}
	defer rows.Close()

	var categories []string
    for rows.Next() {
        var category string
        err = rows.Scan(&category)
        if err != nil {
            return nil, fmt.Errorf("Error in retrieving categories")
        }
        categories = append(categories, category)
    }

	return categories, nil
}

// parseTime converts a []uint8 timestamp to time.Time
func parseTime(rawTime []uint8) (time.Time, error) {
    timeStr := string(rawTime)
    return time.Parse("2006-01-02 15:04:05", timeStr)
}

// ScanRowToTask scans a single SQL row into a Tasks struct
func ScanRowToTask(row *sql.Rows) (models.Tasks, error) {
    var task models.Tasks
    var startDate []uint8
    var endDate []uint8
    
    err := row.Scan(
        &task.ID, 
        &task.Username, 
        &task.Title, 
        &task.Category, 
        &task.Description, 
        &task.Completed, 
        &startDate, 
        &endDate,
    )

    if err != nil {
        return task, fmt.Errorf("Error scanning row: %v", err)
    }

    task.StartDate, err = parseTime(startDate)
    if err != nil {
        return task, fmt.Errorf("Error parsing start date: %v", err)
    }

    task.EndDate, err = parseTime(endDate)
    if err != nil {
        return task, fmt.Errorf("Error parsing end date: %v", err)
    }

    return task, nil
}

// ScanRowsToTasks scans SQL rows into a slice of Tasks structs
func ScanRowsToTasks(rows *sql.Rows) ([]models.Tasks, error) {
    var tasks []models.Tasks
    
    for rows.Next() {
        task, err := ScanRowToTask(rows)
        if err != nil {
            return nil, fmt.Errorf("Error scanning row: %v", err)
        }
        tasks = append(tasks, task)
    }

    if err := rows.Err(); err != nil {
        return nil, fmt.Errorf("row error: %v", err)
    }

    return tasks, nil
}