const Player = (num, name, marker) => {
  return { num, name, marker };
};

const Cell = (space) => {
  let marker = "";

  return { space, marker };
};

const gameBoard = (() => {
  // Generate a new board with 9 unmarked cells
  let board = [];
  for (let i = 0; i < 9; i++) {
    let newCell = Cell(i);
    board.push(newCell);
  }

  return board;
})();

const gameController = (() => {
  let playerOne = Player(1, "Player One", "X");
  let playerTwo = Player(2, "Player Two", "O");
  let activePlayer = playerOne;

  const getActivePlayer = () => activePlayer;

  const changeActivePlayer = () => {
    activePlayer =
      activePlayer === playerOne
        ? (activePlayer = playerTwo)
        : (activePlayer = playerOne);
  };

  const setMarker = (space) => {
    if (!gameBoard[space].marker) {
      gameBoard[space].marker = activePlayer.marker;
      checkForWinner();
      changeActivePlayer();
    }
  };

  const checkForWinner = () => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 4, 8],
      [2, 4, 6],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
    ];

    winningCombos.forEach((combo) => {
      let first = combo[0];
      let second = combo[1];
      let third = combo[2];

      if (
        gameBoard[first].marker &&
        gameBoard[first].marker === gameBoard[second].marker &&
        gameBoard[second].marker === gameBoard[third].marker
      ) {
        console.log("winna winna chicken dinna");
      }
    });
  };

  return { getActivePlayer, setMarker };
})();

const displayController = (() => {
  const boardContainer = document.querySelector(".game-board");
  const scoreBoardContainer = document.querySelector(".scoreboard");
  const startButton = document.querySelector(".start-game-button");
  const titleScreen = document.querySelector(".title-screen");
  const newGameContainer = document.querySelector(".new-game-container");

  const clearBoard = () => {
    while (boardContainer.firstChild) {
      boardContainer.removeChild(boardContainer.firstChild);
    }
  };

  const renderBoard = () => {
    clearBoard();
    gameBoard.forEach((cell) => {
      let cellDiv = document.createElement("div");
      cellDiv.textContent = cell.marker;
      cellDiv.dataset.space = cell.space;

      cellDiv.addEventListener("click", (e) => {
        let space = e.target.dataset.space;
        gameController.setMarker(space);
        renderBoard();
      });

      boardContainer.append(cellDiv);
    });
  };

  startButton.addEventListener("click", (e) => {
    titleScreen.classList.add("hidden");
    newGameContainer.classList.add("hidden");
    boardContainer.classList.remove("hidden");
    scoreBoardContainer.classList.remove("hidden");
    renderBoard();
  });

  return {};
})();
