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

  const getBoard = () => board;

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

  return { getBoard, getActivePlayer, setMarker };
})();

const displayController = (() => {
  const boardContainer = document.getElementById("board-container");
  const scoreContainer = document.getElementById("scoreboard");

  const clearBoard = () => {
    while (boardContainer.firstChild) {
      boardContainer.removeChild(boardContainer.firstChild);
    }
  };

  const clearScores = () => {
    while (scoreContainer.firstChild) {
      scoreContainer.removeChild(scoreContainer.firstChild);
    }
  };

  const renderScores = () => {
    let scoreBoardOne = document.createElement("div");
    let nameAndMarkerOne = document.createElement("div");
    let scoreOne = document.createElement("div");
    let scoreBoardTwo = document.createElement("div");
    let nameAndMarkerTwo = document.createElement("div");
    let scoreTwo = document.createElement("div");
    let activePlayer = gameController.getActivePlayer();

    nameAndMarkerOne.textContent = "X | PLAYER ONE";
    scoreOne.textContent = "0";
    nameAndMarkerTwo.textContent = "PLAYER TWO | O";
    scoreTwo.textContent = "0";

    scoreBoardOne.classList.add("scoreboard-one");
    scoreOne.classList.add("scoreboard-one-score");
    scoreBoardTwo.classList.add("scoreboard-two");
    scoreTwo.classList.add("scoreboard-two-score");

    if (activePlayer.num === 1) {
      scoreBoardTwo.classList.remove("active-player-border");
      scoreBoardOne.classList.add("active-player-border");
    } else {
      scoreBoardTwo.classList.add("active-player-border");
      scoreBoardOne.classList.remove("active-player-border");
    }

    scoreBoardOne.append(nameAndMarkerOne);
    scoreBoardOne.append(scoreOne);
    scoreBoardTwo.append(nameAndMarkerTwo);
    scoreBoardTwo.append(scoreTwo);
    scoreContainer.append(scoreBoardOne);
    scoreContainer.append(scoreBoardTwo);
  };

  const renderBoard = () => {
    clearBoard();
    clearScores();
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
    renderScores();
  };

  renderBoard();

  return {};
})();
