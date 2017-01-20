//The Simulation class controls the board, organizing movement,
//      and removing/adding pieces as necessary
//Current keeps track of the state of the board, direction is whether we're getting
//      closer to the start of the board or the end
//runningSim tells app whether pushing step buttons starts or alters the path of the sim
//TakenPieces tells changeBoard whether this move, in this direction, involves adding pieces back on

class Simulation{
  constructor(simulation){
    this.moves = simulation["past_moves_board"]
    this.board_size = [simulation["rows"], simulation["cols"]]
    this.starting_board = simulation["pieces"]
    this.current = -1
    this.delay = 500
    this.direction = 0
    this.runningSim = false
    this.takenPieces=[]
    this.highlights = []
    this.paused = true
    this.step = false
    this.setBoard(this.board_size[0], this.board_size[1], this.starting_board)
  }

  // - If we're not paused, we're going to move the board (step overrides pause for one move)
  // - If we're not in the range of the move list and we're going the right way, we
  //    should move into range
  // - We change the board if we're in range (which is always the case unless we've pushed
  //    a button that would go farther than the move range)
  // - If the button is invalid or we're paused, display Play instead of Pause
  runSim(){
    this.runningSim = true
    setTimeout(function render(){
      if (!simulator.paused || simulator.step === true){
        if (simulator.current < 0 && simulator.direction === 1) { simulator.current = 0 }
        if (simulator.current > simulator.moves.length-1 && simulator.direction === -1) { simulator.current = simulator.moves.length - 1 }
        if (simulator.current > -1 && simulator.current < simulator.moves.length){
          let fromSpace = [simulator.moves[simulator.current]["last_move_squares"]["from"]["row"], simulator.moves[simulator.current]["last_move_squares"]["from"]["col"]]
          let toSpace = [simulator.moves[simulator.current]["last_move_squares"]["to"]["row"], simulator.moves[simulator.current]["last_move_squares"]["to"]["col"]]
          simulator.changeBoard(fromSpace, toSpace)
          this.runningSim = false
          simulator.current += simulator.direction
          simulator.step = false
          setTimeout(render, simulator.delay)
        }
        else {
          simulator.runningSim = false
          $("#play").css("display", "inline-block")
          $("#pause").css("display", "none")
        }
      }
      else {
        setTimeout(render, simulator.delay)
        $("#play").css("display", "inline-block")
        $("#pause").css("display", "none")
      }
    }, simulator.delay)
  }

  //Id's are based on the index in the array of spots on the board
  getId(space){
    return this.board_size[1]*(space[0])+(space[1])
  }

  // - Initial setup, get our full board with the appropriate coloured squares
  // - Assign pieces to squares, giving them ids to make them easy to keep track of
  setBoard(rows, cols, pieces, special_square){
    $("#simulator").empty()
    while (pieces.includes('/')){pieces = pieces.replace('/', '')}
    for (let i = 0; i < rows; i++){
      let row = '<div>'
      for (let j = 0; j < cols; j++){
        let space_class = "spot"
        let img_src = "<img id='piece' src='./css/"
        i%2 === j%2 ? space_class += " light" : space_class += " dark"
        if (special_square) { if (special_square['row'] === i+1 && special_square['col'] === j+1) { space_class += " special" } }
        if (pieces[i*cols+j] !== 'e'){
          img_src += pieces[i*cols+j].toUpperCase() === pieces[i*cols+j] ? 'B' : 'W'
          img_src += (pieces[i*cols+j].toUpperCase()+".png'></img>")
        } else {
          img_src = "<span id='piece'></span>"
        }
        row += `<span id=${i*this.board_size[1]+j} class='${space_class}'>${img_src}</span>`
        // $("#simulator").append(`<span id=${i*this.board_size[1]+j} class='${space_class}'>${img_src}</span>`)
        // if (j === cols - 1) {$("#simulator").append("<br>")}
      }
      row += "</div>"
      $("#simulator").append(row)
      row = ""
    }
  }

  //Change the board
  // - Based on which direction we're going, switch the spaces accordingly
  // - If the toSpace is not empty, put the taken piece in the takenPieces array
  // - We check whether for this value of current and direction any pieces need
  //    to be put back on in the fromSpace
  // - We animate by creating a clone and moving it in absolute space between
  //    target and destination
  changeBoard(fromSpace, toSpace){
    let fromIndex; let toIndex
    if (this.direction === 1){
      fromIndex = this.getId(fromSpace); toIndex = this.getId(toSpace)
    } else {
      fromIndex = this.getId(toSpace); toIndex = this.getId(fromSpace)
    }
    let orig_copy = $("#"+fromIndex).children()
    let temp = orig_copy.clone()
    temp.appendTo('body')
    temp.css("display", "inline-block")
    if (!$("#"+toIndex).children().is('span')){
      let img_src = $("#"+toIndex).children().prop('src')
      img_src = "."+img_src.slice(img_src.length - 11, img_src.length)
      this.takenPieces.push([img_src, this.current, this.direction])
    }
    $("#"+toIndex).empty()
    let new_copy = orig_copy.clone().appendTo("#"+toIndex)
    new_copy.css("display", "inline-block")
    let oldOffset = orig_copy.offset()
    $("#"+fromIndex).empty().append("<span id='piece'></span>")
    let newOffset = new_copy.offset()
    for (let i = 0; i < this.takenPieces.length; i++){
      if (this.takenPieces[i][1] === this.current && this.takenPieces[i][2] !== this.direction){
        $("#"+fromIndex).empty().append(`<img id="piece" src=${this.takenPieces[i][0]}></img>`)
        $("#"+fromIndex).css("display", "inline-block")
      }
    }
    for (let i = 0; i < this.highlights.length; i++){
      if (this.highlights[i]){
        this.highlights[i].attr("class").includes("dark") ? this.highlights[i].css("border", "solid medium darkgrey") : this.highlights[i].css("border", "solid medium lightgrey")
      }
    }
    this.highlights[1] = $("#"+fromIndex); this.highlights[2] = $("#"+toIndex)
    $("#"+fromIndex).css("border", "medium solid green")
    $("#"+toIndex).css("border", "medium solid green")
    if (this.moves[this.current]["special_square"]){
      let special_square = [this.moves[this.current]["special_square"]["row"], this.moves[this.current]["special_square"]["col"]]
      $("#"+this.getId(special_square)).css("border", "medium solid red")
      this.highlights[0] = $("#"+this.getId(special_square))
    }
    temp
      .css('position', 'absolute')
      .css('left', oldOffset.left)
      .css('top', oldOffset.top)
      .css('zIndex', 1000)
      .css("display", "inline")
      .css("width", "25px")
      .css("height", "25px")
    new_copy.css("display", "none")
    temp.animate({'top': newOffset.top, 'left':newOffset.left}, this.delay, function(){
       new_copy.css("display", "inline-block")
       temp.remove()
    })
  }

}
