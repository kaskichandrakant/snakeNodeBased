const charm = require('charm')();
const readline = require('readline');
const Event = require('events');
let inputEvent = new Event();
//some initialised values for display.
let lastPositionX = 100;
let lastPositionY = 30;
//some initialised values for snake.
let input = "right"; //first direction.
let food = [15, -19]; //first food pos.
let snake = [
  [23, -12]
]; //snake's initial position.
let last = snake[snake.length - 1];
let score = 00;

//createBorder for the game.
let createBorder = function (cols, row, symbol) {
  let space = row - 2;
  console.log(symbol.repeat(cols));
  for (let i = 0; i < space; i++) {
    console.log(symbol + " ".repeat(cols - 2) + symbol);
  }
  console.log(symbol.repeat(cols));
}
console.clear();
charm.reset(0, -2); //start drawing border from this position.
createBorder(lastPositionX, lastPositionY, "#"); //this will draw the borders for game.

//this part will used to accept the arrow keys and acordingly do some events.
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && (key.name == "d" || key.name == "c"))
    process.exit(0);
  input = key.name;
})//ctrl c to close game at any pt.
let size = process.stdout.getWindowSize();
charm.pipe(process.stdout);


let printFood = function (foodPos, char) {
  charm.position(foodPos[0], foodPos[1]).foreground('green').write(char);
  charm.position(0, 32).foreground('yellow').write('your score is- ' + score.toString())
} //this function will print the food at some position.

function updateFoodPos(foodPos, head) {
  if (head[0] == food[0] && head[1] == food[1]) {
    score += 10
    printFood(food, ' ');
    foodPos[0] = Math.floor((Math.random(3) * (lastPositionX - 3)))
    foodPos[1] = Math.floor((Math.random(3) * (lastPositionY - 3)) * -1)
    snake.push(last);
  }
  printFood(foodPos, '@');
}
//this function will print the food at random position.

let snakeDirectionData = {
  'right': ['>', 0, 1],
  'left': ['<', 0, -1],
  'down': ['v', 1, -1],
  'up': ['^', 1, 1]
} //this is an eventObject.

let updateSnake = function () {
  inputEvent.emit(input);
} //this will update the snake position.

function moveSnake() {
  last = snake[snake.length - 1];
  charm.position(last[0], last[1]).write(' ');
  let head = [snake[0][0], snake[0][1]];
  let data = snakeDirectionData[input];
  updateFoodPos(food, head);
  snake.pop();
  head[data[1]] += data[2];
  snake.unshift(head);
  printSnake(snake, data[0]);
}//changing the snake position from one point to another.


let printSnake = function (snake, head) {
  let tail = snake.slice(1)
  let snakehead = snake[0]
  let kill = tail.find(function (element) {
    return element[0] == snakehead[0] && element[1] == snakehead[1]
  })
  //condition to not eat its own tail
  if (kill) {
    process.exit()
  }
  writeAtPos(snake[0], head);
  if (snake[0][0] == 1 || snake[0][0] == lastPositionX || snake[0][1] == -1 || snake[0][1] == -lastPositionY) {
    charm.position(50, 18).write('Game Over.....');
    process.exit()
  }//condition to not touch the wall border

  snake.slice(1).forEach(function (pos) {
    return writeAtPos(pos, '*');
  })
};//printing the whole snake.

let writeAtPos = function (pos, char) {
  charm.position(...pos).foreground('cyan').write(char);
}


//events for keypress which will give direction to the snake.

inputEvent.on('right', moveSnake);
inputEvent.on('left', moveSnake);
inputEvent.on('up', moveSnake);
inputEvent.on('down', moveSnake);

setInterval(updateSnake, 100); //this is where the game will start.