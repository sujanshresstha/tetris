document.addEventListener('DOMContentLoaded', () =>{
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('.start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]

    //The Tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],             //[01,11,21,02]
        [width, width+1, width+2, width*2+2],   //[10,11,12,22]
        [1, width+1, width*2+1, width*2],       //[01,11,21,20]
        [width, width*2, width*2+1, width*2+2]  //[10,20,21,22]
    ]

    const zTetromino = [
        [0, 1, width+1, width+2],               //00 01 11 12
        [2, width+2, width+1, width*2+1],       //02 12 11 21
        [width*2+2, width*2+1, width+1, width], //22 21 11 10
        [1, width+1, width, width*2]          //01 11 10 20
    ]

    const tTetromino = [
        [1,width, width+1, width+2],            //01 10 11 12
        [1, width+1, width+2, width*2+1],       //01 11 12 21
        [width, width+1, width+2, width*2+1],   //10 11 12 21 
        [1, width, width+1, width*2+1]          //01 10 11 21
    ]

    const oTetromino = [
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1],
        [0, 1, width, width+1]
    ]

    const iTetromino = [
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3],
        [1, width+1, width*2+1, width*3+1],
        [width, width+1, width+2, width+3]
    ]

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4
    let currentRotation = 0

    //randomly select a Tetromino and its first rotation
    let random = Math.floor(Math.random()*theTetrominoes.length)

    let current = theTetrominoes[random][currentRotation]

    //drw the tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    //undraw the tetromino
    function undraw(){
        current.forEach(index =>{
            squares[currentPosition + index].classList.remove('tetromino')
            squares[currentPosition + index].style.backgroundColor = ''
        })
    }

    //move down tetromino every second
    // timerId = setInterval(moveDown, 1000)

    //assign funtion to keyCodes
    function control(e){
        if(e.keyCode === 37){
            moveLeft()
        } 
        else if(e.keyCode === 38){
            rotate()
        }
        else if(e.keyCode === 39){
            moveRight()
        }
        else if(e.keyCode === 40){
            moveDown()
        }
    }
    document.addEventListener('keyup', control)

    //move down function
    function moveDown(){
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    //freeze funtion
    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
    
            //start a new tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }
    
    //move the tetromono left, unless is at the edge or there is blokedge
    function moveLeft(){
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if(!isAtLeftEdge) currentPosition -= 1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition += 1
        }
        draw()
    }

    //move the tetromono right, unless is at the edge or there is blokedge
    function moveRight(){
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === width-1)

        if(!isAtLeftEdge) currentPosition += 1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -= 1
        }
        draw()
    }

    //rotate the tetromino
    function rotate(){
        undraw()
        currentRotation ++
        if(currentRotation == current.length){
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        draw()
    }

    //show up-nex tetromino in mini-grid display
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0

    //the Tetrominos without rotations
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2],
        [0, displayWidth, displayWidth+1, displayWidth*2+1],
        [1, displayWidth, displayWidth+1, displayWidth+2],
        [0, 1, displayWidth, displayWidth+1],
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
    ]

    //display the shape in the mini-grid display
    function displayShape(){
        //remove any trave of a tetromino from the entire grid 
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = ''
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    //add functionality to the button
    startBtn.addEventListener('click', () => {
        if(timerId){
            clearInterval(timerId)
            timerId = null
        } 
        else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()
        }
    })



    //add score
    function addScore(){
        for(let i = 0; i < 199; i += width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

            if(row.every(index => squares[index].classList.contains('taken'))){
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index=> {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    //game over
    function gameOver(){
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
        }
    }




})
