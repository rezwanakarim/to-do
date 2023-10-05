
document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("new-task");
    const addTaskButton = document.getElementById("add-task");
    const taskList = document.getElementById("task-list");

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
            });

            listItem.appendChild(taskTextElement);
            listItem.appendChild(deleteButton);
            taskList.appendChild(listItem);

            taskInput.value = ""; 
        }
    });
});



