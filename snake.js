/* Node snake */

/* API:

- Start function
- Start event
- End event
- Step event
*/



module.exports = {
    width: 20,
    height: 20,
    updateTime: 20,
    grid: [],
    listeners: {},
    givenHistory: [],
    directionHistory: [],
    lastDirection: "r",
    snake: Array(10),
    getInput: null,
    devMode: false,
    currentLog: [],
    gameInterval: null,
    // init board and snake
    init: function(x, y) {
        var x = x<20?20:x;
        var y = y<20?20:y;
        this.width = x;
        this.height = y;
        this.grid = Array.apply(null, Array(x)).map(function() {
            return Array.apply(null, Array(y)).map(function() { return 0; });
         });

        for(var i=0; i<this.snake.length;i++){
            this.snake[i] = {x: i+5, y: 10};
            this.setState(i+5, 10, 1);
        }

        this.spawnFruit();
        this.fireEvent("afterInit");

        this.givenHistory = [];
        this.directionHistory = [];
        this.currentLog = [];
        this.lastDirection = "r";

        this.showGrid();

    },
    logStep: function(){
        this.currentLog.push("");
    },
    log: function(message){
        this.currentLog[this.currentLog.length-1] = this.currentLog[this.currentLog.length-1] +"| "+message+" ";
    },
    setInputFunction: function(inputFunction){
        this.getInput = inputFunction;
    },
    start: function(){
        var that = this;
        this.gameInterval = setInterval(function(){
            that.gameStep.apply(that);
        }, this.updateTime);
    },
    pause: function(){
        clearInterval(this.gameInterval);
    },
    //Game Step
    gameStep: function(){
        var that = this;
        that.fireEvent("beforeStep");
        nextDirection = that.getInput({
            width: that.width,
            height: that.height,
            grid: that.grid,
            snake: that.snake
        });

        if(typeof(nextDirection)!=="string"){
            nextDirection = "X";
        }

        that.givenHistory.push(nextDirection);
        if( (that.lastDirection === "u" && nextDirection === "d") ||
            (that.lastDirection === "d" && nextDirection === "u") ||
            (that.lastDirection === "l" && nextDirection === "r") ||
            (that.lastDirection === "r" && nextDirection === "l") ||
            (nextDirection!=="d" && nextDirection!=="u" && nextDirection!=="l" && nextDirection!=="r")
        ){
            nextDirection = that.lastDirection;
        }

        that.directionHistory.push(nextDirection);
        that.lastDirection = nextDirection;

        var snakeHeadPos = that.getSnakeHeadPos();

        switch(nextDirection){
            case "u":
                var nextPos = { x: snakeHeadPos.x, y: (snakeHeadPos.y-1) };
            break;
            case "d":
                var nextPos = { x: snakeHeadPos.x, y: (snakeHeadPos.y+1) };
            break;
            case "l":
                var nextPos = { x: (snakeHeadPos.x-1), y: snakeHeadPos.y };
            break;
            case "r":
                var nextPos = { x: (snakeHeadPos.x+1), y: snakeHeadPos.y };
            break;
        }

        var nextPosState = that.checkState(nextPos.x, nextPos.y);
        if( nextPosState === 3 || nextPosState === 1 || nextPos.x < 0 || nextPos.y < 0 || nextPos.y >= that.height || nextPos.x >= that.width ){
            //collission
            console.log("FAILED! Achieved length "+ that.snake.length);
            that.pause();
            that.fireEvent("failed");
            return false;
        }
        else {

            that.snake.push(nextPos);
            that.grid[nextPos.x][nextPos.y] = 1;

            if(nextPosState !== 2){
                var tailPos = that.snake.shift();
                that.setState(tailPos.x, tailPos.y, 0);
            }
            else{
                that.spawnFruit();
            }

            that.fireEvent("afterStep");
            that.showGrid();
            that.logStep();
        }
    },
    // Check state of position
    checkState: function(x, y){
        if(this.grid[x] !== undefined){
            if(this.grid[x][y] !== undefined){
                return this.grid[x][y];
            }
        }
        return 3;
    },
    setState: function(x, y, state){
        this.grid[x][y] = state;
    },
    // show the board
    showGrid: function(){
        if(this.devMode){return;}
        this.clear();

        var borderTop = "┏";
        for(var i=0; i<this.width; i++){
            borderTop += "━";
        }
        borderTop += "┓-I-O- Log data:";
        console.log(borderTop);

        for(var i=0; i<this.height; i++){
            var row = "┃";
            for(var j=0; j<this.width; j++){
                var state = this.checkState(j, i);
                if(state === 0){
                    row += " ";
                }
                else if(state === 1){
                    row += "█";
                }
                else if(state === 2){
                    row += "▲";
                }
                else {
                    row += "E";
                }
            }
            row += "┃";

            var historyIndex = this.directionHistory.length-i-1;
            if(this.directionHistory[historyIndex] !== undefined){
                row += " "+this.directionHistory[historyIndex];
            }
            else {
                row += "  ";
            }

            var historyIndex = this.givenHistory.length-i-1;
            if(this.givenHistory[historyIndex] !== undefined){
                row += " "+this.givenHistory[historyIndex];
            }
            else {
                row += "  ";
            }

            var logIndex = this.currentLog.length-i-1;
            if(this.currentLog[logIndex] !== undefined){
                row += "  "+this.currentLog[logIndex];
            }
            else {
                row += "  ";
            }

            console.log(row);
        }

        var borderBottom = "┗";
        for(var i=0; i<this.width; i++){
            borderBottom += "━";
        }
        borderBottom += "┛";
        console.log(borderBottom);

        console.log("Current length: "+ this.snake.length);
    },
    // Spawn a piece of fruit
    spawnFruit: function(){
        if(this.hasFruit()){return;}
        var empties = this.getOfState(0);
        var pos = Math.floor(Math.random() * empties.length);
        var fruitPos = empties[pos];
        this.setState(fruitPos.x, fruitPos.y, 2);
    },
    //Check if the board has fruit
    hasFruit: function(){
        return this.getOfState(2).length!==0;
    },
    getSnakeHeadPos: function(){
        return this.snake[this.snake.length-1];
    },
    //Get all grid positions with given state
    getOfState: function(state){
        var found = [];
        this.grid.forEach(function(xArray, xIndex){
            xArray.forEach(function(gridPosition, yIndex){
                if(gridPosition===state){
                    found.push({x: xIndex, y:yIndex});
                }
            });
        });
        return found;
    },
    fireEvent: function(event){
        if(!Array.isArray(this.listeners[event])){
            this.listeners[event] = [];
        }
        this.listeners[event].forEach(function(evFn){
            var info = {
                width: this.width,
                height: this.height,
                grid: this.grid,
                snake: this.snake
            };
            info = JSON.parse(JSON.stringify(info));
            evFn(info);
        }, this);
    },
    on: function(event, evFn){
        if(!Array.isArray(this.listeners[event])){
            this.listeners[event] = [];
        }

        this.listeners[event].push(evFn);
    },
    off: function(event){
        delete this.listeners[event];
    },
    //Clear the console window
    clear: function() {
      process.stdout.write('\u001B[2J\u001B[0;0f');
    }
};
