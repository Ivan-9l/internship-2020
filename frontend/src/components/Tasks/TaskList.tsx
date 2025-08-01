import React from 'react';
import {
  List,
  ListItem,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { Task } from '../../types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onTaskUpdate: () => void;
  onTaskDelete: () => void;
  onTaskEdit: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  onTaskUpdate,
  onTaskDelete,
  onTaskEdit,
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (tasks.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="textSecondary">
          No tasks found
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Create your first task to get started!
        </Typography>
      </Paper>
    );
  }

  return (
    <List sx={{ width: '100%' }}>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onTaskUpdate={onTaskUpdate}
          onTaskDelete={onTaskDelete}
          onTaskEdit={onTaskEdit}
        />
      ))}
    </List>
  );
};

export default TaskList;