import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Fab,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Add, Search, Assignment, CheckCircle, Schedule, Cancel } from '@mui/icons-material';
import { Task, TaskStats } from '../../types';
import { taskAPI } from '../../services/api';
import TaskList from '../Tasks/TaskList';
import TaskDialog from '../Tasks/TaskDialog';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({ total: 0, todo: 0, inProgress: 0, done: 0 });
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await taskAPI.getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await taskAPI.getTaskStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleSearch = async (keyword: string) => {
    setSearchKeyword(keyword);
    if (keyword.trim()) {
      try {
        const data = await taskAPI.searchTasks(keyword);
        setTasks(data);
      } catch (error) {
        console.error('Failed to search tasks:', error);
      }
    } else {
      fetchTasks();
    }
  };

  const handleTaskCreated = () => {
    fetchTasks();
    fetchStats();
    setOpenDialog(false);
    setEditingTask(null);
  };

  const handleTaskUpdated = () => {
    fetchTasks();
    fetchStats();
    setOpenDialog(false);
    setEditingTask(null);
  };

  const handleTaskDeleted = () => {
    fetchTasks();
    fetchStats();
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setOpenDialog(true);
  };

  const statsCards = [
    { title: 'Total Tasks', value: stats.total, icon: Assignment, color: '#1976d2' },
    { title: 'To Do', value: stats.todo, icon: Schedule, color: '#ff9800' },
    { title: 'In Progress', value: stats.inProgress, icon: Schedule, color: '#2196f3' },
    { title: 'Completed', value: stats.done, icon: CheckCircle, color: '#4caf50' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <stat.icon sx={{ fontSize: 40, color: stat.color, mr: 2 }} />
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search tasks..."
          value={searchKeyword}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Tasks Section */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            Your Tasks
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
          >
            Add Task
          </Button>
        </Box>
        
        <TaskList 
          tasks={tasks} 
          loading={loading}
          onTaskUpdate={handleTaskUpdated}
          onTaskDelete={handleTaskDeleted}
          onTaskEdit={handleEditTask}
        />
      </Paper>

      {/* Add/Edit Task Dialog */}
      <TaskDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingTask(null);
        }}
        onTaskCreated={handleTaskCreated}
        onTaskUpdated={handleTaskUpdated}
        task={editingTask}
      />

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setOpenDialog(true)}
      >
        <Add />
      </Fab>
    </Container>
  );
};

export default Dashboard;