
/*
let listeMessages = [];

let width = 1200;
let height = 600;

let myFont;
let myFont2;

function breakMessage(leMessage){
    leMessageOut = "";
    let splittedMessage = leMessage.split(" ");
    for(let i=0; i<splittedMessage.length; i++){
        leMessageOut += splittedMessage[i]+" "
        if(i%5 === 0 && i!==0){
            leMessageOut += "\n";
        }
    }
    return leMessageOut;
}


function setup() {
    createCanvas(width, height);
    //myFont = loadFont('assets/circular.ttf');
    //myFont = loadFont('assets/NextPosterFont/NEXTPoster-Bold2.otf');
    //myFont2 = loadFont('assets/NEXTMono-Thin.otf');
    myFont2 = loadFont('assets/OverpassMono-SemiBold.ttf');
    myFont = loadFont('assets/MessinaSansMonoTrial-Black.otf');
    //listeMessages.push(new Message("KevinDu78599_XXX_VIP_MortalStart_Combat"," quand on est à plus de 2, les projets se passent jamais comme prevus"));
}

class Message {
    constructor(user,couleur,leMessage) {
        this.x = width/2;
        this.y = height;
        this.user = user;
        this.contenuMessage = breakMessage(leMessage);
        this.scale = 1;
        this.vx =0;
        this.vy = -1;
        this.age = 0;
        this.opacity = 255;
        this.toDestroy = false;
        if(couleur === null){
            let r = random(255);
            let g = random(255);
            let b = random(255);
            this.color = color(r,g,b);
        }else{
            this.color = color(couleur);
        }
    }
    move(){
        this.x += this.vx;
        this.y += this.vy;
        if(this.scale < 14) {
            this.scale += 0.05;
        }
        this.age += 1;
        if(this.age >100){
            this.opacity -= 1;
        }
        if(this.opacity < 0){
            this.toDestroy = true;
        }
    }
    show(){
        let c = this.color;
        let valRGB = c.toString();
        let RGB = valRGB.substring(5,valRGB.length-1).split(",");
        fill(RGB[0],RGB[1],RGB[2],this.opacity);
        //fill(c,this.opacity);

        let widthBox = 10;
        let heightBox = 10;

        textFont(myFont);
        textAlign(RIGHT, CENTER);
        textSize(this.scale);
        text(this.user+" - ",this.x,this.y);

        textFont(myFont2);
        textAlign(LEFT, TOP);
        text(""+this.contenuMessage, this.x, this.y);
    }
}

function draw() {
    //background(220);
    clear();
    for(let i=0; i<listeMessages.length; i++){
        listeMessages[i].show();
        listeMessages[i].move();
        if(listeMessages[i].toDestroy){
            listeMessages.shift();
        }
    }
}
*/

function createNewMessage(utilisateur,couleur, leMessage){
    if(couleur === null) {
        couleur = "#"+Math.floor(Math.random()*16777215).toString(16);
    }
    console.log(utilisateur + " : " + leMessage);
    let container = document.querySelector("#messageContainer");
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    let userText = document.createElement("div");
    userText.classList.add("user");
    userText.style.color = couleur;
    userText.textContent = utilisateur;
    let newText = document.createElement("div");
    newText.classList.add("messageText");
    newText.style.color = couleur;
    newText.textContent = leMessage;
    messageDiv.appendChild(userText);
    messageDiv.appendChild(newText);
    container.appendChild(messageDiv);
    return messageDiv;
}

/*
function laSuite(element){
    let value = window.innerHeight;
    let timeIntervalMessage = setInterval(()=> {
        element.style.top = value+"px";
        value -= 1;
        if(value+element.clientHeight <= 0 ){
            clearInterval(timeIntervalMessage);
            element.remove();
        }
    }, 10);
}
 */

//Part connected to twitch chat

let nomChaine = "ponce";

const params = new URLSearchParams(window.location.search);
const channel = params.get('channel') || nomChaine.toLowerCase();
const client = new tmi.Client({
    connection: {
        secure: true,
        reconnect: true,
    },
    channels: [channel],
});

client.connect();
let listeMessage = [];

client.on('message', (wat, tags, message, self) => {
    if (self) return;
    listeMessage.push({tags,message});
    //.getBoundingClientRect
});

function map(x, in_min, in_max, out_min,out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function render() {
    let messages = document.getElementsByClassName("message");

    for(let i=0; i<messages.length; i++){
        let m = messages[i];
        let pY = parseFloat(m.style.top);
        if(isNaN(pY)){
            pY = window.innerHeight;
        }
        pY -= 1;
        m.style.top =pY+"px";
        m.style.opacity = map(pY,window.innerHeight/2,0,1,0);
        if(pY < -m.clientHeight){
            m.remove();
        }
    }

    let lastM = messages[messages.length-1];
    if(listeMessage.length>0 && (messages.length === 0 || parseFloat(lastM.style.top) < window.innerHeight-lastM.clientHeight-10)){
        let data = listeMessage.shift();
        console.log(data);
        createNewMessage(data.tags['display-name'],data.tags['color'], data.message);
    }

    requestAnimationFrame(_=> render());
}

render();
