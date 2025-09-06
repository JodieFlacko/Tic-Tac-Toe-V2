const Game = (function(){  
  const Gameboard = (function (){
    const board = [
    ]
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

    function checkBoard(){
      const updatedBoard = board.filter(cell => cell.getValue() != "")
      if (updatedBoard.length === 9) return true
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


    return {showBoard, checkBoard, markCell}
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
    let gameOver = false

    function displayPlayersData(){
      console.log(`First Player \n\tName: ${playerOne.getName()}\n\tScore: ${playerOne.getScore()}\n\tMark: ${playerOne.getMark()}\nSecond Player\n\tName: ${playerTwo.getName()}\n\tScore: ${playerTwo.getScore()}\n\tMark: ${playerTwo.getMark()}\n`)
    }

    function startRound(message){
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
        const mark = activePlayer.getMark()

        Gameboard.markCell(boardIndex, mark)

      })();

      (function switchRound(){
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne
      })();

      function checkPositionInputValidity(inputX, inputY){
        if(inputX > 3 || inputX < 1 && inputY > 3 || inputY < 1) {
          startRound('Invalid Input: enter a value greater then 0 and smaller then 4')
          return
        }
      }
      Gameboard.showBoard();
      gameOver = Gameboard.checkBoard();
    }
    
    // while(!gameOver){
    //   startRound()
    // }

    startRound()

    return {displayPlayersData}
  }())

  // "Game" module ending
  return {displayData: consoleController.displayPlayersData, showBoard: Gameboard.showBoard}
})()
