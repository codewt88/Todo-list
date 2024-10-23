let currentMainTask = null;
// Variable to store the current main task

document.getElementById('add-main-task').addEventListener('click', function() {
    const mainTaskText = document.getElementById('main-task').value.trim();
    // Get the text from the main task input and remove whitespace

    if (mainTaskText === '') {
        // Check if the input is empty and show an alert if it is
        alert('Please enter the task content.');
        return;
    }

    if (mainTaskText !== '') {
        const taskContainer = createTaskElement(mainTaskText, false, []);
        document.getElementById('task-list').appendChild(taskContainer);
        // Add the task to the task list

        document.getElementById('main-task').value = '';
        // Clear the main task input field
        saveTasks();
        // Save tasks after adding a new main task
    }
});

document.getElementById('all-tasks').addEventListener('click', function() {
    filterTasks('all');
    // Show all tasks
});

document.getElementById('completed-tasks').addEventListener('click', function() {
    filterTasks('completed');
    // Show only completed tasks
});

document.getElementById('incomplete-tasks').addEventListener('click', function() {
    filterTasks('incomplete');
    // Show only incomplete tasks
});

function filterTasks(filter) {
    const tasks = document.querySelectorAll('.task-item');
    tasks.forEach(task => {
        switch (filter) {
            case 'all':
                task.style.display = 'block';
                break;
            case 'completed':
                task.style.display = task.dataset.completed === 'true' ? 'block' : 'none';
                break;
            case 'incomplete':
                task.style.display = task.dataset.completed === 'false' ? 'block' : 'none';
                break;
        }
    });
}

function toggleTaskCompleted(taskLabel, isCompleted) {
    // Function to toggle the style of completed/incomplete tasks
    if (isCompleted) {
        taskLabel.style.textDecoration = 'line-through';
        taskLabel.style.color = 'gray';
    } else {
        taskLabel.style.textDecoration = 'none';
        taskLabel.style.color = 'black';
    }
}

// Function to save tasks to localStorage
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task-item').forEach(taskContainer => {
        const mainTaskText = taskContainer.querySelector('.task-text').textContent;
        const isCompleted = taskContainer.dataset.completed === 'true';
        const subTasks = [];

        taskContainer.querySelectorAll('.sub-task').forEach(subTaskContainer => {
            subTasks.push({
                text: subTaskContainer.querySelector('.task-text').textContent,
                isCompleted: subTaskContainer.querySelector('.task-checkbox').checked
            });
        });

        tasks.push({
            mainTaskText,
            isCompleted,
            subTasks
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskContainer = createTaskElement(task.mainTaskText, task.isCompleted, task.subTasks);
        document.getElementById('task-list').appendChild(taskContainer);
    });
}

// Function to create a task element with all its components
function createTaskElement(mainTaskText, isCompleted, subTasks) {
    const taskContainer = document.createElement('div');
    taskContainer.classList.add('task-item');
    taskContainer.dataset.completed = isCompleted;

    // Main Task
    const mainTask = document.createElement('div');
    mainTask.classList.add('main-task');

    const mainTaskCheckbox = document.createElement('input');
    mainTaskCheckbox.type = 'checkbox';
    mainTaskCheckbox.classList.add('task-checkbox');
    mainTaskCheckbox.checked = isCompleted;

    const mainTaskLabel = document.createElement('span');
    mainTaskLabel.textContent = mainTaskText;
    mainTaskLabel.classList.add('task-text');
    toggleTaskCompleted(mainTaskLabel, isCompleted);

    mainTask.appendChild(mainTaskCheckbox);
    mainTask.appendChild(mainTaskLabel);

    // Sub Task Container
    const subTaskContainer = document.createElement('div');
    subTaskContainer.classList.add('sub-task-container');

    subTasks.forEach(subTask => {
        const subTaskElement = createSubTaskElement(subTask.text, subTask.isCompleted);
        subTaskContainer.appendChild(subTaskElement);
    });

    // Sub Task Input
    const subTaskInput = document.createElement('textarea');
    subTaskInput.rows = 2;
    subTaskInput.placeholder = 'Sub task...';
    subTaskInput.classList.add('resizable-textbox');

    const addSubTaskButton = document.createElement('button');
    addSubTaskButton.textContent = 'Add Sub Task';
    addSubTaskButton.classList.add('add-sub-task');

    addSubTaskButton.addEventListener('click', function() {
        const subTaskText = subTaskInput.value.trim();
        if (subTaskText === '') {
            alert('Please enter the sub-task content.');
            return;
        }

        const subTaskElement = createSubTaskElement(subTaskText, false);
        subTaskContainer.appendChild(subTaskElement);
        subTaskInput.value = '';
        saveTasks();
    });

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-task');
    deleteButton.textContent = 'Delete Task';

    deleteButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this task?')) {
            taskContainer.remove();
            saveTasks();
        }
    });

    mainTaskCheckbox.addEventListener('change', function() {
        toggleTaskCompleted(mainTaskLabel, mainTaskCheckbox.checked);
        taskContainer.dataset.completed = mainTaskCheckbox.checked ? 'true' : 'false';

        const subTasks = subTaskContainer.querySelectorAll('.sub-task .task-checkbox');
        subTasks.forEach(subTaskCheckbox => {
            subTaskCheckbox.checked = mainTaskCheckbox.checked;
            toggleTaskCompleted(subTaskCheckbox.nextElementSibling, subTaskCheckbox.checked);
        });
        saveTasks();
    });

    taskContainer.appendChild(mainTask);
    taskContainer.appendChild(subTaskInput);
    taskContainer.appendChild(addSubTaskButton);
    taskContainer.appendChild(subTaskContainer);
    taskContainer.appendChild(deleteButton);

    return taskContainer;
}

// Function to create a sub-task element
function createSubTaskElement(subTaskText, isCompleted) {
    const subTask = document.createElement('div');
    subTask.classList.add('sub-task');

    const subTaskCheckbox = document.createElement('input');
    subTaskCheckbox.type = 'checkbox';
    subTaskCheckbox.classList.add('task-checkbox');
    subTaskCheckbox.checked = isCompleted;

    const subTaskLabel = document.createElement('span');
    subTaskLabel.textContent = subTaskText;
    subTaskLabel.classList.add('task-text');
    toggleTaskCompleted(subTaskLabel, isCompleted);

    const deleteSubTaskButton = document.createElement('button');
    deleteSubTaskButton.classList.add('delete-sub-task');
    deleteSubTaskButton.innerHTML = '<img src="delete-icon.png" alt="Delete">';

    deleteSubTaskButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this sub-task?')) {
            subTask.remove();
            saveTasks();
        }
    });

    subTaskCheckbox.addEventListener('change', function() {
        toggleTaskCompleted(subTaskLabel, subTaskCheckbox.checked);
        saveTasks();
    });

    subTask.appendChild(subTaskCheckbox);
    subTask.appendChild(subTaskLabel);
    subTask.appendChild(deleteSubTaskButton);

    return subTask;
}

// Call loadTasks when the page loads
window.addEventListener('load', loadTasks);

// Example of saving tasks after deleting a main task
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-task')) {
        saveTasks();
    }
});
