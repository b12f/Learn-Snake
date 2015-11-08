var game = require('./snake.js').game;

var solver = function(gameObject){
    var directions = ["u","d","l","r"];
    return directions[Math.floor(Math.random() * directions.length)];
}

game.devMode = false;
game.on( "failed" , function(){
    console.log("Oh fuck I failed.");
});
game.setInputFunction(solver);
game.init(100, 40);
game.start();
