const c = document.getElementById("myCanvas");
const canvasHeight = c.height;
const canvasWidth = c.width;
const ctx = c.getContext("2d");
let circle_x = 160;
let circle_y = 60;
let radius = 10;
let xSpeed = 10;
let ySpeed = 10;
let ground_x = 100;
let ground_y = 595;
let ground_height = 5;
let brickArray = [];
let count = 0;
let brickNum = 30;

// min, max
function getRandomArbitrary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 25;
    this.height = 25;
    brickArray.push(this);
    this.visible = true;
  }

  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY <= this.y + this.height + radius &&
      ballY >= this.y - radius
    );
  }

  pickALocation() {
    let overlapping = false;
    let new_x;
    let new_y;
    let width = this.width;
    let height = this.height;
    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < brickArray.length; i++) {
        if (
          new_x <= brickArray[i].x + width &&
          new_x >= brickArray[i].x - width &&
          new_y <= brickArray[i].y + height &&
          new_y >= brickArray[i].y - height
        ) {
          console.log("overlapping...");
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      new_x = getRandomArbitrary(0, 950);
      new_y = getRandomArbitrary(0, 450);
      checkOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}

//制作所有的brick
for (let i = 0; i < brickNum; i++) {
  let myBrick = new Brick(
    getRandomArbitrary(0, 950),
    getRandomArbitrary(0, 450)
  );
  myBrick.pickALocation();
}

c.addEventListener("mousemove", (e) => {
  ground_x = e.clientX - 350;
});

function drawCircle() {
  // 确认球是否打到砖块
  brickArray.forEach((brick, index) => {
    if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
      count++;
      brick.visible = false;
      // 改变x, y方向速度，并且将brick从brickArray中移除
      // 从下方撞击
      if (circle_y >= brick.y + brick.height) {
        ySpeed *= -1;
      }
      // 从上方撞击
      else if (circle_y <= brick.y) {
        ySpeed *= -1;
      }
      // 从左侧撞击
      else if (circle_x <= brick.x) {
        xSpeed *= -1;
      }
      // 从右侧撞击
      else if (circle_x >= brick.x + brick.width) {
        xSpeed *= -1;
      }

      // brickArray.splice(index, 1);
      // if (brickArray.length == 0) {
      //   alert("游戏结束");
      //   clearInterval(game);
      // }
      if (count == brickNum) {
        alert("游戏结束");
        clearInterval(game);
      }
    }
  });

  // 确认球有没有打到地板
  if (
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + 200 + radius &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius
  ) {
    if (ySpeed > 0) {
      circle_y -= 50;
    } else {
      circle_y += 50;
    }
    ySpeed *= -1;
  }

  // 确认球有没有碰到边界
  if (circle_x >= canvasWidth - radius) {
    xSpeed *= -1;
  }
  if (circle_x <= radius) {
    xSpeed *= -1;
  }
  if (circle_y >= canvasHeight) {
    alert("游戏结束");
    clearInterval(game);
  }
  if (circle_y <= radius) {
    ySpeed *= -1;
  }

  // 更动圆的坐标
  circle_x += xSpeed;
  circle_y += ySpeed;

  // 画出黑色背景
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // 画出所有的brick
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  // 画出可控制的地板
  ctx.fillStyle = "orange";
  ctx.fillRect(ground_x, ground_y, 200, ground_height);

  // 画出圆球
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();
}

let game = setInterval(drawCircle, 25);
