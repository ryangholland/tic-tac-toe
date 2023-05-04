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
  let playerOne = player("Player One", "X");
  let playerTwo = player("Player Two", "O");


  return {};
};

const displayController = () => {
  let game = gameController();


  return {};
};
