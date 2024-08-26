const parentTarget = document.getElementById('js-task-list');

const settingsButton = document.getElementById('js-settings');

let tasks = [];

chrome.storage.local.get(['tasks'], function(result) {
    if (result.tasks) {
        tasks = result.tasks;
    } else {
        chrome.storage.local.set({ tasks: tasks });
    }

    loadTasks(tasks);
    initPanels();
    settingButtonInit();
    initStarPauseButtons();
    initCheckboxes();
});

const loadTasks = ((items) => {
    const itemsLength = items.length;

    if (itemsLength > 0) {
        parentTarget.innerHTML = '';

        for (i = itemsLength - 1; i >= 0; i--) {
            let startBtnStr = 'Start';
            let panelStarted = '';

            if (items[i].started) {
                startBtnStr = 'Pause';
                panelStarted = 'started';
            }

            const timeRemainingTemp = Math.ceil(items[i].timeRemaining);

            //checkboxMarkup(i)
            let checkboxMarkup = '';
            let subtasksFinished = 0;
            const subtasks = items[i].subtasks; 
            const subtasksLength = subtasks.length;

            for (j = 0; j < subtasksLength; j++) {
                let isChecked = '';

                if (subtasks[j].finished) {
                    isChecked = 'checked';

                    subtasksFinished ++;
                }

                checkboxMarkup += 
                    '<div class="checkbox">' +
                        '<input type="checkbox" class="checkbox__input js-subtask-checkbox" id="option-' + i + j + '" data-task-number="' + i + '" data-subtask="' + j + '"' + isChecked + '>' +
                        
                        '<label for="option-' + i + j + '" class="checkbox__label">' + subtasks[j].name + '</label>' +
                    '</div>';
            }

            const subtasksFinishedPart = subtasksFinished/subtasksLength*100;
            let finished = '';

            if (subtasksFinished == subtasksLength) {
                finished = 'finished'
            }

            const markup = 
                '<div class="panel-item panel-item--small ' + panelStarted + ' ' + finished + '">' +
                    '<a href="#" class="panel-item__head">' +
                        '<h3 class="panel-item__entry">' +
                            items[i].name +
                        '</h3>' +

                        '<div class="panel-item__progressbar">' +
                            '<span style="width: ' + subtasksFinishedPart + '%"></span>' +
                        '</div>' +

                        '<div class="panel-item__duration">' +
                            (items[i].time - timeRemainingTemp) + '/' + items[i].time + 'min' +
                        '</div>' +
                    '</a>' +

                    '<div class="panel-item__body">' +
                        '<p class="panel-item__text">' +
                            items[i].description +
                        '</p>' +

                        '<div class="panel-item__foot">' +
                            checkboxMarkup +
                        '</div>' +

                        '<p class="panel-item__foot">' +
                            timeRemainingTemp + ' minutes remaining' +
                        '</p>' +

                        '<div class="panel-item__actions">' +
                            '<button class="btn btn--small js-toggle-task" data-task-number="' + i + '">' + startBtnStr + '</button>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            
            parentTarget.innerHTML += markup;
        }
    } else {
        parentTarget.innerHTML = '<p class="panel__entry">No added tasks yet!</p>';
    }
});

const initPanels = () => {
    const panelItems = document.querySelectorAll('.panel-item__head');

    panelItems.forEach((element) => {
        element.addEventListener('click', () => {
            const parentElement = element.parentElement;

            if (!parentElement.classList.contains('active')) {
                panelItems.forEach((elementInner) => {
                    const parentElementInner = elementInner.parentElement;

                    parentElementInner.classList.remove('active');
                });
            }
            
            parentElement.classList.toggle('active');
        });
    });
}

const settingButtonInit = () => {
    settingsButton.addEventListener('click', () => {
        chrome.tabs.create({
            url: chrome.runtime.getURL("settings.html")
        });
    });
}

const initStarPauseButtons = () => {
    const startStopButtons = document.querySelectorAll('.js-toggle-task');

    startStopButtons.forEach((element) => {
        element.addEventListener('click', () => {
            const parentElement = element.closest('.panel-item');
            const taskNumber = element.dataset.taskNumber;
            let taskStarted = tasks[taskNumber].started;

            if (taskStarted) {
                parentElement.classList.remove('started');
                element.innerHTML = 'Start';
            } else {
                parentElement.classList.add('started');
                element.innerHTML = 'Pause';
            }

            tasks[taskNumber].started = !taskStarted;

            chrome.storage.local.set({ tasks: tasks });
        });
    });
}

const initCheckboxes = () => {
    const subtaskCheckboxes = document.querySelectorAll('.js-subtask-checkbox');

    subtaskCheckboxes.forEach((element) => {
        const subTaskNumber = element.dataset.subtask;
        const taskNumber = element.dataset.taskNumber;

        element.addEventListener('change', () => {
            tasks[taskNumber].subtasks[subTaskNumber].finished = element.checked;

            chrome.storage.local.set({ tasks: tasks });
        });
    });
}

const taskClock = setInterval(() => {
    const itemsLength = tasks.length;
    let hasStarted = false;

    if (itemsLength > 0) {
        for (i = itemsLength - 1; i >= 0; i--) {
            if (tasks[i].started == true) {
                tasks[i].timeRemaining -= 0.01;

                hasStarted = true;
            }
        }
    }

    if (hasStarted) {
        chrome.storage.local.set({ tasks: tasks });
    }
    
    if (!taskClock) {
        taskClock;
    }
}, 600)

if (!taskClock) {
    taskClock;
}