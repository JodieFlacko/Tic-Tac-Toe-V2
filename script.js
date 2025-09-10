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

    function promptName(player){
      return prompt(`Enter ${player} player Name: `,"");
    };

    // const nameOne = promptName("first")
    // const nameTwo = promptName("second")
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
    const activePlayerMark = activePlayer.getMark();
    let gameStatus = "ongoing";
    let ties = 0
    function startRound(){
      while(gameStatus === 'ongoing'){
        (function playTurn(message){
          console.log(message);
          // function that allow the user to choose the cell to activePlayerMark
          (function promptCellToMark(){
            // const rowIndex = prompt("Enter a valid row: ")
            // const columnIndex = promptF("Enter a valid column: ")
            // test
            let rowIndex = '1';
            let columnIndex = '1';
            // check for input validity
            (function checkPositionInputValidity(inputX, inputY){
              if(inputX > 3 || inputX < 1 && inputY > 3 || inputY < 1) {
                playTurn('Invalid Input: enter a value greater then 0 and smaller then 4')
                return
              }
            })();

            // subtract one from indexes to access the right position
            rowIndex -= 1;
            columnIndex -= 1;
            const boardIndex = (rowIndex * 3) + columnIndex;

            Gameboard.markCell(boardIndex, activePlayerMark);

            //test
            Gameboard.markCell(1, activePlayerMark);
            Gameboard.markCell(2, activePlayerMark);

          })();

          (function updateGameStatus(){
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

            const board = Gameboard.getBoard();
            (function checkWin(){
              winningSeries.forEach(array => {
                let count = 0
                array.forEach(index =>{
                  if(board[index] == activePlayerMark){
                    count++;
                    if (count === 3) {
                      gameStatus = "win"
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
                gameStatus = "tie";
                ties++;
                return;
              }
            })();
          })();  

          function logUpdate(status){
            if(status === "win"){
              console.log(`We have a winner! ${activePlayer.getName()} wins the round!`);
            }
            else{
              console.log("We have a Tie!");
            }
          };

          switchTurn();

          Gameboard.showBoard();
          logUpdate(gameStatus);
          displayScore();
        })();
      };

      // if we exit the while loop, the round has ended
      Gameboard.clearBoard();

      function switchTurn(){
      activePlayer = activePlayer === playerOne ? playerTwo : playerOne
      };
    }
    
    function displayScore(){
      console.log(`First Player \n\tName: ${playerOne.getName()}\n\tScore: ${playerOne.getScore()}\n\tMark: ${playerOne.getMark()}\nSecond Player\n\tName: ${playerTwo.getName()}\n\tScore: ${playerTwo.getScore()}\n\tMark: ${playerTwo.getMark()}\n\t\nTies: ${ties}`)
    };

    startRound();

    return {displayScore};
  }());

  // "Game" module ending
  return {displayData: consoleController.displayScore};
})();
