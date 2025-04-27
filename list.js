const addBtn = document.getElementById('add-btn');
const newTaskInput = document.getElementById('new-task');
const incompleteTasks = document.getElementById('incomplete-tasks');
const completedTasks = document.getElementById('completed-tasks');

function saveTasks() {
    const tasks = {
        incomplete: [],
        completed: [],
        lastSavedDate: new Date().toLocaleDateString()
    };

    incompleteTasks.querySelectorAll('li').forEach(item => {
        tasks.incomplete.push(item.firstChild.textContent);
    });

    completedTasks.querySelectorAll('li').forEach(item => {
        tasks.completed.push(item.firstChild.textContent);
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (!savedTasks) return;

    const today = new Date().toLocaleDateString();

    if (savedTasks.lastSavedDate !== today) {
        const allTasks = [...savedTasks.incomplete, ...savedTasks.completed];
        allTasks.forEach(taskText => {
            const listItem = createTaskElement(taskText, false);
            incompleteTasks.appendChild(listItem);
        });
    } else {
        savedTasks.incomplete.forEach(taskText => {
            const listItem = createTaskElement(taskText, false);
            incompleteTasks.appendChild(listItem);
        });

        savedTasks.completed.forEach(taskText => {
            const listItem = createCompletedTaskElement(taskText, false);
            completedTasks.appendChild(listItem);
        });
    }
}

function createTaskElement(taskText, save = true) {
    const listItem = document.createElement('li');
    listItem.textContent = taskText;

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    styleButton(completeButton, '#4CAF50');

    completeButton.addEventListener('click', () => {
        const completedItem = createCompletedTaskElement(taskText);
        completedTasks.appendChild(completedItem);
        listItem.remove();
        saveTasks();
    });

    listItem.appendChild(completeButton);

    if (save) saveTasks();
    return listItem;
}

function createCompletedTaskElement(taskText, save = true) {
    const listItem = document.createElement('li');
    listItem.textContent = taskText;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    styleButton(deleteButton, '#f44336');

    deleteButton.addEventListener('click', () => {
        listItem.remove();
        saveTasks();
    });

    listItem.appendChild(deleteButton);

    if (save) saveTasks();
    return listItem;
}

function styleButton(button, bgColor) {
    button.style.marginLeft = '10px';
    button.style.backgroundColor = bgColor;
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '5px 10px';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
}

function addTask() {
    const taskText = newTaskInput.value.trim();
    if (taskText !== '') {
        const listItem = createTaskElement(taskText);
        incompleteTasks.appendChild(listItem);
        newTaskInput.value = '';
    }
}

addBtn.addEventListener('click', addTask);

newTaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

loadTasks();
