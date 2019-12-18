// Labirent şeması
let template = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1,
    1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1,
    1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1,
    1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1,
    1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1,
    1, 0, 1, 1, 1, 0, 1, 0, 2, 0, 1, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1,
    1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1,
    1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1,
    1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1,
    1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];

// TODO: 3 farklı çözüm yolu olan map oluştur random 3 arasından seç ona git
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

// Canvas tanımlanıyor
const gameCanvas = document.getElementById('canvas');
const ctx = gameCanvas.getContext('2d');
gameCanvas.width = document.body.clientWidth;
gameCanvas.height = document.documentElement.scrollHeight;
let tileSize = 46;
const gameArea = document.getElementById('gameArea');
const startArea = document.getElementById('startArea');
const resultArea = document.getElementById('resultArea');

// Kullanılan kaynak resimler tanımlanıyor.
let rat = new Image();
rat.src = "res/rat.png";

let enemyRat = new Image();
enemyRat.src = "res/enemyRat.png";

let cheese = new Image();
cheese.src = "res/cheese.png";

let wall = new Image();
wall.src = "res/wall.png";

let maze = [];

let firstPlayer = false;
let Iwin = false;
// Karakter tanımlanıyor
let player = new Object({ x: 0, y: 1, loc: 15, moves: 0 })
let enemyPlayer = new Object({ x: 14, y: 1, loc: 30, moves: 0 });

let x = 0, y = 0;

// Labirent oluşturuluyor
for (let i = 0; i < 15 * 15; i++) {
    maze.push({ "x": x, "y": y, "state": template[i] });
    if (x == 14) {
        y++;
        x = 0;
    }
    else { x++; }
}

function moveRight() {
    player.loc++;
    if (maze[player.loc].state != 1) {
        ctx.clearRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize)
        player.x++;
        player.moves++;
    }
    else { player.loc--; }
    ctx.drawImage(rat, player.x * tileSize, player.y * tileSize, tileSize, tileSize);
}

function moveLeft() {
    player.loc--;
    if (maze[player.loc].state != 1) {
        ctx.clearRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize)
        player.x--;
        player.moves++;
    }
    else { player.loc++; }
    ctx.drawImage(rat, player.x * tileSize, player.y * tileSize, tileSize, tileSize);
}

function moveDown() {
    player.loc += 15;
    if (maze[player.loc].state != 1) {
        ctx.clearRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize)
        player.y++;
        player.moves++;
    }
    else { player.loc -= 15; }
    ctx.drawImage(rat, player.x * tileSize, player.y * tileSize, tileSize, tileSize);
}

function moveUp() {
    player.loc -= 15;
    if (maze[player.loc].state != 1) {
        ctx.clearRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize)
        player.y--;
        player.moves++;
    }
    else { player.loc += 15; }
    ctx.drawImage(rat, player.x * tileSize, player.y * tileSize, tileSize, tileSize);
}

// Basılan tuşa göre farenin hareket etmesi sağlanıyor W A S D
function keyPress(e) {
    switch (e.keyCode) {
        case 68: // Sağ, D
            moveRight();
            break;
        case 83: // Aşşağı, S
            moveDown();
            break;
        case 65: // Sol, A
            moveLeft();
            break;
        case 87: // Yukarı, W
            moveUp();
            break;
    }
    ctx.clearRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize)
    // Karakter çiziliyor
    ctx.drawImage(rat, player.x * tileSize, player.y * tileSize, tileSize, tileSize)
    if (firstPlayer)
        socket.emit('pos', player);
    else {
        if (socket) {
            socket.emit('secPos', player);
        }
    }
    // Farenin Peynire ulaşıp ulaşmadığı kontrol ediliyor.
    if (maze[player.loc].state == 2) {
        if (socket) {
            Iwin = true;
            socket.emit('win', 'win')
        }
        setTimeout(() => {
            resultArea.classList.remove("d-none");
            gameArea.classList.add("d-none");
            document.getElementById('message').innerHTML = player.moves + ' hamlede Kazandınız\nTebrikler!!';
        }, 400);
    }

    // Atılan adıma göre adım sayacı arttırılıyor.
    document.getElementById('moves').innerHTML = "Hamle Sayısı: " + player.moves;
}

