var music = document.getElementById("music");
var controls = document.getElementById("controls");
var volume = document.createElement("input");
volume.type = "range";
controls.innerHTML="volume:";
controls.appendChild(volume);
var brickImage = new Image();
brickImage.src = "img/sausage.jpg";
var ballImage = new Image();
ballImage.src = "img/coin.png";
var paddleImage = new Image();
paddleImage.src = "img/paddle.jpg";

var pause = true;
volume.addEventListener("pointermove",updateVolume);
function updateVolume(ev) {
    music.volume = volume.value/100;
}
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

canvas.addEventListener("click",startgame);



function startgame(){
    draw();
    music.play();
}

ctx.font = "30px arial";
ctx.textAlign = "center";
ctx.fillText("klik om te starten", canvas.width/2, canvas.height/2);
// SNELHEID
var dx= 3.5;
var dy = -3.5;

// EIGENSCHAPPEN BAL
var ballRadius = 10;
var color = get_random_color();

// EIGENSCHAPPEN PADDLE
var paddleHeight = 10;
var paddleWidth = 75;

// EIGENSCHAPPEN BLOKKEN
var brickRowCount = 5;
var brickColumnCount = 3;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
// STARTCOÖRDINATEN
var x = canvas.width/2;
var y = canvas.height-30;
var paddleX = (canvas.width-paddleWidth)/2;
var paddleY = (canvas.height-paddleHeight);

// GEDRUKT OF NIET
var rightPressed = false;
var leftPressed = false;

// EVENTLISTENERS
document.onkeydown = keyDownHandler;
document.onkeyup = keyUpHandler;

function boxBallCollision(box,ball) {
    // console.log('dx: ' + dx);
    // console.log('dy: '+ dy);
    var has_hit=true;
    var hit_y= true;
    var hit_x= true;
    if (ball.x +ball.r < box.x )
    {
        console.log('hit block');
        has_hit=false;
        hit_x=false;
    }

    if (ball.x -ball.r > box.x + box.width)
    {
        has_hit=false;
        hit_x=false;
    }
    if(ball.y + ball.r < box.y)
    {
        has_hit=false;
        hit_y=false;
    }
    if(ball.y - ball.r > box.y + box.height)
    {
        has_hit=false;
        hit_y=false;
    }
    if(has_hit)
    {
        if(hit_x) {
            console.log("hit_x");
        }
        else
        {
            console.log("hit_y");
        }
    }

    return has_hit;
}


function collisionDetection(){
    for(var c=0; c<brickColumnCount; c++){
        for(var r=0; r<brickRowCount; r++){
            var b = bricks[c] [r];
            if(b.status == 1){
                b.width=brickWidth;
                b.height = brickHeight;
                var ball={};
                ball.x=x;
                ball.y=y;
                ball.r = ballRadius;
               if(boxBallCollision(b,ball))
               {
                   dy = Math.abs(dy);
                   b.status = 0;
                   dx += .3;
                   dy += .3;

               }
            }
        }
    }
}

var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1};
    }
}

function drawbricks(){
    for(c=0; c<brickColumnCount; c++){
        for(r=0; r<brickRowCount; r++ ){
            if(bricks [c][r].status == 1) {
                var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.drawImage(brickImage, brickX , brickY);
                ctx.closePath();
            }
        }
    }
}



function keyDownHandler(e) {
    if (e.keyCode == '39') {
        rightPressed = true;
    } else if (e.keyCode == '37') {
        leftPressed = true;
    }
}
function keyUpHandler(e){
    if (e.keyCode == '39'){
        rightPressed = false;
    } else if (e.keyCode == '37'){
        leftPressed = false;
    }
}

function get_random_color() {
var color = "rgb(";
color += Math.floor(Math.random() * 255) + ",";
color += Math.floor(Math.random() * 255) + ",";
color += Math.floor(Math.random() * 255) + ")";
return color;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
   ctx.drawImage(ballImage, x-10, y-10)
}

function drawPaddle() {
ctx.beginPath();
ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
ctx.drawImage(paddleImage, paddleX, paddleY);
ctx.closePath();
}



function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawbricks();
    drawBall();
    drawPaddle();
    collisionDetection();

    var box={};
    box.x=paddleX;
    box.y=paddleY;
    box.width = paddleWidth;
    box.height = paddleHeight;
    var ball={};
    ball.x=x;
    ball.y=y;
    ball.r= ballRadius;
    if(boxBallCollision(box, ball))
    {
        dy = -Math.abs(dy);
    }



        // bounce against walls
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
        color = get_random_color();
    }
    if (y + dy < ballRadius) {
        dy = -dy;
        color = get_random_color();
    } else if (y + dy > canvas.height - ballRadius)
    {
           alert ("GAME OVER \n \n klik op ok om opnieuw te beginnen");
            document.location.reload();
    }
    if(rightPressed && paddleX < canvas.width-paddleWidth){
        paddleX += 7;
    } else if(leftPressed && paddleX > 0){
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    window.requestAnimationFrame(draw);
}


