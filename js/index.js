// Labirent şeması
let template = [
    1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,
    1,0,0,0,1,0,1,1,1,1,1,0,1,0,0,
    1,1,0,1,1,0,1,0,0,0,1,0,1,0,0,
    1,0,0,1,0,0,1,0,0,0,1,0,1,0,1,
    1,1,0,1,1,0,1,0,0,1,1,0,0,0,1,
    1,0,0,1,1,0,1,0,0,0,0,0,1,0,1,
    1,1,0,0,0,0,0,0,1,1,1,1,1,0,1,
    1,0,0,1,1,0,1,0,0,0,1,0,0,0,1,
    1,0,1,1,1,0,1,1,1,1,1,1,0,1,1,
    1,0,1,0,0,0,1,0,0,0,0,1,0,1,1,
    1,0,1,1,0,1,0,1,0,1,0,1,0,0,0,
    1,0,1,0,0,1,0,1,0,1,0,0,1,1,0,
    1,0,0,0,0,1,0,1,0,1,1,0,1,1,0,
    1,0,1,1,0,0,0,1,0,2,1,0,0,0,0,
];

// Canvas tanımlanıyor
const gameCanvas = document.getElementById('canvas');
const ctx = gameCanvas.getContext('2d');

// Kullanılan kaynak resimler tanımlanıyor.
let rat = new Image();
rat.src = "res/rat.png";

let cheese = new Image();
cheese.src = "res/cheese.png";

let wall = new Image();
wall.src = "res/wall.png";

let maze = [];

// Karakter tanımlanıyor
let player = new Object({x:0,y:1,loc:15,moves:0})

let x = 0, y = 0;

// Labirent oluşturuluyor
for (let i = 0; i < 15*15; i++) {
    maze.push({"x":x,"y":y,"state":template[i]});
    if(x == 14){
        y++;
        x = 0;
    }  
    else{ x++; }
}

// Basılan tuşa göre farenin hareket etmesi sağlanıyor W A S D
function keyPress(e) {
    switch (e.keyCode) {
        case 68: // Sağ, D
            if (player.x != 14) {
                player.loc++;
                if (maze[player.loc].state != 1) {
                    ctx.clearRect(player.x * 32, player.y * 32, 32, 32)
                    player.x ++;
                    player.moves++;
                }
                else {player.loc --;}
            }
            break;
        case 65: // Sol, A
            if (player.x != 0) {
                player.loc--;
                if (maze[player.loc].state != 1) {
                    ctx.clearRect(player.x * 32, player.y * 32, 32, 32)
                    player.x--;
                    player.moves++;
                }
                else { player.loc++; }
            }
            break;
        case 83: // Aşşağı, S
            if (player.y != 14) {
                player.loc += 15;
                if (maze[player.loc].state != 1) {
                    ctx.clearRect(player.x * 32, player.y * 32, 32, 32)
                    player.y++;
                    player.moves++;
                }
                else { player.loc-=15; }
            }
            break;
        case 87: // Yukarı, W
            if (player.x != 0) {
                player.loc -= 15;
                if (maze[player.loc].state != 1) {
                    ctx.clearRect(player.x * 32, player.y * 32, 32, 32)
                    player.y--;
                    player.moves++;
                }
                else { player.loc += 15; }
            }
            break;
    }
    // Karakter çiziliyor
    ctx.drawImage(rat, player.x * 32, player.y * 32, 32, 32)

    // Farenin Peynire ulaşıp ulaşmadığı kontrol ediliyor.
    if (maze[player.loc].state == 2) {
        alert('Kazandın');
        location.reload();
    }  

    // Atılan adıma göre adım sayacı arttırılıyor.
    document.getElementById('moves').innerHTML = "Hamle Sayısı: " + player.moves;
}

function start() {
    // Labirent canvasa çiziliyor.
    for (let i = 0; i < 15 * 15; i++) {
        if(maze[i].state == 1 || maze[i].state == "1")
            ctx.drawImage(wall, maze[i].x * 32, maze[i].y * 32, 32 , 32);
        if(maze[i].state == 2 || maze[i].state == "2")
            ctx.drawImage(cheese, maze[i].x * 32, maze[i].y * 32 ,32 ,32);
    }
    // Fare ekrana çiziliyor
    ctx.drawImage(rat, player.x  *32 ,player.y *32 ,32, 32)
    // Klavyeden dinleme yapılması için dinleme yapılıyor
    window.addEventListener("keydown", keyPress, true);
}