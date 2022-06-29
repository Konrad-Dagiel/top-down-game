/* ****************************************************
        ADDITIONAL INFO
********************************************************
-THE GAME HAS 2 MODES AND 2 CHARACTERS

 *** STORY MODE IS MUCH MUCH EASIER ***

endless mode there is no winning, only survival
Create an account to have your 'high score' stored in the LEADERBOARD

in story mode, there is an end screen. It's really nothing exciting, but 
you can visit it by sticking '/endscreen' to the end of the URL,
---> cs1.ucc.ie/https://cs1.ucc.ie/~kd13/cgi-bin/ca2/run.py/endscreen
(or by beating the game of course)

1. the 'how to play' section in the main page contains all of the controls,
but basically arrows move space shoot, kill everything.
E and Q have their own little effects (depending on character)

2. when picking character, selecting the INFO link under their name will bring up 
a character specific guide

3. the dragon appears as the 'final boss' in story mode, 
or every 5 levels in endless mode.
I have done my best to make getting there managable.

4.in endless mode, every 3rd level contains bosses and every 5th level contains dragons.

5. the song used is copyright-free and free to use with no need for credit

      -----------------QUICK CLARITY---------------

If the page is refreshed during the game, the song doesn't start playing until the character moves.
this is because the document must be interracted with in order for audio to play AS OF CHROME 66
attempting to play audio before interraction with the window raises multiple errors in the console,
which are not programming errors
-----------------------------------------------------------------------------

Thanks and enjoy!
(I hope my terrible voice acting makes sitting through 100 games more barable)

*******************************************************************
*********************************************************************

*/



let canvas;
let context;
let fpsInterval = 1000/30;
let now;
let then = Date.now();
let request_id;

let gamemode;
let character;
let loadingScreenElement;


let moveSpeed;
let player ={
    x:0,
    y:0,
    width:32,
    height:48,
    frameX:0,
    frameY:2,
    xChange:0,
    yChange:0,
    facing:'right',
    reloading:false
};

let tilesPerRow=6;
let tileSize=16;

let backgroundImage= new Image();

let background=[
    [ 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52],
    [ 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52],
    [ 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52],
    [ 52, 52, 52, 52, 58, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52],
    [ 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52],
    [ 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 58, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52],
    [ 52, 52, 52, 52, 64, 52, 52, 52, 52, 52, 52, 58, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52],
    [ 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52],
    [ 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52],
    [ 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52],
    [ 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52],
    [ 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 58, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52],
    [ 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52],
    [ 52, 58, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52],
    [ 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52],
    [ 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52],
    [ 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52],
    [ 52, 52, 52, 52, 58, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52],
    [ 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52],
    [ 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52, 52]

]
let arrow={
    x:250,
    y:130,
    height:75,
    width:100,
    xChange:-2
};

let level=1;
let kills_needed=3;
let enemies_remaining=3;
let kills=0;
let bosses_remaining=0;
let dragons_remaining=0;

let magazine=[];
let grimUltshots=3;
let grimUlt=[];
let ghostMode=false;

let playerImage = new Image();
let ammo;
let hp=100;
let eCooldown=0;
let qCharge=100;

let enemies=[];
let bosses=[];
let dragons=[];
let zombie1Image= new Image();
let boss1Image= new Image();
let dragonImage=new Image();
let arrowImage=new Image();

let deathSound=new Audio();
let shotSound=new Audio();
let qSound=new Audio();
let eSound=new Audio();
let startSound=new Audio();
let walkSound=new Audio();
let reloadSound=new Audio();
let gameOverSound=new Audio();
let bgmusic=new Audio();


let moveLeft=false;
let moveUp=false;
let moveRight=false;
let moveDown=false;
let shoot=false;
let reload=false;
let eUsed=false;
let qUsed=false;

let xhttp;

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");

    load_images(["static/tiles1.png","static/soldierSprite.png", "static/arrow.png","static/zombie1.png","static/reaperSprite2.png"]);
    //adjusted function for audio inputs
    load_audios(["static/grimShot.mp3", "static/marine67shot.mp3","static/grime.mp3","static/bgmusic.mp3"]);

    //get the mode and character using AJAX
    get_settings();
}

