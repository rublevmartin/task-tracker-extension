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
});

const loadTasks = ((items) => {
    const itemsLength = items.length;

    let markup = '';

    if (itemsLength > 0) {
        parentTarget.innerHTML = '';

        for (i = 0; i < itemsLength; i++) {
            markup = 
                '<div class="panel-item panel-item--small">' +
                    '<a href="#" class="panel-item__head">' +
                        '<h3 class="panel-item__entry">' +
                            items[i].name +
                        '</h3>' +

                        '<div class="panel-item__progressbar">' +
                            '<span style="width: 50%"></span>' +
                        '</div>' +

                        '<div class="panel-item__duration">' +
                            items[i].time + '/' + items[i].time + 'min' +
                        '</div>' +
                    '</a>' +

                    '<div class="panel-item__body">' +
                    '</div>' +
                '</div>';
            
            parentTarget.innerHTML += markup;
        }
    } else {
        parentTarget.innerHTML = '<p class="panel__entry">No added tasks yet!</p>';
    }
});

settingsButton.addEventListener('click', () => {
    chrome.tabs.create({
        url: chrome.runtime.getURL("settings.html")
    });
})