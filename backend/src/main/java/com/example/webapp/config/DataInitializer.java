package com.example.webapp.config;

import com.example.webapp.model.*;
import com.example.webapp.repository.UserRepository;
import com.example.webapp.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements ApplicationRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // Check if users already exist
        if (userRepository.count() == 0) {
            createSampleUsers();
        }
    }

    private void createSampleUsers() {
        // Create admin user
        User admin = new User();
        admin.setUsername("admin");
        admin.setEmail("admin@example.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setFirstName("Admin");
        admin.setLastName("User");
        Set<Role> adminRoles = new HashSet<>();
        adminRoles.add(Role.ADMIN);
        adminRoles.add(Role.USER);
        admin.setRoles(adminRoles);
        admin = userRepository.save(admin);

        // Create regular user
        User user = new User();
        user.setUsername("user");
        user.setEmail("user@example.com");
        user.setPassword(passwordEncoder.encode("user123"));
        user.setFirstName("John");
        user.setLastName("Doe");
        Set<Role> userRoles = new HashSet<>();
        userRoles.add(Role.USER);
        user.setRoles(userRoles);
        user = userRepository.save(user);

        // Create sample tasks for the regular user
        createSampleTasks(user);

        System.out.println("Sample data created successfully!");
        System.out.println("Admin credentials: admin / admin123");
        System.out.println("User credentials: user / user123");
    }

    private void createSampleTasks(User user) {
        // Sample task 1
        Task task1 = new Task();
        task1.setTitle("Complete project documentation");
        task1.setDescription("Write comprehensive documentation for the task management application");
        task1.setStatus(TaskStatus.IN_PROGRESS);
        task1.setPriority(TaskPriority.HIGH);
        task1.setUser(user);
        taskRepository.save(task1);

        // Sample task 2
        Task task2 = new Task();
        task2.setTitle("Review code changes");
        task2.setDescription("Review pull requests and provide feedback to team members");
        task2.setStatus(TaskStatus.TODO);
        task2.setPriority(TaskPriority.MEDIUM);
        task2.setUser(user);
        taskRepository.save(task2);

        // Sample task 3
        Task task3 = new Task();
        task3.setTitle("Set up CI/CD pipeline");
        task3.setDescription("Configure automated testing and deployment pipeline");
        task3.setStatus(TaskStatus.DONE);
        task3.setPriority(TaskPriority.CRITICAL);
        task3.setUser(user);
        taskRepository.save(task3);

        // Sample task 4
        Task task4 = new Task();
        task4.setTitle("Update user interface");
        task4.setDescription("Improve the user experience with modern design patterns");
        task4.setStatus(TaskStatus.TODO);
        task4.setPriority(TaskPriority.LOW);
        task4.setUser(user);
        taskRepository.save(task4);
    }
}