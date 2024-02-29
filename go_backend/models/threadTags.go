package models

import "time"

type ThreadTag struct {
	ThreadID string `json:"thread_id"`
	TagName  string `json:"tag_name"`
}