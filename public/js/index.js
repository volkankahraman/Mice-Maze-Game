
// Labirent şeması
let template = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
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

// Canvas tanımlanıyor
const gameCanvas = document.getElementById('canvas');
const ctx = gameCanvas.getContext('2d');

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
let player = new Object({x:0,y:1,loc:15,moves:0})
let enemyPlayer = new Object({ x: 14, y: 1, loc: 30, moves: 0 });

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
                player.loc++;
                if (maze[player.loc].state != 1) {
                    ctx.clearRect(player.x * 32, player.y * 32, 32, 32)
                    player.x ++;
                    player.moves++;
                }
                else {player.loc --;}
            break;
            case 83: // Aşşağı, S
                    player.loc += 15;
                    if (maze[player.loc].state != 1) {
                        ctx.clearRect(player.x * 32, player.y * 32, 32, 32)
                        player.y++;
                        player.moves++;
                    }
                    else { player.loc-=15; }
                break;
        case 65: // Sol, A
                player.loc--;
                if (maze[player.loc].state != 1) {
                    ctx.clearRect(player.x * 32, player.y * 32, 32, 32)
                    player.x--;
                    player.moves++;
                }
                else { player.loc++; }
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
    ctx.clearRect(player.x * 32, player.y * 32, 32, 32)
    // Karakter çiziliyor
    ctx.drawImage(rat, player.x * 32, player.y * 32, 32, 32)
    if(firstPlayer)
        socket.emit('pos', player);
    else {
        if (socket){
            socket.emit('secPos', player);
        }
    }
    // Farenin Peynire ulaşıp ulaşmadığı kontrol ediliyor.
    if (maze[player.loc].state == 2) {
        if(socket){
            Iwin = true;
            socket.emit('win', 'win')
        }
        setTimeout(() => {
            alert(player.moves + ' hamlede Kazandınız\nTebrikler!!');
            location.reload();
        }, 400);
    }  

    // Atılan adıma göre adım sayacı arttırılıyor.
    document.getElementById('moves').innerHTML = "Hamle Sayısı: " + player.moves;
}

function createMap() {
    // Labirent canvasa çiziliyor.
    for (let i = 0; i < 15 * 15; i++) {
        if (maze[i].state == 1 || maze[i].state == "1")
            ctx.drawImage(wall, maze[i].x * 32, maze[i].y * 32, 32, 32);
        if (maze[i].state == 2 || maze[i].state == "2")
            ctx.drawImage(cheese, maze[i].x * 32, maze[i].y * 32, 32, 32);
    }
}

function start() {
    createMap();
    // Fare ekrana 
        
    

    ctx.drawImage(rat, player.x * 32, player.y * 32, 32, 32)

    // Klavyeden dinleme yapılması için dinleme yapılıyor
    window.addEventListener("keydown", keyPress, true);
}

function startAI() {
    
    maze[125] = { x: 5, y: 8, state:1 }
    
    createMap();
    ctx.drawImage(rat, player.x * 32, player.y * 32, 32, 32)

    let myInterval = setInterval(() => {
        if (player.x != 14 || player.x != 0 || player.y != 14 || player.x != 0)  { 
            let dir = Math.floor(Math.random() * Math.floor(4))
            
            curPos = player.loc;
            switch (dir) {
                case 0:// Aşağı
                    if (maze[player.loc + 1].state != 1) {
                        player.loc++;
                        if (maze[player.loc].state != 1) {
                            ctx.clearRect(player.x * 32, player.y * 32, 32, 32)
                            player.x++;
                            player.moves++;
                        }
                        else { player.loc--; }
                    }
                    break;    
                
                case 1:
                    if (maze[player.loc - 1].state != 1) {
                        player.loc--;
                        if (maze[player.loc].state != 1) {
                            ctx.clearRect(player.x * 32, player.y * 32, 32, 32)
                            player.x--;
                            player.moves++;
                        }
                        else { player.loc++; }
                    }
                    break;
                case 2:
                    if (maze[player.loc - 15].state != 1) {
                        player.loc -= 15;
                        if (maze[player.loc].state != 1) {
                            ctx.clearRect(player.x * 32, player.y * 32, 32, 32)
                            player.y--;
                            player.moves++;
                        }
                        else { player.loc += 15; }
                    }
                    
                case 3:
                    if (maze[player.loc + 15].state != 1) {
                        player.loc += 15;
                        if (maze[player.loc].state != 1) {
                            ctx.clearRect(player.x * 32, player.y * 32, 32, 32)
                            player.y++;
                            player.moves++;
                        }
                        else { player.loc -= 15; }
                    }
                    
                default:
                    break;
            }

        }
        //peynir silmek için
        ctx.clearRect(player.x * 32, player.y * 32, 32, 32)

        ctx.drawImage(rat, player.x * 32, player.y * 32, 32, 32)
        if (maze[player.loc].state == 2) {
            clearInterval(myInterval)
            alert('Bilgisayar ' + player.moves + ' hamlede kazandı');
            location.reload();
        }else{
            document.getElementById('moves').innerHTML = "Hamle Sayısı: " + player.moves;
        }
    }, 100);
}

$('.overlay').hide();
let socket;

function startSocket() {
    socket = io();
    socket.on('pos', function (data) {
        if (!firstPlayer){
            
            ctx.clearRect(enemyPlayer.x * 32, enemyPlayer.y * 32, 32, 32)
            enemyPlayer = data;
            ctx.drawImage(enemyRat, enemyPlayer.x * 32, enemyPlayer.y * 32, 32, 32)
        } 
    })
    
    socket.on('secPos', function (data) {
        if (firstPlayer) {

            ctx.clearRect(enemyPlayer.x * 32, enemyPlayer.y * 32, 32, 32)
            enemyPlayer = data;
            ctx.drawImage(enemyRat, enemyPlayer.x * 32, enemyPlayer.y * 32, 32, 32)
        }
    })
    socket.on('broadcast', function (data) {
        

        if(data == 1 ){
            firstPlayer =true;
        }     
        if(data == 2){
            
            $('.overlay').hide();
            startGameWithSocket();
        }
        if(data > 2){
            location.reload();
        }
    
        
    });
    socket.on('win', function (params) {
        if(!Iwin){
            alert("Karşı taraf kazandı. Kaybettin\nBir daha ki sefere!");
            location.reload();
        }
    })
    $('.overlay').show();
}
function startGameWithSocket() {
    createMap();
    //ctx.drawImage(enemyRat, enemyPlayer.x * 32, enemyPlayer.y * 32, 32, 32)
    // Fare ekrana 
    if(!firstPlayer){
        player = new Object({ x: 14, y: 1, loc: 29, moves: 0 })
        
        enemyPlayer = new Object({ x: 0, y: 1, loc: 15, moves: 0 })
    }

    ctx.drawImage(enemyRat, enemyPlayer.x * 32, enemyPlayer.y * 32, 32, 32)
    ctx.drawImage(rat, player.x * 32, player.y * 32, 32, 32)

    // Klavyeden dinleme yapılması için dinleme yapılıyor
    window.addEventListener("keydown", keyPress, true);
}