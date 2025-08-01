import React, { useState } from 'react';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Box,
  Typography,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  CheckCircle,
  Schedule,
  Cancel,
  Flag,
} from '@mui/icons-material';
import { Task, TaskStatus, TaskPriority } from '../../types';
import { taskAPI } from '../../services/api';

interface TaskItemProps {
  task: Task;
  onTaskUpdate: () => void;
  onTaskDelete: () => void;
  onTaskEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onTaskUpdate,
  onTaskDelete,
  onTaskEdit,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      await taskAPI.updateTask(task.id, {
        title: task.title,
        description: task.description,
        status: newStatus,
        priority: task.priority,
      });
      onTaskUpdate();
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await taskAPI.deleteTask(task.id);
      onTaskDelete();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DONE:
        return <CheckCircle sx={{ color: '#4caf50' }} />;
      case TaskStatus.IN_PROGRESS:
        return <Schedule sx={{ color: '#2196f3' }} />;
      case TaskStatus.CANCELLED:
        return <Cancel sx={{ color: '#f44336' }} />;
      default:
        return <Schedule sx={{ color: '#ff9800' }} />;
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DONE:
        return '#4caf50';
      case TaskStatus.IN_PROGRESS:
        return '#2196f3';
      case TaskStatus.CANCELLED:
        return '#f44336';
      default:
        return '#ff9800';
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.CRITICAL:
        return '#f44336';
      case TaskPriority.HIGH:
        return '#ff9800';
      case TaskPriority.MEDIUM:
        return '#2196f3';
      default:
        return '#4caf50';
    }
  };

  return (
    <>
      <ListItem 
        sx={{ 
          border: '1px solid #e0e0e0', 
          borderRadius: 1, 
          mb: 1, 
          backgroundColor: '#fafafa' 
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
          {getStatusIcon(task.status)}
        </Box>
        
        <ListItemText
          primary={
            <Typography variant="h6" component="div">
              {task.title}
            </Typography>
          }
          secondary={
            <Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                {task.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  size="small"
                  label={task.status.replace('_', ' ')}
                  sx={{ 
                    backgroundColor: getStatusColor(task.status),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
                <Chip
                  size="small"
                  icon={<Flag />}
                  label={task.priority}
                  sx={{ 
                    backgroundColor: getPriorityColor(task.priority),
                    color: 'white'
                  }}
                />
                <Chip
                  size="small"
                  label={new Date(task.createdAt).toLocaleDateString()}
                  variant="outlined"
                />
              </Box>
            </Box>
          }
        />

        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
        </ListItemSecondaryAction>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { onTaskEdit(task); handleMenuClose(); }}>
            <Edit sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          
          {task.status !== TaskStatus.DONE && (
            <MenuItem onClick={() => { handleStatusChange(TaskStatus.DONE); handleMenuClose(); }}>
              <CheckCircle sx={{ mr: 1 }} />
              Mark as Done
            </MenuItem>
          )}
          
          {task.status !== TaskStatus.IN_PROGRESS && task.status !== TaskStatus.DONE && (
            <MenuItem onClick={() => { handleStatusChange(TaskStatus.IN_PROGRESS); handleMenuClose(); }}>
              <Schedule sx={{ mr: 1 }} />
              Mark as In Progress
            </MenuItem>
          )}
          
          <MenuItem 
            onClick={() => { 
              setDeleteDialogOpen(true); 
              handleMenuClose(); 
            }}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>
      </ListItem>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{task.title}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskItem;