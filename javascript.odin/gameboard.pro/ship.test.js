// ship.test.js
const Ship = require('./ship');

test('ship has correct length', () => {
    const ship = new Ship(3);
    expect(ship.length).toBe(3);
});

test('hit() increases hits by 1', () => {
    const ship = new Ship(3);
    ship.hit();
    expect(ship.hits).toBe(1);
});

test('isSunk() returns false if not enough hits', () => {
    const ship = new Ship(3);
    ship.hit();
    expect(ship.isSunk()).toBe(false);
});

test('isSunk() returns true when hits equal length', () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
});