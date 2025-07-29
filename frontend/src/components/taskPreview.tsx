import React, { useState } from "react";
import {
  Box,
  Divider,
  Typography,
  Chip,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { AccessTime, CalendarToday, Flag } from "@mui/icons-material";

const TaskPreview = ({ t, onStatusToggle, onDelete }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(t.id);
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
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
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        {/* Task Title */}
        <Typography
          sx={{
            fontSize: { xs: "1.25rem", sm: "1.5rem" },
            fontWeight: "700",
            textOverflow: "ellipsis",
            overflow: "hidden",
            color: "primary.main",
            flex: 1,
            mr: 2,
          }}
        >
          {t.title}
        </Typography>

        {/* Delete Icon */}
        <DeleteForeverIcon
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem" },
            cursor: "pointer",
            color: "error.main",
            flexShrink: 0,
          }}
          aria-label="Delete Task"
          onClick={handleDeleteClick}
        />
      </Stack>

      {/* Task Time */}

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
          Start: {startDate} {startTime} <br />
          End: {endDate} {endTime}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the task "{t.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
};

export default TaskPreview;