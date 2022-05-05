// Variables

// Funciones

// Escena
const scene = new THREE.scene();

//primer cubo
const geometry = new THREE.BoxGeometry(3, 1, 3); //width, height, depth
const material = new THREE.MeshLambertMaterial({ color: 0xfb8e00}); // El material más simple que considera la iluminación de la escena, para diferenciar las caras de la figura
const bloque = new THREE.Mesh(geometry, material); //combinación de la geometría y el material
bloque.position.set(0, 0, 0);
scene.add(bloque);

// Iluminación para visualizar la escena
// Luz ambiente
const a_light = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(a_light);

// Cámara
const aspect = window.innerWidth / window.innerHeight;
const width = 10;
const height = width / aspect;

// izq, der, arriba, abajo, plano cercano, plano lejano
const camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 100 );

camera.position.set(4, 4, 4);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setClearColor("#000000");
renderer.setSize(window.innerWidth, window.innerHeight);
//renderer.render(scene, camera);

//Añadir a HTML
document.body.appendChild(renderer.domElement);

var render = function () {
    requestAnimationFrame( render );
  
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  
    // Render la escena
    renderer.render(scene, camera);
  };

  render();