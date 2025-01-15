# Task Management System
A simple task management system where users can add tasks and categorise them based on custome categories.

## Features

- View a list of tasks grouped by categories
- Add new tasks or categories
- Toggle the completion status of tasks.

## Tech Stack

- **Frontend**: React, Material-UI (MUI)
- **Backend**: Go (Golang)
- **Database**: MySQL
- **API**: RESTful API

## Installation

### 1. Clone the repository

```bash
git clone git@github.com:roshnidaksha/Task-Management-System.git
cd task-management-system
```

### 2. Frontend (React)

Install dependencies

```bash
cd frontend
npm install
```

Start the frontend development server

```bash
npm start
```

The React app should now be running on http://localhost:3000.

### 3. Backend (Go)

Install dependencies

```bash
cd backend
go mod tidy
```

Start the Go backend server

```bash
go run main.go
```

The Go backend API should now be running on http://localhost:3001.
