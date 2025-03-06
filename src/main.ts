import { io } from "socket.io-client";

const socket = io("http://localhost:3000/");
var pseudo: string | any[];
let listPlayer = document.getElementById("listPlayer");
let cardContainer = document.getElementById("cardContainer")
let discardPileContainer = document.getElementById("discardPileContainer");
let verify = false;
let buttonReady = false;
let numberPlayerReady = 0;
let buttonStart = document.getElementById("start") as HTMLButtonElement;
let inputName = document.getElementById("inputName") as HTMLInputElement;
let leaveButton = document.getElementById("leave") as HTMLButtonElement;
buttonStart.disabled = true;

// let players[] = socket.on('updatePLayers', player)

socket.on("joinGameStatus", (message: any) => {
  console.log(message);
});

//
document.getElementById('pseudo')!.addEventListener('input', function (event) {
  const element = event.target! as HTMLInputElement;
  pseudo = element.value;
});

leaveButton.addEventListener("click", leaveGame)

function leaveGame() {
  socket.emit('disconnect');
}

function createCard(object: any) {
  console.log("create Card");
  console.log(object.players);
  console.log(socket.id);
  console.log(object.discardPile)

  // Rendre l'écran de chargement visible UNIQUEMENT quand createCard() est appelée
  const loadingScreen = document.getElementById("loadingScreen");
  if (loadingScreen) {
    loadingScreen.style.display = "flex";
  }

  setTimeout(() => {
    // Masquer l'écran de chargement après 2 secondes
    if (loadingScreen) {
      loadingScreen.style.display = "none";
    }

    const discardPileDiv = document.createElement('div')
    discardPileDiv.classList.add("discardPile", "cardDiscardPile")
    discardPileDiv.innerHTML = "<p class='cardNumber'>" + object.discardPile[0].value + "</p>";
    discardPileDiv.style.backgroundColor = object.discardPile[0].color;
    discardPileContainer?.appendChild(discardPileDiv);

    for (let i = 0; i < object.players.length; i++) {
      if (object.players[i].id === socket.id) {
        for (let j = 0; j < object.players[i].hand.length; j++) {
          console.log("carte ajoutée");

          const card = document.createElement("div");
          card.classList.add("card", "hidden"); // Ajout d'une classe pour l'animation
          card.innerHTML = "<p class='cardNumber'>" + object.players[i].hand[j].value + "</p>";
          card.style.backgroundColor = object.players[i].hand[j].color;
          cardContainer?.appendChild(card);

          inputName.classList.add("hidden");
          listPlayer!.innerHTML = "";

          // Déclencher l'animation après un léger délai
          setTimeout(() => {
            card.classList.remove("hidden");
            card.classList.add("fade-in");
          }, j * 300); // Décalage progressif pour chaque carte
        }
      }
    }
  }, 2000); // Délai avant de cacher l'animation et afficher les cartes
}




//fonction pour faire rejoindre le joueur 
document.getElementById('joinGame')!.addEventListener("click", function () {
  if (pseudo.length < 1) {
    alert("Veuillez entrer un pseudo");
  }
  else {
    socket.emit('joinGame', (pseudo))
    verify = true;
  }
})

//Fonction pour mettre le joueur prêt
document.getElementById('ready')!.addEventListener("click", function () {
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

socket.on('updatePlayers', (players: any) => {
  listPlayer!.innerHTML = "";
  cardContainer!.innerHTML = "";
  for (let i = 0; i < players.length; i++) {
    console.log(players[i]);
    const element = document.createElement('p');
    element.innerHTML = "<p id=" + players[i].name + ">" + players[i].name + " joined the game</p>";
    listPlayer!.appendChild(element);

    if (players[i].isReady == true) {
      let playerReady = document.getElementById(players[i].name);
      playerReady!.style.color = "green";
      playerReady!.textContent = players[i].name + " is ready";
      console.log(players[i])
      numberPlayerReady += 1;
    }
    else if (players[i].isReady == false) {
      let playerNotReady = document.getElementById(players[i].name);
      playerNotReady!.style.color = "white";
      playerNotReady!.textContent = players[i].name + " joined the game";
    }

    // document.getElementById('listPlayer')!.innerHTML += "<p>" + players[i].name + " joined the game</p>";
  }


})

socket.on('gameStart', createCard);

if (numberPlayerReady >= 2) {
  buttonStart.disabled = false;
  console.log("2 joueurs sont prêts")
}