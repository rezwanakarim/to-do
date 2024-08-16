document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("new-task");
    const dueDateInput = document.getElementById("due-date");
    const addTaskButton = document.getElementById("add-task");
    const taskList = document.getElementById("task-list");

    loadTasksFromLocalStorage();

    addTaskButton.addEventListener("click", function () {
        const taskText = taskInput.value.trim();
        const dueDate = dueDateInput.value;

        if (taskText !== "" && dueDate !== "") {
            const addedDate = new Date();
            const taskId = Date.now().toString(); 
            const listItem = createTaskElement(taskId, taskText, false, addedDate, dueDate, null);
            taskList.appendChild(listItem);

            taskInput.value = "";
            dueDateInput.value = "";

            saveTaskToLocalStorage(taskId, taskText, addedDate, dueDate, false, null);
            sortAndDisplayTasks();
        }
    });

    function formatDate(date) {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    }

    function createTaskElement(taskId, taskText, completed = false, addedDate = new Date(), dueDate, completedDate = null) {
        const listItem = document.createElement("li");
        listItem.dataset.taskId = taskId; 

        const dateElement = document.createElement("div");
        dateElement.classList.add("task-date");
        dateElement.innerHTML = 
            `<span>Added: ${formatDate(addedDate)} | Due: ${formatDate(dueDate)}</span>`;

        const taskContent = document.createElement("div");
        taskContent.classList.add("task-content");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = completed;
        checkbox.classList.add("checkbox");

        const taskTextElement = document.createElement("p");
        taskTextElement.classList.add("task-text");
        taskTextElement.textContent = taskText;

        const timestampElement = document.createElement("span");
        timestampElement.classList.add("timestamp");
        updateTimestamp(addedDate, completedDate, timestampElement);

        const taskButtons = document.createElement("div");
        taskButtons.classList.add("task-buttons");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-button");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");

        checkbox.addEventListener("change", function () {
            const taskId = listItem.dataset.taskId;
            const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

            const task = tasks.find(task => task.id === taskId);
            if (task) {
                task.completed = checkbox.checked;
                task.completedDate = checkbox.checked ? new Date().toISOString() : null;
                localStorage.setItem("tasks", JSON.stringify(tasks));

                if (checkbox.checked) {
                    taskTextElement.classList.add("task-completed");
                } else {
                    taskTextElement.classList.remove("task-completed");
                }
            }

            updateTimestamp(new Date(task.addedDate), task.completedDate, timestampElement);
            sortAndDisplayTasks();
        });

        editButton.addEventListener("click", function () {
            const newTaskText = prompt("Edit your task:", taskTextElement.textContent);
            const newDueDate = prompt("Edit the due date:", dueDate);
            if (newTaskText !== null && newTaskText.trim() !== "" && newDueDate) {
                taskTextElement.textContent = newTaskText.trim();
                dateElement.innerHTML = 
                    ` <span></span>
                    <span>Added: ${formatDate(addedDate)} | Due: ${formatDate(newDueDate)}</span>`;
                const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
                const task = tasks.find(task => task.id === taskId);
                if (task) {
                    task.text = newTaskText.trim();
                    task.dueDate = newDueDate;
                    localStorage.setItem("tasks", JSON.stringify(tasks));
                }
            }
        });

        deleteButton.addEventListener("click", function () {
            listItem.remove();
            updateLocalStorage();
            sortAndDisplayTasks();
        });

        taskContent.appendChild(checkbox);
        taskContent.appendChild(taskTextElement);
        taskContent.appendChild(timestampElement);
        taskContent.appendChild(taskButtons);

        taskButtons.appendChild(editButton);
        taskButtons.appendChild(deleteButton);

        listItem.appendChild(taskContent);
        listItem.appendChild(dateElement);

        if (completed) {
            taskTextElement.classList.add("task-completed");
        }

        return listItem;
    }

    function updateTimestamp(addedDate, completedDate, timestampElement) {
        // timestampElement.textContent = `Added at ${new Date(addedDate).toLocaleTimeString()}`;
        if (completedDate) {
            timestampElement.textContent += `  Completed at ${new Date(completedDate).toLocaleTimeString()}`;
        }
    }

    function saveTaskToLocalStorage(taskId, taskText, addedDate, dueDate, completed, completedDate) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        const taskData = {
            id: taskId,
            text: taskText,
            completed: completed,
            addedDate: addedDate.toISOString(),
            dueDate: dueDate,
            completedDate: completedDate
        };

        tasks.push(taskData);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

        tasks.forEach(function (task) {
            const listItem = createTaskElement(
                task.id,
                task.text,
                task.completed,
                new Date(task.addedDate),
                task.dueDate,
                task.completedDate ? new Date(task.completedDate) : null
            );
            taskList.appendChild(listItem);
        });

        sortAndDisplayTasks();
    }

    function sortAndDisplayTasks() {
        let tasks = Array.from(taskList.children);

        tasks.sort((a, b) => {
            const aCompleted = a.querySelector("input[type='checkbox']").checked;
            const bCompleted = b.querySelector("input[type='checkbox']").checked;

            if (aCompleted && !bCompleted) return 1;
            if (!aCompleted && bCompleted) return -1;

            const aDate = new Date(a.querySelector(".timestamp").textContent.split('Added at ')[1]);
            const bDate = new Date(b.querySelector(".timestamp").textContent.split('Added at ')[1]);

            return aDate - bDate;
        });

        taskList.innerHTML = "";
        tasks.forEach(task => taskList.appendChild(task));
    }

    function updateLocalStorage() {
        const tasks = Array.from(taskList.children).map(function (taskItem) {
            const taskId = taskItem.dataset.taskId;
            const checkbox = taskItem.querySelector("input[type='checkbox']");
            const taskTextElement = taskItem.querySelector(".task-text");
            const timestampElement = taskItem.querySelector(".timestamp");
            const dueDateElement = taskItem.querySelector(".task-date").textContent.split('| Due: ')[1].trim();

            return {
                id: taskId,
                text: taskTextElement.textContent,
                completed: checkbox.checked,
                addedDate: new Date(timestampElement.textContent.split('Added at ')[1]).toISOString(),
                dueDate: dueDateElement,
                completedDate: checkbox.checked ? new Date().toISOString() : null
            };
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
});
