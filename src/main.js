var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xDDDDDD, 1);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(70, WIDTH/HEIGHT, 0.1, 10000);
camera.position.z = 50;
scene.add(camera);

const controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.update();

// var boxGeometry = new THREE.BoxGeometry(10, 10, 10);
// var basicMaterial = new THREE.MeshBasicMaterial({color: 0x0095DD});
// var cube = new THREE.Mesh(boxGeometry, basicMaterial);
// // cube.position.x = -25;
// cube.rotation.set(0.4, 0.2, 0);
// scene.add(cube);

var guiObj = createGuiObject();
var strangeGeometry = new THREE.DodecahedronGeometry(guiObj.geometrySize);
var lambertMaterial = new THREE.MeshLambertMaterial({color: 0x0095DD});
var dodecahedron = new THREE.Mesh(strangeGeometry, lambertMaterial);
// dodecahedron.position.x = 25;
scene.add(dodecahedron);

var light = new THREE.PointLight(0xFFFFFF);
light.position.set(-10, 15, 50);
scene.add(light);

var t = 0;


function createPanel() {
  const panel = new dat.GUI( {width: 310});
  
  const folder1 = panel.addFolder('Geometry');

  
  // folder1.add(dodecahedron.rotation, 'x', 0, 3.14 * 2);
  // folder1.add(dodecahedron.rotation, 'y', 0, 3.14 * 2);
  // folder1.add(dodecahedron.rotation, 'z', 0, 3.14 * 2);
  folder1.add(dodecahedron.scale, 'x', 0, 10, 0.01).name('Width').listen();
  folder1.add(dodecahedron.scale, 'y', 0, 10, 0.01).name('Height').listen();
  folder1.add(dodecahedron.scale, 'z', 0, 10, 0.01).name('Length').listen();
  folder1.add(guiObj, 'rotationSpeedX', 0, 0.2, 0.005).listen();
  folder1.add(guiObj, 'rotationSpeedY', 0, 0.2, 0.005).listen();
  folder1.add(guiObj, 'rotationSpeedZ', 0, 0.2, 0.005).listen();
  folder1.add(guiObj, 'translationSpeedX', 0, 10, 0.01).listen();
  folder1.add(guiObj, 'translationSpeedY', 0, 10, 0.01).listen();
  folder1.add(guiObj, 'translationSpeedZ', 0, 10, 0.01).listen();
  folder1.add(dodecahedron.material, 'wireframe').listen();
  folder1.add(guiObj, 'resetCamera').name('Reset Camera');
  folder1.add(guiObj, 'resetGeometry').name('Reset Geometry');
  folder1.open();
  panel.open();
}

function createGuiObject() {
  return {
    rotationSpeedX: 0,
    rotationSpeedY: 0.01,
    rotationSpeedZ: 0,
    translationSpeedX: 0,
    translationSpeedY: 2,
    translationSpeedZ: 0,
    geometrySize: 7,
    resetCamera: function() {
      camera.position.x = 0;
      camera.position.y = 0;
      camera.position.z = 50;
    },
    resetGeometry: function() {
      this.rotationSpeedX = 0,
      this.rotationSpeedY = 0.01,
      this.rotationSpeedZ = 0,
      this.translationSpeedX = 0,
      this.translationSpeedY = 2,
      this.translationSpeedZ = 0,
      this.geometrySize = 7
    }
  }
}

function render() {
    t += 0.01;
    requestAnimationFrame(render);
    dodecahedron.rotation.x += guiObj.rotationSpeedX;
    dodecahedron.rotation.y += guiObj.rotationSpeedY;
    dodecahedron.rotation.z += guiObj.rotationSpeedZ;
    dodecahedron.position.x = -7*Math.sin(t*guiObj.translationSpeedX);
    dodecahedron.position.y = -7*Math.sin(t*guiObj.translationSpeedY);
    dodecahedron.position.z = -7*Math.sin(t*guiObj.translationSpeedZ);
    controls.update();
    renderer.render(scene, camera);

}
render();
createPanel();
