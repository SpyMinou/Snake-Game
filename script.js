let gameBoard = document.querySelector("#game") // importing the canvas in the js
let ctx = gameBoard.getContext("2d")            // selecting the context of the canva
let ScoreText = document.querySelector("#score")
let resetButton = document.querySelector("#startButton")

let width = gameBoard.width;
let height = gameBoard.height;

let highScore = getHighScore()
let highScoreT = document.querySelector("#highScore")

// setting the color of the background and snake and apple
const backgroundColor = "lightgrey"
const snakeColor = "green"
const snakeBorder = "black"
const appleColor = "red"

const unitSize = 25;     // the unit that were gonna use in the game is 25px

let running = false     // to check if the game is running or not

// setting the variables of moving 
let xVelocity = unitSize    // positive means right negative means left
let yVelocity = 0           // positive means up negative means down

// Setting the foor coordinates randomly at the startt of the game
let AppleXcoordinates;       
let AppleYcoordinates;
// Setting the score to 0
let score = 0

// the snake is going to be an array of objects (parts)
let snake = [
    {x:unitSize*4, y:0},   // head
    {x:unitSize*3, y:0},
    {x:unitSize*2, y:0},
    {x:unitSize*1, y:0},    
    {x:0, y:0}             // tail
]

window.addEventListener("keydown",changeDirection)
resetButton.addEventListener("click",ResetGame)


gameStart();

// to start the game
function gameStart() {
    
    running = true
    ScoreText.textContent = score
    highScoreT.textContent = highScore
    createApple()
    drawApple()
    nextClick()
}
// to determine the sense the snake gonna move
function nextClick() {
    if(running){
        setTimeout(() => {
           ClearBoard() 
           drawApple()
           moveSnake()
           DrawSnake()
           CheckGameOver()
           nextClick()
        }, 100);
    }else{
        CheckGameOver()
    }
}
// to repaint the gameBoard
function ClearBoard() {
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0,0,width,height)
}
// to randomly generate the plce of Apple 
function createApple() {
    function randomApple(min,max) {
        return Math.floor(Math.random()*(max-min)/unitSize) * unitSize
    }
    
    AppleXcoordinates = randomApple(0,width - unitSize)
    AppleYcoordinates = randomApple(0,height - unitSize)
}
// to draw the Apple at the random selected place
function drawApple() {
    ctx.fillStyle = appleColor;
    ctx.fillRect(AppleXcoordinates,AppleYcoordinates,unitSize,unitSize)
}
// to draw the snake body and shape
function DrawSnake() {
    ctx.fillStyle = snakeColor
    ctx.strokeStyle = snakeBorder
    snake.forEach(snakePart=>{
        ctx.fillRect(snakePart.x,snakePart.y,unitSize,unitSize)
        ctx.strokeRect(snakePart.x,snakePart.y,unitSize,unitSize)
    })
}
// to move the snake
function moveSnake() {
    let head = {x:snake[0].x+xVelocity,y:snake[0].y+yVelocity}
    snake.unshift(head)
    // if the head is touching the apple we dont change the snake heigh
    if (snake[0].x == AppleXcoordinates && snake[0].y == AppleYcoordinates) {
        
        createApple()            
        
        drawApple()
        score ++
        ScoreText.textContent = score

    } else {
        snake.pop()
    }
}
// to check if the game is over or not yet
function CheckGameOver() {
    if(snake[0].x<0 || snake[0].y<0 || snake[0].y==height || snake[0].x==width){
        running = false
        DisplayGameOver()

            SaveHighScore(score,highScore)
            

            highScore = getHighScore()
            highScoreT.textContent = highScore
            DisplayGameOver()
    }
    for (let i = 1; i < snake.length; i++) {
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y ){
            running = false
            ctx.fillStyle = "red"
            ctx.fillRect(snake[i].x,snake[i].y,unitSize,unitSize)
            

            SaveHighScore(score,highScore)

            highScore = getHighScore()
            highScoreT.textContent = highScore
            DisplayGameOver()
            break
        }
    }
}
// to Display when the game over
function DisplayGameOver() {
   ctx.font = "60px MV Boli" 
   ctx.fillStyle = "black"
   ctx.textAlign = "center"
   ctx.fillText("GAME OVER ! ",width/2,height/2)
}
function ResetGame() {
    running = false
    snake = [
        {x:unitSize*4, y:0},   // head
        {x:unitSize*3, y:0},
        {x:unitSize*2, y:0},
        {x:unitSize*1, y:0},    
        {x:0, y:0}             // tail
    ]
    

    xVelocity = unitSize    
    yVelocity = 0  
    score = 0

    gameStart()
}
function changeDirection(event){
    const goingUp = (yVelocity == -unitSize)
    const goingDown = (yVelocity == unitSize) 
    const goingRight = (xVelocity == unitSize)
    const goingLeft = (xVelocity == -unitSize)

    if (event.key == "ArrowUp" && !goingDown) {
        xVelocity = 0 
        yVelocity = -unitSize
    }else if(event.key == "ArrowDown" && !goingUp){
        xVelocity = 0
        yVelocity = unitSize
    }else if(event.key == "ArrowRight" && !goingLeft){
        xVelocity = unitSize
        yVelocity = 0
    }else if(event.key == "ArrowLeft" && !goingRight){
        xVelocity = -unitSize
        yVelocity = 0
    }
}
// lets save the highScore : 
function SaveHighScore(score,highScore) {
    
    if(score>highScore){
        highScore = score
        document.querySelector("#highScore").textContent = highScore
    }

    let date = new Date()
    date.setTime(date.getTime()+365*24*60*60*1000)

    let expires = "expires="+date.toUTCString()

    document.cookie = "highScore="+highScore+";"+expires+";path=/"
    

}

function getHighScore(){
    let Score = decodeURIComponent(document.cookie).split("; ")
    let highscore = 0
    Score.forEach((element)=>{
        if(element.split("=")[0]=="highScore"){

            if(element.split("=")[1]!="undefined"){
                highscore = element.substring("highscore".length+1)
                    console.log(document.cookie);

            }else if(element.split("=")[1]!=""){
                highscore = score
            }else{
                highScore = 0
            }
        }
        

    })
    
    return highscore
}