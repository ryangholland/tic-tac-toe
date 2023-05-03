const gameBoard = (() => {
  let board = [];
  const hello = () => console.log("Hello. I'm the gameBoard.");

  return { hello };
})();

const Player = (name, marker) => {
  return { name, marker };
};

const flowController = (() => {
  const hello = () => console.log("Hello. I'm the flowController.");

  return { hello };
})();

const displayController = (() => {
  const hello = () => console.log("Hello. I'm the displayController.");

  return { hello };
})();


gameBoard.hello();
flowController.hello();
displayController.hello();