let chatIndex = 0,
    chatHistory = [];

// Creates instance of a chat message
class ChatMessage {
    constructor(message, user, isBroadcaster, index, command) {
        this.message = message;
        this.user = user;
        this.isBroadcaster = isBroadcaster;
        this.index = index;
        this.command = command;
        this.isComplete = false;
    }
}

// List of available commands
const commands = {
    '!addtask': handleAddTask,
    '!removetask': handleRemoveTask,
    '!done': handleCompletedTask
    //'!removeallchat': handleRemoveAllChat,
    //'!removeallstreamer': handleRemoveAllStreamer
}

// Listens for events
window.addEventListener('onEventReceived', function (obj) {

    // Determines if event is from a chat message
    if (obj.detail.listener === 'message') {
        console.log('Loading message...');

        // Assigns variables with chat message details
        const msgData = obj.detail.event.data;
        const [command, ...messageParts] = msgData.text.trim().split(' ');
        const message = messageParts.join(' ');
        const user = msgData.nick;
        const isBroadcaster = msgData.badges.some(badge => badge.type === 'broadcaster');

        console.log('Checking for command prompt...');
        if (commands[command.toLowerCase()]) {

            // Creates new Chat structured obj
            const chatMessage = new ChatMessage(
                message,
                user,
                isBroadcaster,
                chatIndex++,
                command
            );

            commands[command.toLowerCase()](chatMessage);
        }
    }

})

// Function to handle adding tasks to master list and updating HTML
function handleAddTask(message) {

    console.log('Loading task...');

    // Checks user input for task
    if (!message.message) {
        console.log("User needs to clarify task to be added");
        return;
    }

    chatHistory.push(message);  // Adds chat instance to master list
    updateTaskList();           // Updates HTML

}

// Function to handle removing tasks from master list
// Broadcaster only allowed
function handleRemoveTask(message) {

    /*if (!message.isBroadcaster) {
        console.log(`${message.user}, is not authorized to remove`);
        return; 
    }*/

    // Deletes the first task of the user on the list if user did not specify which
    if (!message.message) {
        const chatHistoryIndex = chatHistory.findIndex(m => m.user === message.user);

        if (chatHistoryIndex != -1) {
            const removedTask = chatHistory.splice(chatHistoryIndex, 1);
            updateTaskList();
            console.log(`Removed first found task for ${removedTask.user}`);
        }
        else {
            console.log(`No task found for ${removedTask.user}`);
        }

        return;
    }

    // Parses List number from message and checks its validity
    mListNum = parseInt(message.message.trim());
    if (isNaN(mListNum) || mListNum < 1) {
        console.log("Invalid list number");
        return;
    }

    // Splits broadcaster list and viewer list into temporary variables
    const tempBroadcasterList = chatHistory.filter(m => m.isBroadcaster);
    const tempViewerList = chatHistory.filter(m => !m.isBroadcaster);

    let taskToRemove = null;

    // Finds the task in either the broadcaster or viewer list
    if (mListNum <= tempBroadcasterList.length && message.isBroadcaster) {
        taskToRemove = tempBroadcasterList[mListNum - 1];
    }
    else if (mListNum <= tempViewerList.length && !message.isBroadcaster) {
        taskToRemove = tempViewerList[mListNum - 1];
    }

    // Removes task from master list
    if (taskToRemove) {
        const chatHistoryIndex = chatHistory.findIndex(m => m === taskToRemove);
        if (chatHistoryIndex != -1) {
            taskRemoved = chatHistory.splice(chatHistoryIndex, 1);
            updateTaskList();
        }
        else {
            console.log("Task not found for removal")
        }
    }
}

function handleCompletedTask(message) {

    // Parses List number from message and checks its validity
    mListNum = parseInt(message.message.trim());
    if (isNaN(mListNum) || mListNum < 1) {
        console.log("Invalid list number");
        return;
    }

    // Splits broadcaster list and viewer list into temporary variables
    const tempBroadcasterList = chatHistory.filter(m => m.isBroadcaster);
    const tempViewerList = chatHistory.filter(m => !m.isBroadcaster);

    let taskToComplete = null;

    // Finds the task in either the broadcaster or viewer list
    if (mListNum <= tempBroadcasterList.length && message.isBroadcaster) {
        taskToComplete = tempBroadcasterList[mListNum - 1];
        console.log(taskToComplete.message);
    }
    else if (mListNum <= tempViewerList.length && !message.isBroadcaster) {
        taskToComplete = tempViewerList[mListNum - 1];
    }

    if (taskToComplete && message.user === taskToComplete.user) {
        taskToComplete.isComplete = true;
        updateTaskList();
    }
}

// Function to update the HTML lists list with edited master list
function updateTaskList() {

    // Links HTML elements to JS variables
    console.log('Updating list...');
    const broadcasterTasks = document.getElementById('broadcasterTasks');
    const viewerTasks = document.getElementById('viewerTasks');

    // Checks if HTML/JS links were successful
    if (broadcasterTasks && viewerTasks) {

        // Clear both lists
        broadcasterTasks.innerHTML = '';
        viewerTasks.innerHTML = '';

        // Get sorted lists for both broadcaster and viewers
        const [sortedBroadcasterList, sortedViewerList] = getSortedLists();

        let listNum = 1;

        sortedBroadcasterList.forEach((task) => {

            const listItem = document.createElement('li');
            listItem.textContent = `${listNum}. ${task.message}`;

            if (task.isComplete) {
                listItem.style.textDecoration = 'line-through';
                listItem.style.opacity = '0.6';
            }

            broadcasterTasks.appendChild(listItem);
            listNum++;
        });

        listNum = 1;

        sortedViewerList.forEach((task) => {

            const listItem = document.createElement('li');
            listItem.textContent = `${listNum}. ${task.user} - ${task.message}`;

            if (task.isComplete) {
                listItem.style.textDecoration = 'line-through';
                listItem.style.opacity = '0.6';
            }

            viewerTasks.appendChild(listItem);
            listNum++;
        });
    }
}

function getSortedLists() {
    const tempBroadcasterList = chatHistory.filter(m => m.isBroadcaster);
    const tempViewerList = chatHistory.filter(m => !m.isBroadcaster);

    sortedBroadcasterList = [
        ...tempBroadcasterList.filter(m => !m.isComplete),
        ...tempBroadcasterList.filter(m => m.isComplete)
    ];

    sortedViewerList = [
        ...tempViewerList.filter(m => !m.isComplete),
        ...tempViewerList.filter(m => m.isComplete)
    ];

    return [sortedBroadcasterList, sortedViewerList];
}