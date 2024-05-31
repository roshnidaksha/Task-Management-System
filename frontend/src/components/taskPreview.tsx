import * as React from "react";
import {
  Box,
  Divider,
  Typography,
} from "@mui/material";
import Tasks from "../models/Tasks.tsx"

const TaskPreview = (t: Readonly<Tasks>) => {
    const formatDate = (date: string) => {
        const dateObject = new Date(date);

        // Format the date and time in UTC
        const dateOptions: Intl.DateTimeFormatOptions = { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            timeZone: 'UTC' 
        };
        const timeOptions: Intl.DateTimeFormatOptions = { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: false, 
            timeZone: 'UTC' 
        };

        const formattedDate = dateObject.toLocaleDateString('en-GB', dateOptions);
        const formattedTime = dateObject.toLocaleTimeString('en-GB', timeOptions);
        return { date: formattedDate, time: formattedTime };
    }

    const { date: startDate, time: startTime } = formatDate(t.startDate);
    const { date: endDate, time: endTime } = formatDate(t.endDate);
    
    return (
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
                {t.title}
            </Typography>

            <Divider />

            <Typography
                sx={{
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                }}
            >
                {t.description}
            </Typography>

            <Typography
                sx={{
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                }}
            >
                {startDate} {startTime} - {endDate} {endTime}
            </Typography>
        </Box>
    )
};

export default TaskPreview;