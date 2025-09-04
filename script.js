const Game = (function(){
  const Gameboard = (function (){
    const board = []

    function showBoard(){
      console.log(board)
    }
    return {showBoard}
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
    function displayPlayersData(){
      console.log(`First Player \n\tName: ${Players.one.getName()}\n\tScore: ${Players.one.getScore()}\nSecond Player\n\tName: ${Players.two.getName()}\n\tScore: ${Players.two.getScore()}\n`)
    }

    return {displayPlayersData}
  }())

  // "Game" module ending
  return {displayData: consoleController.displayPlayersData}
})()
