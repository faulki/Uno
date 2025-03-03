import {io} from "socket.io-client";

const socket = io("http://localhost:3000/");
var pseudo: string | any[];
let listPlayer = document.getElementById("listPlayer");
let verify = false;

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
  if (verify) {
    socket.emit('playerReady');
  }
})

socket.on('updatePlayers', (players) => {
  listPlayer!.innerHTML = "";
  for (let i = 0; i < players.length; i++) {
    console.log(players[i].name);
    const element = document.createElement('p');
    element.innerHTML = "<p>" + players[i].name + " joined the game</p>";
    listPlayer!.appendChild(element);
    // document.getElementById('listPlayer')!.innerHTML += "<p>" + players[i].name + " joined the game</p>";
  }
})