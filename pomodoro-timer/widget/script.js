let totalSeconds = 0;
let isPaused = false;

// Gets HTML element
const display = document.getElementById('timerText');

// Creates instance of a chat message
class ChatMessage {
    constructor(isBroadcaster, command, minutes = 0) {
        this.isBroadcaster = isBroadcaster;
        this.command = command;
        this.minutes = minutes;
    }
}

// List of available commands
const commands = {
    '!settimer': handleSetTimer,
    '!starttimer': handleStartTimer,
    '!pausetimer': handlePauseTimer
}

window.addEventListener('onWidgetLoad', (obj) => {

});


// Listens for events
window.addEventListener('onEventReceived', function (obj) {

    // Determines if event is from a chat message
    if (obj.detail.listener === 'message') {
        console.log('Loading message...');

        // Assigns variables with chat message details
        const msgData = obj.detail.event.data;
        const isBroadcaster = msgData.badges.some(badge => badge.type === 'broadcaster');
        const command = msgData.text.trim().toLowerCase().split(' ')[0];
        const minutes = msgData.text.trim().toLowerCase().split(' ')[1];

        // Creates new Chat structured obj
        const chatMessage = new ChatMessage(
            isBroadcaster,
            command,
            minutes
        );

        // Checks if message is from broadcaster
        if (chatMessage.isBroadcaster) {

            // Checks if message contains known command
            console.log('Checking for command prompt...');
            if (commands[command]) {
                commands[command](chatMessage);
            }
        }
    }
})

// Sets the HTML display with the broadcaster requested time
function handleSetTimer(message) {

    // Checks if message minutes is a number and if it's greater than 0
    console.log('Checking for proper time...');
    if (!isNaN(message.minutes) && message.minutes > 0) {

        // Calculate total seconds for timer and set the display
        console.log('Loading display...');
        totalSeconds = message.minutes * 60;
        formatTime(totalSeconds);
    }

}

function handleStartTimer(message) {

    isPaused = false;
    countDown();

}

function handlePauseTimer(message) {

    isPaused = true;

}

function countDown() {

    const countdown = setInterval(() => {

        formatTime(totalSeconds);

        // Checks if timer is finished
        if (totalSeconds <= 0) {
            clearInterval(countdown);
            display.textContent = 'Why\'s all the time gone!';
        }
        else if (isPaused) {            // Check if timer is paused
            clearInterval(countdown);   // Clears interval cache
            return;                     // Exits countDown function
        }

        // Reduces time every second
        totalSeconds--;

    }, 1000);
}

function formatTime(totalSec) {

    // Sets remaining minutes and seconds
    const minutes = Math.floor(totalSec / 60);
    const remainingSec = totalSec % 60;

    // Formats time for HTML Display
    const timeInMin = minutes < 10 ? '0' + minutes : minutes;
    const timeInSec = remainingSec < 10 ? '0' + remainingSec : remainingSec;

    // FIXME: possible standalone function
    // Sets the current time to HTML element
    display.textContent = `${timeInMin}:${timeInSec}`;

}