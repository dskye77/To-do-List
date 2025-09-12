const ToDoList = {
    List: [],
    async init() {
        await this.loadList()
        this.displayTasks(this.List);
        this.bindEvents();
    },
    bindEvents() {
        document.getElementById("addTask").addEventListener("click", () => {
            const input = document.getElementById("taskInput");
            const inputValue = input.value;
            this.createTask(inputValue, input);
        });
        document
            .getElementById("tasks")
            .addEventListener("click", (e) => this.handleTaskClicks(e));
    },
    createTask(name, input = null) {
        if (!this.taskNameValidation(name)) return;
        const task = {
            title: name,
            id: Date.now(),
            isCompleted: false,
        };
        this.addTask(task);
        this.displayTasks(this.List);

        if (input) input.value = ""; //reset task input
    },
    addTask(taskObj) {
        this.List.push(taskObj);
    },
    taskNameValidation(name) {
        //check empty input
        if (name.trim() === "") {
            window.alert("task title can't be empty");
            return false;
        }

        //check already existing task
        for (const task of this.List) {
            if (task.title === name) {
                window.alert("This task already exists");
                return false;
            }
        }
        return true;
    },
    displayTasks(taskArray = this.List) {
        document.getElementById("tasks").innerHTML = "";
        taskArray.sort((a, b) => a.isCompleted - b.isCompleted);
        taskArray.forEach((task) => {
            document
                .getElementById("tasks")
                .insertAdjacentHTML(
                    "beforeend",
                    this.taskHTML(task.title, task.id, task.isCompleted)
                );
        });
    },
    taskHTML(name, id, completed) {
        return `<div class="task row ${completed ? "completed" : ""
            }" data-id="${id}">
              <input class="check" type="checkbox" ${completed ? "checked" : ""
            }>
              <p class="task-name">${name}</p>
              <button class="delete-task" type="button">
                <img src="/images/delete-button.svg" alt="" />
              </button>
              <button class="edit-task" type="button">
                <img src="/images/edit-pencil.svg" alt="" srcset="" />
              </button>
            </div>`;
    },
    handleTaskClicks(e) {
        const target = e.target;
        const taskDiv = target.closest(".task");
        let taskId = null;
        if (taskDiv) {
            taskId = parseInt(taskDiv.dataset.id);
        }
        if (target.classList.contains("delete-task")) {
            this.deleteTask(taskId);
        } else if (target.classList.contains("edit-task")) {
            this.editTask(taskId);
        } else if (target.classList.contains("check")) {
            this.toggleCompleted(taskId);
        }
    },
    deleteTask(id) {
        let taskIndex = this.getIdx(id);
        if (taskIndex === -1) return;

        this.List.splice(taskIndex, 1);
        this.displayTasks(this.List);
    },
    editTask(id) {
        let taskIndex = this.getIdx(id);
        if (taskIndex === -1) return;
        const title = this.List[taskIndex].title;
        const newTitle = window.prompt(`Enter a new name for the task ${title}`);

        if (!newTitle) return;
        if (!this.taskNameValidation(newTitle)) return;

        this.List[taskIndex].title = newTitle;
        this.displayTasks(this.List);
    },
    toggleCompleted(id) {
        let taskIndex = this.getIdx(id);
        if (taskIndex === -1) return;

        const currentState = this.List[taskIndex].isCompleted;
        this.List[taskIndex].isCompleted = !currentState;
        this.displayTasks(this.List);
    },
    getIdx(id) {
        for (let i = 0; i < this.List.length; i++) {
            const task = this.List[i];
            if (task.id === id) return i;
        }
        return -1;
    },

    async loadList() {
        const response = await fetch("https://jsonplaceholder.typicode.com/todos");
        const json = await response.json();
        const totalList = [];
        const someJSON = json.slice(0, 10);
        someJSON.forEach((item) => {
            const task = {
                title: item.title,
                id: item.id,
                isCompleted: item.completed
            };
            totalList.push(task);
        });

        if (totalList) {
            this.List = totalList;
        }
    },
    // loadList() {

    //     return new Promise((resolve) => {
    //         fetch("https://jsonplaceholder.typicode.com/todos")
    //             .then(response => response.json())
    //             .then(json => {
    //                 const totalList = []
    //                 const someJSON = json.slice(0, 10)
    //                 someJSON.forEach((item) => {
    //                     const task = {
    //                         title: item.title,
    //                         id: item.id,
    //                         isCompleted: item.completed
    //                     }
    //                     totalList.push(task)
    //                 })

    //                 if (totalList) {
    //                     this.List = totalList;
    //                     resolve();
    //                 }
    //             })

    //     });
    // },
};
ToDoList.init();
