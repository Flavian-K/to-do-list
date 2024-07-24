document.addEventListener("DOMContentLoaded", function () {
	const taskInput = document.getElementById("taskInput");
	const addTaskButton = document.getElementById("addTaskButton");
	const taskList = document.getElementById("taskList");
	const showAllButton = document.getElementById("showAllButton");
	const showCompletedButton = document.getElementById("showCompletedButton");
	const showIncompleteButton = document.getElementById("showIncompleteButton");

	// Load tasks from local storage
	let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

	function saveTasks() {
		localStorage.setItem("tasks", JSON.stringify(tasks));
	}

	function renderTasks(filter = "all") {
		taskList.innerHTML = "";
		tasks.forEach((task, index) => {
			if (filter === "completed" && !task.completed) return;
			if (filter === "incomplete" && task.completed) return;

			const li = document.createElement("li");
			li.className = task.completed ? "completed" : "";
			li.innerHTML = `
        <input type="checkbox" ${
					task.completed ? "checked" : ""
				} data-index="${index}">
        <span contenteditable>${task.text}</span>
        <button data-index="${index}">Delete</button>
      `;
			taskList.appendChild(li);
		});
	}

	function addTask() {
		const text = taskInput.value.trim();
		if (text) {
			tasks.push({ text, completed: false });
			saveTasks();
			renderTasks();
			taskInput.value = "";
		}
	}

	function toggleTask(index) {
		tasks[index].completed = !tasks[index].completed;
		saveTasks();
		renderTasks();
	}

	function deleteTask(index) {
		tasks.splice(index, 1);
		saveTasks();
		renderTasks();
	}

	function editTask(index, newText) {
		tasks[index].text = newText;
		saveTasks();
	}

	taskList.addEventListener("click", function (e) {
		if (e.target.tagName === "BUTTON") {
			const index = e.target.dataset.index;
			deleteTask(index);
		} else if (e.target.tagName === "INPUT") {
			const index = e.target.dataset.index;
			toggleTask(index);
		}
	});

	taskList.addEventListener("input", function (e) {
		if (e.target.tagName === "SPAN") {
			const index = [...taskList.children].indexOf(e.target.parentElement);
			editTask(index, e.target.textContent);
		}
	});

	addTaskButton.addEventListener("click", addTask);
	showAllButton.addEventListener("click", () => renderTasks("all"));
	showCompletedButton.addEventListener("click", () => renderTasks("completed"));
	showIncompleteButton.addEventListener("click", () =>
		renderTasks("incomplete")
	);

	renderTasks();
});
