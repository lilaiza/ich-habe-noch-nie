// Game state
let players = [];
let usedQuestions = [];
let allQuestions = [];
let gameActive = false;
let currentQuestionIndex = -1;
let questionHistory = [];

// Initialize
async function init() {
    await loadQuestions();
    
    // Add keyboard listener
    document.addEventListener('keydown', (e) => {
        if (!gameActive) return;
        
        if (e.code === 'Space' || e.code === 'ArrowRight' || e.code === 'Enter') {
            e.preventDefault();
            getNextQuestion();
        } else if (e.code === 'ArrowLeft') {
            e.preventDefault();
            getPreviousQuestion();
        }
    });
}

// Load questions from server
async function loadQuestions() {
    try {
        const response = await fetch('/api/questions');
        allQuestions = await response.json();
    } catch (error) {
        console.error('Fehler beim Laden der Fragen:', error);
        alert('Fehler beim Laden der Fragen. Bitte Seite neu laden.');
    }
}

// Start game
function startGame() {
    const player1Name = document.getElementById('player1').value.trim();
    const player2Name = document.getElementById('player2').value.trim();
    const player3Name = document.getElementById('player3').value.trim();
    const player4Name = document.getElementById('player4').value.trim();

    if (!player1Name || !player2Name) {
        alert('Mindestens 2 Spieler erforderlich!');
        return;
    }

    // Initialize players
    players = [];
    if (player1Name) players.push({ name: player1Name, lives: 3 });
    if (player2Name) players.push({ name: player2Name, lives: 3 });
    if (player3Name) players.push({ name: player3Name, lives: 3 });
    if (player4Name) players.push({ name: player4Name, lives: 3 });

    gameActive = true;
    usedQuestions = [];

    // Show game section
    document.getElementById('setupSection').classList.add('hidden');
    document.getElementById('gameSection').classList.remove('hidden');

    renderPlayers();
}

// Render players
function renderPlayers() {
    const playersDisplay = document.getElementById('playersDisplay');
    playersDisplay.innerHTML = '';

    players.forEach((player, index) => {
        const playerCard = document.createElement('div');
        const isEliminated = player.lives === 0;
        
        const livesHTML = Array.from({ length: 3 }, (_, i) => {
            const isLost = i >= player.lives;
            return `<span class="cursor-pointer text-sm transition-all ${isLost ? 'opacity-30 grayscale' : 'hover:scale-125'}" onclick="toggleLife(${index}, ${i})">❤️</span>`;
        }).join('');

        playerCard.className = `text-center px-4 py-2 rounded-xl transition-all ${
            isEliminated 
                ? 'bg-white/20 opacity-50' 
                : 'bg-white/90'
        }`;

        playerCard.innerHTML = `
            <div class="font-bold text-xs mb-1 ${isEliminated ? 'text-white/60' : 'text-siemens-dark'}">${player.name}</div>
            <div class="flex justify-center gap-1">
                ${livesHTML}
            </div>
        `;

        playersDisplay.appendChild(playerCard);
    });

    checkGameOver();
}

// Toggle life (manual control)
function toggleLife(playerIndex, lifeIndex) {
    if (!gameActive) return;

    const player = players[playerIndex];
    const previousLives = player.lives;
    
    // Toggle between full lives and reduced lives
    if (lifeIndex < player.lives) {
        // Clicking on an active heart - reduce to this number
        player.lives = lifeIndex;
    } else if (lifeIndex === player.lives && player.lives < 3) {
        // Clicking on first lost heart - restore one
        player.lives = lifeIndex + 1;
    }

    // Add flash red effect if life was lost
    if (player.lives < previousLives) {
        const playerCards = document.querySelectorAll('#playersDisplay > div');
        const playerCard = playerCards[playerIndex];
        playerCard.classList.add('flash-red');
        setTimeout(() => playerCard.classList.remove('flash-red'), 500);
    }

    renderPlayers();
}

// Get next question
async function getNextQuestion() {
    if (!gameActive) {
        alert('Bitte starte zuerst ein Spiel!');
        return;
    }

    // Check if all questions have been used
    if (usedQuestions.length >= allQuestions.length) {
        usedQuestions = [];
        questionHistory = [];
    }

    // Get available questions
    const availableQuestions = allQuestions.filter((q, index) => !usedQuestions.includes(index));
    
    if (availableQuestions.length === 0) {
        document.getElementById('questionText').textContent = 'Keine Fragen verfügbar!';
        return;
    }

    // Pick random question
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];
    const originalIndex = allQuestions.indexOf(selectedQuestion);
    
    usedQuestions.push(originalIndex);
    currentQuestionIndex = originalIndex;
    questionHistory.push(originalIndex);

    // Display question (sin animación)
    const questionEl = document.getElementById('questionText');
    questionEl.textContent = selectedQuestion;
}

// Get previous question
function getPreviousQuestion() {
    if (!gameActive || questionHistory.length < 2) {
        return; // No previous question available
    }

    // Remove current question from history
    questionHistory.pop();
    
    // Get previous question
    const previousIndex = questionHistory[questionHistory.length - 1];
    currentQuestionIndex = previousIndex;

    // Display previous question (sin animación)
    const questionEl = document.getElementById('questionText');
    questionEl.textContent = allQuestions[previousIndex];
}

// Check game over
function checkGameOver() {
    const activePlayers = players.filter(p => p.lives > 0);

    if (activePlayers.length <= 1 && gameActive) {
        gameActive = false;
        
        // Trigger confetti!
        if (activePlayers.length === 1) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#009999', '#00cccc', '#ffd700', '#ffffff']
            });
            
            // Extra confetti burst
            setTimeout(() => {
                confetti({
                    particleCount: 50,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 }
                });
                confetti({
                    particleCount: 50,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 }
                });
            }, 250);
        }
        
        // Show game over
        document.getElementById('gameSection').classList.add('hidden');
        document.getElementById('gameOverSection').classList.remove('hidden');

        const winnerText = document.getElementById('winnerText');
        if (activePlayers.length === 1) {
            winnerText.textContent = `${activePlayers[0].name} gewinnt! 🎉`;
        } else {
            winnerText.textContent = 'Unentschieden!';
        }
    }
}

// Reset game
function resetGame() {
    players = [];
    usedQuestions = [];
    questionHistory = [];
    currentQuestionIndex = -1;
    gameActive = false;

    document.getElementById('gameSection').classList.add('hidden');
    document.getElementById('gameOverSection').classList.add('hidden');
    document.getElementById('setupSection').classList.remove('hidden');

    // Clear inputs
    document.getElementById('player1').value = '';
    document.getElementById('player2').value = '';
    document.getElementById('player3').value = '';
    document.getElementById('player4').value = '';
    document.getElementById('questionText').textContent = 'Drücke den Button';
}

// Initialize on load
init();