function createMap() {
    // Labirent canvasa çiziliyor.
    for (let i = 0; i < 15 * 15; i++) {
        if (maze[i].state == 1 || maze[i].state == "1")
            ctx.drawImage(wall, maze[i].x * tileSize, maze[i].y * tileSize, tileSize, tileSize);
        if (maze[i].state == 2 || maze[i].state == "2")
            ctx.drawImage(cheese, maze[i].x * tileSize, maze[i].y * tileSize, tileSize, tileSize);
    }
}

function start() {
    gameArea.classList.remove("d-none");
    startArea.classList.add("d-none");
    createMap();

    // Fare ekrana 
    ctx.drawImage(rat, player.x * tileSize, player.y * tileSize, tileSize, tileSize)

    // Klavyeden dinleme yapılması için dinleme yapılıyor
    window.addEventListener("keydown", keyPress, true);
}

function startAI() {
    gameArea.classList.remove("d-none");
    startArea.classList.add("d-none");
    maze[125] = { x: 5, y: 8, state: 1 }

    createMap();
    ctx.drawImage(rat, player.x * tileSize, player.y * tileSize, tileSize, tileSize)

    let myInterval = setInterval(() => {
        if (player.x != 14 || player.x != 0 || player.y != 14 || player.x != 0) {
            let dir = Math.floor(Math.random() * Math.floor(4))

            curPos = player.loc;
            switch (dir) {
                case 0: // Sağ, D
                    moveRight();
                    break;
                case 1: // Aşşağı, S
                    moveDown();
                    break;
                case 2: // Sol, A
                    moveLeft();
                    break;
                case 3: // Yukarı, W
                    moveUp();
                    break;
            }
        }
        //peynir silmek için
        ctx.clearRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize)

        ctx.drawImage(rat, player.x * tileSize, player.y * tileSize, tileSize, tileSize)
        if (maze[player.loc].state == 2) {
            clearInterval(myInterval)
            resultArea.classList.remove("d-none");
            gameArea.classList.add("d-none");
            document.getElementById('message').innerHTML = 'Bilgisayar peyniri buldu.';
        } else {
            document.getElementById('moves').innerHTML = "Hamle Sayısı: " + player.moves;
        }
    }, 100);
}

$('.overlay').hide();
let socket;

function startSocket() {
    gameArea.classList.remove("d-none");
    startArea.classList.add("d-none");
    socket = io();
    socket.on('pos', function (data) {
        if (!firstPlayer) {
            ctx.clearRect(enemyPlayer.x * tileSize, enemyPlayer.y * tileSize, tileSize, tileSize)
            enemyPlayer = data;
            ctx.drawImage(enemyRat, enemyPlayer.x * tileSize, enemyPlayer.y * tileSize, tileSize, tileSize)
        }
    })
    socket.on('secPos', function (data) {
        if (firstPlayer) {
            ctx.clearRect(enemyPlayer.x * tileSize, enemyPlayer.y * tileSize, tileSize, tileSize)
            enemyPlayer = data;
            ctx.drawImage(enemyRat, enemyPlayer.x * tileSize, enemyPlayer.y * tileSize, tileSize, tileSize)
        }
    })
    socket.on('broadcast', function (data) {
        if (data == 1) {
            firstPlayer = true;
        }
        if (data == 2) {
            $('.overlay').hide();
            startGameWithSocket();
        }
        if (data > 2) {
            location.reload();
        }
    });
    socket.on('win', function (params) {
        if (!Iwin) {
            resultArea.classList.remove("d-none");
            gameArea.classList.add("d-none");
            document.getElementById('message').innerHTML = "Karşı taraf kazandı. Kaybettin\nBir daha ki sefere!";
        }
    })
    $('.overlay').show();
}

function startGameWithSocket() {
    createMap();
    //ctx.drawImage(enemyRat, enemyPlayer.x * tileSize, enemyPlayer.y * tileSize, tileSize, tileSize)
    // Fare ekrana 
    if (!firstPlayer) {
        player = new Object({ x: 14, y: 1, loc: 29, moves: 0 })

        enemyPlayer = new Object({ x: 0, y: 1, loc: 15, moves: 0 })
    }

    ctx.drawImage(enemyRat, enemyPlayer.x * tileSize, enemyPlayer.y * tileSize, tileSize, tileSize)
    ctx.drawImage(rat, player.x * tileSize, player.y * tileSize, tileSize, tileSize)

    // Klavyeden dinleme yapılması için dinleme yapılıyor
    window.addEventListener("keydown", keyPress, true);
}

function reload() {
    location.reload();
}