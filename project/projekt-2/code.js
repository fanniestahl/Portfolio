const northBtn = document.querySelector("#northBtn");
const southBtn = document.querySelector("#southBtn");
const eastBtn = document.querySelector("#eastBtn");
const westBtn = document.querySelector("#westBtn");
const roomDesc = document.querySelector("#roomDesc");
const backgroundImage = document.querySelector("#backgroundImg");
let hasDynamite = false;
let hasKey = false;

northBtn.addEventListener("click", walkNorth);
southBtn.addEventListener("click", walkSouth);
eastBtn.addEventListener("click", walkEast);
westBtn.addEventListener("click", walkWest);


// kartan visas som en 2d array men är 1-dimensionell
const map = [
    1, 9, 0, 5, 0, 8, 0,
    0, 10, 0, 10, 0, 12, 7,
    0, 12, 16, 14, 0, 0, 10,
    0, 0, 3, 0, 6, 11, 15,
    13, 11, 15, 0, 10, 0, 10,
    10, 0, 12, 11, 14, 0, 10,
    4, 0, 0, 0, 0, 2, 14

];
/*här redigeraras alla rummen med bilde och backgrunds bilder samt om rummet ska ha nån speciel funktion */
const rooms = ["inget rum",
    /*starten har siffran 1*/
    {
        image: "room1.jpg",
        textImg: {
            text: " <br> <br> <br>  Du måste ta <br> dig ut! <br> Jag har inte <br> mycket tid men där <br> finns två vägar ut, <br> du måste försöka <br> att hitta dom!<br> Det enda jag <br> kommer ihåg är <br> siffran 2. <br> Skynda dig innan <br> kungen kommer!",
            image: "scroll.png",
        },
        sprites: [{
            image: "note.png",
            type: "note",
            x: 80,
            y: 30,
            width: "70px",
            height: "80px",

        }, {
            image: "karaktär.png",
            type: "karaktär",
            x: 85,
            y: 25,
            width: "70px",
            height: "80px",
        }, {
            image: "trapdoor.png",
            type: "lockedHatch",
            x: 0,
            y: 44,
            width: "70px",
            height: "80px",
        }]

    },
    /* har siffran 2 rum med en björn som om du klickar på den så dör du. */
    {
        image: "room3.jpg",
        sprites: [{
            image: "karaktär.png",
            type: "karaktär",
            x: 50,
            y: 20,
            width: "70px",
            height: "80px"
        }, {
            image: "bear.png",
            type: "bearAttack",
            x: 10,
            y: 10,
            width: "70px",
            height: "80px"
        }]
    },
    /*detta rum har ett kassaskåpp har siffran 3*/
    {
        image: "room9.jpg",
        textImg: {
            text: " <br> <br> <br> <br> oj! Ett kassaskåp. hmm Jag<br> behöver en fysiffrig kod. <br> jag måste gå runt och <br> leta efter ledtrådar <br> till koden.",
            image: "scroll.png"
        },
        sprites: [{
            image: "safeclose.png",
            type: "kassaskåp",
            x: 50,
            y: 50,
            width: "100px",
            height: "100px"
        }, {
            image: "karaktär.png",
            type: "karaktär",
            x: 50,
            y: 20,
            width: "70px",
            height: "80px"
        }, {
            image: "note.png",
            type: "note",
            x: 40,
            y: 40,
            width: "70px",
            height: "80px"
        }
    ]
    },
    // Detta är rum 4 som har en ledtråden till den sissta siffran i kassaskåpet i sig. 
    {
        image: "room7.jpg",
        textImg: {
            text: " <br> <br> sista siffran är <br> <br> 2+2=?",
            image: "scroll.png"
        },
        sprites: [{
            image: "note.png",
            type: "note",
            x: 60,
            y: 50,
            width: "70px",
            height: "80px"
        }, {
            image: "karaktär.png",
            type: "karaktär",
            x: 50,
            y: 20,
            width: "70px",
            height: "80px"
        }]
    },
    // Detta är rum number 5 och har ledtråden till den sista siffran 3
    {
        image: "room8.jpg",
        textImg: {
            text: " <br> <br>tredje siffarn: <br> <br> 6/2=?",
            image: "scroll.png"
        },
        sprites: [{
            image: "note.png",
            type: "note",
            x: 50,
            y: 50,
            width: "70px",
            height: "80px"
        }, {
            image: "karaktär.png",
            type: "karaktär",
            x: 50,
            y: 20,
            width: "70px",
            height: "80px"
        }]
    },
    // nytt rum 6 Detta rum har dynamiten
    {
        image: "room2.jpg",
        textImg: {
            text: "",
            image: "dynamite.png"
        },
        sprites: [{
            image: "dynamite.gif",
            type: "dynamite",
            x: 10,
            y: 20,
            width: "70px",
            height: "80px"
        }, {
            image: "karaktär.png",
            type: "karaktär",
            x: 50,
            y: 20,
            width: "70px",
            height: "80px"
        }]
    },
    // rum 7 här är ledtråden till till första siffran 
    {
        image: "room6.jpg",
        textImg: {
            text: " <br> <br>första siffran är: <br> <br> 6*10-59=?",
            image: "scroll.png"
        },
        sprites: [{
            image: "karaktär.png",
            type: "karaktär",
            x: 90,
            y: 50,
            width: "50px",
            height: "50px"
        }, {
            image: "note.png",
            type: "note",
            x: 90,
            y: 40,
            width: "70px",
            height: "80px"
        }]
    },
    // nytt rum 8 rummet som du kan spränga en hög med stenar med hjälp ut av dynamiten för att rymma
    {
        image: "room2.jpg",
        sprites: [{
            image: "karaktär.png",
            type: "karaktär",
            x: 50,
            y: 50,
            width: "50px",
            height: "50px"
        }, {
            image: "rocks.png",
            type: "pileOfRocks",
            x: 95,
            y: 40,
            width: "120px",
            height: "120px"
        }]
    },
    //  nummer 9: Koridor som går från höger till ner 
    {
        image: "cornernew.jpg",
        sprites: [{
            image: "karaktär.png",
            type: "karaktär",
            x: 50,
            y: 50,
            width: "70px",
            height: "80px"
        }]
    },
    // nummer 10: Korridor som går från upp till ner
    {
        image: "new-path.jpg",
        sprites: [{
            image: "karaktär.png",
            type: "karaktär",
            x: 48,
            y: 50,
            width: "70px",
            height: "80px"
        }]
    },
    // nummer 11: Korridor som går från höger till vänster
    {
        image: "new-path2.jpg",
        sprites: [{
            image: "karaktär.png",
            type: "karaktär",
            x: 50,
            y: 40,
            width: "70px",
            height: "80px"
        }]
    },

    // nummer 12: Korridor upp till höger
    {
        image: "cornernew2.jpg",
        sprites: [{
            image: "karaktär.png",
            type: "karaktär",
            x: 50,
            y: 50,
            width: "70px",
            height: "80px"
        }]
    },
    // nummer 13: Korridor som går från höger till ner
    {
        image: "cornernew3.jpg",
        sprites: [{
            image: "karaktär.png",
            type: "karaktär",
            x: 50,
            y: 50,
            width: "70px",
            height: "80px"
        }]
    },
    // nummer 14: Korridor som går från upp till vänster
    {
        image: "cornernew4.jpg",
        sprites: [{
            image: "karaktär.png",
            type: "karaktär",
            x: 50,
            y: 50,
            width: "70px",
            height: "80px"
        }]
    },
    // nummer 15: 3-vägs korridor som går från upp, vänster, ner
    {
        image: "3path.jpg",
        sprites: [{
            image: "karaktär.png",
            type: "karaktär",
            x: 50,
            y: 50,
            width: "70px",
            height: "80px"
        }]
    },

    // nummer 16: 3-vägs korridor som går från vänster, ner och höger
    {
        image: "3path2.jpg",
        sprites: [{
            image: "karaktär.png",
            type: "karaktär",
            x: 50,
            y: 50,
            width: "70px",
            height: "80px"
        }]
    },

    // nummer 17: 3-vägs korridor som går från vänster, upp, höger
    {
        image: "3path3.jpg",
        sprites: [{
            image: "karaktär.png",
            type: "karaktär",
            x: 50,
            y: 50,
            width: "70px",
            height: "80px"
        }]
    },

];


