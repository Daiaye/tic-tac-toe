function createPlayer(number, mark) {
    return { number, mark }
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

    for (let i = 0; i < rows; i++) {
        board[i] = []
        for (let j = 0; j < columns; j++) {
            board[i][j] = cell();
        }
    }
    
    const getRows = () => rows;

    const getColumns = () => columns;
    
    const getBoard = () => board;

    const readMarkerAt = (row, col) => {
        return board[row][col].getValue();
    }

    const placeMarkerAt = (row, col, mark) => {
        if (board[row][col].isEmpty()) {
            board[row][col].addMarker(mark)
            return true
        }
        
        return false
    }

    return { getRows, getColumns, getBoard, readMarkerAt, placeMarkerAt }
})();

const displayController = (() => {
    const printBoard = () => {
    const border = "-------\n";
    let boardString = "";
    boardString += border;
    for (let r = 0; r < gameboard.getRows(); r++) {
        let rowString = "";
        for (let c = 0; c < gameboard.getColumns(); c++) {
            rowString += `|${gameboard.readMarkerAt(r, c)}`
        }
        rowString += "|\n";
        boardString += rowString;
    }
    boardString += border;
    console.log(boardString);
    }

    return { printBoard }
})();


displayController.printBoard();
gameboard.placeMarkerAt(2, 0, "X")
displayController.printBoard();
gameboard.placeMarkerAt(1, 0, "X")
displayController.printBoard();
gameboard.placeMarkerAt(0, 0, "X")
displayController.printBoard();