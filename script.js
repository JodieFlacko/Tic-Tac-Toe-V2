const Game = (function(){  
  const Gameboard = (function (){
    const board = [
    ];

    (function populateBoard(){
      for(let i = 0; i<= 8; i++){
        board.push(Cell())
      }
    })()
    
    function showBoard(){
      for(let i = 0; i<= 8; i++){
        console.log(`${board[i].getValue()}`)
      }
    }

    function getBoard(){
      const boardValues = board.map(cell => cell.getValue())
      return boardValues
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


    return {showBoard, getBoard, markCell}
  }())

  const Players = (function(){
    function createPlayer(name, mark){
      let score = 0

      const increaseScore = () => { score++ }
      const getName  = () => { return name }
      const getMark = () => { return mark }
      const getScore = () => { return score }

      return {increaseScore, getName, getMark, getScore}
    }

    function promptName(player){
      return prompt(`Enter ${player} player Name: `,"")
    }

    // const nameOne = promptName("first")
    // const nameTwo = promptName("second")
    const nameOne = 'first'
    const nameTwo = 'second'
    const one = createPlayer(nameOne, "x")
    const two = createPlayer(nameTwo, "o")
    
    return {one, two}
  }())

  const consoleController = (function(){
    const playerOne = Players.one
    const playerTwo = Players.two
    let activePlayer = playerOne
    const mark = activePlayer.getMark()
    let gameStatus = "ongoing"

    function displayPlayersData(){
      console.log(`First Player \n\tName: ${playerOne.getName()}\n\tScore: ${playerOne.getScore()}\n\tMark: ${playerOne.getMark()}\nSecond Player\n\tName: ${playerTwo.getName()}\n\tScore: ${playerTwo.getScore()}\n\tMark: ${playerTwo.getMark()}\n`)
    }

    function playTurn(message){
      console.log(message);
      // function that allow the user to choose the cell to mark
      (function promptCellToMark(){
        // const rowIndex = prompt("Enter a valid row: ")
        // const columnIndex = promptF("Enter a valid column: ")
        let rowIndex = '1'
        let columnIndex = '1'
        // check for input validity
        checkPositionInputValidity(rowIndex, columnIndex)

        // subtract one from indexes to access the right position
        rowIndex -= 1
        columnIndex -= 1

        const boardIndex = (rowIndex * 3) + columnIndex

        Gameboard.markCell(boardIndex, mark)

        //test
        Gameboard.markCell(1, mark)
        Gameboard.markCell(2, mark)

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
              if(board[index] == mark){
                count++;
                if (count === 3) gameStatus = "win"
                return
              }
            })
          });
        })();

        (function checkTie(){
          const markedBoard = board.filter(cell => cell != "")
          if (markedBoard.length === 9) {
            gameStatus = "tie"
            return
          }
        })();
      })();

      (function switchTurn(){
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne
      })();

      function checkPositionInputValidity(inputX, inputY){
        if(inputX > 3 || inputX < 1 && inputY > 3 || inputY < 1) {
          playTurn('Invalid Input: enter a value greater then 0 and smaller then 4')
          return
        }
      }
      Gameboard.showBoard();
    }
    
    function checkGameStatus(){
      switch (gameStatus){
        case "ongoing":
          playTurn()
          return;
        case "win":
          console.log("We have a winner!")
          return;
        case "tie":
          console.log("we have a Tie!")
          return;
      }
    };


    playTurn()
    checkGameStatus()
    return {displayPlayersData}
  }())

  // "Game" module ending
  return {displayData: consoleController.displayPlayersData, showBoard: Gameboard.showBoard}
})()
