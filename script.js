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
  let aiActive = false;
  let aiDifficulty = "Easy";

  const getPlayerOne = () => playerOne;
  const getPlayerTwo = () => playerTwo;
  const getActivePlayer = () => activePlayer;

  const setPlayerNames = (name1, name2) => {
    playerOne.name = name1;
    if (aiActive) {
      playerTwo.name = `AI (${aiDifficulty})`;
    } else {
      playerTwo.name = name2;
    }
  };

  const initAI = () => {
    aiActive = true;
  };

  const noAI = () => {
    aiActive = false;
  };

  const setDifficulty = (difficulty) => {
    aiDifficulty = difficulty;
  };

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
      stepAI();
    }
  };

  const stepAI = () => {
    if (aiActive && activePlayer === playerTwo && winningPlayer === null) {
      while (activePlayer === playerTwo) {
        let aiCell = aiController.getAiSquare(
          aiDifficulty,
          gameBoard,
          playerOne,
          playerTwo
        );
        setMarker(aiCell);
      }
      console.log("AI's Turn");
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

    stepAI();
  };

  const resetGame = () => {
    round = 1;
    winningPlayer = null;
    activePlayer = playerOne;
    gameBoard.forEach((cell) => {
      cell.marker = "";
    });
    playerOne.score = 0;
    playerTwo.score = 0;
    playerOne.marker = "X";
    playerTwo.marker = "O";
  };

  return {
    getPlayerOne,
    getPlayerTwo,
    getActivePlayer,
    initAI,
    noAI,
    setDifficulty,
    setPlayerNames,
    setMarker,
    initNewRound,
    resetGame,
  };
})();

const aiController = (() => {
  const getAiSquare = (difficulty, board, playerOne, playerTwo) => {
    if (difficulty === "Easy") {
      return getEasySquare();
    } else if (difficulty === "Hard") {
      return getHardSquare(board, playerOne, playerTwo);
    }
  };

  const getRandomCell = () => {
    min = Math.ceil(0);
    max = Math.floor(9);
    return Math.floor(Math.random() * (max - min) + min);
  };

  const getEasySquare = () => {
    return getRandomCell();
  };

  const getHardSquare = (board, playerOne, playerTwo) => {
    console.log({playerOne, playerTwo})
    let humanMarker = playerOne.marker;
    let aiMarker = playerTwo.marker;
    let simpleBoard = board.map((cell) => cell.marker);

    for (let i = 0; i < simpleBoard.length; i++) {
      if (simpleBoard[i] === "") simpleBoard[i] = i;
    }

    const emptyCells = (board) => {
      return board.filter((cell) => cell != "X" && cell != "O");
    };

    const winning = (board, marker) => {
      if (
        (board[0] == marker && board[1] == marker && board[2] == marker) ||
        (board[3] == marker && board[4] == marker && board[5] == marker) ||
        (board[6] == marker && board[7] == marker && board[8] == marker) ||
        (board[0] == marker && board[3] == marker && board[6] == marker) ||
        (board[1] == marker && board[4] == marker && board[7] == marker) ||
        (board[2] == marker && board[5] == marker && board[8] == marker) ||
        (board[0] == marker && board[4] == marker && board[8] == marker) ||
        (board[2] == marker && board[4] == marker && board[6] == marker)
      ) {
        return true;
      } else {
        return false;
      }
    };

    const minimax = (newBoard, marker) => {
      let availCells = emptyCells(newBoard);

      if (winning(newBoard, humanMarker)) {
        return { score: -10 };
      } else if (winning(newBoard, aiMarker)) {
        return { score: 10 };
      } else if (availCells.length === 0) {
        return { score: 0 };
      }

      let moves = [];

      for (let i = 0; i < availCells.length; i++) {
        let move = {};
        move.index = newBoard[availCells[i]];

        newBoard[availCells[i]] = marker;

        if (marker == aiMarker) {
          let result = minimax(newBoard, humanMarker);
          move.score = result.score;
        } else {
          let result = minimax(newBoard, aiMarker);
          move.score = result.score;
        }

        newBoard[availCells[i]] = move.index;

        moves.push(move);
      }

      let bestMove;
      if (marker === aiMarker) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
          if (moves[i].score > bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
          if (moves[i].score < bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      }

      return moves[bestMove];
    };

    let returnValue = minimax(simpleBoard,aiMarker);
    console.log(returnValue.index);
    return returnValue.index;
  };

  return { getAiSquare };
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
  const vsPlayerButton = document.querySelector(".vs-player-button");
  const vsComputerButton = document.querySelector(".vs-computer-button");

  const nameScreen = document.querySelector(".name-screen");
  const playerOneNameInput = document.querySelector(".player-one-name-input");
  const playerTwoNameInput = document.querySelector(".player-two-name-input");

  const computerScreen = document.querySelector(".computer-screen");
  const playerNameInput = document.querySelector(".player-name-input");
  const easyButton = document.querySelector(".easy-diff");
  const medButton = document.querySelector(".med-diff");
  const hardButton = document.querySelector(".hard-diff");
  const diffButtons = [easyButton, medButton, hardButton];

  const startGameContainer = document.querySelector(".start-game-container");
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

  vsPlayerButton.addEventListener("click", (e) => {
    playerOneNameInput.value = "";
    playerTwoNameInput.value = "";
    playerNameInput.value = "";
    gameController.noAI();
    menuController.hideScreen(titleScreen);
    menuController.hideScreen(newGameContainer);
    menuController.showScreen(nameScreen);
    menuController.showScreen(startGameContainer);
  });

  vsComputerButton.addEventListener("click", (e) => {
    playerOneNameInput.value = "";
    playerTwoNameInput.value = "";
    playerNameInput.value = "";
    gameController.initAI();
    menuController.hideScreen(titleScreen);
    menuController.hideScreen(newGameContainer);
    menuController.showScreen(computerScreen);
    menuController.showScreen(startGameContainer);
  });

  startButton.addEventListener("click", (e) => {
    menuController.hideScreen(nameScreen);
    menuController.hideScreen(startGameContainer);
    menuController.hideScreen(computerScreen);
    menuController.showScreen(boardContainer);
    menuController.showScreen(scoreBoardContainer);
    let playerOneName = playerNameInput.value;
    if (!playerOneName)
      playerOneName =
        playerOneNameInput.value === ""
          ? "Player One"
          : playerOneNameInput.value;
    gameController.setPlayerNames(
      playerOneName,
      playerTwoNameInput.value === "" ? "Player Two" : playerTwoNameInput.value
    );
    renderBoard();
    renderScoreBoard();
  });

  newRoundButton.addEventListener("click", (e) => {
    gameController.initNewRound();
    renderBoard();
    renderScoreBoard();
    hideEndRoundModal();
  });

  mainMenuButton.addEventListener("click", (e) => {
    gameController.resetGame();
    renderScoreBoard();
    renderActivePlayer();
    menuController.hideScreen(boardContainer);
    menuController.hideScreen(scoreBoardContainer);
    menuController.showScreen(titleScreen);
    menuController.showScreen(newGameContainer);
    hideEndRoundModal();
  });

  diffButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      diffButtons.forEach((button) => button.classList.remove("diff-select"));
      button.classList.add("diff-select");
      gameController.setDifficulty(button.textContent);
    });
  });

  return { showEndRoundModal };
})();
