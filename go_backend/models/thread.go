package models

import "time"

type Thread struct {
	ID           string    `json:"id"`
	Title        string    `json:"title"`
	Body         string    `json:"body"`
	Creator      string    `json:"creator"`
	CreatedTime  time.Time `json:"created_time"`
	UpdatedTime  time.Time `json:"updated_time"`
	NumComments  int       `json:"num_comments"`
}