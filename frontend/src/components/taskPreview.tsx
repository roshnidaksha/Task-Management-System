import React, { useState } from "react";
import {
  Box,
  Divider,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import { AccessTime, CalendarToday, Flag } from "@mui/icons-material";

const TaskPreview = ({t, onStatusToggle}) => {
  const formatDate = (date: string) => {
    if (!date) {
      return { date: '', time: '' }; // Return empty strings or handle as needed
    }
    const [datePart, timePart] = date.split(" ");

    // Format the date in "DD-MM-YYYY" format
    const [year, month, day] = datePart.split("-");
    const formattedDate = `${day}-${month}-${year}`;

    // Format the time in "HH:MM AM/PM" format
    const [hour, minute, second] = timePart.split(":");
    const hourInt = parseInt(hour, 10);
    const formattedTime = `${hourInt % 12 || 12}:${minute} ${hourInt >= 12 ? "PM" : "AM"}`;

    return { date: formattedDate, time: formattedTime };
  }
  const { date: startDate, time: startTime } = formatDate(t.startDate);
  const { date: endDate, time: endTime } = formatDate(t.endDate);

  const priorityColors = {
    low: "success.main",
    medium: "warning.main",
    high: "error.main",
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        width: "100%",
        borderStyle: "solid",
        borderColor: "linear-gradient(90deg, #FF5733, #FFC300)",
        borderWidth: 2,
        borderRadius: 3,
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "background.paper",
      }}
    >
      {/* Task Title */}
      <Typography
        sx={{
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
          fontWeight: "700",
          textOverflow: "ellipsis",
          overflow: "hidden",
          color: "primary.main",
        }}
      >
        {t.title}
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Task Description */}
      <Typography
        sx={{
          fontSize: { xs: "1rem", sm: "1.125rem" },
          color: "text.secondary",
          mb: 2,
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}
      >
        {t.description}
      </Typography>

      {/* Task Date and Time */}
      <Stack direction="row" spacing={1} alignItems="center">
        <CalendarToday fontSize="small" color="action" />
        <Typography
          sx={{
            fontSize: { xs: "0.875rem", sm: "1rem" },
            color: "text.primary",
          }}
        >
          {startDate} {startTime} - {endDate} {endTime}
        </Typography>
      </Stack>

      {/* Task Priority */}
      {/*<Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
        <Flag fontSize="small" sx={{ color: priorityColors[t.priority.toLowerCase()] }} />
        <Typography
          sx={{
            fontSize: { xs: "0.875rem", sm: "1rem" },
            fontWeight: "600",
            color: priorityColors[t.priority.toLowerCase()],
            textTransform: "capitalize",
          }}
        >
          {t.priority} Priority
        </Typography>
      </Stack>*/}

      {/* Task Status */}
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
        <Chip
          label={t.completed === 1 ? "Done" : "Not Done"}
          color={t.completed === 1 ? "success" : "warning"}
          onClick={() => onStatusToggle(t.id, t.completed)}
          size="small"
          sx={{
            cursor: "pointer",
          }}
        />
      </Stack>
    </Box>
  )
};

export default TaskPreview;