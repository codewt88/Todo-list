document.querySelector(".add-btn").addEventListener("click", function () {
  const todoInput = document.querySelector(".todo-input");
  const task = todoInput.value.trim();

  if (task !== "") {
    const todoList = document.querySelector(".todo-list");
    const li = document.createElement("li");
    li.classList.add("task-item");

    const taskHeader = document.createElement("div");
    taskHeader.className = "task-header";

    const taskCheckbox = document.createElement("input");
    taskCheckbox.type = "checkbox";
    taskCheckbox.className = "task-checkbox";
    taskCheckbox.style.marginRight = "10px";
    taskHeader.appendChild(taskCheckbox);

    const taskTitle = document.createElement("span");
    taskTitle.textContent = task;
    taskHeader.appendChild(taskTitle);

    const deleteTaskBtn = document.createElement("button");
    deleteTaskBtn.className = "delete-btn";
    deleteTaskBtn.textContent = "Delete";
    taskHeader.appendChild(deleteTaskBtn);

    li.appendChild(taskHeader);

    const subtaskInput = document.createElement("textarea");
    subtaskInput.className = "subtask-input";
    subtaskInput.placeholder = "Add a subtask...";
    const addSubtaskBtn = document.createElement("button");
    addSubtaskBtn.className = "add-subtask-btn";
    addSubtaskBtn.textContent = "Add Subtask";

    const subtaskContainer = document.createElement("div");
    subtaskContainer.style.display = "flex";
    subtaskContainer.style.alignItems = "flex-start";
    subtaskContainer.appendChild(subtaskInput);
    subtaskContainer.appendChild(addSubtaskBtn);
    li.appendChild(subtaskContainer);

    const subtaskList = document.createElement("ul");
    subtaskList.className = "subtask-list";
    li.appendChild(subtaskList);

    todoList.appendChild(li);
    todoInput.value = "";

    deleteTaskBtn.addEventListener("click", function () {
      todoList.removeChild(li);
    });

    addSubtaskBtn.addEventListener("click", function () {
      const subtask = subtaskInput.value.trim();
      if (subtask !== "") {
        const subtaskItem = document.createElement("li");
        subtaskItem.className = "subtask-item";

        const subtaskLabel = document.createElement("label");
        const subtaskCheckbox = document.createElement("input");
        subtaskCheckbox.type = "checkbox";
        subtaskCheckbox.addEventListener("change", function () {
          if (subtaskCheckbox.checked) {
            subtaskItem.classList.add("completed");
          } else {
            subtaskItem.classList.remove("completed");
          }
        });

        subtaskLabel.appendChild(subtaskCheckbox);
        subtaskLabel.appendChild(document.createTextNode(subtask));
        subtaskItem.appendChild(subtaskLabel);

        const deleteSubtaskBtn = document.createElement("button");
        deleteSubtaskBtn.className = "delete-btn";
        deleteSubtaskBtn.textContent = "Delete";
        deleteSubtaskBtn.addEventListener("click", function () {
          subtaskList.removeChild(subtaskItem);
        });

        subtaskItem.appendChild(deleteSubtaskBtn);
        subtaskList.appendChild(subtaskItem);
        subtaskInput.value = "";
      }
    });

    taskCheckbox.addEventListener("change", function () {
      if (taskCheckbox.checked) {
        taskHeader.classList.add("completed");
        const subtasks = li.querySelectorAll(
          '.subtask-item input[type="checkbox"]'
        );
        subtasks.forEach((subtaskCheckbox) => {
          subtaskCheckbox.checked = true;
          subtaskCheckbox.parentElement.parentElement.classList.add(
            "completed"
          );
        });
      } else {
        taskHeader.classList.remove("completed");
        const subtasks = li.querySelectorAll(
          '.subtask-item input[type="checkbox"]'
        );
        subtasks.forEach((subtaskCheckbox) => {
          subtaskCheckbox.checked = false;
          subtaskCheckbox.parentElement.parentElement.classList.remove(
            "completed"
          );
        });
      }
    });
  }
});

document.getElementById("show-all").addEventListener("click", function () {
  filterTasks("all");
});

document
  .getElementById("show-completed")
  .addEventListener("click", function () {
    filterTasks("completed");
  });

document
  .getElementById("show-incomplete")
  .addEventListener("click", function () {
    filterTasks("incomplete");
  });

function filterTasks(filter) {
  const tasks = document.querySelectorAll(".task-item");
  tasks.forEach((task) => {
    const subtasks = task.querySelectorAll(
      '.subtask-item input[type="checkbox"]'
    );
    const allCompleted = Array.from(subtasks).every(
      (checkbox) => checkbox.checked
    );
    const anyIncomplete = Array.from(subtasks).some(
      (checkbox) => !checkbox.checked
    );

    if (filter === "all") {
      task.style.display = "";
    } else if (
      filter === "completed" &&
      task.querySelector(".task-checkbox").checked
    ) {
      task.style.display = "";
    } else if (
      filter === "incomplete" &&
      !task.querySelector(".task-checkbox").checked
    ) {
      task.style.display = "";
    } else {
      task.style.display = "none";
    }
  });
}
