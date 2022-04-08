class Vector {

    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    // Getters
    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    // Funciones
    normalize() {
        let norma = Math.sqrt(Math.pow(this._x, 2) + Math.pow(this._y, 2)); // módulo
        // console.log("Norma: " + norma);
        this._x /= norma;
        this._y /= norma; 
        // console.log("Normax: " + this._x);
        // console.log("Normay: " + this._y);
    }
    
    add(v) {
        this._x += v.x;
        this._y += v.y;
    }

    sub(v) {
        this._x -= v.x;
        this._y -= v.y;
    }

    mult(n) {
        this._x *= n;
        this._y *= n;
    }

    copy(v) {
        this._x = v.x;
        this._y = v.y;
        // console.log(v.x + ", " + v.y);
    }

    
}

class Bola {
    constructor(posx, posy) {
        this._x = posx;
        this._y = posy;
        this._pos = new Vector(this._x, this._y);
        this._vel = vel_bola;
    }

    // Getters
    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get pos() {
        return this._pos;
    }

    get speed() {
        return this._vel;
    }

    // Funciones
    setPos(v) {
        this._pos = v;
        this._x = this._pos.x;
        this._y = this._pos.y;
    }

    updateSpeed() {
        this._vel = vel_bola;
    }

    mover() {
        this._pos.add(dir_bola);
        this._x = this._pos.x;
        this._y = this._pos.y;
    }
    
    dibujar() {
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.strokeStyle = "indigo";
        grad_bola = ctx.createRadialGradient(this._x, this._y, radio_bola, this._x, this._y, radio_bola/5);
        grad_bola.addColorStop(0, "indigo");
        grad_bola.addColorStop(1, "mediumvioletred");
        ctx.fillStyle = grad_bola;
        ctx.arc(this._x, this._y, radio_bola, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }
}

class Pala {
    constructor (posx, tam, img, quepala) {
        this._tam = tam;
        this._x = posx;
        this._y = centro_campo.y - (this._tam/2);
        this._posini = new Vector(this._x, this._y);
        this._width = 5;
        this._img = img;
        this._quepala = quepala;
        this._speedpala = 10;
    }

    // Getters
    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get posini() {
        return this._posini;
    }

    get w() {   // width
        return this._width;
    }

    get tam() {
        return this._tam;
    }


    set tam(tam) {
        this._tam = tam;
    }

    resetPos() {
        this._x = this._posini.x;
        this._y = this._posini.y;
    }

    // Funciones
    dibujar() {
        let imagen = new Image();
        if (this._quepala == 1) {
            imagen.src = rutaPala1;
        } 
        else {
            imagen.src = rutaPala2;
        }

        var pat = ctx.createPattern(imagen, "repeat");

        ctx.beginPath();
        ctx.fillStyle = pat;
        ctx.fillRect(this._x, this._y, this._width, this._tam);
        ctx.stroke();
    }

