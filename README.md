# snake.js
Snake game with solver API for JS beginners to learn programming.

## Variables

### bool game.devMode
    default: false

You can set this to either true or false to toggle the display of the grid in the console. Devmode makes sure the grid doesn't get displayed so you can output your console log by hand.

### int game.updateTime
    default: 20

Time between gamesteps in ms.

## Methods

###game.setInputFunction(function inputFunction)

Should be called with an inputFunction that returns either "r", "l", "u" or "d" for right, left, up, down respectively. inputFunction will receive a game object as a parameter, with the following properties:

    int width
    int height
    array grid
        (Array of Arrays, with each parent array representing a row and containing another array of column fields)
    array snake
        (Array of objects: {x: xPosition, y: yPosition}. The earliest entry is the tail, the last the head.)

Changes made to this object will not result in changes to the game.

### game.on(string event, function callback)

Should be called when you want to do something when one of the following events happens:
- beforeStep
- afterStep
- afterInit
- failed

Will receive the same game object as your inputFunction.

### game.off(string event)

Clears all event listeners for the given event.

### game.init(int width, int height)

Initializes the game board with height and width (both >=20).

### game.start()

Starts the game.

### game.pause()

Pauses the game.

### game.log(string message)

Will log all messages you provide it with to display under Log data, in case you want to display log data while showing the grid. Messages will be collected per gamestep and displayed as follows:

    message1 | message2 | message3[| nextmessage ]

### game.showGrid()

Clears the console, draws the gameboard.
