const popup = document.getElementById('js-popup-new-task');
const formPopup = document.getElementById('js-new-task');
const parentTarget = document.getElementById('js-task-list');
const popupToggle = document.querySelectorAll('.js-popup-toggle');

// const newTaskButton = document.getElementById('js-new-task-button');
// const editTaskButton = document.getElementById('js-edit-task-button');

// new values
const newTitle = document.getElementById('task-title');
const newDescription = document.getElementById('task-description');
const newEstimate = document.getElementById('task-estimate');

const targetContainer = document.getElementById('js-subtasks');

let tasks = [];
let updateTask = false;
let taskNumber = 0;

// Function to get a task by ID
const getTaskById = async (taskId) => {
try {
        const response = await fetch(`http://localhost:3000/task/${taskId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
        });

        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        const task = await response.json();
        console.log('Fetched task:', task);
        return task;
    } catch (error) {
        console.error('Error fetching task:', error);
    }
};

async function fetchTasks() {
    try {
        const userId = 1;
      const response = await fetch(`http://localhost:3000/user/${userId}/   `, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      console.log(data);
      
    //   tasks = data.tasks;
    } catch (error) {
      console.error('Error fetching task count:', error);
    }
  }

// async function fetchTasksForUser(userId) {
//     try {
//       const response = await fetch(`http://localhost:3000/user/${userId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
  
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
  
//       const tasks = await response.json();
//       console.log('Fetched tasks for user:', tasks);
//       return tasks;
//     } catch (error) {
//       console.error('Error fetching tasks for user:', error);
//     }
//   }
  

//   // Example usage: Fetch the task with ID 1
const newFunk = setInterval(() => {
    getTaskById(1);

    //fetchTaskCount();
    // Example usage: Fetch tasks for user with ID 1
  //fetchTasksForUser(0);
    // fetchTaskCount();
}, 2000);

const initTasks = async () => {
    tasks = await fetchTasks();

    //loadTasks(tasks);

    // popupToggle.forEach((element) => {
    //         element.addEventListener('click', ()=>{
    //         showPopup();

    //         updateTask = false;
    //     });
    // });

    // formPopup.addEventListener('submit', addNewTask);
}


initTasks();

// chrome.storage.local.get(['tasks'], function(result) {
//     if (result.tasks) {
//         tasks = result.tasks;
//     } else {
//         chrome.storage.local.set({ tasks: tasks });
//     }

//     //Load Server Data into tasks[];

    
// });

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

    targetContainer.innerHTML = 
        '<div class="form__row-inner">' +
            '<label for="subtask-1" class="form__label">Subtask 1</label>' +

            '<input type="text" id="subtask-1" class="field">' +
        '</div>';

    targetContainer.dataset.subtaskNumber = 1;
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

const addNewTask = (async (event) => {
    event.preventDefault();

    let subtaskArr = [];

    for(i = 1; i <= targetContainer.dataset.subtaskNumber; i++) {
        console.log(targetContainer.dataset.subtaskNumber);
        let subtaskItem = document.getElementById('subtask-' + i);

        subtaskArr.push ({
            name: subtaskItem.value,
            finished: false
        })
    }

    if(updateTask) {
        tasks[taskNumber] = {
            name: newTitle.value,
            description: newDescription.value,
            time: newEstimate.value,
            timeRemaining: newEstimate.value,
            finished: false,
            started: false,
            subtasks: subtaskArr
        }
    } else {
        tasks.push ({
            name: newTitle.value,
            description: newDescription.value,
            time: newEstimate.value,
            timeRemaining: newEstimate.value,
            finished: false,
            started: false,
            subtasks: subtaskArr
        });
    }

    //Add Server Data

    await fetch('http://localhost:3000/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: 1,
            title: newTitle.value,
            description: newDescription.value,
            timeEstimate: newEstimate.value,
        })
      });

    chrome.storage.local.set({ tasks: tasks });

    updateTask = false;

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

    //Delete Here Server Data

    loadTasks(tasks);
});

const editTask = ((taskIndex) => {
    showPopup();

    updateTask = true;

    taskNumber = taskIndex;

    newTitle.value = tasks[taskIndex].name;
    newDescription.value = tasks[taskIndex].description;
    newEstimate.value = tasks[taskIndex].time;
});

document.getElementById('js-add-subtask').addEventListener('click', (event) => {
    event.preventDefault();

    targetContainer.dataset.subtaskNumber ++;
    let targetContainerNumber = targetContainer.dataset.subtaskNumber;

    targetContainer.innerHTML += 
        '<div class="form__row-inner">' +
            '<label for="subtask-' + targetContainerNumber + '" class="form__label">Subtask ' + targetContainerNumber + '</label>' +

            '<input type="text" id="subtask-' + targetContainerNumber + '" class="field">' +
        '</div>'
});
