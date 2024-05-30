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

const TasksPage = () => {
    const auth = useAuth();

    const [tasks, setTasks] = useState<Tasks[]>([]);

    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Fetch Tasks from API
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/${auth.user}/retrieveTasks`, {
                    method: "GET",
                });

                if (response.ok) {
                    const tasks = await response.json();
                    setTasks(tasks);
                    setIsError(false);
                    setErrorMessage("");
                    console.log("Tasks retrieved successfully"); // handle success
                } else {
                    const errorData = await response.json();
                    setIsError(true);
                    setErrorMessage(errorData.error);
                    console.error(`Error: ${response.status}`);
                }
            } catch(e) {
                setIsError(true);
                setErrorMessage("An error occurred while fetching tasks.");
                console.error(e);
            }
        };
        fetchTasks();
    }, [auth.user]);

    return (
        <Box>          
            {isError && (
                <Alert severity="error">
                    {errorMessage}
                </Alert>
            )}

            {!isError && tasks.length === 0 && (
                <Alert severity="error">
                    No tasks found
                </Alert>
            )}
                
            <Stack alignItems="center">
                {!isError && tasks.length > 0 && (
                    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
                        {tasks.map((task) => (
                            <ListItem key={task.id}>
                                <TaskPreview {...task} />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Stack>
        </Box>
    );
}

export default TasksPage;