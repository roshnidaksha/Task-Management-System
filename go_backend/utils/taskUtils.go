package utils

import (
	"database/sql"
	"fmt"
    "time"

	"go_backend/models"
)

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