// startkoords
let cx = 0;
cy = 0;
updateRoomDesc();
// här kollar jag om det rummen runt ett rum har siffran 0 ifall den har det så är det inget rum.
function checkRoom(roomNum) {
    if (roomNum < 0 || roomNum >= map.length) {
        return false
    }
    if (map[roomNum] === 0) {
        return false;
    }
    return true;
}

// här ligger alla funktionerna för att gå de olika hållen. 
function walkNorth() {

    if (cy <= 0)
        return;
    if (!checkRoom(cx + (cy - 1) * 7)) {
        updateRoomDesc();
        return;
    }
    cy--;
    updateRoomDesc();
}

function walkSouth() {

    if (cy >= 6) {
        return;
    }
    if (!checkRoom(cx + (cy + 1) * 7)) {
        updateRoomDesc();
        return;
    }
    cy++;
    updateRoomDesc();
}

function walkEast() {
    if (cx >= 6) {
        return;
    }
    if (!checkRoom(cx + 1 + cy * 7)) {
        updateRoomDesc();
        return;
    }
    cx++;
    updateRoomDesc();
}

function walkWest() {
    if (cx <= 0) {
        return;
    }
    if (!checkRoom(cx - 1 + cy * 7)) {
        updateRoomDesc();
        return;
    }
    cx--;
    updateRoomDesc();
}
/*Denna funktionen tar bort allting från förra rummet och uppdaterar rummet när du kommer in i dem så att de har rätt bakgrundsbild samt så loopar den sprite och deras funktion om de finns på det rummet.
Den kollar också vart du kan gå och lägger bara till de riktningarna som du kan gå till. 
*/
function updateRoomDesc() {
    let room = rooms[map[cx + cy * 7]];
    backgroundImage.src = room.image;
    // console.log(room.sprites);
    document.querySelectorAll('.sprites').forEach(function (a) {
        a.remove()
    })
    for (let i = 0; i < room.sprites.length; i++) {

        let img = document.createElement("img");
        img.setAttribute("src", room.sprites[i].image);
        img.classList.add("sprites");
        img.classList.add(room.sprites[i].type);
        img.style.top = room.sprites[i].y + "%";
        img.style.left = room.sprites[i].x + "%";
        img.style.width = room.sprites[i].width;
        img.style.height = room.sprites[i].height;
        img.addEventListener("click", () => {
            if (room.sprites[i].type === "note") {
                renderModal(room.textImg)
            } else if (room.sprites[i].type === "dynamite") {
                removedynamite()
                getDynamite()
            } else if (room.sprites[i].type === "kassaskåp") {
                openSafe();
            } else if (room.sprites[i].type === "lockedHatch") {
                hatch()
            } else if (room.sprites[i].type === "pileOfRocks") {
                blowRocks()
            } else if (room.sprites[i].type === "bearAttack") {
                pokeBear()
            }
        });
        document.body.appendChild(img);

    }
    removedynamite()

    southBtn.style.display = checkRoom(cx + (cy + 1) * 7) && cy + 1 <= 6 ? "block" : "none";
    northBtn.style.display = checkRoom(cx + (cy - 1) * 7) && cy - 1 >= 0 ? "block" : "none";
    westBtn.style.display = checkRoom(cx - 1 + cy * 7) && cx - 1 >= 0 ? "block" : "none";
    eastBtn.style.display = checkRoom(cx + 1 + cy * 7) && cx + 1 <= 6 ? "block" : "none";
    // console.log(cx, cy);
}
// Denna funktionen är till dörren i rum 1 där ifall du inte har nyckeln så säger modalen att du måste hitta nyckeln annars ifall du har nyckeln så rymmer du. 
function hatch() {
    if (hasKey === false) {
        makeTextModal("Du måste hitta nyckeln!")
    } else {
        makePlayAgainModal("Du låste upp och rymmde!")
    }
}

