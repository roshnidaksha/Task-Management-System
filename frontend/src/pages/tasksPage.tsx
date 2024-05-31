import * as React from "react";
import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Typography,
    Stack,
    List,
    ListItem,
} from "@mui/material";
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
            console.log("Tasks retrieved successfully"); // handle success
            return { tasks, isError: false, errorMessage: "" };
        } else {
            const errorData = await response.json();
            console.error(`Error: ${response.status}`);
            return { tasks: [], isError: true, errorMessage: errorData.error };
        }
    } catch(e) {
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

    // Fetch Categories from API
    useEffect(() => {
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
            } catch(e) {
                setIsError(true);
                setErrorMessage("An error occurred while fetching categories.");
                console.error(e);
            }
        };
        fetchCategories();
    }, [auth.user]);

    // Fetch all tasks grouped by categories
    useEffect(() => {
        if (categories.length === 0) return;
        const fetchAllTasks = async () => {
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
        <Box>          
            {isError && (
                <Alert severity="error">
                    {errorMessage}
                </Alert>
            )}

            {!isError && categories.length === 0 && (
                <Alert severity="error">
                    No tasks found
                </Alert>
            )}

            {!isError && categories.length > 0 && (
                <List sx={{ bgcolor: "background.paper" }}>
                    {categories.map((category) => (
                        <ListItem key={category}>
                            <Box
                                sx={{
                                    p: { xs: 1, sm: 2 },
                                    width: '100%',
                                    borderStyle: 'solid',
                                    borderColor: 'gray',
                                    borderWidth: 2,
                                    borderRadius: 3,
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: { xs: "1.125rem", sm: "1.25rem" },
                                        fontWeight: "600",
                                        textOverflow: "ellipsis",
                                        overflow: "hidden",
                                    }}
                                >
                                    {category}
                                </Typography>

                                <Stack alignItems="center">
                                    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                                        {taskMap[category]?.map((task) => (
                                            <ListItem key={task.id}>
                                                <TaskPreview {...task} />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Stack>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            )} 
        </Box>
    );
}

export default TasksPage;