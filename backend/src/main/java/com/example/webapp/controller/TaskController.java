package com.example.webapp.controller;

import com.example.webapp.dto.TaskRequest;
import com.example.webapp.model.Task;
import com.example.webapp.model.TaskStatus;
import com.example.webapp.model.User;
import com.example.webapp.repository.TaskRepository;
import com.example.webapp.repository.UserRepository;
import com.example.webapp.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/tasks")
public class TaskController {
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Task>> getAllUserTasks(Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<Task> tasks = taskRepository.findByUserOrderByCreatedAtDesc(user);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Task>> getTasksByStatus(@PathVariable TaskStatus status, 
                                                      Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<Task> tasks = taskRepository.findByUserAndStatusOrderByCreatedAtDesc(user, status);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<Task>> searchTasks(@RequestParam String keyword, 
                                                 Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<Task> tasks = taskRepository.findByUserAndKeyword(user, keyword);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id, Authentication authentication) {
        User user = getCurrentUser(authentication);
        Optional<Task> task = taskRepository.findById(id);
        
        if (task.isPresent() && task.get().getUser().getId().equals(user.getId())) {
            return ResponseEntity.ok(task.get());
        }
        
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Task> createTask(@Valid @RequestBody TaskRequest taskRequest, 
                                          Authentication authentication) {
        User user = getCurrentUser(authentication);
        
        Task task = new Task(taskRequest.getTitle(), taskRequest.getDescription(), user);
        if (taskRequest.getStatus() != null) {
            task.setStatus(taskRequest.getStatus());
        }
        if (taskRequest.getPriority() != null) {
            task.setPriority(taskRequest.getPriority());
        }
        if (taskRequest.getDueDate() != null) {
            task.setDueDate(taskRequest.getDueDate());
        }
        
        Task savedTask = taskRepository.save(task);
        return ResponseEntity.ok(savedTask);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, 
                                          @Valid @RequestBody TaskRequest taskRequest,
                                          Authentication authentication) {
        User user = getCurrentUser(authentication);
        Optional<Task> taskOptional = taskRepository.findById(id);
        
        if (!taskOptional.isPresent() || !taskOptional.get().getUser().getId().equals(user.getId())) {
            return ResponseEntity.notFound().build();
        }
        
        Task task = taskOptional.get();
        task.setTitle(taskRequest.getTitle());
        task.setDescription(taskRequest.getDescription());
        if (taskRequest.getStatus() != null) {
            task.setStatus(taskRequest.getStatus());
        }
        if (taskRequest.getPriority() != null) {
            task.setPriority(taskRequest.getPriority());
        }
        if (taskRequest.getDueDate() != null) {
            task.setDueDate(taskRequest.getDueDate());
        }
        
        Task updatedTask = taskRepository.save(task);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteTask(@PathVariable Long id, Authentication authentication) {
        User user = getCurrentUser(authentication);
        Optional<Task> taskOptional = taskRepository.findById(id);
        
        if (!taskOptional.isPresent() || !taskOptional.get().getUser().getId().equals(user.getId())) {
            return ResponseEntity.notFound().build();
        }
        
        taskRepository.deleteById(id);
        return ResponseEntity.ok("Task deleted successfully!");
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<?> getTaskStats(Authentication authentication) {
        User user = getCurrentUser(authentication);
        
        long totalTasks = taskRepository.countByUser(user);
        long todoTasks = taskRepository.countByUserAndStatus(user, TaskStatus.TODO);
        long inProgressTasks = taskRepository.countByUserAndStatus(user, TaskStatus.IN_PROGRESS);
        long doneTasks = taskRepository.countByUserAndStatus(user, TaskStatus.DONE);
        
        return ResponseEntity.ok(new TaskStats(totalTasks, todoTasks, inProgressTasks, doneTasks));
    }

    private User getCurrentUser(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        return userRepository.findByUsername(userPrincipal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Inner class for task statistics
    public static class TaskStats {
        private long total;
        private long todo;
        private long inProgress;
        private long done;

        public TaskStats(long total, long todo, long inProgress, long done) {
            this.total = total;
            this.todo = todo;
            this.inProgress = inProgress;
            this.done = done;
        }

        // Getters
        public long getTotal() { return total; }
        public long getTodo() { return todo; }
        public long getInProgress() { return inProgress; }
        public long getDone() { return done; }
    }
}