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
    //'!removeUserTasks': handleRemoveUserTasks 
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
function handleRemoveTask(message) {

    // Deletes the first task of the user on the list if user did not specify which
    if (!message.message) {

        // Finds index of first user task occurence 
        const chatHistoryIndex = chatHistory.findIndex(m => m.user === message.user);

        // Checks if search found a user's task
        if (chatHistoryIndex != -1) {

            // Remove task from master list and update HTML
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

    // Get sorted broadcaster and viewer lists
    const [sortedBroadcasterList, sortedViewerList] = getSortedLists();

    let taskToRemove = null;

    // Finds the task in either the broadcaster or viewer HTML list
    if (mListNum <= sortedBroadcasterList.length && message.isBroadcaster) {
        taskToRemove = sortedBroadcasterList[mListNum - 1];
    }
    else if (mListNum <= sortedViewerList.length && !message.isBroadcaster) {
        taskToRemove = sortedViewerList[mListNum - 1];
    }

    // Removes task from master list and updates HTML
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

// Function to mark tasks completed in the master list
function handleCompletedTask(message) {

    // Parses List number from chat message and checks its validity
    mListNum = parseInt(message.message.trim());
    if (isNaN(mListNum) || mListNum < 1) {
        console.log("Invalid list number");
        return;
    }

    // Get sorted broadcaster and viewer lists
    const [sortedBroadcasterList, sortedViewerList] = getSortedLists();

    let taskToComplete = null;

    // Finds the task in either the broadcaster or viewer HTML list
    if (mListNum <= sortedBroadcasterList.length && message.isBroadcaster) {
        taskToComplete = sortedBroadcasterList[mListNum - 1];
        console.log(taskToComplete.message);
    }
    else if (mListNum <= sortedViewerList.length && !message.isBroadcaster) {
        taskToComplete = sortedViewerList[mListNum - 1];
    }

    // Marks the task as complete and updates HTML
    if (taskToComplete && message.user === taskToComplete.user) {
        taskToComplete.isComplete = true;
        updateTaskList();
    }
}

// Function for broadcaster to remove all of a single user's tasks
function handleRemoveUserTasks(message) {

    // Check if broadcaster
    if (message.isBroadcaster) {
        chatHistory.filter(user => user !== message.message);
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

        // Get sorted broadcaster and viewer lists
        const [sortedBroadcasterList, sortedViewerList] = getSortedLists();

        let listNum = 1;

        // Update HTML with new broadcaster list
        sortedBroadcasterList.forEach((task) => {

            // Create list item
            const listItem = document.createElement('li');
            listItem.textContent = `${listNum}. ${task.message}`;

            // If task is marked complete draw a line-through
            if (task.isComplete) {
                listItem.style.textDecoration = 'line-through';
                listItem.style.opacity = '0.6';
            }

            // Add to HTML
            broadcasterTasks.appendChild(listItem);
            listNum++;
        });

        listNum = 1;

        // Update HTML with new viewer list
        sortedViewerList.forEach((task) => {

            // Create list item
            const listItem = document.createElement('li');
            listItem.textContent = `${listNum}. ${task.user} - ${task.message}`;

            // If task is marked complete draw a line-through
            if (task.isComplete) {
                listItem.style.textDecoration = 'line-through';
                listItem.style.opacity = '0.6';
            }

            // Add to HTML
            viewerTasks.appendChild(listItem);
            listNum++;
        });
    }
}

/*
    This function sorts the master list into broadcaster and viewer
    Both lists are then sorted by incomplete and complete tasks
    This helps with the index search of the main list and still
    keeping two separate HTML lists
*/
function getSortedLists() {

    // Separate broadcaster and viewers into separate temp lists
    const tempBroadcasterList = chatHistory.filter(m => m.isBroadcaster);
    const tempViewerList = chatHistory.filter(m => !m.isBroadcaster);

    // Sort broadcaster list by incomplete and complete tasks
    sortedBroadcasterList = [
        ...tempBroadcasterList.filter(m => !m.isComplete),
        ...tempBroadcasterList.filter(m => m.isComplete)
    ];

    // Sort viewer list by incomplete and complete tasks
    sortedViewerList = [
        ...tempViewerList.filter(m => !m.isComplete),
        ...tempViewerList.filter(m => m.isComplete)
    ];

    // Return coupled list of sorted lists
    return [sortedBroadcasterList, sortedViewerList];
}