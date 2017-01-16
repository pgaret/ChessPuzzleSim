var simulator

$(document).ready(function(){
  $.ajax({
    dataType: 'json',
    url: 'https://chess-puzzles.herokuapp.com/api/v1/puzzles',
    success: function(results){
      $("#puzzle").html(results)
      for (let i = 0; i < results.length; i++){
        let puzzle_data = results[i]["Puzzle_No"]+" | "+results[i]["Rating"]+" | "+results[i]["Played_times"]
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
  setTimeout(simulator.runSim(), 1)
}

function pauseSim(){
  $("#play").css("display", "inline-block")
  $("#pause").css("display", "none")
  simulator.paused = true
}

function changeSimOptions(speed, direction){
  simulator.delay = speed
  simulator.direction = direction
  simulator.paused = false
  if (!simulator.runningSim) {setTimeout(runSim(), simulator.delay)}
}

function stepSim(num){
  simulator.paused = true
  simulator.step = true
  if (num !== simulator.direction) { simulator.current += num }
  simulator.direction = num
  simulator.delay = 500
  runSim()
}
