// Portfolio Website JavaScript

// Smooth Scroll Navigation
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = document.querySelector(this.getAttribute('href'));
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// To do list
class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentId = parseInt(localStorage.getItem('currentId')) || 1;
        this.editingId = null;
        this.init();
    }

    init() {
        // Initialize event listeners
        document.getElementById('todoForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTodo();
        });

        document.getElementById('saveEdit').addEventListener('click', () => {
            this.saveEdit();
        });

        // Initial render
        this.render();
    }

    addTodo() {
        const input = document.getElementById('todoInput');
        const priority = document.getElementById('prioritySelect').value;
        const text = input.value.trim();

        if (text) {
            this.todos.push({
                id: this.currentId++,
                text,
                priority,
                completed: false,
                createdAt: new Date().toISOString()
            });
            this.saveTodos();
            input.value = '';
            this.render();
        }
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    }

    editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            this.editingId = id;
            document.getElementById('editInput').value = todo.text;
            document.getElementById('editPriority').value = todo.priority;
            new bootstrap.Modal(document.getElementById('editModal')).show();
        }
    }

    saveEdit() {
        const todo = this.todos.find(t => t.id === this.editingId);
        if (todo) {
            todo.text = document.getElementById('editInput').value;
            todo.priority = document.getElementById('editPriority').value;
            this.saveTodos();
            this.render();
            bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
        }
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
        localStorage.setItem('currentId', this.currentId.toString());
    }

    updateCounters() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const pending = total - completed;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('pendingTasks').textContent = pending;
    }

    render() {
        const todoList = document.getElementById('todoList');
        todoList.innerHTML = '';

        this.todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .forEach(todo => {
                const item = document.createElement('div');
                item.className = `todo-item list-group-item d-flex justify-content-between align-items-center mb-2 priority-${todo.priority} ${todo.completed ? 'completed' : ''}`;
                
                item.innerHTML = `
                    <div class="d-flex align-items-center">
                        <input type="checkbox" class="form-check-input me-2" 
                            ${todo.completed ? 'checked' : ''}>
                        <span class="todo-text">${todo.text}</span>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary edit-btn">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;

                // Add event listeners
                item.querySelector('input[type="checkbox"]').addEventListener('change', 
                    () => this.toggleTodo(todo.id));
                item.querySelector('.edit-btn').addEventListener('click', 
                    () => this.editTodo(todo.id));
                item.querySelector('.delete-btn').addEventListener('click', 
                    () => this.deleteTodo(todo.id));

                todoList.appendChild(item);
            });

        this.updateCounters();
    }
}

  // Updated JavaScript with new class names
  const passwordField = document.querySelector('.pwd-input-field');
  const lengthSlider = document.querySelector('.pwd-length-slider');
  const lengthNumber = document.querySelector('.pwd-length-number');
  const uppercaseCheck = document.getElementById('uppercase');
  const lowercaseCheck = document.getElementById('lowercase');
  const numbersCheck = document.getElementById('numbers');
  const symbolsCheck = document.getElementById('symbols');
  const generateButton = document.querySelector('.pwd-generate-btn');
  const copyButton = document.querySelector('.pwd-copy-button');
  const strengthIndicator = document.querySelector('.pwd-strength-indicator');
  const notification = document.querySelector('.pwd-notification');
  const displayBox = document.querySelector('.pwd-display-box');

  lengthSlider.addEventListener('input', (e) => {
      lengthNumber.textContent = e.target.value;
  });

  generateButton.addEventListener('click', generatePassword);
  
  copyButton.addEventListener('click', () => {
      if (!passwordField.value) return;
      
      navigator.clipboard.writeText(passwordField.value).then(() => {
          showNotification();
      });
  });

  function generatePassword() {
      const length = +lengthSlider.value;
      const hasUpper = uppercaseCheck.checked;
      const hasLower = lowercaseCheck.checked;
      const hasNumber = numbersCheck.checked;
      const hasSymbol = symbolsCheck.checked;

      const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const lowercase = 'abcdefghijklmnopqrstuvwxyz';
      const numbers = '0123456789';
      const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

      let chars = '';
      if (hasUpper) chars += uppercase;
      if (hasLower) chars += lowercase;
      if (hasNumber) chars += numbers;
      if (hasSymbol) chars += symbols;

      if (!chars) {
          alert('Please select at least one character type');
          return;
      }

      let password = '';
      for (let i = 0; i < length; i++) {
          password += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      passwordField.value = password;
      updateStrengthMeter(password);
      
      displayBox.classList.add('pwd-highlight');
      setTimeout(() => displayBox.classList.remove('pwd-highlight'), 500);
  }

  function updateStrengthMeter(password) {
      const length = password.length;
      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSymbol = /[^A-Za-z0-9]/.test(password);

      const variety = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
      
      strengthIndicator.className = 'pwd-strength-indicator';
      if (length < 8 || variety === 1) {
          strengthIndicator.classList.add('pwd-weak');
      } else if (length < 12 || variety === 2) {
          strengthIndicator.classList.add('pwd-medium');
      } else if (length < 16 || variety === 3) {
          strengthIndicator.classList.add('pwd-strong');
      } else {
          strengthIndicator.classList.add('pwd-very-strong');
      }
  }

  function showNotification() {
      notification.style.display = 'block';
      setTimeout(() => {
          notification.style.display = 'none';
      }, 2000);
  }

// Initialize the app
const todoApp = new TodoApp();

// Form Validation and Submission
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form fields
        const name = contactForm.querySelector('input[type="text"]');
        const email = contactForm.querySelector('input[type="email"]');
        const message = contactForm.querySelector('textarea');
        
        // Basic validation
        if (name.value.trim() === '') {
            showError(name, 'Name cannot be empty');
            return;
        }
        
        if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email');
            return;
        }
        
        if (message.value.trim() === '') {
            showError(message, 'Message cannot be empty');
            return;
        }
        
        // Simulate form submission
        sendMessage(name.value, email.value, message.value);
    });
}

// Email validation helper function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show error message
function showError(input, message) {
    // Remove any existing error
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create and append error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message text-danger small mt-1';
    errorElement.textContent = message;
    input.parentElement.appendChild(errorElement);
    
    // Highlight input field
    input.classList.add('is-invalid');
    
    // Remove error after user starts typing
    input.addEventListener('input', function removeError() {
        errorElement.remove();
        input.classList.remove('is-invalid');
        input.removeEventListener('input', removeError);
    });
}

// Simulated message sending function
function sendMessage(name, email, message) {
    // In a real-world scenario, you would send this to a backend service
    console.log('Message Submitted:', { name, email, message });
    
    // Show success modal or message
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
    
    // Reset form
    document.getElementById('contactForm').reset();
}

// Project Modal Functionality
function initProjectModals() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const projectTitle = this.querySelector('.card-title').textContent;
            const projectDescription = this.querySelector('.card-text').textContent;
            const projectImage = this.querySelector('.card-img-top').src;
            
            // Update modal content
            const modalTitle = document.getElementById('projectModalLabel');
            const modalBody = document.querySelector('#projectModal .modal-body');
            const modalImage = document.querySelector('#projectModal .modal-body img');
            
            modalTitle.textContent = projectTitle;
            modalBody.querySelector('p').textContent = projectDescription;
            modalImage.src = projectImage;
        });
    });
}

// Skill Animation
function animateSkills() {
    const skillBadges = document.querySelectorAll('#skills .badge');
    
    skillBadges.forEach((badge, index) => {
        badge.style.opacity = '0';
        badge.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            badge.style.transition = 'all 0.5s ease';
            badge.style.opacity = '1';
            badge.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Dark Mode Toggle
function initDarkModeToggle() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    
    darkModeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', this.checked);
    });
    
    // Check user's previous preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }
}

// Initialize all functions when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScroll();
    initContactForm();
    initProjectModals();
    animateSkills();
    initDarkModeToggle();
});

// Additional utility functions can be added here

function copyText() {
    // Get the textarea element
    const textarea = document.getElementById('textArea');
    
    // Select the text
    textarea.select();
    textarea.setSelectionRange(0, 99999); // For mobile devices
    
    // Copy the text
    try {
        navigator.clipboard.writeText(textarea.value)
            .then(() => {
                alert('Text copied successfully!');
            })
            .catch(err => {
                // Fallback for older browsers
                document.execCommand('copy');
                alert('Text copied successfully!');
            });
    } catch (err) {
        // Fallback for older browsers
        document.execCommand('copy');
        alert('Text copied successfully!');
    }
}