function initStage2(){
    //finish off initializing
    canvas=document.querySelector("canvas");
    context=canvas.getContext("2d");
    player.x=canvas.width/2;
    player.y=(canvas.height)/2;
    let characterName=document.querySelector('#character');
    let gamemodeElement=document.querySelector('#gamemode');

    if(character==='marine67'){
        playerImage.src="static/soldierSprite.png";
        startSound.src="static/marine67start.mp3";
        eSound.src="static/marine67e.mp3";
        qSound.src="static/marine67q.mp3";
        shotSound.src="static/marine67shot.mp3";
        deathSound.src="static/marine67death.mp3";
        ammo=30;
        moveSpeed=0.5;
        let playerIcon=document.querySelector('img');
        playerIcon.src  = "static/soldier.png"
        characterName.innerHTML  = 'MARINE: 67';
    }else if(character==='grim'){
        playerImage.src="static/reaperSprite2.png";
        startSound.src="static/grimstart.mp3";
        eSound.src="static/grime.mp3";
        qSound.src="static/grimq.mp3";
        shotSound.src="static/grimshot.mp3";
        deathSound.src="static/grimdeath.mp3";
        ammo=1;
        moveSpeed=0.4;
        let playerIcon=document.querySelector('img');
        playerIcon.src  = "static/reaper.png";
        characterName.innerHTML = 'GRIM';
    }
    if (gamemode==='story'){
        gamemodeElement.innerHTML='STORY'
    }else if(gamemode==='endless'){
        gamemodeElement.innerHTML='ENDLESS'
    }
    backgroundImage.src="static/tiles1.png";
    zombie1Image.src="static/zombie1.png";
    boss1Image.src="static/boss1Sprite.png";
    arrowImage.src="static/arrow.png";
    dragonImage.src='static/boss2Sprite.png';
    walkSound.src="static/running.mp3";
    reloadSound.src="static/reload.mp3";
    gameOverSound.src="static/gameOver.mp3";
    bgmusic.src="static/bgmusic.mp3";


    window.addEventListener('keydown',activate,false);
    window.addEventListener('keyup',deactivate,false);
    //make loading screen go away before drawing
    loadingScreenElement=document.querySelector(".loadingscreen");
    loadingScreenElement.className+=' hidden';


    draw();

}

