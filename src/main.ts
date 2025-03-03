import {io} from "socket.io-client";

const socket = io("http://localhost:3000/");
var pseudo: string | any[];
let listPlayer;
let verify = false;

// let players[] = socket.on('updatePLayers', player)

socket.on("joinGameStatus", (message) =>{
  console.log(message);
});

listPlayer = document.getElementById('listplayer');

document.getElementById('pseudo')!.addEventListener('input', function(event) {
  const element = event.target! as HTMLInputElement;
  pseudo = element.value;
});



document.getElementById('joinGame')!.addEventListener("click", function(){
  if (pseudo.length < 1){
    alert("Veuillez entrer un pseudo");
  }
  else {
    socket.emit('joinGame', (pseudo))
    verify = true;
  }
})

document.getElementById('ready')!.addEventListener("click", function(){
  if (verify) {
    socket.emit('playerReady');
  }
})