    mover(deltaY) {
        if (this._y >=5 && this._y <= height - this._tam - 5) {
            this._y += deltaY * this._speedpala;
        }
        else if (this.y < 5) {
            this._y += 5;
            if (1 == this._quepala)
                panner.pan.value = -1;
            else 
                panner.pan.value = 1;

            palaElement.play();
            panner.pan.value = 0;
        }
        else {
            this._y -=5;
            palaElement.play();
        }
        this.dibujar();
    }
}

// Formulario
var formBoton = document.getElementById("submit");
var formReset = document.getElementById("reset");
var formJ1 = document.getElementById("inputJ1");
var formJ2 = document.getElementById("inputJ2");
var formTam = document.getElementById("inputTamPala");
var formVel = document.getElementById("inputVelBola");
var formVol = document.getElementById("inputVol");

// Jugadores
var nombreJ1;
var nombreJ2;

// Lienzo
var canvas;
var ctx;

// Medidas
var largo_pala;
var line_dash;
var radio_centro;
var radio_bola;
var width;
var height;

// Posiciones
var pos_ini_pala1;
var pos_ini_pala2;
var pos_pala1;
var pos_pala2;
var centro_campo; // Centro

// Imágenes
var rutaPala1 = './pala1.png';
var rutaPala2 = './pala2.png';
var pala1;
var pala2;

// Bola
var bola;
var grad_bola;
var dir_bola;
var salida_bola;
var vel_bola;

// Audio
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;
let pongElement;
let palaElement;
let golElement;
let endElement;
let pongTrack;
let palaTrack;
let golTrack;
let golEndTrack;
let gainNode;
let pannerOptions;
let panner;

// Auxiliares
var cont1 = 0;
var cont2 = 0;
var cont = cont1 + cont2;
var maxgoles = 9;
var gol = false;
var jugadores = true;
var fin = false;

// Eventos
formBoton.addEventListener("click", function(){updateData();});
formReset.addEventListener("click", resetAll);
formVol.addEventListener("change", updateVol);
window.addEventListener("keydown", keyHandlerDown);
window.onload = start();

function start() {
    // Audio
    audioCtx = new AudioContext();
    gainNode = audioCtx.createGain();
    pannerOptions = {pan: 0};
    panner = new StereoPannerNode(audioCtx, pannerOptions);
    pongElement = document.getElementById("soundPong");
    palaElement = document.getElementById("soundPala");
    golElement = document.getElementById("soundGol");
    endElement = document.getElementById("soundEnd");
    pongTrack = audioCtx.createMediaElementSource(pongElement);
    palaTrack = audioCtx.createMediaElementSource(palaElement);
    golTrack = audioCtx.createMediaElementSource(golElement);
    endTrack = audioCtx.createMediaElementSource(endElement);
    pongTrack.connect(gainNode).connect(panner).connect(audioCtx.destination);
    palaTrack.connect(gainNode).connect(audioCtx.destination);
    golTrack.connect(gainNode).connect(audioCtx.destination);

    // Jugadores
    nombreJ1 = formJ1.value;
    nombreJ2 = formJ2.value;

    // Lienzo
    canvas = document.getElementById("campo");
    ctx = canvas.getContext("2d");

    // Medidas
    largo_pala = 100;
    line_dash = [5, 3];
    radio_centro = 50;
    radio_bola = 10;
    width = canvas.width;
    height = canvas.height;

    // Centro
    centro_campo = new Vector(width/2, height/2); 

    // Posiciones
    pos_ini_pala1 = new Vector(0, height/2 - largo_pala/2);
    pos_ini_pala2 = new Vector(width - 5, height/2 - largo_pala/2);
    
    pala1 = new Pala(pos_ini_pala1.x, largo_pala, rutaPala1, 1);
    pala2 = new Pala(pos_ini_pala2.x, largo_pala, rutaPala2, 2);

    // Bola
    dir_bola = new Vector(0, 0);
    vel_bola = 2;
    console.log("Vel en start: " + vel_bola);
    console.log("1: " + dir_bola.x);
    bola = new Bola(width/2, height/2);
    resetPos();
    deltaX = 10;
    deltaY = 10;

    setInterval(update, 10);
}

function draw() {
    // Fondo
    ctx.beginPath();
    ctx.fillStyle = "darkseagreen";
    ctx.strokeStyle = "darkseagreen";
    ctx.fillRect(0, 0, width, height);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Línea vertical discontinua
    ctx.beginPath();
    ctx.setLineDash(line_dash);
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";
    ctx.moveTo((width / 2), 0);
    ctx.lineTo((width / 2), height);
    ctx.stroke();

    // Círculo discontinuo
    ctx.beginPath();
    ctx.setLineDash(line_dash);
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";
    ctx.arc(centro_campo.x, centro_campo.y, radio_centro, 0, 2 * Math.PI);
    ctx.stroke();

    // Marcador
    if (true == jugadores) {
        ctx.beginPath();
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        if (cont <= maxgoles-2)
            ctx.fillText(maxgoles - cont +" balls!", width/2, 65); // goles J1
        else {
            ctx.fillText("Last ball!", width/2, 65); // goles J1
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.font = "bold 50px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(nombreJ1, width/4, height/2 - 80);
        ctx.stroke();
        ctx.beginPath();
        ctx.font = "bold 100px Arial";
        ctx.fillStyle = "white";
        ctx.stroke();
        ctx.beginPath();
        ctx.fillText(cont2, width/4, height/2 + 35); // goles J1
        ctx.font = "bold 50px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(nombreJ2, 3 * width/4, height/2 - 80);
        ctx.stroke();
        ctx.beginPath();
        ctx.font = "bold 100px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(cont1, 3 * width/4, height/2 + 35); // goles J2
        ctx.stroke();
    } else {
        let gana;

        if (cont1 > cont2) {
            //ganador J2
            gana = nombreJ2;
        }
        else {
            //ganador J1
            gana = nombreJ1;
        }

        ctx.beginPath();
        ctx.font = "80px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(gana + " wins!", width/2, height/2); // goles J1
        ctx.stroke();
        setTimeout(resetAll, 10000);
    }

    // Bola
    bola.dibujar();
    
    // Pala 1
    pala1.dibujar();

    // Pala 2
    pala2.dibujar();
}

function update() {
    if(!gol)
        evaluarBordes(); 
    
    draw();
   
}
function resetGol() {
    resetPos();
    gol = false;
}

function resetPos() {
    
    pala1.resetPos();
    pala2.resetPos();
    console.log("2: " + dir_bola.x);
    bola.setPos(new Vector(centro_campo.x, centro_campo.y));
    dir_bola = new Vector(0, 0);
    salida_bola = (Math.floor(Math.random() * 10) % 4);
    if(maxgoles != cont){
        //trigger 0
        setTimeout(corregirDireccion(0), 3000);
    }
    console.log("vel: " + bola.speed);
    //dir_bola.mult(bola.speed);
    console.log("3: " + dir_bola.x);
}

function moverBola() {
    bola.pos.add(dir_bola);
}

function toRad(grados) {
    return (grados * 2 * Math.PI / 360);
}

function evaluarBordes() {
    if(bola.x <=0 || bola.x >= width){
        bola.setPos(new Vector(width/2, height/2));
        corregirDireccion(3);
        gol = true;
        
        //Subir gol
        if(bola.x <= 0)
            cont1++;
        else
            cont2++;
        
        //resetPos();
        setTimeout(resetGol, 3000);
        setTimeout(moverBola, 3000);
        cont++;
        golElement.play();

        //caso para cuando acaba el partido (booleano)
        if(maxgoles === cont){
            endElement.play();
            fin = true;
            jugadores = false;
            //resetAll();
            setTimeout(resetAll, 5000);
        }
    } else {
        bola.mover();
    }


    // Rebote con paredes
    if (bola.y <= radio_bola) {
        panner.pan.value = 0;
        pongElement.play();
        corregirDireccion(1);

        //dir_bola = new Vector(dir_bola.x, -dir_bola.y);
    } 
    else if (bola.y > height - radio_bola) {
        panner.pan.value = 0;
        pongElement.play();
        corregirDireccion(1);

        //dir_bola = new Vector(dir_bola.x, -dir_bola.y);
    }

    // Rebote con palas
    if (bola.x <=width/2) {
        if (bola.x - radio_bola <= pala1.x + pala1.w) {
            //console.log("Coincide la x");
            if (bola.y >= pala1.y - 5 && bola.y <= pala1.y + pala1.tam + 5) {
                //console.log("Colision pala1");
                panner.pan.value = -1;
                pongElement.play();
                panner.pan.value = 0;
                corregirDireccion(2);
                //console.log("Rebote");
            }
        }
    } else {
        if (bola.x + radio_bola >= pala2.x) {
            //console.log("Coincide la x");
            if (bola.y >= pala2.y - 5 && bola.y <= pala2.y + pala2.tam + 5) {
                //console.log("Colision pala2");
                panner.pan.value = 1;
                pongElement.play();
                panner.pan.value = 0;
                corregirDireccion(2);
                //console.log("Rebote");
            }
        }
    }

    // Si la bola toca la pala, entonces rebota. Si está dentro de su y, y coincide la x
    //if(pos_bola.y == pala1.y)
}

function corregirDireccion(trigger){
    /* Posibles valores del trigger
    3 = gol
    2 = pala
    1 = pared
    0 = salida
    */
    switch(trigger){
        case 3:
            dir_bola = new Vector(0, 0);
            break;
        case 2:
            dir_bola = new Vector(-dir_bola.x, dir_bola.y);
            break;
        case 1:
            dir_bola = new Vector(dir_bola.x, -dir_bola.y);
            break;
        case 0:
            let a;
            let b;
            let valoresPosibles = [-1, 1];
            let random;
            random = valoresPosibles[Math.floor(Math.random() * valoresPosibles.length)];
            a = Math.cos(toRad(35) * random);
            random = valoresPosibles[Math.floor(Math.random() * valoresPosibles.length)];
            b = Math.sin(toRad(35) * random);
            dir_bola.copy(new Vector(a, b));

            dir_bola.mult(bola.speed);
            break;
    }
}

function updateData() {
    // Nombres
    nombreJ1 = formJ1.value || nombreJ1;
    nombreJ2 = formJ2.value || nombreJ2;

    // Tamaño pala
    largo_pala = parseInt(formTam.value || largo_pala);
    pala1 = new Pala(pos_ini_pala1.x, largo_pala, rutaPala1, 1);
    pala2 = new Pala(pos_ini_pala2.x, largo_pala, rutaPala2, 2);
    //pala1._tam = parseInt(formTam.value || pala1._tam);
    //pala2._tam = parseInt(formTam.value || pala2._tam);

    // Velocidad bola
    let au = parseInt(formVel.value);
    console.log("value: "+ au);
    switch(au){
        case 3:
            vel_bola = 4;
        break;
        case 2:
        default:
            vel_bola = 1;
        break;
        case 1:
            vel_bola = 0.5;
        break;
    }
    console.log("Vel en updateData: " + vel_bola);
    bola.updateSpeed();
    console.log("Vel en updateData: " + vel_bola);
}

var refresco1;
var refresco2;

function keyHandlerDown(e){
    let code = e.keyCode;
    switch(code){
        //J1
        case 87: //Arriba
            pala1.mover(-1);
            break;
        case 83: //Abajo
            pala1.mover(1);
            break;
            //J2
        case 38: //Arriba
            pala2.mover(-1);
            break;
        case 40: //Abajo
            pala2.mover(1);
            break;
    }
}

function updateVol() {
    gainNode.gain.value = parseInt(inputVol.value);
}

function resetAll () {
    bola.setPos(new Vector(centro_campo.x, centro_campo.y));
    if(!fin){

        resetGol();
        gol = false;
        
        
    }else{
        cont = 0;
        cont1 = 0;
        cont2 = 0;
        fin = false;
    }
    jugadores = true;
    //start();
}