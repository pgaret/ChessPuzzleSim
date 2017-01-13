var simulator

$(document).ready(function(){
  $.ajax({
    dataType: 'json',
    url: 'https://chess-puzzles.herokuapp.com/api/v1/puzzles',
    success: function(results){
      $("#puzzle").html(results)
      for (let i = 0; i < results.length; i++){
        let puzzle_data = results[i]["game_board"]["Puzzle_No"]+" | "+results[i]["game_board"]["Rating"]+" | "+results[i]["game_board"]["Played_times"]
        let str = `<button onClick='simulate(${results[i]['ind']})'>${puzzle_data}</button><br>`
        $("#menu").append(str)
      }
    }
  })
})

function simulate(id){
  $.ajax({
    dataType: 'json',
    url: 'https://chess-puzzles.herokuapp.com/api/v1/puzzles/'+id,
    success: function(results){
      $("#menu").css("display", "none")
      $("#simulator_container").css("display", "block")
      $("#puzzle").html(results)
        simulator = new Simulation(results[0])
      }
  })
}

function runSim(){
  $("#pause").css("display", "inline-block")
  $("#play").css("display", "none")
  simulator.paused = false
  setTimeout(simulator.runSim(), 1)
}

function pauseSim(){
  simulator.paused = true
  $("#play").css("display", "inline-block")
  $("#pause").css("display", "none")
}

function changeSimOptions(speed, direction){
  simulator.delay = speed
  simulator.direction = direction
  simulator.paused = false
  if (!simulator.runningSim) {runSim()}
}
