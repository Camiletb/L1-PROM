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
        console.log("Norma: " + norma);
        this._x /= norma;
        this._y /= norma; 
        console.log("Normax: " + this._x);
        console.log("Normay: " + this._y);
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
        _x *= n;
        _y *= n;
    }

    copy(v) {
        this._x = v.x;
        this._y = v.y;
        console.log(v.x + ", " + v.y);
    }

    
}

class Bola {
    constructor(posx, posy, speed) {
        this._x = posx;
        this._y = posy;
        this._pos = new Vector(this._x, this._y);
        this._vel = speed;
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
        this._speedpala = 3;

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
        if(this._y >=5 && this._y <= height - this._tam - 5){

            this._y += deltaY * this._speedpala;
        }else if(this.y < 5){
            this._y += 5;
        }else{
            this._y -=5;
            
        }
        this.dibujar();
    }
}

// Formulario
var formBoton = document.getElementById("submit");
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

// Auxiliares
var cont = 0;
var cont1 = 0;
var cont2 = 0;
var gol = false;

window.addEventListener("keydown", keyHandlerDown);
window.onload = start();

function start() {
    // Eventos
    formBoton.addEventListener("click", function(){updateData(); resetPos();});

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
    console.log("Marcador");
    dir_bola = new Vector(0, 0);
    console.log("1: " + dir_bola.x);
    bola = new Bola(width/2, height/2, vel_bola);
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
    ctx.beginPath();
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Best of 5!", width/2, 65); // goles J1
    ctx.stroke();
    ctx.font = "50px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(cont1, 35, 65); // goles J1
    ctx.fillStyle = "black";
    ctx.textAlign = "right";
    ctx.fillText(cont2, width - 35, 65); // goles J2
    ctx.stroke();

    // Bola
    bola.dibujar();
    
    // Pala 1
    pala1.dibujar();

    // Pala 2
    pala2.dibujar();
}

function update() {
    if (gol == false) {
        evaluarBordes();
        bola.mover();
        draw();
    }
    else {
        setTimeout(draw, 3000);
        setTimeout(resetGol, 3000);
    }

    cont++;
}

function resetGol() {
    gol = false;
}

function resetPos() {
    pos_pala1 = pos_ini_pala1;
    pos_pala2 = pos_ini_pala2;
    console.log("2: " + dir_bola.x);
    bola.setPos(new Vector(centro_campo.x, centro_campo.y));
    //dir_bola = new Vector(0, 0);
    salida_bola = (Math.floor(Math.random() * 10) % 4);

    switch(salida_bola) {
        case 0:

            dir_bola.copy(new Vector(Math.cos(toRad(55)), Math.sin(toRad(55))));
            console.log("dir_bola: " + dir_bola.x + ", " + dir_bola.y);
            dir_bola.normalize();
            console.log("dir_bola: " + dir_bola.x + ", " + dir_bola.y);
            break;
        case 1:

            dir_bola.copy(new Vector(Math.cos(toRad(125)), Math.sin(toRad(125))));
            console.log("dir_bola: " + dir_bola.x + ", " + dir_bola.y);
            dir_bola.normalize();

            console.log("dir_bola: " + dir_bola.x + ", " + dir_bola.y);
            break;
        case 2:

            dir_bola.copy(new Vector(Math.cos(toRad(235)), Math.sin(toRad(235))));
            console.log("dir_bola: " + dir_bola.x + ", " + dir_bola.y);
            dir_bola.normalize();

            console.log("dir_bola: " + dir_bola.x + ", " + dir_bola.y);

            break;
        case 3:
        default:

            dir_bola.copy(new Vector(Math.cos(toRad(305)), Math.sin(toRad(305))));
            console.log("dir_bola: " + dir_bola.x + ", " + dir_bola.y);
            dir_bola.normalize();

            console.log("dir_bola: " + dir_bola.x + ", " + dir_bola.y);

            break;
    }
    console.log("3: " + dir_bola.x);
}

function moverBola() {
    bola.pos.add(dir_bola);
}

function toRad(grados) {
    return (grados * 2 * Math.PI / 360);
}

function evaluarBordes() {
    // Gol izquierda
    if (bola.x <= 0) {
        dir_bola = new Vector(0, 0);
        gol = true;
        cont1++;
        setTimeout(draw, 3000);
        setTimeout(moverBola, 3000);
        resetPos();
    }

    // Gol derecha
    if (bola.x >= width) {
        dir_bola = new Vector(0, 0);
        gol = true;
        cont2++;
        setTimeout(draw, 3000);
        setTimeout(moverBola, 3000);
        resetPos();
    }

    // Rebote con paredes
    if (bola.y <= 0 + radio_bola) {
        dir_bola = new Vector(dir_bola.x, -dir_bola.y);
    } 
    else if (bola.y > height - radio_bola) {
        dir_bola = new Vector(dir_bola.x, -dir_bola.y);
    }

    // Rebote con palas
    if(bola.x <=width/2){
        if(bola.x - radio_bola <= pala1.x + pala1.w){
            console.log("Coincide la x");
            if(bola.y >= pala1.y - 5 && bola.y <= pala1.y + pala1.tam + 5){
                console.log("Colision pala1");
                dir_bola = new Vector(-dir_bola.x, dir_bola.y);
                console.log("Rebote");
            }
        }
    }
    else{
        if(bola.x + radio_bola >= pala2.x){
            console.log("Coincide la x");
            if(bola.y >= pala2.y - 5 && bola.y <= pala2.y + pala2.tam + 5){
                console.log("Colision pala2");
                dir_bola = new Vector(-dir_bola.x, dir_bola.y);
                console.log("Rebote");
            }
        }
    }

    // Si la bola toca la pala, entonces rebota. Si está dentro de su y, y coincide la x
    //if(pos_bola.y == pala1.y)
}

function updateData() {
    // Nombres
    nombreJ1 = formJ1.value || nombreJ1;
    nombreJ2 = formJ2.value || nombreJ2;

    // Tamaño pala
    pala1._tam = formTam.value || pala1._tam;
    pala2._tam = formTam.value || pala2._tam;

    // Velocidad bola
    vel_bola = formVel.value || vel_bola;
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