function draw(){
    bgmusic.volume=0.15;
    bgmusic.play();
    request_id=window.requestAnimationFrame(draw);
    let now=Date.now();
    let elapsed = now-then;
    if (elapsed <= fpsInterval){
        return;
    }
    then=now-(elapsed % fpsInterval);

    //draw background
    context.clearRect(0,0,canvas.width,canvas.height);
    context.fillStyle = "#87cefa";
    context.fillRect(0,0,canvas.width,canvas.height);
    for (let r=0; r<20; r+=1){
        for(let c=0; c<32;c+=1){
            let tile=background[r][c];
            if (tile>=0){
                let tileRow = Math.floor(tile/tilesPerRow);
                let tileCol = Math.floor(tile % tilesPerRow);
                context.drawImage(backgroundImage,
                    tileCol*tileSize, tileRow*tileSize, tileSize, tileSize,
                    c*tileSize, r*tileSize ,tileSize, tileSize);
            }
        }
    }

    //draw player
    context.save()
    if(ghostMode){
        context.globalAlpha=0.4;
    }else{
        context.globalAlpha=1;
    }
    context.drawImage(playerImage,
        player.width*player.frameX,player.height*player.frameY, player.width,player.height,
        player.x, player.y, player.width, player.height);
    if ((moveLeft || moveRight || moveUp || moveDown )&& !(moveLeft && moveRight)&&!(moveUp&&moveDown)){
        player.frameX=(player.frameX+1)%4;
        walkSound.loop=true;
        walkSound.volume=0.15;
        walkSound.play();
    }else{
        walkSound.pause();
    }
    context.restore()

    //create enemies
    if (enemies_remaining >0){
        let side=randint(0,1);
        if (side===0){
        let e = {
            x: canvas.width-33,
            y: randint(1, canvas.height-49),
            width:32,
            height:48,
            frameX:0,
            frameY:1,
            health:7,
            xChange:randint(-3,-1),
            yChange:randint(-3,3)
        };
        enemies.push(e);
        enemies_remaining-=1;
    }else{
        let e = {
            x: 1,
            y: randint(1, canvas.height-49),
            width:32,
            height:48,
            frameX:0,
            frameY:1,
            health:7,
            xChange:randint(-3,-1),
            yChange:randint(-3,3)
        };
        enemies.push(e);
        enemies_remaining-=1;
    }
    }

    //create bosses
    if (bosses_remaining >0){
        let side=randint(0,1);
        if (side===0){
        let e = {
            x: canvas.width-81,
            y: randint(0, canvas.height-80),
            width:80,
            height:80,
            frameX:0,
            frameY:1,
            health:40,
            xChange:-2,
            yChange:randint(-2,2),
            targetX:0,
            targetY:0,
            charging:false,
            charges:3,
            chargeCooldown:randint(50,200)
        };
        bosses.push(e);
        bosses_remaining-=1;
        }else{
            let e = {
                x: 1,
                y: randint(0, canvas.height-80),
                width:80,
                height:80,
                frameX:0,
                frameY:1,
                health:40,
                xChange:2,
                yChange:randint(-2,2),
                targetX:0,
                targetY:0,
                charging:false,
                charges:3,
                chargeCooldown:randint(50,200)
            };
            bosses.push(e);
            bosses_remaining-=1;
            }
        
    }
    //create dragons
    if (dragons_remaining >0){
        let e = {
            x: canvas.width-97,
            y: randint(0, canvas.height-97),
            width:96,
            height:96,
            frameX:0,
            frameY:1,
            health:100,
            xChange:-2,
            yChange:randint(-2,2),
            targetX:0,
            targetY:0,
            charging:false,
            chargeCooldown:randint(10,20),
            facing:'left'
        };
        dragons.push(e);
        dragons_remaining-=1;
        }

    //draw enemies
    for (let e of enemies){
        context.drawImage(zombie1Image,
            e.width*e.frameX,e.height*e.frameY, e.width,e.height,
            e.x, e.y, e.width, e.height);
        e.frameX=(e.frameX+1)%4;
        if (e.xChange>0){
            e.frameY=2;
        }else{
            e.frameY=1;
        }
    }
    //draw bosses
    for (let e of bosses){
        context.drawImage(boss1Image,
            e.width*e.frameX,e.height*e.frameY, e.width,e.height,
            e.x, e.y, e.width, e.height);
        if(e.charging===false){
        e.frameX=(e.frameX+1)%4;
        if (e.xChange>0){
            e.frameY=2;
        }else{
            e.frameY=1;
        }
    }
    context.strokeStyle='black'
    if (e.health>30){
        context.fillStyle='green';
    }else if(e.health>20){
        context.fillStyle='yellow';
    }else if(e.health>10){
        context.fillStyle='orange';
    }else{
        context.fillStyle='red';
    }
    if(e.health>=0){
    context.fillRect(e.x+20,e.y,e.health,6);
    context.strokeRect(e.x+20,e.y,40,6)
    }
    }
    //draw dragons
    for (let e of dragons){
        context.drawImage(dragonImage,
            e.width*e.frameX,e.height*e.frameY, e.width,e.height,
            e.x, e.y, e.width, e.height);
        if(e.charging===false){
            e.frameX=(e.frameX+1)%4;
            if (e.xChange>0){
                e.frameY=2;
            }else{
                e.frameY=1;
            }
        }
        context.strokeStyle='black'
        if (e.health>75){
            context.fillStyle='green';
        }else if(e.health>50){
            context.fillStyle='yellow';
        }else if(e.health>32){
            context.fillStyle='orange';
        }else{
            context.fillStyle='red';
        }
        if(e.health>=0){
        context.fillRect(e.x-10,e.y-10,e.health,7);
        context.strokeRect(e.x-10,e.y-10,100,7)
        }
        }

    //draw bullets
    for (let p of magazine){
        if (p.x+p.size<0 || p.x>canvas.width){
            let index=magazine.indexOf(p);
            magazine.splice(index,1);
        }
        else{
            context.fillStyle="yellow";
            context.fillRect(p.x,p.y,p.size,p.size);
            p.x=p.x+p.xChange;
            //inaccuracy
            p.y=p.y+p.yChange*(0.03);
        }
    }

    //draw grim ult
    for (let p of grimUlt){
        if (p.x+p.size<0 || p.x>canvas.width){
            let index=grimUlt.indexOf(p);
            grimUlt.splice(index,1);
        }
        else{
            context.fillStyle="orange";
            context.fillRect(p.x,p.y,p.size,p.size);
            p.x=p.x+p.xChange;
            p.y=p.y+p.yChange;
        }
    }

    //draw healthbar
    context.strokeStyle='black'
    if (hp>75){
        context.fillStyle='green';
    }else if(hp>50){
        context.fillStyle='yellow';
    }else if(hp>32){
        context.fillStyle='orange';
    }else{
        context.fillStyle='red';
    }
    if(hp>0){
    context.fillRect(player.x-10,player.y-10,Math.floor(hp/2),5);
    context.strokeRect(player.x-10,player.y-10,50,5)
    }

    //HUD
    //ammo counter
    let ammoCounter = document.querySelector('#ammo');
    if (ammo>0){
    ammoCounter.innerHTML = 'ammo: '+ammo;
    }
    //player hit points
    let hpCounter = document.querySelector('#hp');
    hpCounter.innerHTML = 'hp: '+hp+'%';
    //kills
    let killCounter=document.querySelector('#kills');
    killCounter.innerHTML = 'kills: '+ kills +'/'+kills_needed;
    //level
    let levelCounter=document.querySelector('#level');
    levelCounter.innerHTML='level: '+level;
    //e cooldown
    let eCooldownCounter=document.querySelector('#e');
    if (eCooldown != 0){
        eCooldownCounter.innerHTML = '(E): '+Math.ceil(eCooldown);
    }else{
        eCooldownCounter.innerHTML='(E): ready';
    }
    if(eUsed){
        eCooldownCounter.className='highlight';
    }else{
        eCooldownCounter.className='';
    }
    //ult cooldown
    let UltChargeCounter=document.querySelector('#q');
    if (qCharge != 100){
        UltChargeCounter.innerHTML = 'Ultimate(Q): '+qCharge+'%';
    }else{
        UltChargeCounter.innerHTML='Ultimate(Q): ready';
    }if(qUsed){
        UltChargeCounter.className='highlight';
    }else{
        UltChargeCounter.className='';
    }
    //reload reminder
    let reloadReminder=document.querySelector('#r');
    reloadReminder.innerHTML='Reload(R)'
    if(reload){
        reloadReminder.className='highlight';
    }else{
        reloadReminder.className='';
    }

    



    //enemy movment
    for (let e of enemies){
        e.x=e.x+e.xChange;
        e.y=e.y+e.yChange;

        if (e.x <= 0 || e.x + e.width > canvas.width){
            e.xChange=e.xChange*-1;
        }
        if (e.y+e.height > canvas.height || e.y<=0){
            e.yChange=e.yChange*-1;

        }
    }
    //boss movement
    for (let e of bosses){
        if (e.charging===false){
        e.x=e.x+e.xChange;
        e.y=e.y+e.yChange;
                //getting unstuck from walls (due to large hitbox)
                if(e.y<-5){
                    e.y=0;
                }else if(e.y+e.height>canvas.height+5){
                    e.y=canvas.height-e.height;
                }else if(e.x<-5){
                    e.x=0;
                }else if(e.x+e.width>canvas.width+5){
                    e.x=canvas.width-e.width;
                }
        e.chargeCooldown-=1;
        }

        if (e.x <= 0 || e.x + e.width >= canvas.width){
            e.xChange=e.xChange*-1;
        }
        if (e.y+e.height >= canvas.height || e.y<=0){
            e.yChange=e.yChange*-1;

        }
        //boss special attack
        if (e.chargeCooldown<0){
            e.chargeCooldown=0;
            if (e.charges>0){
                e.chargeCooldown=randint(100,200);
                e.charging=true;
                e.frameX=0;
                e.frameY=0;
                let OGx=e.xChange;
                let OGy=e.yChange;
                e.targetX=player.x;
                e.targetY=player.y;
                e.charges-=1;
                setTimeout(function(){
                    //charge in player's general direction (at the start of charge animation)
                    e.charging=false;
                    if(e.targetX>e.x){
                    e.xChange=2;
                    e.xChange=e.xChange*(4);
                    }else{
                    e.xChange=-2;
                    e.xChange=e.xChange*(4);
                    }
                    if(e.targetY>e.y){
                    e.yChange=2;
                    e.yChange=e.yChange*(4);
                    }else{
                    e.yChange=-2;
                    e.yChange=e.yChange*(4);
                    }
                    setTimeout(function(){
                        e.xChange=OGx;
                        e.yChange=OGy;
                    },1000)
                },2000);
                }
            
        }
    }
    //dragon movment
    for (let e of dragons){
        if (e.charging===false){
        e.x=e.x+e.xChange;
        e.y=e.y+e.yChange;
                //getting unstuck from walls (due to large hitbox)
                if(e.y<-5){
                    e.y=0;
                }else if(e.y+e.height>canvas.height+5){
                    e.y=canvas.height-e.height;
                }else if(e.x<-5){
                    e.x=0;
                }else if(e.x+e.width>canvas.width+5){
                    e.x=canvas.width-e.width;
                }
        e.chargeCooldown-=1;
        }

        if (e.x <= 0 || e.x + e.width > canvas.width){
            e.xChange=e.xChange*-1;
        }
        if (e.y+e.height > canvas.height || e.y<=0){
            e.yChange=e.yChange*-1;

        }
        //dragon special attack
        if (e.chargeCooldown<0){
            e.chargeCooldown=0;
            e.chargeCooldown=randint(200,300);
            e.charging=true;
            e.frameX=0;
            e.frameY=0;
            let OGx=e.xChange;
            let OGy=e.yChange;
            e.charges-=1;
            let attack=randint(1,2);
            if (attack===1 || kills_needed > 14){//prevents dragon from adding too many enemies
            setTimeout(function(){
                //charge in player's general direction (current location)
                    e.charging=false;
                    if(player.x>e.x){
                    e.xChange=2;
                    e.xChange=e.xChange*(4);
                    }else{
                    e.xChange=-2;
                    e.xChange=e.xChange*(4);
                    }
                    if(player.y>e.y){
                    e.yChange=2;
                    e.yChange=e.yChange*(4);
                    }else{
                    e.yChange=-2;
                    e.yChange=e.yChange*(4);
                    }
                    setTimeout(function(){
                        e.xChange=OGx;
                        e.yChange=OGy;
                    },1000)
                },2000);  
                }
            else if(attack===2 && kills_needed <14){
                //spawn minions attack
                setTimeout(function(){
                    e.charging=false;
                    kills_needed+=7;
                    enemies_remaining=6;
                    bosses_remaining=1;
                },1000);
            }
    }
}


    //handle cooldowns (ult charge handled in collisions)
    if (eCooldown > 0){
        eCooldown=eCooldown-0.1;
    }
    else if(eCooldown <0){
        eCooldown=0;
    }
    if (qCharge >100){
        qCharge=100;
    }
        
    //handle key presses
    if(moveLeft){
        player.xChange=player.xChange-moveSpeed;
        player.facing='left';
        player.frameY=1;
    }
    if(moveRight){
        player.xChange=player.xChange+moveSpeed;
        player.facing='right';
        player.frameY=2;
    }
    if (moveUp){
        player.yChange=player.yChange-moveSpeed;
    }
    if (moveDown){
        player.yChange=player.yChange+moveSpeed;
    }
    if (reload){
        if (character==='marine67'){
        if (ammo <30){
        ammo=0;
        shoot=true;
        }
    }
        reload=false;
    
    }
    // e e e e e e e e
    if (eUsed){
        if (eCooldown===0){
            if(character==='marine67'){
                if (hp<100){
                    eSound.volume=0.2;
                    eSound.play();
                    if(hp>=80){
                        hp=100;
                    }
                    else{
                        hp=hp+20;
                    }
                    eCooldown=20;
                }
            }else if(character==='grim'){
                ghostMode=true;
                eSound.volume=0.15;
                eSound.play();
                setTimeout(function(){
                    ghostMode=false;
                },3000);
                eCooldown=26;
                }

            }
            eUsed=false;
    }
    // q q q q q q q ULT USED
    if (qUsed){
        if (qCharge===100){
            qSound.volume=0.3;
            qSound.play();
            if (character==='marine67'){
                reloadSound.playbackRate=1;
                reloadSound.currentTime=0;
                reloadSound.play();
                ammo=100;
                player.reloading=false;
                qCharge=0;
            }else if (character==='grim'){
                grimUltshots=3;
                grimQ();
                qCharge=0;
        }
    }
        qUsed=false;
    }

    if (shoot){
        ghostMode=false;
        if(player.reloading===false){
            //reload mechanic
            if (ammo===0){
                ammoCounter.innerHTML = 'reloading'
                player.reloading=true;
                if(character==='marine67'){
                    reloadSound.volume=0.3;
                    reloadSound.play();
                    setTimeout(function(){
                        reloadSound.currentTime=0;
                        reloadSound.play();

                    },300);
                    setTimeout(function reloadFunct(){
                        if (ammo===0){
                    ammo=30;
                    player.reloading=false;
                    shoot=false;
                        }
                },2000);
            }else if (character==='grim'){
                setTimeout(function(){
                    reloadSound.volume=0.5;
                reloadSound.play();
                },400);
                setTimeout(function reloadFunct(){
                    ammo=1;
                
                player.reloading=false;
                shoot=false;
            },1500);
            }
        }
            //shoot right
            else if (player.facing==='right'){
                if (character==='marine67'){
                let p = {
                    x: player.x+player.width/2,
                    y:player.y+player.height/2,
                    size:5,
                    xChange:13,
                    yChange:randint(-10,10)
                };
                magazine.push(p);
                shotSound.currentTime=0;
                shotSound.volume=0.15;
                shotSound.play();
                ammo=ammo-1;
            }else if(character==='grim'){
                for (let i=0;i<9;i+=1){
                let p = {
                    x: player.x+player.width/2,
                    y:player.y+player.height/2,
                    size:5,
                    xChange:13,
                    yChange:randint(-60,60)
                };
                magazine.push(p);
                shotSound.currentTime=0;
                shotSound.volume=0.15;
                shotSound.play();
            }
                ammo=ammo-1;
            }
            }
            //shoot left
            else{
                if (character==='marine67'){
                let p = {
                    x: player.x+player.width/2,
                    y:player.y+player.height/2,
                    size:5,
                    xChange:-13,
                    yChange:randint(-10,10)
                };
                magazine.push(p);
                shotSound.currentTime=0;
                shotSound.volume=0.15;
                shotSound.play();
                ammo=ammo-1;
            }else if(character==='grim'){
                for (let i=0;i<9;i+=1){
                    let p = {
                        x: player.x+player.width/2,
                        y:player.y+player.height/2,
                        size:5,
                        xChange:-13,
                        yChange:randint(-60,60)
                    };
                    magazine.push(p);
                    shotSound.currentTime=0;
                    shotSound.volume=0.15;
                    shotSound.play();
                }
                ammo=ammo-1;
            }
        }
        }
    }
    //update player
    player.x=player.x+player.xChange;
    player.y=player.y+player.yChange;


    //physics
    player.xChange=player.xChange*0.9;//friction
    player.yChange=player.yChange*0.9;//friction

    //collisions
    for (let e of enemies){//enemy touching player
        if (player_collides(e)){
            if(!ghostMode){
            hp-=1;
            if (hp<0){
                hp=0;
            }
            }
        }
    }
    for (let e of bosses){//boss touching player
        if (player_collides_boss(e)){
            if(!ghostMode){
            hp-=2;
            if (hp<0){
                hp=0;
            }
                }
            }
        }
    for (let e of dragons){//dragon touching player
        if (player_collides_boss(e)){
            if(!ghostMode){
            hp-=3;
            if (hp<0){
                hp=0;
            }
                }
            }
        }

    //losing
    if (hp===0){
        deathSound.volume=0.3;
        gameOverSound.volume=0.15;
        bgmusic.pause();
        deathSound.play();
        gameOverSound.play();
        hpCounter.innerHTML= 'hp: '+0;
        stop('GAME OVER');
    }

    //grim ghost mode grants movespeed
    if(character==='grim'){
        if(ghostMode){
            moveSpeed=0.6;
        }else{
            moveSpeed=0.4;
        }
    }

    //going off screen not allowed
    if (player.y<0){
        player.y=0;
    }else if(player.y + player.height> canvas.height){
        player.y = canvas.height-player.height;
    }
    if (player.x<0){
        player.x=0;
    }else if(player.x + player.width> canvas.width){
        player.x = canvas.width-player.width;
    }
    //enemies losing hp
    for (let p of magazine){
        for (let e of enemies){
            if (bullet_collides(p,e)){
                e.health-=1;
                if (character==='grim'){
                    if(hp<100){
                        hp+=1;
                    }
                }
                let index=magazine.indexOf(p);
                magazine.splice(index,1);
                //charge ult
                if ((qCharge != 100)&& (ammo <21)){
                    qCharge=qCharge+1;
                }
            }
            if (e.health<0){
                let index=enemies.indexOf(e);
                enemies.splice(index,1);
                kills+=1;
            }

        }
    }
    //bosses losing hp
    for (let p of magazine){
        for (let e of bosses){
            if (bullet_collides(p,e)){
                e.health-=1;
                if (character==='grim'){
                    if(hp<100){
                        hp+=1;
                    }
                }
                let index=magazine.indexOf(p);
                magazine.splice(index,1);
                //charge ult
                if ((qCharge != 100)&& (ammo <21)){
                    qCharge=qCharge+1;
                }
            }
            if (e.health<0){
                let index=bosses.indexOf(e);
                bosses.splice(index,1);
                kills+=1;
            }

        }
    }
    //dragons losing hp
    for (let p of magazine){
        for (let e of dragons){
            if (bullet_collides(p,e)){
                e.health-=1;
                if (character==='grim'){
                    if(hp<100){
                        hp+=1;
                    }
                }
                let index=magazine.indexOf(p);
                magazine.splice(index,1);
                //charge ult
                if ((qCharge != 100)&& (ammo <21)){
                    qCharge=qCharge+1;
                }
            }
            if (e.health<0){
                let index=dragons.indexOf(e);
                dragons.splice(index,1);
                kills+=1;
            }

        }
    }
    //grim ult killing enemies
    for (let p of grimUlt){
        for (let e of enemies){
            if (bullet_collides(p,e)){
                e.health-=5;
                if(hp<100){
                    hp+=1;
                }
                
                let index=grimUlt.indexOf(p);
                grimUlt.splice(index,1);
                
            }
            if (e.health<0){
                let index=enemies.indexOf(e);
                enemies.splice(index,1);
                kills+=1;
            }

        }
    }
    //grim ult killing bosses
    for (let p of grimUlt){
        for (let e of bosses){
            if (bullet_collides(p,e)){
                e.health-=2;
                if(hp<100){
                    hp+=1;
                }
                
                let index=grimUlt.indexOf(p);
                grimUlt.splice(index,1);
                
            }
            if (e.health<0){
                let index=bosses.indexOf(e);
                bosses.splice(index,1);
                kills+=1;
            }

        }
    }
    //grim ult killing dragons
    for (let p of grimUlt){
        for (let e of dragons){
            if (bullet_collides(p,e)){
                e.health-=2;
                if(hp<100){
                    hp+=1;
                }
                
                let index=grimUlt.indexOf(p);
                grimUlt.splice(index,1);
                
            }
            if (e.health<0){
                let index=dragons.indexOf(e);
                dragons.splice(index,1);
                kills+=1;
            }

        }
    }
    //increment level
        if (kills===kills_needed){
            context.drawImage(arrowImage,
                arrow.x , arrow.y, arrow.width,arrow.height );
            if(player.x === canvas.width-player.width){
                magazine=[];
                grimUlt=[];
                increment_level();
            }
    }
    //animate arrow
    arrow.x+=arrow.xChange;
    if(arrow.x>270 || arrow.x<230){
        arrow.xChange=arrow.xChange*(-1);
    }


}

