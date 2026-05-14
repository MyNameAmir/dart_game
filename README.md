# 🎯 Dart Master - Target Game

A beautiful web-based dart shooting game with persistent score tracking and a leaderboard system.

## Features

✅ **Beautiful Modern UI** - Dark theme with gradients, smooth animations, and responsive design
✅ **Interactive Dart Game** - Click targets with your mouse and earn points
✅ **Real-time Scoring** - Score tracking, shot count, and accuracy percentage
✅ **Database Storage** - All scores saved to SQLite database
✅ **Leaderboard** - Top 3 scores displayed on landing page and after each game
✅ **Multi-player** - Multiple players can play and track their scores separately
✅ **Continuous Play** - Play unlimited rounds without closing the application
✅ **60-Second Rounds** - Fast-paced gameplay with a 60-second timer

## Project Structure

```
dart-game/
├── server.js              # Express backend server
├── package.json           # Dependencies configuration
├── scores.db             # SQLite database (auto-created)
└── public/               # Frontend files
    ├── index.html        # Main HTML page
    ├── game.js           # Game logic and interactivity
    └── styles.css        # Modern UI styling
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Steps

1. **Navigate to project directory:**
   ```bash
   cd /Users/amirmoin/Desktop/sample
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

## How to Play

1. **Enter Your Name** - Type your name on the landing page
2. **Start the Game** - Click "Start Game" button
3. **Shoot Targets** - Click on the red targets to score points
4. **Watch Your Stats** - Monitor your score, shots fired, and accuracy in real-time
5. **Game Duration** - Each game lasts 60 seconds
6. **View Results** - After time runs out, see your final score and the top 3 leaderboard
7. **Play Again** - Click "Play Again" to start a new round immediately
8. **Different Player** - Click "Back to Menu" and enter a new name to play as a different player

## Scoring System

- **Hit Target** - +10 points per successful hit
- **Accuracy** - Calculated as (hits / total shots) × 100%
- **Leaderboard** - Top 3 scores are displayed across all players

## Game Mechanics

- **Target Placement** - New targets appear at random positions on the game area
- **Auto-spawn** - Targets automatically respawn when hit or after 1.5 seconds
- **Miss Effect** - Visual feedback when you miss (red circle)
- **Hit Effect** - Golden burst animation when you hit a target
- **Responsive** - Game area adjusts to different screen sizes

## Database

The game uses SQLite for score storage. The `scores.db` file is automatically created when you first run the server.

### Database Schema
```sql
CREATE TABLE scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  playerName TEXT NOT NULL,
  score INTEGER NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## API Endpoints

- **POST** `/api/scores` - Save a player's score
- **GET** `/api/top-scores` - Get top 3 scores
- **GET** `/api/player-scores/:playerName` - Get all scores for a specific player

## Technical Stack

- **Frontend**: HTML5, CSS3 (with gradients & animations), Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Styling**: Modern CSS with Glassmorphism effects

## Color Scheme

- **Primary**: Indigo (#6366f1)
- **Secondary**: Pink (#ec4899)
- **Success**: Green (#10b981)
- **Background**: Dark Navy (#1a1a2e, #16213e)

## Troubleshooting

**Port already in use?**
```bash
# Kill the process on port 3000
lsof -i :3000
kill -9 <PID>
```

**Database issues?**
- Delete `scores.db` and restart the server to create a fresh database
- The database will automatically initialize on first run

**Targets not appearing?**
- Ensure JavaScript is enabled in your browser
- Refresh the page and try again
- Check browser console for any errors

## Future Enhancements

- Sound effects for hits/misses
- Difficulty levels (moving targets)
- Power-ups (double points, freeze targets)
- Global leaderboard
- Achievement badges
- Mobile touch support

---

**Enjoy the game!** 🎯
# dart_game
