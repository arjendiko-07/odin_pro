// player.js
const Gameboard = require('./gameboard');

class Player {
    constructor(type = 'human') {
        this.type = type;
        this.gameboard = new Gameboard();
        this.attackedCoords = [];
    }

    attack(enemyBoard, row, col) {
        enemyBoard.receiveAttack(row, col);
        this.attackedCoords.push([row, col]);
    }

    randomAttack(enemyBoard) {
        let row, col;

    // Keep trying until we find a coordinate we haven't attacked yet
    do {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
    } while (
        this.attackedCoords.some(([r, c]) => r === row && c === col)
    );

    this.attack(enemyBoard, row, col);
    }
}

module.exports = Player;