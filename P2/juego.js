class Vector {

    constructor(x, y){
        this._x = x;
        this._y = y;
    }

    normalize() {
        let norma = Math.sqrt(Math.pow(_x, 2) + Math.pow(_y, 2)); //módulo
        _x /= norma;
        _y /= norma; 
    }

    add(v) {
        this._x += v.x;
        this._y += v.y;
    }

    sub(v) {
        this._x -= v.x;
        this._y -= v.y;
    }

    mult(n){
        _x *= n;
        _y *= n;
    }

    copy(v){
        this._x = v.x;
        this._y = v.y;
    }

    // Setters _y Getters
    get x(){
        return this._x;
    }
    get y(){
        return this._y;
    }
}

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
var imgPala1;
var patPala1;
var imgPala2;
var patPala2;

// Bola
var grad_bola;
var pos_bola;
var deltaX; //incremento
var deltaY;
var dir_bola;
var salida_bola;

// Auxiliares
var cont = 0;

window.onload = start();
function start(){
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

    // Posiciones
    pos_ini_pala1 = new Vector(0, height/2 - largo_pala/2);
    pos_ini_pala2 = new Vector(width, height/2 - largo_pala/2);
    //pos_pala1.copy(pos_ini_pala1);
    //pos_pala2.copy(pos_ini_pala2);
    pos_pala1 = pos_ini_pala1;
    pos_pala2 = pos_ini_pala2;
    centro_campo = new Vector(width/2, height/2); // Centro

    // Bola
    pos_bola = new Vector(centro_campo.x, centro_campo.y);
    console.log(pos_bola.x);
    console.log(pos_bola.y);
    deltaX = 10;
    deltaY = 10;
    salida_bola = (Math.floor(Math.random()*10)%4);
    switch(salida_bola) {
        case 0:
            dir_bola = new Vector(Math.cos(toRad(35)), Math.sin(toRad(35)));
            break;
        case 1:
            dir_bola = new Vector(Math.cos(toRad(145)), Math.sin(toRad(145)));
            break;
        case 2:
            dir_bola = new Vector(Math.cos(toRad(215)), Math.sin(toRad(215)));
            break;
        case 3:
        default:
            dir_bola = new Vector(Math.cos(toRad(325)), Math.sin(toRad(325)));
            break;
    }

    // Imágenes
    imgPala1 = new Image();
    imgPala1.src= "./pala1.png";
    patPala1 = ctx.createPattern(imgPala1, "repeat");
    imgPala2 = new Image();
    imgPala2.src= "./pala2.png";
    patPala2 = ctx.createPattern(imgPala2, "repeat");
    
    
    setInterval(update, 100);
}

function draw() {


    // Fondo
    ctx.beginPath();
    ctx.fillStyle = "darkseagreen";
    ctx.strokeStyle = "darkseagreen";
    ctx.rect(0, 0, width, height);
    ctx.fill();
    ctx.stroke();

    // Línea vertical discontinua
    ctx.beginPath();
    ctx.setLineDash(line_dash);
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";
    ctx.moveTo((width/2), 0);
    ctx.lineTo((width/2), height);
    ctx.stroke();

    // Círculo discontinuo
    ctx.beginPath();
    ctx.setLineDash(line_dash);
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";
    ctx.arc(centro_campo.x, centro_campo.y, radio_centro, 0, 2 * Math.PI);
    ctx.stroke();

    // Bola
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.strokeStyle = "indigo";
    console.log(pos_bola.x);
    console.log(pos_bola.y);
    grad_bola = ctx.createRadialGradient(pos_bola.x, pos_bola.y, radio_bola, pos_bola.x, pos_bola.y, radio_bola/5);
    grad_bola.addColorStop(0, "indigo");
    grad_bola.addColorStop(1, "mediumvioletred");
    ctx.fillStyle = grad_bola;
    ctx.arc(pos_bola.x, pos_bola.y, radio_bola, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();

    // Pala 1
    ctx.beginPath();
    //ct_x.fillStyle = patPala1;
    ctx.fillRect(pos_pala1.x, pos_pala1.y, 20, largo_pala);
    //ct_x.fill();
    ctx.stroke();

    // Pala 2
    ctx.beginPath();
    //ct_x.fillStyle = patPala2;
    ctx.fillRect(pos_pala2.x - 20, pos_pala2.y, 20, largo_pala);
    //ct_x.fill();
    ctx.stroke();
}
function update() {
    moverBola();
    draw();
    cont++;
    console.log(cont);
}

function moverBola() {
    evaluarBordes();
    pos_bola.add(new Vector(deltaX, deltaY));
    
}

function toRad(grados) {
    return (grados * 2 * Math.PI / 360);
}

function evaluarBordes(){
    // Gol
    if(pos_bola.x <= 0 + radio_bola || pos_bola.x >= width - radio_bola)
        start();
    // Rebote
    if(pos_bola.y <= 0 + radio_bola || pos_bola.y >= height - radio_bola)
        dir_bola.y = -dir_bola.y;
}