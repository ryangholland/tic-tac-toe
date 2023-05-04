const Player = (name, marker) => {
  return { name, marker };
};

const Cell = (space) => {
  let marker = "X";

  return { space, marker };
};

const gameBoard = () => {
  // Generate a new board with 9 unmarked cells
  let board = [];
  for (let i = 0; i < 9; i++) {
    let newCell = Cell(i);
    board.push(newCell);
  }

  const getBoard = () => board;

  return { getBoard };
};

const gameController = () => {
  let board = gameBoard();
  let playerOne = Player("Player One", "X");
  let playerTwo = Player("Player Two", "O");

  const getBoard = () => board.getBoard();

  return { getBoard };
};

const displayController = () => {
  const boardContainer = document.getElementById("board-container");

  let game = gameController();
  let board = game.getBoard();

  const clearBoard = () => {
    while (boardContainer.firstChild) {
      boardContainer.removeChild(boardContainer.firstChild);
    }
  };

  const renderBoard = () => {
    clearBoard();
    board.forEach((cell) => {
      let cellDiv = document.createElement("div");
      cellDiv.textContent = cell.marker;
      boardContainer.append(cellDiv);
    });
  };

  renderBoard();

  return {};
};

displayController();
