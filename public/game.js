// Game State
const gameState = {
  playerName: '',
  score: 0,
  shots: 0,
  hits: 0,
  startTime: 0,
  gameActive: false,
  gameDuration: 60, // 60 seconds game
  timerInterval: null,
  targetSpawnInterval: null,
};

// DOM Elements
const landingPage = document.getElementById('landing-page');
const gamePage = document.getElementById('game-page');
const resultsPage = document.getElementById('results-page');
const playerNameInput = document.getElementById('playerName');
const startBtn = document.getElementById('startBtn');
const endGameBtn = document.getElementById('endGameBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const backToLandingBtn = document.getElementById('backToLandingBtn');
const gameArea = document.getElementById('gameArea');
const currentScoreDisplay = document.getElementById('currentScore');
const currentPlayerDisplay = document.getElementById('currentPlayer');

// Utility Functions
function showPage(page) {
  landingPage.classList.remove('active');
  gamePage.classList.remove('active');
  resultsPage.classList.remove('active');
  page.classList.add('active');
}

function getRandomPosition() {
  const gameAreaRect = gameArea.getBoundingClientRect();
  const targetSize = 80;
  const maxX = gameAreaRect.width - targetSize;
  const maxY = gameAreaRect.height - targetSize;
  
  const x = Math.random() * maxX;
  const y = Math.random() * maxY;
  
  return { x, y };
}

function spawnTarget() {
  if (!gameState.gameActive) return;
  
  // Remove existing target if any
  const existingTarget = gameArea.querySelector('.target');
  if (existingTarget) {
    existingTarget.remove();
  }
  
  const { x, y } = getRandomPosition();
  const target = document.createElement('div');
  target.className = 'target';
  target.style.left = x + 'px';
  target.style.top = y + 'px';
  
  target.addEventListener('click', (e) => {
    e.stopPropagation();
    hitTarget(target);
  });
  
  gameArea.appendChild(target);
}

function hitTarget(target) {
  if (!gameState.gameActive) return;
  
  gameState.hits++;
  gameState.shots++;
  gameState.score += 10;
  
  // Create hit effect
  const hitEffect = document.createElement('div');
  hitEffect.className = 'hit-effect';
  hitEffect.style.left = target.style.left;
  hitEffect.style.top = target.style.top;
  gameArea.appendChild(hitEffect);
  
  setTimeout(() => hitEffect.remove(), 600);
  
  // Update display
  currentScoreDisplay.textContent = gameState.score;
  updateStats();
  
  // Remove target and spawn new one
  target.remove();
  spawnTarget();
}

function missTarget(x, y) {
  if (!gameState.gameActive) return;
  
  // Create miss effect
  const missEffect = document.createElement('div');
  missEffect.className = 'miss-effect';
  missEffect.style.left = (x - 25) + 'px';
  missEffect.style.top = (y - 25) + 'px';
  gameArea.appendChild(missEffect);
  
  setTimeout(() => missEffect.remove(), 500);
}

function updateStats() {
  const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
  const accuracy = gameState.shots > 0 
    ? Math.round((gameState.hits / gameState.shots) * 100) 
    : 0;
  
  document.getElementById('hitCount').textContent = `Shots: ${gameState.shots}`;
  document.getElementById('accuracy').textContent = `Accuracy: ${accuracy}%`;
  document.getElementById('timer').textContent = `Time: ${gameState.gameDuration - elapsed}s`;
  
  if (elapsed >= gameState.gameDuration) {
    endGame();
  }
}

function startGame() {
  const playerName = playerNameInput.value.trim();
  
  if (!playerName) {
    alert('Please enter your name to play!');
    return;
  }
  
  gameState.playerName = playerName;
  gameState.score = 0;
  gameState.shots = 0;
  gameState.hits = 0;
  gameState.gameActive = true;
  gameState.startTime = Date.now();
  
  currentPlayerDisplay.textContent = `${playerName}'s Game`;
  currentScoreDisplay.textContent = '0';
  
  showPage(gamePage);
  
  // Spawn first target
  spawnTarget();
  
  // Setup target spawn interval (1.5 seconds between spawns if not hit)
  gameState.targetSpawnInterval = setInterval(() => {
    if (gameState.gameActive && !gameArea.querySelector('.target')) {
      spawnTarget();
    }
  }, 1500);
  
  // Setup stats update
  gameState.timerInterval = setInterval(updateStats, 100);
  
  // Setup game area click handler for misses
  gameArea.addEventListener('click', handleGameAreaClick);
}

function handleGameAreaClick(e) {
  if (!gameState.gameActive) return;
  
  // If click was on target, it would have been handled by target click handler
  if (e.target.classList.contains('target')) return;
  
  gameState.shots++;
  const rect = gameArea.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  missTarget(x, y);
  updateStats();
}

function endGame() {
  gameState.gameActive = false;
  
  clearInterval(gameState.timerInterval);
  clearInterval(gameState.targetSpawnInterval);
  gameArea.removeEventListener('click', handleGameAreaClick);
  
  // Save score to database
  saveScore();
  
  // Show results
  showResults();
}

async function saveScore() {
  try {
    const response = await fetch('/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerName: gameState.playerName,
        score: gameState.score,
      }),
    });
    
    if (!response.ok) {
      console.error('Failed to save score');
    }
  } catch (error) {
    console.error('Error saving score:', error);
  }
}

async function showResults() {
  const accuracy = gameState.shots > 0 
    ? Math.round((gameState.hits / gameState.shots) * 100) 
    : 0;
  
  document.getElementById('resultPlayer').textContent = gameState.playerName;
  document.getElementById('resultScore').textContent = gameState.score;
  document.getElementById('resultShots').textContent = gameState.shots;
  document.getElementById('resultAccuracy').textContent = `${accuracy}%`;
  
  // Load top scores
  await loadTopScores('resultsTopScores');
  
  showPage(resultsPage);
}

async function loadTopScores(elementId) {
  try {
    const response = await fetch('/api/top-scores');
    const scores = await response.json();
    
    const container = document.getElementById(elementId);
    
    if (scores.length === 0) {
      container.innerHTML = '<p class="loading">No scores yet. Be the first!</p>';
      return;
    }
    
    container.innerHTML = scores.map((score, index) => `
      <div class="score-item">
        <span class="score-rank">#${index + 1}</span>
        <span class="score-name">${escapeHtml(score.playerName)}</span>
        <span class="score-value">${score.score}</span>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading scores:', error);
    document.getElementById(elementId).innerHTML = '<p class="loading">Error loading scores</p>';
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function playAgain() {
  playerNameInput.value = gameState.playerName;
  startGame();
}

function backToLanding() {
  playerNameInput.value = '';
  playerNameInput.focus();
  showPage(landingPage);
  loadTopScores('topScoresPreview');
}

// Event Listeners
startBtn.addEventListener('click', startGame);
endGameBtn.addEventListener('click', endGame);
playAgainBtn.addEventListener('click', playAgain);
backToLandingBtn.addEventListener('click', backToLanding);

playerNameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    startGame();
  }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  playerNameInput.focus();
  loadTopScores('topScoresPreview');
});
