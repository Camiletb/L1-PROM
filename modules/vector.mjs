
class Vector {

    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    normalize() {
        let norma = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)); //módulo
        x /= norma;
        y /= norma; 
    }

    add(x, y) {
        this.x += x;
        this.y += y;
    }

    sub(x, y) {
        this.x -= x;
        this.y -= y;
    }

    mult(n){
        x *= n;
        y *= n;
    }

    copy(v){
        this.x = v.x;
        this.y = v.y;
    }

    // Setters y Getters
    get x(){
        return this.x;
    }
    get y(){
        return this.y;
    }
    set x(a){
        this.x = a;
    }
    set y(a){
        this.y = a;
    }
}