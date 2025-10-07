# Pomodoro Overlay

A customizable streaming overlay system featuring an interactive task tracker and Pomodoro timer for Twitch/YouTube streamers.

## Overview

Pomodoro Overlay consists of two separate widgets designed to help streamers stay organized and focused during streams. Both the broadcaster and viewers can interact with the task tracker, while the broadcaster has full control over the timer and appearance customization.

## Projects

This repository contains two independent overlay widgets:

### Task Tracker
An interactive task management system where both broadcasters and viewers can collaborate on stream goals.

**Features:**
- Add, complete, and remove tasks
- Tasks automatically ordered numerically in ascending order
- Incomplete tasks display before completed tasks
- Customizable appearance:
  - Task window color
  - Font color
  - Font size
  - Font family

### Pomodoro Timer
A customizable countdown timer for time management during streams.

**Features:**
- Set timer to any minute amount via chat commands
- Start and stop controls via chat commands
- Customizable appearance:
  - Border color
  - Background color
  - Font size

## Installation

### Prerequisites
- StreamElements account
- OBS Studio (or other streaming software with browser source support)

### Setup Instructions

1. **Download the latest release**
   - Go to the [Releases](../../releases) page
   - Download the latest version (V.YY.MM.DD format)
   - Extract the ZIP files

2. **Setup in StreamElements**
   - Log into your StreamElements dashboard
   - Navigate to Streaming Tools → My Overlays
   - Create a new overlay or select an existing one
   - Click "Add Widget" → "Static/Custom" → "Custom Widget"

3. **Install Task Tracker Widget**
   - Open the Task Tracker files from the downloaded ZIP
   - In StreamElements custom widget editor:
     - Copy contents from `HTML` file → Paste into HTML tab
     - Copy contents from `CSS` file → Paste into CSS tab
     - Copy contents from `JS` file → Paste into JS tab
     - Copy contents from `Fields` file → Paste into Fields tab
   - Click "Save"

4. **Install Pomodoro Timer Widget** (repeat step 3 with Timer files)

5. **Add to OBS**
   - In StreamElements, copy the overlay URL
   - In OBS, add a new Browser Source
   - Paste the StreamElements overlay URL
   - Set width and height as needed (1920x1080 recommended)
   - Click "OK"

## Usage

### Task Tracker Commands
*Commands available to broadcaster and viewers (unless otherwise noted):*

- `!addtask [task description]` - Add a new task
- `!done [task number]` - Mark a task as complete
- `!removetask [task number]` - Remove a task from the list

### Timer Commands
*Broadcaster only:*

- `!settimer [minutes]` - Set the timer duration
- `!starttimer` - Start the countdown
- `!stoptimer` - Stop/pause the timer

### Customization

Both widgets can be customized through the StreamElements Fields panel:

**Task Tracker:**
- Window background color
- Font color
- Font size (px)
- Font family

**Pomodoro Timer:**
- Border color
- Background color
- Font size (px)

## Versioning

This project uses date-based versioning in the format `VYY.MM.DD`.

See the [Releases](../../releases) page for version history and changelogs.

## Roadmap

- [ ] Add Pomodoro count tracking
- [ ] Timer audio features
- [ ] Ability to move task lists independently
- [ ] Task list persistence

## Support

If you encounter issues or have questions, please open an issue on the [Issues](../../issues) page.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made for streamers who want to stay productive and organized during broadcasts.
