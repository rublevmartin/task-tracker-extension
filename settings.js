const popup = document.getElementById('js-popup-new-task');
const formPopup = document.getElementById('js-new-task');
const parentTarget = document.getElementById('js-task-list');
const popupToggle = document.querySelectorAll('.js-popup-toggle');

// new values
const newTitle = document.getElementById('task-title');
const newDescription = document.getElementById('task-description');
const newEstimate = document.getElementById('task-estimate');

let tasks = [];

chrome.storage.local.get(['tasks'], function(result) {
    if (result.tasks) {
        tasks = result.tasks;
    } else {
        chrome.storage.local.set({ tasks: tasks });
    }

    loadTasks(tasks);

    popupToggle.forEach((element) => {
        element.addEventListener('click', showPopup);
    });

    formPopup.addEventListener('submit', addNewTask);
});

const updateDeleteButtons = () => {
    const deleteButtons = document.querySelectorAll('.js-delete-button');

    deleteButtons.forEach((element) => {
        const dataNumber = element.dataset.taskNumber;

        element.addEventListener('click', () => {deleteTask(dataNumber)});
    });
}

const updateEditButtons = () => {
    const editButtons = document.querySelectorAll('.js-edit-button');

    editButtons.forEach((element) => {
        const dataNumber = element.dataset.taskNumber;

        element.addEventListener('click', () => {editTask(dataNumber)});
    });
}

const showPopup = () => {
    popup.classList.toggle('active');

    formPopup.reset();
}

const loadTasks = ((items) => {
    const itemsLength = items.length;

    let markup = '';

    if (itemsLength > 0) {
        parentTarget.innerHTML = '';

        for (i = itemsLength - 1; i >= 0; i--) {
            markup = 
                '<div class="panel-item">' +
                    '<div class="panel-item__head">' +
                        '<h3 class="panel-item__entry">' +
                            items[i].name +
                        '</h3>' +
                    
                        '<div class="panel-item__buttons">' +
                            '<button class="btn btn--small js-edit-button" data-task-number="' + i + '">Edit</button>' +
                            '<button class="btn btn--small js-delete-button" data-task-number="' + i + '">Delete</button>' +
                        '</div>' +
                    '</div>' +
                '</div>' 
            
            parentTarget.innerHTML += markup;
        }

        updateDeleteButtons();
        updateEditButtons();
    } else {
        parentTarget.innerHTML = '<p class="panel__entry">No added tasks yet!</p>';
    }
});

const addNewTask = ((event) => {
    event.preventDefault();

    tasks.push ({
        name: newTitle.value,
        description: newDescription.value,
        time: newEstimate.value,
        timeRemaining: newEstimate.value,
        finished: false,
        started: false,
        subtasks: [
            {name: 'option 1', finished: false},
            {name: 'option 2', finished: false}
        ]
    });

    chrome.storage.local.set({ tasks: tasks });

    showPopup();
    loadTasks(tasks);
});

const deleteTask = ((taskIndex) => {
    if (tasks.length > 0) {
        tasks.splice(taskIndex, 1);
    } else {
        tasks = [];
    }

    chrome.storage.local.set({ tasks: tasks });

    loadTasks(tasks);
});

const editTask = ((taskIndex) => {
    showPopup();

    newTitle.value = tasks[taskIndex].name;
    newDescription.value = tasks[taskIndex].description;
    newEstimate.value = tasks[taskIndex].time;
});