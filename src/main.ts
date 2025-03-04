import {io} from "socket.io-client";

const socket = io("http://localhost:3000/");
var pseudo: string | any[];
let listPlayer = document.getElementById("listPlayer");
let verify = false;
let buttonReady = false;

// let players[] = socket.on('updatePLayers', player)

socket.on("joinGameStatus", (message) =>{
  console.log(message);
});

//
document.getElementById('pseudo')!.addEventListener('input', function(event) {
  const element = event.target! as HTMLInputElement;
  pseudo = element.value;
});


//fonction pour faire rejoindre le joueur 
document.getElementById('joinGame')!.addEventListener("click", function(){
  if (pseudo.length < 1){
    alert("Veuillez entrer un pseudo");
  }
  else {
    socket.emit('joinGame', (pseudo))
    verify = true;
  }
})

//Fonction pour mettre le joueur prêt
document.getElementById('ready')!.addEventListener("click", function(){
  if (verify && buttonReady == false) {
    socket.emit('playerReady');
    buttonReady = true;
    document.getElementById('ready')!.innerHTML = "Not Ready Anymore"
  }
  else if (verify && buttonReady == true) {
    console.log('notReady')
    socket.emit('playerNotReady');
    buttonReady = false;
    document.getElementById('ready')!.innerHTML = "Ready"
  }
})

socket.on('updatePlayers', (players) => {
  listPlayer!.innerHTML = "";
  for (let i = 0; i < players.length; i++) {
    console.log(players[i]);
    const element = document.createElement('p');
    element.innerHTML = "<p id="+players[i].name+">" + players[i].name + " joined the game</p>";
    listPlayer!.appendChild(element);

    if (players[i].isReady == true) {
      let playerReady = document.getElementById(players[i].name);
      playerReady!.style.color = "green";
      playerReady!.textContent = players[i].name + " is ready";
    }
    else if (players[i].isReady == false) {
      let playerNotReady = document.getElementById(players[i].name);
      playerNotReady!.style.color = "white";
      playerNotReady!.textContent = players[i].name + " joined the game";
    }
    // document.getElementById('listPlayer')!.innerHTML += "<p>" + players[i].name + " joined the game</p>";
  }
})