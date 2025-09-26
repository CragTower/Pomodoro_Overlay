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
        const messageParts = msgData.text.trim().toLowerCase();
        const message = messageParts.indexOf(' ') === -1 ? "" : messageParts.substring(messageParts.indexOf(' ') + 1);
        const user = msgData.nick;
        const isBroadcaster = msgData.badges.some(badge => badge.type === 'broadcaster');
        const command = messageParts.split(' ', 1);

        console.log('Checking for command prompt...');
        if (commands[command] && message != "") {

            // Creates new Chat structured obj
            const chatMessage = new ChatMessage(
                message,
                user,
                isBroadcaster,
                chatIndex++,
                command
            );

            commands[command](chatMessage);
        }
    }

})

// Function to handle adding tasks to master list and updating HTML
function handleAddTask(message) {

    console.log('Loading task...');
    chatHistory.push(message);  // Adds chat instance to master list
    updateTaskList();           // Updates HTML

}

// Function to handle removing tasks from master list
// Broadcaster only allowed
function handleRemoveTask(message) {

    // Checks for authorized permission (broadcaster only)
    console.log('Authorizing removal...');
    if (message.isBroadcaster) {

        // Collects reference # from chat message and set to 0 if no message
        const taskIndex = !isNaN(parseInt(message.message)) ? parseInt(message.message) : 0;

        // Checks if reference # is real 
        console.log('Initializing task removal...');
        if (taskIndex >= 0) {

            // Finds reference # in master list and removes it
            console.log('Removing task...')
            const arrayIndex = chatHistory.findIndex(message => message.index === taskIndex);
            const removedTask = chatHistory.splice(arrayIndex, 1);

            // Updates HTML lists
            updateTaskList();
            console.log(`Streamer removed task: ${removedTask}`);
        }
    }
}

function handleCompletedTask(message) {


    let savedMessage = chatHistory[message.message];
    let messageOwner = savedMessage.user;

    if (message.user === messageOwner) {
        savedMessage.isComplete = true;
        updateTaskList();
    }

}

// Function to update the HTML lists list with edited master list
function updateTaskList() {

    // Links HTML elements to JS variables
    console.log('Updating list...');
    const broadcasterList = document.getElementById('streamerTasks');
    const chatList = document.getElementById('chatTasks');

    // Checks if HTML/JS links were successful
    if (broadcasterList && chatList) {

        // Clear both lists
        broadcasterList.innerHTML = '';
        chatList.innerHTML = '';

        // Creates new lists
        chatHistory.forEach((message, index) => {

            // Generates new broadcaster HTML list
            if (message.isBroadcaster) {
                const listItem = document.createElement('li');
                listItem.textContent = `${message.message} [${message.index}]`;

                if (message.isComplete) {
                    listItem.style.textDecoration = 'line-through';
                }

                broadcasterList.appendChild(listItem);
            }
            // Generates new chat HTML list
            else {
                const listItem = document.createElement('li');
                listItem.textContent = `${index + 1}. ${message.user} - ${message.message} [${message.index}]`;
                chatList.appendChild(listItem);
            }
        });
    }
}