function activate(event){
    let key= event.key;
    if (key ==='ArrowLeft'){
        moveLeft=true;
    }
    else if(key==='ArrowUp'){
        moveUp=true;
    }
    else if(key==='ArrowDown'){
        moveDown=true;
    }
    else if(key==='ArrowRight'){
        moveRight=true;
    }
    else if (key===' '){
        shoot=true;
    }
    else if (key==='r'){
        reload=true;
    }
    else if (key==='e'){
        eUsed=true;
    }
    else if (key==='q'){
        qUsed=true;
    }

}
function deactivate(event){
    let key= event.key;
    if (key ==='ArrowLeft'){
        moveLeft=false;
    }
    else if(key==='ArrowUp'){
        moveUp=false;
    }
    else if(key==='ArrowDown'){
        moveDown=false;
    }
    else if(key==='ArrowRight'){
        moveRight=false;
    }
    else if(key===' '){
        shoot=false;
    }
    else if(key==='e'){
        eUsed=false;
    }
    else if (key==='r'){
        qUsed=false;
    }
}
function randint(min,max){
    return Math.round(Math.random()*(max-min))+min;
}
function player_collides(e){
    if (player.x +player.width <e.x ||
        e.x +e.width < player.x ||
        player.y > e.y +e.height ||
        e.y > player.y + player.height){
        return false;
        }else{
            return true;
        }
}
function player_collides_boss(e){
    if (player.x +player.width <e.x+10 ||
        e.x +e.width-10 < player.x ||
        player.y > e.y +e.height-10 ||
        e.y+10 > player.y + player.height){
        return false;
        }else{
            return true;
        }
}
function bullet_collides(p,e){
    if (p.x +p.size <e.x ||
        e.x +e.width < p.x ||
        p.y > e.y +e.height||
        e.y > p.y +p.size){
        return false;
        }else{
            return true;
        }
}

