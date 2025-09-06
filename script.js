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

    function markCell(rowIndex, columnIndex, mark){
      // subtract one from indexes to access the right position
      rowIndex -= 1
      columnIndex -= 1
      board[(rowIndex * 3) + columnIndex].setValue(mark)
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

    const nameOne = promptName("first")
    const nameTwo = promptName("second")
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
      console.log(`First Player \n\tName: ${playerOne.getName()}\n\tScore: ${playerOne.getScore()}\nSecond Player\n\tName: ${playerTwo.getName()}\n\tScore: ${playerTwo.getScore()}\n`)
    }

    function startRound(){
      console.log(`${activePlayer.getName()}'s turn:\n`);
      // function that allow the user to choose the cell to mark
      (function promptCellToMark(){
        const rowIndex = prompt("Enter a valid row: ")
        const columnIndex = prompt("Enter a valid column: ")
        const mark = activePlayer.getMark()

        Gameboard.markCell(rowIndex, columnIndex, mark)
      })();

      (function switchRound(){
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne
      })();
      Gameboard.showBoard();
      gameOver = Gameboard.checkBoard();
    }
    
    while(!gameOver){
      startRound()
    }

    return {displayPlayersData}
  }())

  // "Game" module ending
  return {displayData: consoleController.displayPlayersData, showBoard: Gameboard.showBoard}
})()
