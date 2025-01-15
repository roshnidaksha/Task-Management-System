import * as React from "react";
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  Typography,
  Stack,
  ListItem,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../contexts/AuthContext.tsx"
import Tasks from "../models/Tasks.tsx"
import TaskPreview from "../components/taskPreview.tsx";

type TaskMap = {
  [key: string]: Tasks[];
};

// Fetch Tasks from API for a particular category
const fetchTasksByCategory = async (username: string, category: string) => {
  try {
    const response = await fetch(`http://localhost:3001/api/retrieveTasks?username=${username}&category=${category}`, {
      method: "GET",
    });

    if (response.ok) {
      const tasks = await response.json();
      console.log("Tasks retrieved successfully", tasks); // handle success
      return { tasks, isError: false, errorMessage: "" };
    } else {
      const errorData = await response.json();
      console.error(`Error: ${response.status}`);
      return { tasks: [], isError: true, errorMessage: errorData.error };
    }
  } catch (e) {
    console.error(e);
    return { tasks: [], isError: true, errorMessage: "An error occurred while fetching tasks." };
  }
};

const TasksPage = () => {
  const auth = useAuth();

  const [taskMap, setTaskMap] = useState<TaskMap>({});
  const [categories, setCategories] = useState<string[]>([]);

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    category: "",
    description: "",
    completed: false,
    startDate: "",
    endDate: "",
  });
  const [currentCategory, setCurrentCategory] = useState("");

  const handleOpen = (category) => {
    setCurrentCategory(category);
    setNewTask({ ...newTask, category });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewTask({
      title: "",
      category: "",
      description: "",
      completed: false,
      startDate: "",
      endDate: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const task = {
      id: "10",
      username: auth.user,
      ...newTask,
      startDate: `${newTask.startDate}:00`,
      endDate: `${newTask.endDate}:00`,
    };
    console.log(task);
    createTask(task);
    handleClose();
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/retrieveCategories?username=${auth.user}`, {
        method: "GET",
      });

      if (response.ok) {
        const cats = await response.json();
        setCategories(cats);
        setIsError(false);
        setErrorMessage("");
        console.log("Categories retrieved successfully"); // handle success
      } else {
        const errorData = await response.json();
        setIsError(true);
        setErrorMessage(errorData.error);
        console.error(`Error: ${response.status}`);
      }
    } catch (e) {
      setIsError(true);
      setErrorMessage("An error occurred while fetching categories.");
      console.error(e);
    }
  };

  // Fetch Categories from API
  useEffect(() => {
    fetchCategories();
  }, [auth.user]);

  const createTask = async (task) => {
    try {
      const response = await fetch(`http://localhost:3001/api/createTask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      if (response.ok) {
        const successMessage = await response.json();
        console.log(successMessage.message);
        fetchCategories();
      } else {
        const errorData = await response.json();
        setIsError(true);
        setErrorMessage(errorData.error);
        console.error(`Error: ${response.status}`);
      }
    } catch (e) {
      setIsError(true);
      setErrorMessage("An error occurred while creating the task.");
      console.error(e);
    }
  };

  const handleToggleStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;

    try {
      const response = await fetch(`http://localhost:3001/api/toggleStatus/${taskId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: newStatus }),
      });

      if (response.ok) {
        const successMessage = await response.json();
        console.log("Completion Status toggled successfully:", successMessage.message);
        fetchCategories();
      } else {
        const errorData = await response.json();
        setIsError(true);
        setErrorMessage(errorData.error);
        console.error(`Error: ${response.status}`);
      }
    } catch (error) {
      setIsError(true);
      setErrorMessage("Error Updating Status");
      console.error(error);
    }
  };

  // Fetch all tasks grouped by categories
  useEffect(() => {
    const fetchAllTasks = async () => {
      if (!categories || categories.length === 0) return;
      try {
        const results = await Promise.all(categories.map(category =>
          fetchTasksByCategory(auth.user, category)
        ));

        const tasksByCategory: TaskMap = {};
        results.forEach((result, index) => {
          setIsError(result.isError);
          setErrorMessage(result.errorMessage);
          if (result.isError) {
            console.error(`Error: ${result.errorMessage}`)
          } else {
            tasksByCategory[categories[index]] = result.tasks;
          }
        });

        setTaskMap(tasksByCategory);
      } catch (e) {
        setIsError(true);
        setErrorMessage("An error occurred while fetching categories.");
        console.error(e);
      }
    };
    fetchAllTasks();
  }, [auth.user, categories]);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Error Message */}
      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {/* No Tasks Found */}
      {!isError && (!categories || (Array.isArray(categories) && categories.length === 0)) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          No tasks found
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          p: 2,
          m: 2,
          backgroundImage: "linear-gradient(90deg,rgb(5, 130, 189),rgb(144, 192, 216))",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Enter category name"
          value={currentCategory}
          onChange={(e) => setCurrentCategory(e.target.value)}
          sx={{
            backgroundColor: "white",
            borderRadius: 1,
            flexGrow: 1,
          }}
        />
        <Button
          onClick={() => handleOpen(currentCategory)}
          variant="contained"
          sx={{
            color: "white",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.3)",
            },
          }}>
          <AddIcon />
        </Button>
      </Box>

      {/* Task Categories */}
      {!isError && (categories && Array.isArray(categories) && categories.length > 0) && (
        <Grid container spacing={6} sx={{ marginTop: 2 }}>
          {categories.map((category) => (
            <Grid item
              xs={12}
              sm={6}
              md={4}
            >
              {/* Category Header */}
              <Card
                sx={{
                  p: 2,
                  m: 2,
                  backgroundImage: "linear-gradient(90deg,rgb(51, 88, 255),rgb(0, 170, 255))",
                  borderRadius: 2,
                  boxShadow: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "700",
                      color: "white",
                      textShadow: "0px 1px 2px rgba(0,0,0,0.5)",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {category}
                  </Typography>
                  <IconButton
                    onClick={() => handleOpen(category)}
                    sx={{
                      color: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                      },
                    }}>
                    <AddIcon />
                  </IconButton>
                </Box>
              </Card>

              {/* Task List */}
              <Stack spacing={2} width="100%" useFlexGap sx={{ flexWrap: 'wrap' }}>
                {taskMap[category]?.map((task) => (
                  <ListItem
                    key={task.id}
                    sx={{
                      m: 1,
                      p: 2,
                      borderRadius: 2,
                      boxShadow: 1,
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: 3,
                      },
                    }}
                  >
                    <TaskPreview
                      key={task.id}
                      t={task}
                      onStatusToggle={handleToggleStatus}
                    />
                  </ListItem>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog for Adding a New Task */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Task Title"
            name="title"
            fullWidth
            value={newTask.title}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            label="Description"
            name="description"
            fullWidth
            multiline
            rows={3}
            value={newTask.description}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            label="Start Date"
            name="startDate"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newTask.startDate}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            label="End Date"
            name="endDate"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newTask.endDate}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Add Task
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}

export default TasksPage;