function pokeBear() {
    makePlayAgainModal("Du petade på björnen så den åt upp dig!")
}
// denna funktionen är till stennarna i rum 8 för att spränga stenarna med dynamiten. 
function blowRocks() {
    if (hasDynamite === false) {
        makeTextModal("detta ser sprängbart ut hehe!")
    } else {
        makePlayAgainModal("Du sprängde ut dig själv!")
    }
}
// här är funktionen till kassaskåpet i rum 4. 
function openSafe() {
    let code = []
    let correctCode = [1, 2, 3, 4]
    const modal = document.createElement('div')
    modal.classList.add('modal')
    let display = document.createElement('div')
    display.classList.add("displayCode")
    modal.appendChild(display)


    let safe = document.createElement('div')
    safe.classList.add("safe");
    modal.appendChild(safe)
    for (let i = 1; i < 10; i++) {
        let child = document.createElement('button')
        child.textContent = i;
        child.classList.add('btn')
        child.classList.add('safeBtn')

        safe.appendChild(child)
        child.addEventListener('click', event => {
            if (event.target.classList[1] === 'safeBtn') {
                if (code.length >= 4) {
                    return
                }
                code.push(parseInt(child.textContent))
                display.innerHTML = code.join(" ");
                if (JSON.stringify(code) == JSON.stringify(correctCode)) {
                    hasKey = true;
                    display.innerHTML = "du hitta nyckeln!"



                }
            }
        })
    }
    let resetBtn = document.createElement("button")
    resetBtn.classList.add("btn")
    resetBtn.textContent = "radera"
    safe.appendChild(resetBtn);
    resetBtn.addEventListener('click', event => {
        code = [];
        display.innerHTML = " ";
    })
    document.body.appendChild(modal)

    modal.addEventListener('click', event => {
        if (event.target.className === 'modal') {
            removeModal()
        }
    })
}

