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
  let winningPlayer = null;

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
        console.log("winna winna chicken dinna");
        displayController.showEndRoundModal(activePlayer.name);
      }
    });
  };

  const checkForTie = () => {
    if (
      gameBoard.filter((cell) => !cell.marker).length === 0 &&
      !winningPlayer
    ) {
      console.log("tie");
      displayController.showEndRoundModal();
    }
  };

  return { getActivePlayer, setMarker };
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
  const scoreBoardContainer = document.querySelector(".scoreboard");
  const startButton = document.querySelector(".start-game-button");
  const titleScreen = document.querySelector(".title-screen");
  const newGameContainer = document.querySelector(".new-game-container");
  const endRoundModal = document.querySelector("dialog");
  const endRoundText = document.querySelector(".end-round-text");

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

  const showEndRoundModal = (winner) => {
    if (winner) {
      endRoundText.textContent = `${winner} wins the round!`;
    } else {
      endRoundText.textContent = `The round was a tie!`;
    }

    endRoundModal.showModal();
  };

  startButton.addEventListener("click", (e) => {
    menuController.hideScreen(titleScreen);
    menuController.hideScreen(newGameContainer);
    menuController.showScreen(boardContainer);
    menuController.showScreen(scoreBoardContainer);
    renderBoard();
  });

  return { showEndRoundModal };
})();
