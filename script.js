const Player = (name, marker) => {
  return { name, marker };
};

const Cell = (space) => {
  let marker = "";

  return { space, marker };
};

const gameBoard = () => {
  // Generate a new board with 9 unmarked cells
  let board = [];
  for (let i = 0; i < 9; i++) {
    let newCell = Cell(i);
    board.push(newCell);
  }

  return board;
};

const gameController = () => {
  let board = gameBoard();
  let playerOne = Player("Player One", "X");
  let playerTwo = Player("Player Two", "O");

  const getBoard = () => board;

  const getActivePlayer = () => playerOne;

  const setMarker = (space, marker) => {
    board[space].marker = marker;
  };

  return { getBoard, getActivePlayer, setMarker };
};

const displayController = () => {
  const boardContainer = document.getElementById("board-container");

  let game = gameController();
  let board = game.getBoard();

  console.log(board);

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
      cellDiv.dataset.space = cell.space;

      cellDiv.addEventListener("click", (e) => {
        let space = e.target.dataset.space;
        game.setMarker(space, "X");
        renderBoard();
      });

      boardContainer.append(cellDiv);
    });
  };

  renderBoard();

  return {};
};

displayController();
