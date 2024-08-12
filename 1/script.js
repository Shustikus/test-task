document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveAndRenderTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    };

    const renderTasks = () => {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            if (!task.completed) taskItem.title = 'Click to mark as completed';

            taskItem.innerHTML = `
                <span>${task.text}</span>
                <button>Delete</button>
            `;

            taskItem.querySelector('span').addEventListener('click', () => {
                tasks[index].completed = !tasks[index].completed;
                saveAndRenderTasks();
            });

            taskItem.querySelector('button').addEventListener('click', () => {
                tasks.splice(index, 1);
                saveAndRenderTasks();
            });

            taskList.appendChild(taskItem);
        });
    };

    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push({ text: taskText, completed: false });
            saveAndRenderTasks();
            taskInput.value = '';
        }
    });

    renderTasks();
});
