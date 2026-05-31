// gameController.js
const Player = require('./player');

class GameController {
    constructor() {
        this.human = new Player('human');
        this.computer = new Player('computer');
        this.gameOver = false;

    // Place ships for both players
        this.human.gameboard.placeShip(5, 0, 0);
        this.human.gameboard.placeShip(4, 2, 0);
        this.human.gameboard.placeShip(3, 4, 0);

        this.computer.gameboard.placeShip(5, 0, 0);
        this.computer.gameboard.placeShip(4, 2, 0);
        this.computer.gameboard.placeShip(3, 4, 0);
    }

    humanTurn(row, col) {
        if (this.gameOver) return;

    this.human.attack(this.computer.gameboard, row, col);

    if (this.computer.gameboard.allSunk()) {
        this.gameOver = true;
        return 'human wins';
    }

    // Computer attacks back
    this.computer.randomAttack(this.human.gameboard);

    if (this.human.gameboard.allSunk()) {
        this.gameOver = true;
        return 'computer wins';
    }

    return 'continue';
    }
}

module.exports = GameController;