package models

import "time"

type Tasks struct {
	ID           string    `json:"id" gorm:"primaryKey;autoIncrement"`
	Username	 string	   `json:"username" gorm:"size:64;not null"`
	Title        string    `json:"title" gorm:"size:200;not null"`
	Category	 string    `json:"category" gorm:"size:50;default:others"`
	Description	 string    `json:"description" gorm:"size:500"`
	Completed	 bool	   `json:"completed" gorm:"default:false"`
	StartDate	 time.Time `json:"startDate" gorm:"column:StartDate;not null"`
	EndDate		 time.Time `json:"endDate" gorm:"column:EndDate;not null"`
}