function removeModal() {
    const modal = document.querySelector('.modal')
    if (modal) {
        modal.remove()
    }
}
// Denna modalen är till alla olika notes. 
function renderModal(element) {
    const modal = document.createElement('div')
    modal.classList.add('modal')
    const child = document.createElement('p')
    child.classList.add('child')
    child.style.backgroundImage = 'url("' + element.image + '")';
    child.innerHTML = element.text
    modal.appendChild(child)
    document.body.appendChild(modal)

    modal.addEventListener('click', event => {
        if (event.target.className === 'modal') {
            removeModal()
        }
    })
}
// ifall hasDynamite är true så tar den bort dynamite spriten.
function removedynamite() {
    const dynamite = document.querySelector('.dynamite')
    if (dynamite && hasDynamite) {
        dynamite.remove()
    }
}
// Ändrar hasDynamite till true  
function getDynamite() {
    return hasDynamite = true;
    console.log(hasDynamite)
}
// timer som räknar ner 2 minuter.
function startTimer(duration, display) {

    var timer = duration,
        minutes, seconds;
    interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            makePlayAgainModal("tiden är ute!")
        }
        // console.log( minutes + ":" + seconds)

    }, 1000);
}
let interval;
window.onload = function () {
    var countdown = 4* 60,
        display = document.querySelector('#time');
    startTimer(countdown, display);
};

function resetGame() {
    hasKey = false;
    hasDynamite = false;
    cx = 0;
    cy = 0;
}
// Här är spela igen modalen ifall du vinner eller dör. Den ressetar hela spelet 
function makePlayAgainModal(HTMLtext) {
    const modal = document.createElement('div')
    modal.classList.add('modal')
    const child = document.createElement('div')
    const playAgainDiv = document.createElement('div')
    child.classList.add('modal-text')
    child.innerHTML = HTMLtext
    modal.appendChild(child)
    document.body.appendChild(modal)
    clearInterval(interval);
    let playAgainBtn = document.createElement('button')
    playAgainBtn.classList.add('btn')
    playAgainDiv.classList.add('playAgain')
    playAgainBtn.innerHTML = "SPELA IGEN!"
    modal.appendChild(playAgainDiv)
    playAgainDiv.appendChild(playAgainBtn)

    playAgainBtn.addEventListener('click', event => {
        removeModal()
        resetGame()
        updateRoomDesc()
        var countdown = 60 * 4,
            display = document.querySelector('#time');
        startTimer(countdown, display);
    })
}
// En modal där det kommer upp text.
function makeTextModal(HTMLtext) {
    const modal = document.createElement('div')
    modal.classList.add('modal')
    const child = document.createElement('div')
    child.classList.add('modal-text')
    child.innerHTML = HTMLtext;
    modal.appendChild(child)
    document.body.appendChild(modal)

    modal.addEventListener('click', event => {
        if (event.target.className === 'modal') {
            removeModal()
        }

    })
}
document.addEventListener("keydown", e => {
    if (e.key == "ArrowUp") {
        walkNorth()
    } else if (e.key == "ArrowDown") {
        walkSouth()
    } else if (e.key == "ArrowLeft") {
        walkWest()
    } else if (e.key == "ArrowRight") {
        walkEast()
    } 
});