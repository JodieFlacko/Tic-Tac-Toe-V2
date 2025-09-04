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
      console.log(board)
    }

    return {showBoard}
  }())

  function Cell(){
    value = ""
    function getValue(){
      return value
    }
    function setValue(mark){
      value = mark
    }
    return {getValue, setValue}
  }

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
    function displayPlayersData(){
      console.log(`First Player \n\tName: ${Players.one.getName()}\n\tScore: ${Players.one.getScore()}\nSecond Player\n\tName: ${Players.two.getName()}\n\tScore: ${Players.two.getScore()}\n`)
    }

    // function that allow the user to choose the cell to mark
    return {displayPlayersData}
  }())

  // "Game" module ending
  return {displayData: consoleController.displayPlayersData, showBoard: Gameboard.showBoard}
})()
