// ui.js
const GameController = require('./gameController');

const game = new GameController();

function renderBoard(board, elementId, isEnemy = false) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';

    board.board.forEach((row, rIdx) => {
        row.forEach((cell, cIdx) => {
        const div = document.createElement('div');
        div.classList.add('cell');

      // Show hits
        if (cell && cell.hits > 0) div.classList.add('hit');

      // Show misses
        if (board.missedAttacks.some(([r, c]) => r === rIdx && c === cIdx)) {
            div.classList.add('miss');
        }

      // Only enemy board is clickable
        if (isEnemy) {
            div.addEventListener('click', () => handleAttack(rIdx, cIdx));
        }

        container.appendChild(div);
    });
    });
}

function handleAttack(row, col) {
    const result = game.humanTurn(row, col);

    renderBoard(game.human.gameboard, 'human-board');
    renderBoard(game.computer.gameboard, 'computer-board', true);

    if (result === 'human wins') {
        document.getElementById('message').textContent = 'You win! 🎉';
    } else if (result === 'computer wins') {
        document.getElementById('message').textContent = 'Computer wins! 💀';
    }
}

// Initial render
renderBoard(game.human.gameboard, 'human-board');
renderBoard(game.computer.gameboard, 'computer-board', true);