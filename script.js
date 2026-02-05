document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const statusDisplay = document.getElementById('status');
    const newGameBtn = document.getElementById('new-game-btn');
    const restartGameBtn = document.getElementById('restart-game-btn');
    const howToPlayBtn = document.getElementById('how-to-play-btn');
    const modal = document.getElementById('how-to-play-modal');
    const closeBtn = document.querySelector('.modal .close-btn');
    const winLine = document.getElementById('win-line');

    let cells = [];
    let currentPlayer = 'X';
    let boardState = Array(9).fill(null);
    let gameActive = true;

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]  // Diagonals
    ];

    function handleCellClick(clickedCell, cellIndex) {
        if (boardState[cellIndex] || !gameActive) {
            return;
        }

        boardState[cellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.dataset.player = currentPlayer;

        const winningCombination = checkWin();
        if (winningCombination) {
            statusDisplay.textContent = `Player ${currentPlayer} has won!`;
            gameActive = false;
            drawWinningLine(winningCombination);
            return;
        }

        if (boardState.every(cell => cell)) {
            statusDisplay.textContent = 'Game ended in a draw!';
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = `It's ${currentPlayer}'s turn`;
    }

    function handleArrowNavigation(key, currentIndex = -1) {
        if (currentIndex === -1) {
            // Start navigation from the beginning by focusing the top-left cell.
            const firstCell = cells[0];
            if (firstCell) {
                cells.forEach(c => c.setAttribute('tabindex', '-1'));
                firstCell.setAttribute('tabindex', '0');
                firstCell.focus();
            }
            return;
        }

        let nextIndex = -1;

        switch (key) {
            case 'ArrowUp':
                nextIndex = currentIndex - 3;
                break;
            case 'ArrowDown':
                nextIndex = currentIndex + 3;
                break;
            case 'ArrowLeft':
                if (currentIndex % 3 !== 0) {
                    nextIndex = currentIndex - 1;
                }
                break;
            case 'ArrowRight':
                if (currentIndex % 3 !== 2) {
                    nextIndex = currentIndex + 1;
                }
                break;
        }

        if (nextIndex >= 0 && nextIndex < 9) {
            cells[currentIndex].setAttribute('tabindex', '-1');
            cells[nextIndex].setAttribute('tabindex', '0');
            cells[nextIndex].focus();
        }
    }

    function drawWinningLine(combination) {
        const startCell = combination[0];
        const endCell = combination[2];

        const startCoords = getCellCenter(startCell);
        const endCoords = getCellCenter(endCell);

        winLine.setAttribute('x1', startCoords.x);
        winLine.setAttribute('y1', startCoords.y);
        winLine.setAttribute('x2', endCoords.x);
        winLine.setAttribute('y2', endCoords.y);

        winLine.style.visibility = 'visible';
    }

    function getCellCenter(index) {
        const row = Math.floor(index / 3);
        const col = index % 3;
        const x = col * 125 + 60;
        const y = row * 125 + 60;
        return { x, y };
    }

    function checkWin() {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
                return winningConditions[i];
            }
        }
        return null;
    }

    function startGame() {
        boardState.fill(null);
        gameActive = true;
        currentPlayer = 'X';
        statusDisplay.textContent = `It's ${currentPlayer}'s turn`;
        cells.forEach((cell, index) => {
            cell.textContent = '';
            delete cell.dataset.player;
            cell.setAttribute('tabindex', '-1');
        });
        winLine.style.visibility = 'hidden';
    }

    function restartGame() {
        startGame();
    }

    function createBoard() {
        board.addEventListener('focus', () => {
            handleArrowNavigation();
        });
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.cellIndex = i;
            cell.setAttribute('role', 'button');
            cell.setAttribute('tabindex', '-1');
            cell.addEventListener('click', () => {
                cells.forEach(c => c.setAttribute('tabindex', '-1'));
                cell.setAttribute('tabindex', '0');
                handleCellClick(cell, i);
            });
            cell.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCellClick(cell, i);
                } else if (e.key.startsWith('Arrow')) {
                    e.preventDefault();
                    handleArrowNavigation(e.key, i);
                }
            });
            board.appendChild(cell);
            cells.push(cell);
        }
    }

    newGameBtn.addEventListener('click', startGame);
    restartGameBtn.addEventListener('click', restartGame);

    howToPlayBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    createBoard();
    startGame();
});
