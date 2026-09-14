function createPlayer(number, mark) {
    const getNumber = () => number;
    
    const getMark = () => mark;
    
    return { getNumber, getMark }
}

function cell() {
    let value = " ";

    const getValue = () => value;

    const addMarker = (mark) => {
        value = mark;
    };

    const isEmpty = () => {
        return value === " "
    }

    return { getValue, addMarker, isEmpty };
}

const gameboard = (() => {
    const rows = 3;
    const columns = 3;
    const board = [];
    let remainingCells = 9;

    for (let i = 0; i < rows; i++) {
        board[i] = []
        for (let j = 0; j < columns; j++) {
            board[i][j] = cell();
        }
    }
    
    const getNumberOfRows = () => rows;

    const getNumberOfColumns = () => columns;
    
    const getBoard = () => board;

    const isFull = () => remainingCells === 0

    const readMarkerAt = (row, col) => {
        return board[row][col].getValue();
    }

    const placeMarkerAt = (row, col, mark) => {
        if (board[row][col].isEmpty()) {
            board[row][col].addMarker(mark)
            remainingCells -= 1;
            return true
        }
        
        return false
    }

    const getRow = (row) => {
        const returnRow = [];
        for (let i = 0; i < columns; i++) {
            const cell = board[row][i];
            returnRow.push(cell.getValue());
        }

        return returnRow;
    }

    const getColumn = (col) => {
        const column = [];
        for (let i = 0; i < rows; i++) {
            const cell = board[i][col]
            column.push(cell.getValue());
        }

        return column;
    }

    const getLeftToRightDiagonal = () => {
        const diagonal = []
        for (let i = 0; i < rows; i++) {
            const cell = board[i][i]
            diagonal.push(cell.getValue());
        }
        
        return diagonal;
    }

    const getRightToLeftDiagonal = () => {
        const diagonal = [];
        for (let i = 0; i < rows; i++) {
            const cell = board[i][columns - 1 - i];
            diagonal.push(cell.getValue());
        }

        return diagonal;
    }

    const resetGameboard = () => {
        remainingCells = 9;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                board[i][j] = cell();
            }
        }
    }

    return { getNumberOfRows, getNumberOfColumns, getBoard, readMarkerAt, placeMarkerAt, getRow, getColumn, getLeftToRightDiagonal, getRightToLeftDiagonal, isFull, resetGameboard }
})();

const gameController = (() => {
    const playerX = createPlayer(1, "X");
    const playerO = createPlayer(2, "O");
    let activePlayer = playerX;
    let isGameOver = false;
    let winner = null;

    const playTurn = (row, col) => {
        if (isGameOver) {
            return false
        }

        const validMove = gameboard.placeMarkerAt(row, col, activePlayer.getMark())

        if (!validMove) {
            return false
        }

        if (checkForWin(row, col)) {
            isGameOver = true;
            winner = activePlayer;
            return true
        }

        if (gameboard.isFull()){
            isGameOver = true;
            winner = null;
            return true;
        }

        switchActivePlayer();
        return true;
    }

    const getActivePlayer = () => activePlayer;

    const getIsGameOver = () => isGameOver;

    const getWinner = () => winner;

    const switchActivePlayer = () => {
        if (activePlayer === playerX) {
            activePlayer = playerO;
        } else {
            activePlayer = playerX;
        }
    }

    const checkForWin = (row, col) => {
        const linesToCheck = [
            gameboard.getRow(row),
            gameboard.getColumn(col)
        ];

        if (row === col) {
            linesToCheck.push(gameboard.getLeftToRightDiagonal());
        }

        if (row + col === gameboard.getNumberOfRows() - 1) {
            linesToCheck.push(gameboard.getRightToLeftDiagonal())
        }

        return linesToCheck.some(line => 
            line.every(mark => mark === activePlayer.getMark())
        )
    }

    const resetGame = () => {
        gameboard.resetGameboard();
        isGameOver = false;
        activePlayer = playerX;
        winner = null;
    }

    return { playTurn, getActivePlayer, switchActivePlayer, resetGame, getIsGameOver, getWinner }

    
})();

const displayController = (() => {
    const messageDiv = document.querySelector(".message");
    const gameboardDiv = document.querySelector(".gameboard");

    const updateScreen = () => {
        gameboardDiv.textContent = "";

        for (let row = 0; row < gameboard.getNumberOfRows(); row++) {
            for (let col = 0; col < gameboard.getNumberOfColumns(); col++) {
                const cellButton = document.createElement("button");
                cellButton.textContent = gameboard.readMarkerAt(row, col)
                cellButton.classList.add("cell");
                cellButton.dataset.row = row;
                cellButton.dataset.col = col;
                gameboardDiv.append(cellButton)
            }
        }

        if (gameController.getIsGameOver()) {
            const winner = gameController.getWinner();
            if (winner) {
                setMessage(`Player ${winner.getMark()} wins!`)
            } else {
                setMessage("It's a tie!")
            }
        } else {
            const activePlayer = gameController.getActivePlayer();
            setMessage(`Player ${activePlayer.getMark()}'s turn`);
        }
    }

    const setMessage = (message) => {
        messageDiv.textContent = message;
    }

    const printBoard = () => {
    const border = "-------\n";
    let boardString = "";
    boardString += border;
    for (let r = 0; r < gameboard.getNumberOfRows(); r++) {
        let rowString = "";
        for (let c = 0; c < gameboard.getNumberOfColumns(); c++) {
            rowString += `|${gameboard.readMarkerAt(r, c)}`
        }
        rowString += "|\n";
        boardString += rowString;
        boardString += border;
    }
    console.log(boardString);
    }

    const clickHandlerGameboard = (e) => {
        const targetCell = e.target;
        const validMove = gameController.playTurn(Number(targetCell.dataset.row), Number(targetCell.dataset.col));
        if (validMove) {
            updateScreen();
        }
    }

    gameboardDiv.addEventListener("click", clickHandlerGameboard);

    return { updateScreen, printBoard }
})();

const restartButton = document.querySelector(".restart-button");
restartButton.addEventListener("click", () => {
    gameController.resetGame();
    displayController.updateScreen();
})
