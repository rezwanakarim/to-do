document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("new-task");
    const addTaskButton = document.getElementById("add-task");
    const taskList = document.getElementById("task-list");

    // Load tasks from local storage when the page loads
    loadTasksFromLocalStorage();

    // Add a task and store it in local storage
    addTaskButton.addEventListener("click", function () {
        const taskText = taskInput.value.trim();

        if (taskText !== "") {
            const listItem = document.createElement("li");
            const taskTextElement = document.createElement("span");
            const deleteButton = document.createElement("button");

            taskTextElement.textContent = taskText;
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("delete-button");

            deleteButton.addEventListener("click", function () {
                listItem.remove();
                updateLocalStorage();
            });

            listItem.appendChild(taskTextElement);
            listItem.appendChild(deleteButton);
            taskList.appendChild(listItem);

            taskInput.value = ""; // Clear the input field

            // Store tasks in local storage
            saveTaskToLocalStorage(taskText);
        }
    });

    function saveTaskToLocalStorage(task) {
        let tasks;
        if (localStorage.getItem("tasks") === null) {
            tasks = [];
        } else {
            tasks = JSON.parse(localStorage.getItem("tasks"));
        }

        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasksFromLocalStorage() {
        let tasks;
        if (localStorage.getItem("tasks") === null) {
            tasks = [];
        } else {
            tasks = JSON.parse(localStorage.getItem("tasks"));
        }

        tasks.forEach(function (taskText) {
            const listItem = document.createElement("li");
            const taskTextElement = document.createElement("span");
            const deleteButton = document.createElement("button");

            taskTextElement.textContent = taskText;
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("delete-button");

            deleteButton.addEventListener("click", function () {
                listItem.remove();
                updateLocalStorage();
            });

            listItem.appendChild(taskTextElement);
            listItem.appendChild(deleteButton);
            taskList.appendChild(listItem);
        });
    }

    function updateLocalStorage() {
        const tasks = Array.from(taskList.children).map(function (taskItem) {
            return taskItem.querySelector("span").textContent;
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
});