function grimQ(){
        for (let i=0;i<20;i+=1){
            let p = {
                x: player.x+player.width/2,
                y:player.y+player.height/2,
                size:5,
                xChange:randint(-10,10),
                yChange:randint(-10,10)
            };
            if (!((p.xChange && p.yChange)===0)){
                qSound.volume=0.15;
                grimUlt.push(p);
            }
        }
        ghostMode=false;
    grimUltshots=grimUltshots-1;
    shotSound.currentTime=0;
    shotSound.play();
    if (grimUltshots>0){
        setTimeout(grimQ,1000);
    }
}

function increment_level(){
    //level up on endless mode
    if (gamemode==='endless'){
        let randomBG=randint(43,53);
        //making it rare to get non-grassy stages
        if (randomBG<48){
            randomBG=52;
        }
        else if (randomBG===53){
            randomBG=40;
        }
        for(let i of background){
            for (let k=0;k<37;k+=1){
                i[k]=randomBG;
            }
        }
    level+=1;
    player.x=1;
    if (level%3===0){
    kills_needed=(level*2);
    kills=0;
    setTimeout(function(){
        bosses_remaining=Math.ceil(level/5);
        enemies_remaining = kills_needed;
        kills_needed+=bosses_remaining;
    },2000)
    }else if(level%5===0){
    kills_needed=level/5;
    kills=0;
    setTimeout(function(){
        dragons_remaining=level/5;
    },2000)
    }else{
    kills_needed=(level*2);
    kills=0;
    setTimeout(function(){
        enemies_remaining = kills_needed;
    },2000)
}   
    //level up on story mode
    magazine=[];
    grimUlt=[];
    }else if(gamemode==='story'){
        if(level===5){
            //you win on level 5
            location.replace('endscreen')
        }
        level+=1;
        player.x=1;
        kills=0;
        
        if(level===2){
            for(let i of background){
                for (let k=0;k<37;k+=1){
                    i[k]=56;
                }
            }
            setTimeout(function(){story2();},2000)

        }
        if(level===3){
            for(let i of background){
                for (let k=0;k<37;k+=1){
                    i[k]=58;
                }
            }
            setTimeout(function(){story3();},2000)

        }
        if(level===4){
            for(let i of background){
                for (let k=0;k<37;k+=1){
                    i[k]=40;
                }
            }
            setTimeout(function(){story4();},2000)
        }
        if(level===5){
            for(let i of background){
                for (let k=0;k<37;k+=1){
                    i[k]=76;
                }
            }
            setTimeout(function(){story5();},2000)
        }

    }
}


