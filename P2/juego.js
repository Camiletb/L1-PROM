class Vector {

    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    normalize() {
        let norma = Math.sqrt(Math.pow(_x, 2) + Math.pow(_y, 2)); // módulo
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

    mult(n) {
        _x *= n;
        _y *= n;
    }

    copy(v) {
        this._x = v.x;
        this._y = v.y;
    }

    // Setters _y Getters
    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }
}

class Bola {
    constructor(posx, posy, speed) {
        this._x = posx;
        this._y = posy;
        this._vel = speed;
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get speed() {
        return this._vel;
    }

    mover() {
        this._x = this._x + _vel.x;
        this._y = this._y + _vel.y;
    }
    
}
class Pala {
    constructor(posx, posy, tam, img, quepala) {
        this._x = posx;
        this._y = posy;
        this._tam = tam;
        this._img = img;
        this._quepala = quepala;

    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get tam() {
        return this._tam;
    }

    dibujar() {
        //let imagen = new Image();
        //imagen.src = this._img;
        //let pattern = ctx.createPattern(imagen, "repeat-y");

        //ctx.beginPath();
        //ctx.fillStyle = pattern;
        //ctx.fillRect(this._x, this._y, 20, this._tam);
        //ctx.stroke();
        //quepala++;

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
        ctx.fillRect(this.x, this.y, 20, this.tam);
        ctx.stroke();
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
var rutaPala1 = './pala1.png';
var rutaPala2 = './pala2.png';
var pala1;
var pala2;

// Bola
var grad_bola;
var pos_bola;
var deltaX; //incremento
var deltaY;
var dir_bola;
var salida_bola;

// Auxiliares
var cont = 0;
var cont1 = 0;
var cont2 = 0;
var gol = false;


window.onload = start();
function start() {
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
    pos_ini_pala2 = new Vector(width - 20, height/2 - largo_pala/2);
    
    pala1 = new Pala(pos_ini_pala1.x, pos_ini_pala1.y, largo_pala, rutaPala1, 1);
    pala2 = new Pala(pos_ini_pala2.x, pos_ini_pala2.y, largo_pala, rutaPala2, 2);

    centro_campo = new Vector(width/2, height/2); // Centro

    // Bola

    console.log("Marcador");
    reset();
    //console.log(pos_bola.x);
    //console.log(pos_bola.y);
    deltaX = 10;
    deltaY = 10;
    

    // Imágenes
    //rutaPala2 = new Image();
    //rutaPala2.src= "./pala2.png";
    //patPala2 = ctx.createPattern(rutaPala2, "repeat");
    
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
    grad_bola = ctx.createRadialGradient(pos_bola.x, pos_bola.y, radio_bola, pos_bola.x, pos_bola.y, radio_bola/5);
    grad_bola.addColorStop(0, "indigo");
    grad_bola.addColorStop(1, "mediumvioletred");
    ctx.fillStyle = grad_bola;
    ctx.arc(pos_bola.x, pos_bola.y, radio_bola, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();

    
    // Pala 1
    pala1.dibujar();
    // Pala 2
    pala2.dibujar();
    //let imagen = new Image();
    //imagen.src = this.rutaPala2;
    //var pat = ctx.createPattern(imagen, "repeat");

    //ctx.beginPath();
    //ctx.fillStyle = pat;
    //ctx.fillRect(pos_pala2.x, pos_pala2.y, 20, 100);
    //ctx.stroke();
}

function update() {
    if(gol == false) {
        evaluarBordes();
        moverBola();
        draw();
        
    }
    else {
        setTimeout(draw, 3000);
        setTimeout(click, 3000);
    }

    cont++;
}

function click() {
    gol = false;
}

function reset() {
    //pos_bola = new Vector(width/2, height/2);

    pos_pala1 = pos_ini_pala1;
    pos_pala2 = pos_ini_pala2;
    
    pos_bola = new Vector(centro_campo.x, centro_campo.y);
    dir_bola = new Vector(0, 0);
    salida_bola = (Math.floor(Math.random()*10)%4);
    
    switch(salida_bola) {
        case 0:
            dir_bola = new Vector(Math.cos(toRad(55)), Math.sin(toRad(55)));
            break;
        case 1:
            dir_bola = new Vector(Math.cos(toRad(125)), Math.sin(toRad(125)));
            break;
        case 2:
            dir_bola = new Vector(Math.cos(toRad(235)), Math.sin(toRad(235)));
            break;
        case 3:
        default:
            dir_bola = new Vector(Math.cos(toRad(305)), Math.sin(toRad(305)));
            break;
    }

    console.log("J1: " + cont1 + " - " + cont2 + " :J2");
}

function moverBola() {
    
    // pos_bola.add(new Vector(deltaX, deltaY));
    pos_bola.add(dir_bola);
    
}

function toRad(grados) {
    return (grados * 2 * Math.PI / 360);
}

function evaluarBordes() {
    // Gol izquierda
    if (pos_bola.x <= 0) {
        dir_bola = new Vector(0, 0);
        gol = true;
        cont1++;
        setTimeout(draw, 3000);
        setTimeout(moverBola, 3000);
        reset();
    }

    // Gol derecha
    if (pos_bola.x >= width) {
        dir_bola = new Vector(0, 0);
        gol = true;
        cont2++;
        setTimeout(draw, 3000);
        setTimeout(moverBola, 3000);
        reset();
    }

    // Rebote
    if (pos_bola.y <= 0 + radio_bola) {
        dir_bola = new Vector(dir_bola.x, -dir_bola.y);
    } 
    else if (pos_bola.y > height - radio_bola) {
        dir_bola = new Vector(dir_bola.x, -dir_bola.y);

    }

    // Si la bola toca la pala, entonces rebota. Si está dentro de su y, y coincide la x
    //if(pos_bola.y == pala1.y)
}