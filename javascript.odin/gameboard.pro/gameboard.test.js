// gameboard.test.js
const Gameboard = require('./gameboard');

test('places a ship on the board', () => {
    const board = new Gameboard();
    board.placeShip(3, 0, 0);
    expect(board.board[0][0]).not.toBeNull();
    expect(board.board[0][2]).not.toBeNull();
});

test('receiveAttack hits a ship', () => {
    const board = new Gameboard();
    board.placeShip(3, 0, 0);
    board.receiveAttack(0, 0);
    expect(board.ships[0].hits).toBe(1);
});

test('receiveAttack records a miss', () => {
    const board = new Gameboard();
    board.receiveAttack(5, 5);
    expect(board.missedAttacks).toContainEqual([5, 5]);
});

test('allSunk() returns false if ships remain', () => {
    const board = new Gameboard();
    board.placeShip(2, 0, 0);
    board.receiveAttack(0, 0);
    expect(board.allSunk()).toBe(false);
});

test('allSunk() returns true when all ships are sunk', () => {
    const board = new Gameboard();
    board.placeShip(2, 0, 0);
    board.receiveAttack(0, 0);
    board.receiveAttack(0, 1);
    expect(board.allSunk()).toBe(true);
});