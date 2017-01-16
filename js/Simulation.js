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

  runSim(){
    this.runningSim = true
    setTimeout(function render(){
      if (!simulator.paused || simulator.step === true){
        // debugger
        if (simulator.current < 0 && simulator.direction === 1) { simulator.current = 0 }
        if (simulator.current > simulator.moves.length-1 && simulator.direction === -1) { simulator.current = simulator.moves.length - 1 }

        if (simulator.current > -1 && simulator.current < simulator.moves.length){
        // if ((simulator.direction > 0 && simulator.current > -2 && simulator.current < simulator.moves.length-1) || (simulator.direction < 0 && simulator.current > -2 && simulator.current+1 < simulator.moves.length)){
          let fromSpace = [simulator.moves[simulator.current]["last_move_squares"]["from"]["row"], simulator.moves[simulator.current]["last_move_squares"]["from"]["col"]]
          let toSpace = [simulator.moves[simulator.current]["last_move_squares"]["to"]["row"], simulator.moves[simulator.current]["last_move_squares"]["to"]["col"]]
          simulator.changeBoard(fromSpace, toSpace)
          this.runningSim = false
          simulator.current += simulator.direction
          console.log("Next sim: "+simulator.direction+" "+simulator.current)
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

  getId(space){
    return this.board_size[1]*(space[0])+(space[1])
  }

  setBoard(rows, cols, pieces, special_square){
    $("#simulator").empty()
    while (pieces.includes('/')){pieces = pieces.replace('/', '')}
    for (let i = 0; i < rows; i++){
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
        $("#simulator").append(`<span id=${i*this.board_size[1]+j} class='${space_class}'>${img_src}</span>`)
        if (j === cols - 1) {$("#simulator").append("<br>")}
      }
    }
  }

  changeBoard(fromSpace, toSpace){
    // debugger
    let fromIndex; let toIndex
    if (this.direction === 1){
      fromIndex = this.getId(fromSpace); toIndex = this.getId(toSpace)
    } else {
      fromIndex = this.getId(toSpace); toIndex = this.getId(fromSpace)
    }
    let orig_copy = $("#"+fromIndex).children()
    let temp = orig_copy.clone().appendTo('body')
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
        // debugger
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
    if (this.current === -1) { if (this.game_board["board"]["special_square"]){
      // debugger
      let special_square = [this.game_board["board"]["special_square"]["row"], this.game_board["board"]["special_square"]["col"]]
      $("#"+this.getId(special_square)).css("border", "medium solid red")
      this.highlights[0] = $("#"+this.getId(special_square))
    } }
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
