let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let characters = [];

function Character(position, size, vector, length) {
  this.size = size;
  this.vector = vector;
  this.position = position;
  this.vector.direction = vector.direction;
  this.vector.magnitude = vector.magnitude;
  this.length = length;
}

let gridSize = { x: 17, y: 15 };
canvas.width = window.innerHeight + (window.innerHeight / gridSize.y * 2);
canvas.height = window.innerHeight;
let cellSize = canvas.height/gridSize.y;
let snake = [];
let xRandom = Math.random() * canvas.width;
let xRemainder = xRandom % (cellSize);
let yRandom = Math.random() * canvas.height;
let yRemainder = yRandom % (cellSize);
let debounce = true;
let pos = { x: 0, y: 0 };
let apple = {
  position: [xRandom - xRemainder, yRandom - yRemainder],
  size: cellSize,
};

appleImage = new Image();
appleImage.src = 'apple.png';

let player = new Character([0, 0], cellSize, { magnitude: cellSize, direction: [1, 0] }, 3);

document.addEventListener("keydown", function (event) {
  if (debounce) {
    //Experimental code (player.position[0] += player.position[0] % (cellSize);)
    switch (event.keyCode) {
      case 38:
      case 87:
        if (player.vector.direction[1] == 0) {
          //player.position[0] += player.position[0] % (cellSize);
          player.vector.direction = [0, -1];
          debounce = false;
        }
        break;
      case 37:
      case 65:
        if (player.vector.direction[0] == 0) {
          //player.position[1] += player.position[1] % (cellSize);
          player.vector.direction = [-1, 0];
          debounce = false;
        }
        break;
      case 40:
      case 83:
        if (player.vector.direction[1] == 0) {
          //player.position[0] += player.position[0] % (cellSize);
          player.vector.direction = [0, 1];
          debounce = false;
        }
        break;
      case 39:
      case 68:
        if (player.vector.direction[0] == 0) {
          //player.position[1] += player.position[1] % (cellSize);
          player.vector.direction = [1, 0];
          debounce = false;
        }
        break;
    }
  }
});

snake.push([player.position[0], player.position[1]]);
snake.push([player.position[0]-player.size, player.position[1]]);
snake.push([player.position[0]-(player.size*2), player.position[1]]);

setInterval(function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (snake.length < player.length) {
    snake.push([player.position[0], player.position[1]]);
  } else {
    snake.shift(); // Deletes first element of array
    snake.push([player.position[0], player.position[1]]);
  }
  if (Math.round(player.position[0]) == Math.round(apple.position[0]) && Math.round(player.position[1]) == Math.round(apple.position[1])) {
    loop1:
    while(true) {
      let xRandom = Math.random() * canvas.width;
      let xRemainder = xRandom % (cellSize);
      let yRandom = Math.random() * canvas.height;
      let yRemainder = yRandom % (cellSize);
      apple.position = [xRandom - xRemainder, yRandom - yRemainder];
      loop2:
	    for (let i = 0; i < snake.length; i++) {
        if (Math.round(snake[i][0]) == Math.round(apple.position[0]) && Math.round(snake[i][1]) == Math.round(apple.position[1])) {
          continue loop1;
        }
        if (i == snake.length-1) {
          break loop1;
        }
      }
    }
    player.length += 1;
  } else if (player.position[0] < 0 || player.position[0] >= canvas.width) {
      player = new Character([-cellSize, 0], cellSize, { magnitude: cellSize, direction: [1, 0] }, 3);
      snake.splice(0, snake.length);
  } else if (player.position[1] < 0 || player.position[1] >= canvas.height - 1) {
     player = new Character([-cellSize, 0], cellSize, { magnitude: cellSize, direction: [1, 0] }, 3);
     snake.splice(0, snake.length);
  }
  for (let i = 0; i < snake.length; i++) {
    if (i !== snake.length - 1) {
      if (player.position[0] == snake[i][0] && player.position[1] == snake[i][1]) {
        player = new Character([-cellSize, 0], cellSize, { magnitude: cellSize, direction: [1, 0] }, 3);
        snake.splice(0, snake.length);
      }
    }
  }

  ctx.fillStyle = '#a8d85b';
  pos.x = 0;
  pos.y = 0;
  for (let i = 0; i < gridSize.x; i++) {
    for (let v = 0; v < gridSize.y; v++) {
      ctx.fillRect(pos.x,pos.y,cellSize+1,cellSize+1);
      pos.y += cellSize;
      if (ctx.fillStyle == '#a8d85b') {
        ctx.fillStyle = '#a0d254';
      } else {
        ctx.fillStyle = '#a8d85b';
      }
    }
    pos.x += cellSize;
    pos.y = 0;
  }

  ctx.fillStyle = '#577bf3';
  for (let i = 0; i < snake.length; i++) {
    ctx.fillRect(snake[i][0], snake[i][1], player.size+1, player.size+1);
  }
  ctx.fillStyle = "#e5421f";
  ctx.drawImage(appleImage, apple.position[0], apple.position[1],apple.size,apple.size);
  player.position[0] += player.vector.direction[0] * player.vector.magnitude;
  player.position[1] += player.vector.direction[1] * player.vector.magnitude;
  debounce = true;
}, 120);
