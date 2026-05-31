// gameboard.js
const Ship = require('./ship');

class Gameboard {
    constructor() {
        this.board = Array(10).fill(null).map(() => Array(10).fill(null));
        this.missedAttacks = [];
        this.ships = [];
    }

    placeShip(length, row, col, isVertical = false) {
        const ship = new Ship(length);
    
    for (let i = 0; i < length; i++) {
        if (isVertical) {
            this.board[row + i][col] = ship;
        } else {
            this.board[row][col + i] = ship;
        }
    }
    
    this.ships.push(ship);
    }

    receiveAttack(row, col) {
        const target = this.board[row][col];
    
        if (target) {
            target.hit();
        } else {
            this.missedAttacks.push([row, col]);
        }
    }

    allSunk() {
        return this.ships.every(ship => ship.isSunk());
    }
}

module.exports = Gameboard;