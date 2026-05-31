// player.test.js
const Player = require('./player');
const Gameboard = require('./gameboard');

test('player has a gameboard', () => {
    const player = new Player();
    expect(player.gameboard).toBeInstanceOf(Gameboard);
});

test('player can attack enemy board', () => {
    const player = new Player();
    const enemy = new Player();
    player.attack(enemy.gameboard, 0, 0);
    expect(enemy.gameboard.missedAttacks).toContainEqual([0, 0]);
});

test('computer does not attack same spot twice', () => {
    const computer = new Player('computer');
    const enemy = new Player();

  // Attack all squares except one to force predictable behavior
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            if (!(r === 9 && c === 9)) {
                computer.attackedCoords.push([r, c]);
            }
        }
    }

    computer.randomAttack(enemy.gameboard);
    expect(computer.attackedCoords).toContainEqual([9, 9]);
});