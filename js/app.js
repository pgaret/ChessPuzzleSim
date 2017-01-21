var simulator
var uri = document.URL.includes("pgaret.github.io") ? 'https://chess-puzzles.herokuapp.com' : 'http://localhost:9393'

//Get all our puzzles so the user can pick the one they want
$(document).ready(function(){
  $("form")[0].action = uri+"/api/v1/puzzles"
  //Loading text since sometimes it takes a long while
  $("#loading").css("display", "block")
  $.ajax({
    dataType: 'json',
    url: uri+'/api/v1/puzzles',
    success: function(results){
      $("#loading").css("display", "none")
      for (let i = 0; i < results.length; i++){
        let puzzle_data = results[i]["puzzle_no"]+" | "+results[i]["rating"]+" | "+results[i]["played_times"]
        let str = `<button onClick='simulate("${results[i]['_id']['$oid']}")'>${puzzle_data}</button><br>`
        $("#menu").append(str)
      }
    }
  })
})

//Grab the sim data for the selected puzzle
function simulate(id){
  $.ajax({
    dataType: 'json',
    url: uri+'/api/v1/puzzles/'+id,
    success: function(results){
      $("#menu").css("display", "none")
      $("#simulator_container").css("display", "block")
        simulator = new Simulation(results[0])
      }
  })
}

//While we run the sim, the pause button should be visible and not the play button
function runSim(){
  $("#pause").css("display", "inline-block")
  $("#play").css("display", "none")
  setTimeout(simulator.runSim(), 1)
}

//Invert that over here
function pauseSim(){
  $("#play").css("display", "inline-block")
  $("#pause").css("display", "none")
  simulator.paused = true
}

function changeSimOptions(speed, direction){
  simulator.delay = speed
  simulator.direction = direction
  simulator.paused = false
  //If the sim is already running, just change the values
  //Otherwise we'll need to get it running again
  if (!simulator.runningSim) {setTimeout(runSim(), simulator.delay)}
}

//Step the sim in a direction once
//Changing directions requires a double adjustment for current
//   - Happens here on line 63 & line 41 in Simulation.js
function stepSim(num){
  simulator.paused = true
  simulator.step = true
  if (num !== simulator.direction) { simulator.current += num }
  simulator.direction = num
  simulator.delay = 500
  runSim()
}

function addPuzzle(){
  $("#menu").css("display", "none")
  $("#insert").css("display", "block")
}
