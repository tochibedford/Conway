/*
    Author = Tochi Bedford
    Title = Conway's Game of Life implementation with DOM elements
*/

const app = document.querySelector(".app");

const cellSize = 30; // length of one side of a cell in pixels
let gridWidth = Math.floor(app.offsetWidth/cellSize); // calculate number of cells in a row based on container width
let gridHeight = Math.floor(app.offsetHeight/cellSize); // calculate number of rows based on container height

let interval;
let mainBoard;

window.addEventListener('resize', ()=>{
    // clears all cells from DOM then repopulates DOM with correct number of cells
    clearInterval(interval);

    gridWidth = Math.floor(app.offsetWidth/cellSize);
    gridHeight = Math.floor(app.offsetHeight/cellSize);
    clearDom();
    setUpGrid();
    mainBoard = new Board(gridWidth, gridHeight);

    interval = setInterval(()=>{
        affectDom(app, mainBoard.board);
        mainBoard.boardSlider();
        mainBoard.calculateNextGeneration();
    },100)
})

const affectDom = (gridContainer, board)=>{
    // applies board state to the DOM
    board.forEach(row=>{
        row.forEach(cell=>{
            if(cell.isAlive()){
                gridContainer.children[cell.cellNumber].setAttribute("cell-state", "alive")
            }else{
                gridContainer.children[cell.cellNumber].setAttribute("cell-state", "dead")
            }
        })
    })
}


const clearDom = ()=>{
    // removes all cells from the DOM 
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell=>{
        cell.parentElement.removeChild(cell);
    });
};

const setUpGrid = ()=>{
    // calculates number of cells to put in DOM and puts them in
     
    for(let i=0; i<(gridWidth*gridHeight); i++){
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("cellNumber", i);
        app.appendChild(cell);
    };
};

class Cell{
    // Defines a cell class
    constructor(cellNumber, initialState){
        this.cellNumber = cellNumber;
        this.cellState = initialState;
    };

    isAlive(){
        return this.cellState?1:0;
    };
};

class Board{
    // this defines the actual Board Class which contains most of the functionality
    constructor(width, height, random=true){
        this.width = width;
        this.height = height;
        this.random = random;
        this.board = [];
        this.createCells();
        this.length = this.board.length;
        this.surroundingsMap = [];
    }

    createCells(){
        /* creates and loads the board array with cell objects in a 2D array form
        for example a 4x4 board will be represented as:
        board = [
                    [cell, cell, cell, cell],
                    [cell, cell, cell, cell],
                    [cell, cell, cell, cell],
                    [cell, cell, cell, cell],
                ]

            
        */
        const lengthOfBoard = this.width*this.height;
        let cellNumber = 0;
        for(let i = 0; i<this.height; i++){
            const row = [];
            for(let j=0; j<this.width; j++){
                const cell = new Cell(cellNumber, Math.floor(Math.random()*2));
                row.push(cell)
                cellNumber++;
            }
            this.board.push(row)
        }
    }

    getBoardState(){
        // gets the current state of the board in 1's and 0's and returns it
        const boardState = [];
        this.board.forEach(row=>{
            const newRow = [];
            row.forEach(cell=>{
                newRow.push(cell.isAlive());
            })
            boardState.push(newRow);
        })
        return boardState;
    }

    printBoardState(){
        /* prints the state of the board gotten from getBoardState, 
        in an easy to read string format */

        const boardState = this.getBoardState();
        const rowString = []
        boardState.forEach(row=>{
            rowString.push(row.join(" "))
        })
        console.log(rowString.join("\n"))
    }

