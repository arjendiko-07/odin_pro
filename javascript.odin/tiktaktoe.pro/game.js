const Gameboard = (() => {
    let board = ["","","","","","","","",""];

    const getBoard = () => board;

    const setCell = (index, mark) => {
        if (board[index] !== "") return false;
        board[index] = mark;
        return true;
    };

    const reset = () => {
        board = ["","","","","","","","",""];
    };

    return { getBoard, setCell, reset };
})();


const Player = (name, mark) => {
    return { name, mark };
};


// DISPLAY FIRST (important fix)
const Display = (() => {

    const boardDiv = document.getElementById("board");
    const restartBtn = document.getElementById("restart");

    const render = () => {
        boardDiv.innerHTML = "";

        Gameboard.getBoard().forEach((cell, index) => {

            const div = document.createElement("div");
            div.classList.add("cell");
            div.textContent = cell;

            div.addEventListener("click", () => {
                GameController.play(index);
                render();
            });

            boardDiv.appendChild(div);
        });
    };

    restartBtn.addEventListener("click", () => {
        GameController.reset();
        render();
    });

    render();

    return { render };

})();


const GameController = (() => {

    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");

    let current = player1;
    let gameOver = false;

    const message = document.getElementById("message");

    const switchPlayer = () => {
        current = current === player1 ? player2 : player1;
    };

    const play = (index) => {

        if (gameOver) return;

        const success = Gameboard.setCell(index, current.mark);
        if (!success) return;

        if (checkWinner()) {
            message.textContent = current.name + " wins!";
            gameOver = true;
            return;
        }

        if (checkTie()) {
            message.textContent = "It's a tie!";
            gameOver = true;
            return;
        }

        switchPlayer();
    };

    const checkWinner = () => {

        const wins = [
            [0,1,2],[3,4,5],[6,7,8],
            [0,3,6],[1,4,7],[2,5,8],
            [0,4,8],[2,4,6]
        ];

        return wins.some(([a,b,c]) => {
            const board = Gameboard.getBoard();

            return board[a] &&
                    board[a] === board[b] &&
                    board[a] === board[c];
        });
    };

    const checkTie = () => {
        return Gameboard.getBoard().every(cell => cell !== "");
    };

    const reset = () => {
        Gameboard.reset();
        current = player1;
        gameOver = false;
        message.textContent = "";
        Display.render();
    };

    return { play, reset };

})();