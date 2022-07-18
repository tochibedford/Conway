const app = document.querySelector(".app");

window.addEventListener('resize', ()=>{
    clearDom();
    setUpGrid();
})

const clearDom = ()=>{
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell=>{
        cell.parentElement.removeChild(cell);
    })
}

const setUpGrid = ()=>{
    for(let i=0; i<(Math.floor(app.offsetWidth/30)*Math.floor(app.offsetHeight/30)); i++){
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("cellNumber", i);
        app.appendChild(cell);
    }
}



setUpGrid();


