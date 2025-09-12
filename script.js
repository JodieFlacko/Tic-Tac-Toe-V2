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
    let one, two;

    function createPlayer(data){
      let score = 0;
      const name = data.name;
      let mark;
      if(this.one == undefined) mark = data.mark;
      else mark = this.one.getMark() === "x" ? "o" : "x";
      const increaseScore = () => { score++ };
      const getName  = () => { return name };
      const getMark = () => { return mark };
      const getScore = () => { return score };

      return {increaseScore, getName, getMark, getScore};
    };

    return {one, two, createPlayer}

  }());

  const consoleController = (function(){
      let activePlayer;
      let roundStatus = "ongoing";
      let gameStatus = "ongoing";
      let ties = 0;
      let playedRounds = 0;
      function playTurn(index){
        (function switchTurn(){
          activePlayer = activePlayer === Players.one ? Players.two : Players.one
        })();
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
                    displayScore();
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
              displayScore();
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
        DOMController.displayBoard();  
        logUpdate(roundStatus);
      };

      //helper functions
      function displayScore(){
        console.log(`First Player \n\tName: ${Players.one.getName()}\n\tScore: ${Players.one.getScore()}\n\tMark: ${Players.one.getMark()}\nSecond Player\n\tName: ${Players.two.getName()}\n\tScore: ${Players.two.getScore()}\n\tMark: ${Players.two.getMark()}\n\t\nTies: ${ties}`)
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

  const DOMController = (function (){
    const DOMGrid = document.querySelectorAll(".cell");
    
    function displayBoard(){
      const board = Gameboard.getBoard();
      for(let i = 0; i < 9; i++){
        DOMGrid[i].textContent = board[i];
      }
    };

    (function gridHandler(){
      const gameContainer = document.querySelector(".game-container");
      // later use this to show the container
      const grid = document.querySelector(".game-grid");
      grid.addEventListener("click", markCell);
    })();

    const input = (function(){
      const container = document.querySelector(".start-container");
      const firstDialog = document.querySelector(".input-dialog-player-one");
      const secondDialog = document.querySelector(".input-dialog-player-two");
      const buttonPlayerOneDialog = document.querySelector(".input-dialog-player-one button");
      const buttonPlayerTwoDialog = document.querySelector(".input-dialog-player-two button");
      const gameContainer = document.querySelector(".game-container");

      container.addEventListener("click", () =>{ 
        //first hide the "start container"
        hideElement(container);
        openModal(firstDialog);
      });
      buttonPlayerOneDialog.addEventListener("click", (event) => {
        handleDialog(event, firstDialog, "one");
        openModal(secondDialog);
      });

      buttonPlayerTwoDialog.addEventListener("click", (event) =>{
        handleDialog(event, secondDialog, "two");
        //display grid
        gameContainer.style.display = "flex";
      })

      function handleDialog(event, dialog, player){
        const form = dialog.querySelector("form");
        const data = getFormData(form);
        Players[player] = Players.createPlayer(data);
        closeModal(event, dialog);
      }

      function hideElement(element){
        element.style.display = "none";
      }

      function openModal(dialog){
        //then show the dialog
        dialog.showModal(); 
      };

      function getFormData(form){
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        return data;
      };

      function closeModal(event, dialog){
        event.preventDefault();
        dialog.close();
      };
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

  // "Game" module ending
})();

