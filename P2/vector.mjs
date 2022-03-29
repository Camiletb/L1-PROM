class Vector {

    constructor(x, y){
        this._x = x;
        this._y = y;
    }

    normalize() {
        let norma = Math.sqrt(Math.pow(_x, 2) + Math.pow(_y, 2)); //módulo
        _x /= norma;
        _y /= norma; 
        console.log("hola");
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