function story2(){
    kills_needed=3;
    enemies_remaining=2;
    bosses_remaining=1;
    
}

function story3(){
    kills_needed=8;
    enemies_remaining=8;
    bosses_remaining=0;

}

function story4(){
    kills_needed=3;
    enemies_remaining=0;
    bosses_remaining=3;

}

function story5(){
    kills_needed=1;
    dragons_remaining=1;

}

function stop(outcome){
    qSound.pause();
    eSound.pause();
    walkSound.pause();
    window.removeEventListener('keydown',activate,false);
    window.removeEventListener('keyup',deactivate,false);
    window.cancelAnimationFrame(request_id);
    let outcome_element=document.querySelector("#outcome");
    outcome_element.innerHTML = outcome;
    let play_againElement=document.querySelector('#play_again');
    play_againElement.innerHTML='PLAY AGAIN';

    if(gamemode==='endless'){

    let data= new FormData();
    data.append("score",level);

    xhttp=new XMLHttpRequest();
    xhttp.addEventListener("readystatechange",handle_response,false);
    xhttp.open("POST", "store_score", true); //relative url to account for different path on cs1 server
    xhttp.send(data);
    }

}

function handle_response(){
    if(xhttp.readyState===4){
        if(xhttp.status===200){
            if(xhttp.responseText==="success"){
                let score_element=document.querySelector('#score');
                score_element.innerHTML='Your Highscore has been achieved!';

            }
            else{
                let score_element=document.querySelector('#score');
                score_element.innerHTML='Your Highscore has not been achieved';
            }
        }
    }
}

function get_settings(){
    xhttp=new XMLHttpRequest();
    xhttp.addEventListener("readystatechange",handle_response2,false);
    xhttp.open("GET", "get_settings", true); //relative url
    xhttp.send(null);
}
function handle_response2(){
    if(xhttp.readyState===4){
        if(xhttp.status===200){
            let response= JSON.parse(xhttp.responseText);
            character=response.character;
            gamemode=response.gamemode;
            initStage2();
        }
    }
    
}
async function load_images(urls) {
    let promises = [];
    for (let url of urls) {
        promises.push(new Promise(resolve => {
            let img = new Image();
            img.onload = resolve;
            img.src = url;
        }));
    }
    await Promise.all(promises); 
}
async function load_audios(urls) {
    let promises = [];
    for (let url of urls) {
        promises.push(new Promise(resolve => {
            let audio = new Audio();
            audio.onload = resolve;
            audio.src = url;
        }));
    }
    await Promise.all(promises); 
}