    boardSlider(){
        /* 
            a 3x3 sliding window that creates a representation of the board in terms of
            how many living cells surround each cell. this is use to calculate the next generation
        */
        this.surroundingsMap=[];
        for(let j=0; j<this.height; j++){
            const row = []
            for(let i=0; i<this.width; i++){
                const slider = {
                    topLeft: 0,
                    top: 0,
                    topRight: 0,
                    left: 0,
                    right: 0,
                    bottomLeft: 0,
                    bottom: 0,
                    bottomRight: 0,
                }
                if(j===0){
                    // when the sliding window is at the top row of cells, it can no longer be 3x3
                    if(i===0){
                        // when sliding window is at top row but also at the left-most column
                        slider.right = this.board[j][i+1];
                        slider.bottom = this.board[j+1][i];
                        slider.bottomRight = this.board[j+1][i+1];
                    }
                    else if(i===this.width-1){
                        // when sliding window is at top row but also at the right-most column
                        slider.left = this.board[j][i-1];
                        slider.bottomLeft = this.board[j+1][i-1];
                        slider.bottom = this.board[j+1][i];
                    }else{
                        // when sliding window is at top row but not at the left or right-most column
                        slider.left = this.board[j][i-1];
                        slider.right = this.board[j][i+1];
                        slider.bottomLeft = this.board[j+1][i-1];
                        slider.bottom = this.board[j+1][i];
                        slider.bottomRight = this.board[j+1][i+1];
                    }
                }else if(j===this.height-1){
                    // when the sliding window is at the bottom row of cells, it can no longer be 3x3
                    if(i===0){
                        // when sliding window is at bottom row but also at the left-most column
                        slider.top = this.board[j-1][i];
                        slider.topRight = this.board[j-1][i+1];
                        slider.right = this.board[j][i+1];
                    }else if(i===this.width-1){
                        // when sliding window is at bottom row but also at the right-most column
                        slider.topLeft = this.board[j-1][i-1];
                        slider.top = this.board[j-1][i];
                        slider.left = this.board[j][i-1];
                    }else{
                        // when sliding window is at bottom row but not at the left or right-most column
                        slider.topLeft = this.board[j-1][i-1];
                        slider.top = this.board[j-1][i];
                        slider.topRight = this.board[j-1][i+1];
                        slider.left = this.board[j][i-1];
                        slider.right = this.board[j][i+1];
                    }
                }else{
                    if(i===0){
                        // when sliding window is not at top or bottom row, but is at the left most column
                        slider.top = this.board[j-1][i];
                        slider.topRight = this.board[j-1][i+1];
                        slider.right = this.board[j][i+1];
                        slider.bottom = this.board[j+1][i];
                        slider.bottomRight = this.board[j+1][i+1];
                    }else if(i===this.width-1){
                        // when sliding window is not at top or bottom row, but is at the right most column
                        slider.topLeft = this.board[j-1][i-1];
                        slider.top = this.board[j-1][i];
                        slider.left = this.board[j][i-1];
                        slider.bottomLeft = this.board[j+1][i-1];
                        slider.bottom = this.board[j+1][i];
                    }else{
                        // when sliding window is not at top or bottom row and not at left or right most column
                        slider.topLeft = this.board[j-1][i-1];
                        slider.top = this.board[j-1][i];
                        slider.topRight = this.board[j-1][i+1];
                        slider.left = this.board[j][i-1];
                        slider.right = this.board[j][i+1];
                        slider.bottomLeft = this.board[j+1][i-1];
                        slider.bottom = this.board[j+1][i];
                        slider.bottomRight = this.board[j+1][i+1];
                    }
                }
                
                let sum = 0;
                const arr = Object.values(slider);
                for(let x=0; x<arr.length; x++){
                    
                    if (arr[x].isAlive){
                        sum += arr[x].isAlive();
                    }
                    else{
                        sum += arr[x]
                    }
                }
                row.push(sum);
            }
            this.surroundingsMap.push(row);
        }
        
        return this.surroundingsMap;
    }

    calculateNextGeneration(){
        /* 
            using the standard conways game of life rules, 
            this function calculates for and changes the states of the cells towards the next generation based on the surrounding map  
        */
        this.board.forEach((row, j)=>{
            row.forEach((cell, i)=>{
                if(cell.isAlive()){
                    if(this.surroundingsMap[j][i]<2){
                        cell.cellState = 0;
                    }else if(this.surroundingsMap[j][i]>3){
                        cell.cellState = 0;
                    }
                    else if(this.surroundingsMap[j][i] === 2 || this.surroundingsMap[j][i] === 3 ){
                        // do nothing, let live
                    }
                }else{
                    if(this.surroundingsMap[j][i] === 3){
                        cell.cellState = 1;
                    }
                }
            })
        })
    }

    setCellManually(cellNumber){
        /*
            allows a cell to be set manually, 
            changes cell[cellNumber] state to alive if already dead
            and vice versa 
        */
        this.board.forEach(row=>{
            row.forEach(cell=>{
                if((cell.cellNumber === parseInt(cellNumber)) && cell.isAlive()){
                    cell.cellState = 0;
                }else if((cell.cellNumber === parseInt(cellNumber)) && !cell.isAlive()){
                    cell.cellState = 1;
                }
            })
        })
    }

    
}


setUpGrid();
mainBoard = new Board(gridWidth, gridHeight);

window.addEventListener('click', (e)=>{
    if(e.target.classList.contains("cell")){
        mainBoard.setCellManually(e.target.getAttribute("cellnumber"));
    }
})
interval = setInterval(()=>{
    // every 100 milliseconds this recaulculates the cells of the board and redraws the DOM 
    affectDom(app, mainBoard.board);
    mainBoard.boardSlider();
    mainBoard.calculateNextGeneration();
},100)
