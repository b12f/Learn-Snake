var game = require('./snake');

var solver = function(gameObject){
    var directions = ["u","d","l","r"];
    return directions[Math.floor(Math.random() * directions.length)];
}

game.devMode = false;
game.on( "failed" , function(){
    console.log("Oh fuck I failed.");
    setTimeout(function(){
        game.init(100, 40);
        game.start();
    }, 1000);
});
game.setInputFunction(solver);
game.init(100, 40);
game.start();
