const Game = (function(){  
  const Gameboard = (function (){
    let board = [
    ];

    function populateBoard(){
      for(let i = 0; i<= 8; i++){
        board.push(Cell())
      }
    };
    
    function showBoard(){
      for(let i = 0; i<= 8; i++){
        console.log(`${board[i].getValue()}`)
      }
    }

    function getBoard(){
      const boardValues = board.map(cell => cell.getValue())
      return boardValues
    }

    function clearBoard(){
      board = [];
      populateBoard();
    }

    function markCell(boardIndex, mark){
      board[boardIndex].setValue(mark)
    }

    function Cell(){
      let value = ""
      function getValue(){
        return value
      }
      function setValue(mark){
        value = mark
      }
      return {getValue, setValue, markCell}
    }

    populateBoard();

    return {showBoard, getBoard, clearBoard, markCell};
  }());

  const Players = (function(){
    function createPlayer(name, mark){
      let score = 0;

      const increaseScore = () => { score++ };
      const getName  = () => { return name };
      const getMark = () => { return mark };
      const getScore = () => { return score };

      return {increaseScore, getName, getMark, getScore};
    };

    const nameOne = 'first';
    const nameTwo = 'second';
    const one = createPlayer(nameOne, "x");
    const two = createPlayer(nameTwo, "o");
    
    return {one, two};
  }());

  const consoleController = (function(){
      const playerOne = Players.one;
      const playerTwo = Players.two;
      let activePlayer = playerOne;
      let roundStatus = "ongoing";
      let gameStatus = "ongoing";
      let ties = 0;
      let playedRounds = 0;
      function playTurn(index){
        (function markCell(){
          const activePlayerMark = activePlayer.getMark();
          Gameboard.markCell(index, activePlayerMark);
        })();

        (function updateRoundStatus(){
          const winningSeries = [
            [0, 1, 2],  // top row
            [3, 4, 5],  // middle row
            [6, 7, 8],  // bottom row
            [0, 3, 6],  // left column
            [1, 4, 7],  // middle column
            [2, 5, 8],  // right column
            [0, 4, 8],  // diagonal (\)
            [2, 4, 6]   // diagonal (/)
          ];
          const activePlayerMark = activePlayer.getMark();

          const board = Gameboard.getBoard();
          (function checkWin(){
            winningSeries.forEach(array => {
              let count = 0
              array.forEach(index =>{
                if(board[index] == activePlayerMark){
                  count++;
                  if (count === 3) {
                    roundStatus = "win";
                    activePlayer.increaseScore();
                    return;
                  }
                }
              })
            });
          })();

          (function checkTie(){
            const markedBoard = board.filter(cell => cell != "")
            if (markedBoard.length === 9) {
              roundStatus = "tie";
              ties++;
              return;
            }
          })();
        })();  
        
        // end round
        if(roundStatus !== "ongoing") {
          endRound();
          updateGameStatus();
        }
        function endRound(){
          playedRounds++;
          Gameboard.clearBoard();
          roundStatus = "ongoing";
        };
      
        function updateGameStatus(){
          const activePlayerScore = activePlayer.getScore();
          if(activePlayerScore === 5) {
            gameStatus = "end";
            logUpdate(gameStatus);
          }
        };

        // condition to end match
        if(gameStatus === "end") return;
        //start another round if condition is not fulfilled
        (function switchTurn(){
              activePlayer = activePlayer === playerOne ? playerTwo : playerOne
        })();

        DOMController.displayBoard();  
        logUpdate(roundStatus);
        displayScore();
      };

      //helper functions
      function displayScore(){
        console.log(`First Player \n\tName: ${playerOne.getName()}\n\tScore: ${playerOne.getScore()}\n\tMark: ${playerOne.getMark()}\nSecond Player\n\tName: ${playerTwo.getName()}\n\tScore: ${playerTwo.getScore()}\n\tMark: ${playerTwo.getMark()}\n\t\nTies: ${ties}`)
      };

      function logUpdate(status){
        const name = activePlayer.getName();
        if(status === "win"){
          console.log(`We have a winner! ${name} wins the round!`);
        }
        else if(status === "tie"){
          console.log("We have a Tie!");
        }
        else if(status === "end"){
          console.log(`${name} wins the game!`);
        }
      };

  //"consoleController" module ending
  return {playTurn}
  }());

  // "Game" module ending
})();

const DOMController = (function (){
  const DOMGrid = document.querySelectorAll(".cell");
  
  function displayBoard(){
    const board = Gameboard.getBoard();
    for(let i = 0; i < 9; i++){
      DOMGrid[i].textContent = board[i];
    }
  };

  (function eventHandler(){
    const gameContainer = document.querySelector(".game-container");
    // gameContainer.style.display = "flex";
    // later use this to show the container
    const grid = document.querySelector(".game-grid");
    grid.addEventListener("click", markCell);
  })();

  function markCell(event){
    const index = event.target.dataset.index;
    const board = Gameboard.getBoard()
    if(board[index] != "") {
      alert('Position already taken. Choose another spot');
      return;
    }
    consoleController.playTurn(index);
  };
  
  return {displayBoard};
})();

const input = (function dialogHandler(){
  const container = document.querySelector(".start-container");
  const dialog = document.querySelector(".input-dialog");
  const button = document.querySelector(".input-dialog button");
  let data;
  container.addEventListener("click", showInputForm);
  button.addEventListener("submit", submitInput);

  function showInputForm(){
    //first hide the "start container"
    container.style.display = "none";
    //then show the dialog
    dialog.showModal(); 
  };

  function submitInput(event){
    event.preventDefault();
    data = getFormData();
    dialog.close();
  }

  function getFormData(){
    const form = document.querySelector(".input-dialog form");
    const formData = new FormData(form);

    const data = Object.fromEntries(formData.entries());
    return data;
  }


  return {data};
})();
