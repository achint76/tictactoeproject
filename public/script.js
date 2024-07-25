console.log("Welcome to tic tac toe!");
let music = new Audio("assets/music.mp3");
let audioTurn = new Audio("assets/ting.mp3");
let gameover = new Audio("assets/gameover.mp3");
let turn = "X";
let isGameOver = false;





const socket = io();   //connecting to the socket.io server



//function to change the turn
const changeTurn = ()=>{
    return turn === "X"? "O":"X";

}

//fnuction to check for win

const checkWin = ()=>{
    let boxtext = document.getElementsByClassName('boxtext');
    let wins = [
        [0,1,2,5,5,0],
        [3,4,5,5,15,0],
        [6,7,8,5,25,0],
        [0,3,6,-5,15,90],
        [1,4,7,5,15,90],
        [2,5,8,15,15,90],
        [0,4,8,5,15,45],
        [2,4,6,5,15,135],
    ]
    wins.forEach(e =>{
        if((boxtext[e[0]].innerText === boxtext[e[1]].innerText) && (boxtext[e[2]].innerText === boxtext[e[1]].innerText) && (boxtext[e[0]].innerText !== '')){
            document.querySelector('.info').innerText = boxtext[e[0]].innerText + " won";
            
            isGameOver = true;
            gameover.play();
            document.querySelector('.imgbox').getElementsByTagName('img')[0].style.width = "200px";
            document.querySelector('.line').style.width = "20vw";
            document.querySelector('.line').style.transform = `translate(${e[3]}vw, ${e[4]}vw) rotate(${e[5]}deg)`

          
        }
    })
}


// Listen for initial turn from the server
socket.on('turn', (serverTurn) => {
    turn = serverTurn;
    if (!isGameOver) {
        document.getElementsByClassName("info")[0].innerText = "Turn for " + turn;
    }
});

//game logic
//music.play();
let boxes = document.getElementsByClassName('box');
Array.from(boxes).forEach(element => {
    let boxtext = element.querySelector('.boxtext');
    element.addEventListener('click', (e)=> {
        //music.play();
        if(boxtext.innerText === ''){
            boxtext.innerText = turn;
            turn = changeTurn();
            audioTurn.play();
            checkWin();
            checkDraw();
            
            console.log("turn", turn);
            socket.emit('move', { index: Array.from(boxes).indexOf(element), turn: boxtext.innerText});  //emit the move to the server
            if(!isGameOver)
            document.getElementsByClassName("info")[0].innerText = "Turn for "+ turn;
            // console.log("cuurrent player turn find");

            // currentPlayer = (turn === "X") ? player1Id : player2Id;  // Switch the current player
        }
    })
});

//listen for moves from the server
socket.on('move', (data)=>{
    let boxtext = boxes[data.index].querySelector('.boxtext');
    boxtext.innerText = data.turn;
    checkWin();
    if(!isGameOver){
        turn = changeTurn();  // Ensure the local turn is updated
        document.getElementsByClassName("info")[0].innerText = "Turn for " + (data.turn === "X") ? "O":"X";
    }
})

// //add onclick listener to reset button
// reset.addEventListener('click', ()=>{
//     let boxtexts = document.querySelectorAll('.boxtext');
//     Array.from(boxtexts).forEach(element => {
//         element.innerText = '';
//     })
//     turn = "X";
//     isGameOver = false;
//     document.querySelector('.line').style.width = "0vw";
//     document.getElementsByClassName("info")[0].innerText = "Turn for "+ turn;
//     document.querySelector('.imgbox').getElementsByTagName('img')[0].style.width = "0px";

//     socket.emit('reset');  //emit the reset event to the server
// });


// Add onclick listener to reset button
reset.addEventListener('click', () => {
    socket.emit('reset');  // Emit the reset event to the server
});


socket.on('reset', ()=> {
    let boxtexts = document.querySelectorAll('.boxtext');
    Array.from(boxtexts).forEach(element => {
        element.innerText = '';

    })
    turn = "X";
    isGameOver = false;
    document.querySelector('.line').style.width = "0vw";
    document.getElementsByClassName("info")[0].innerText = "Turn for " + turn;
    document.querySelector('.imgbox').getElementsByTagName('img')[0].style.width = "0px";

})


const checkDraw = ()=> {
    let boxtext = document.getElementsByClassName('boxtext');
    let filled = true;
    Array.from(boxtext).forEach(element => {
        if(element.innerText === '')
            filled = false;
    });
    if(filled && !isGameOver){
    document.querySelector('.info').innerText = "It's a draw!";
    isGameOver = true;
    gameover.play();
    }
}





