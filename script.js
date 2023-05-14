const Player = (num, name, marker, score) => {
  return { num, name, marker, score };
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
  let playerOne = Player(1, "Player One", "X", 0);
  let playerTwo = Player(2, "Player Two", "O", 0);
  let activePlayer = playerOne;
  let winningPlayer = null;
  let round = 1;

  const getPlayerOne = () => playerOne;
  const getPlayerTwo = () => playerTwo;
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
      checkForTie();
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
        activePlayer.score++;
        winningPlayer = activePlayer;
        displayController.showEndRoundModal(activePlayer.name);
      }
    });
  };

  const checkForTie = () => {
    if (
      gameBoard.filter((cell) => !cell.marker).length === 0 &&
      !winningPlayer
    ) {
      displayController.showEndRoundModal();
    }
  };

  const initNewRound = () => {
    round++;
    winningPlayer = null;
    activePlayer = round % 2 == 0 ? playerTwo : playerOne;
    playerOne.marker = playerOne.marker === "X" ? "O" : "X";
    playerTwo.marker = playerTwo.marker === "X" ? "O" : "X";
    gameBoard.forEach((cell) => {
      cell.marker = "";
    });
  };

  return {
    getPlayerOne,
    getPlayerTwo,
    getActivePlayer,
    setMarker,
    initNewRound,
  };
})();

const menuController = (() => {
  const hideScreen = (screen) => {
    screen.classList.add("hidden");
  };

  const showScreen = (screen) => {
    screen.classList.remove("hidden");
  };

  return { hideScreen, showScreen };
})();

const displayController = (() => {
  const boardContainer = document.querySelector(".game-board");

  const titleScreen = document.querySelector(".title-screen");

  const newGameContainer = document.querySelector(".new-game-container");
  const startButton = document.querySelector(".start-game-button");

  const scoreBoardContainer = document.querySelector(".scoreboard");
  const scoreBoardOne = document.querySelector(".scoreboard-one");
  const playerOneMarker = document.querySelector(".player-one-marker");
  const playerOneName = document.querySelector(".player-one-name");
  const playerOneScore = document.querySelector(".player-one-score");
  const scoreBoardTwo = document.querySelector(".scoreboard-two");
  const playerTwoMarker = document.querySelector(".player-two-marker");
  const playerTwoName = document.querySelector(".player-two-name");
  const playerTwoScore = document.querySelector(".player-two-score");

  const endRoundModal = document.querySelector("dialog");
  const endRoundText = document.querySelector(".end-round-text");
  const newRoundButton = document.querySelector(".new-round-button");
  const mainMenuButton = document.querySelector(".main-menu-button");

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
        renderActivePlayer();
        renderBoard();
      });

      boardContainer.append(cellDiv);
    });
  };

  const renderScoreBoard = () => {
    let playerOne = gameController.getPlayerOne();
    let playerTwo = gameController.getPlayerTwo();
    playerOneMarker.textContent = playerOne.marker;
    playerTwoMarker.textContent = playerTwo.marker;
    playerOneName.textContent = playerOne.name;
    playerTwoName.textContent = playerTwo.name;
    playerOneScore.textContent = playerOne.score;
    playerTwoScore.textContent = playerTwo.score;
  };

  const renderActivePlayer = () => {
    let activePlayer = gameController.getActivePlayer();
    if (activePlayer.num === 1) {
      scoreBoardOne.classList.add("active-player-border");
      scoreBoardTwo.classList.remove("active-player-border");
    } else {
      scoreBoardOne.classList.remove("active-player-border");
      scoreBoardTwo.classList.add("active-player-border");
    }
  };

  const showEndRoundModal = (winner) => {
    renderScoreBoard();
    if (winner) {
      endRoundText.textContent = `${winner} wins the round!`;
    } else {
      endRoundText.textContent = `The round was a tie!`;
    }

    endRoundModal.showModal();
  };

  const hideEndRoundModal = () => {
    endRoundModal.close();
  };

  startButton.addEventListener("click", (e) => {
    menuController.hideScreen(titleScreen);
    menuController.hideScreen(newGameContainer);
    menuController.showScreen(boardContainer);
    menuController.showScreen(scoreBoardContainer);
    renderBoard();
  });

  newRoundButton.addEventListener("click", (e) => {
    gameController.initNewRound();
    renderBoard();
    renderScoreBoard();
    hideEndRoundModal();
  });

  return { showEndRoundModal };
})();
