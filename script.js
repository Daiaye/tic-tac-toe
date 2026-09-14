// TODO: Fix bug where marked cell is no longer playable
// TODO: Implement game end

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
        for (let i = 0; i < rows; i++) {
            board[i] = []
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

    const playTurn = (row, col, player) => {
        const validMove = gameboard.placeMarkerAt(row, col, player.getMark())
        console.log(activePlayer.getMark());
        if (validMove) {
            if (checkHorizontalWin(player, row) || checkVerticalWin(player, col) || checkDiagonalWin(player, row, col)) {
                console.log("Game Over")
            } else {
                if (gameboard.isFull()) {
                    console.log("It's a tie!");
                } else {
                    switchActivePlayer();
                }
            }
        } else {
            console.log(`Invalid move! Player ${player.getNumber()} wants to place a ${player.getMark()} in row ${Number(row) + 1} column ${Number(col) + 1} but that cell is already full!\n`)
        }
    }

    const getActivePlayer = () => activePlayer;

    const switchActivePlayer = () => {
        if (activePlayer === playerX) {
            activePlayer = playerO;
        } else {
            activePlayer = playerX;
        }
    }

    const checkForWin = (player, line, direction) => {
        const win = line.every(mark => mark === player.getMark());
        if (win) {
            console.log(`Player ${player.getNumber()} wins with a ${direction} win!`)
            return true
        }

        return false
    }

    const checkHorizontalWin = (player, row) => {
        const rowToCheck = gameboard.getRow(row);
        const result = checkForWin(player, rowToCheck, "horizontal");
        return result
    }

    const checkVerticalWin = (player, col) => {
        const colToCheck = gameboard.getColumn(col);
        const result = checkForWin(player, colToCheck, "vertical");
        return result
    }

    const checkDiagonalWin = (player, row, col) => {
        if (row === col) {
            const diagonalToCheck = gameboard.getLeftToRightDiagonal()
            const result = checkForWin(player, diagonalToCheck, "diagonal");
            if (result) return result;
        }

        if (row + col === gameboard.getNumberOfRows() - 1) {
            const diagonalToCheck = gameboard.getRightToLeftDiagonal()
            const result = checkForWin(player, diagonalToCheck, "diagonal");
            if (result) return result
        }

        return false
    }

    return { playTurn, getActivePlayer, switchActivePlayer }

    
})();

const displayController = (() => {
    const turnMessageDiv = document.querySelector(".turn-message");
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
        const currentPlayer = gameController.getActivePlayer()
        gameController.playTurn(targetCell.dataset.row, targetCell.dataset.col, currentPlayer);
        targetCell.textContent = currentPlayer.getMark();
        console.log(`Row ${e.target.dataset.row} Column ${e.target.dataset.col} was clicked`);
    }

    gameboardDiv.addEventListener("click", clickHandlerGameboard);

    return { updateScreen, printBoard }
})();


// const playerOne = createPlayer(1, "X");
// const playerTwo = createPlayer(2, "O");

// displayController.printBoard();
// gameController.playTurn(2, 0, playerOne);
// displayController.printBoard();
// gameController.playTurn(1, 0, playerTwo);
// displayController.printBoard();
// gameController.playTurn(0, 0, playerOne);
// displayController.printBoard();
// gameController.playTurn(2, 0, playerTwo);
// displayController.printBoard();
// gameController.playTurn(2, 1, playerOne);
// displayController.printBoard();
// gameController.playTurn(2, 2, playerTwo);
// displayController.printBoard();
// gameController.playTurn(1, 2, playerTwo);
// displayController.printBoard();
// gameController.playTurn(1, 1, playerTwo);
// displayController.printBoard();
// gameController.playTurn(0, 2, playerTwo);
// displayController.printBoard();
// gameController.playTurn(0, 1, playerTwo);
// displayController.printBoard();


// Vertical Win
// gameController.playTurn(1, 2, playerOne);
// displayController.printBoard();
// gameController.playTurn(0, 2, playerOne);
// displayController.printBoard();

// Diagonal Win
// gameController.playTurn(1, 1, playerOne);
// displayController.printBoard();


// gameController.playTurn(0, 2, playerOne);
// displayController.printBoard();
// console.log(gameboard.getRightToLeftDiagonal())

const restartButton = document.querySelector(".restart-button");
restartButton.addEventListener("click", () => {
    displayController.updateScreen();
    gameboard.resetGameboard(); 
})
