// Lienzo
var canvas = document.getElementById("campo");
var ctx = canvas.getContext("2d");

// Medidas
var largo_pala = 100;
var line_dash = [5, 3];
var radio_centro = 50;
var radio_bola = 10;
var width = canvas.width;
var height = canvas.height;

// Posiciones
var pos_ini1 = [0, height/2 - largo_pala/2];
var pos_ini2 = [width, height/2 - largo_pala/2];
var pos1 = pos_ini1;
var pos2 = pos_ini2;
var centro = [width/2, height/2]; // Centro

// Imágenes
var imgPala1 = new Image();
imgPala1.src= "./pala1.png";
var patPala1 = ctx.createPattern(imgPala1, "repeat");
var imgPala2 = new Image();
imgPala2.src= "./pala2.png";
var patPala2 = ctx.createPattern(imgPala2, "repeat");

window.onload = start();

function start() {
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
    ctx.arc(centro[0], centro[1], radio_centro, 0, 2*Math.PI);
    ctx.stroke();

    // Bola
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.strokeStyle = "indigo";
    var grad_bola = ctx.createRadialGradient(centro[0], centro[1], radio_bola, centro[0], centro[1], radio_bola/5);
    grad_bola.addColorStop(0, "indigo");
    grad_bola.addColorStop(1, "mediumvioletred");
    ctx.fillStyle = grad_bola;
    ctx.arc(centro[0], centro[1], radio_bola, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();

    // Pala 1
    ctx.beginPath();
    ctx.fillStyle = patPala1;
    ctx.rect(pos1[0], pos1[1], 20, largo_pala);
    ctx.fill();
    ctx.stroke();

    // Pala 2
    ctx.beginPath();
    ctx.fillStyle = patPala2;
    ctx.rect(pos2[0] - 20, pos2[1], 20, largo_pala);
    ctx.fill();
    ctx.stroke();
}