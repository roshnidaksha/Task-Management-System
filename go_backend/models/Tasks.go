package models

type Tasks struct {
	ID          string `json:"id"`
	Username    string `json:"username"`
	Title       string `json:"title"`
	Category    string `json:"category"`
	Description string `json:"description"`
	Completed   bool   `json:"completed"`
	StartDate   string `json:"startDate"`
	EndDate     string `json:"endDate"`
}
