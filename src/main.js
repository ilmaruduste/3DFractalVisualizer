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

// Skybox
// https://codinhood.com/post/create-skybox-with-threejs
// Cloudy sky from here: https://opengameart.org/content/sky-box-sunny-day
// Space nebula from here: https://opengameart.org/content/space-nebulas-skybox

function createPathStrings(filename) {
  const basePath = "./ref/skybox/";
  const baseFilename = basePath + filename;
  const fileType = ".png";
  const sides = ["front", "back", "bottom", "top", "right", "left"];
  const pathStings = sides.map(side => {
    return baseFilename + "_" + side + fileType;
  });
  return pathStings;
}

function createMaterialArray(filename) {
  const skyboxImagepaths = createPathStrings(filename);
  const materialArray = skyboxImagepaths.map(image => {
    let texture = new THREE.TextureLoader().load(image);
    return new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
  });
  return materialArray;
}

const skyboxImage = "skybox";
const materialArray = createMaterialArray(skyboxImage);

skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
skybox = new THREE.Mesh(skyboxGeo, materialArray);
scene.add(skybox);


// Geometry
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
  
  const geometrySettings = panel.addFolder('Geometry');
  const cameraSettings = panel.addFolder('Camera');
  const skyboxSettings = panel.addFolder('Skybox');
  
  
  // folder1.add(dodecahedron.rotation, 'x', 0, 3.14 * 2);
  // folder1.add(dodecahedron.rotation, 'y', 0, 3.14 * 2);
  // folder1.add(dodecahedron.rotation, 'z', 0, 3.14 * 2);
  
  // Scale
  geometrySettings.add(dodecahedron.scale, 'x', 0, 10, 0.01).name('Width').listen();
  geometrySettings.add(dodecahedron.scale, 'y', 0, 10, 0.01).name('Height').listen();
  geometrySettings.add(dodecahedron.scale, 'z', 0, 10, 0.01).name('Length').listen();
  
  // Rotation
  geometrySettings.add(guiObj, 'rotationSpeedX', 0, 0.2, 0.005).listen();
  geometrySettings.add(guiObj, 'rotationSpeedY', 0, 0.2, 0.005).listen();
  geometrySettings.add(guiObj, 'rotationSpeedZ', 0, 0.2, 0.005).listen();
  
  // Translation
  geometrySettings.add(guiObj, 'translationSpeedX', 0, 10, 0.01).listen();
  geometrySettings.add(guiObj, 'translationSpeedY', 0, 10, 0.01).listen();
  geometrySettings.add(guiObj, 'translationSpeedZ', 0, 10, 0.01).listen();
  
  // Wireframe setting
  geometrySettings.add(dodecahedron.material, 'wireframe').listen();
  
  // Reset buttons
  geometrySettings.add(guiObj, 'resetCamera').name('Reset Camera');
  geometrySettings.add(guiObj, 'resetGeometry').name('Reset Geometry');
  
  // geometrySettings.open();
  
  cameraSettings.add(camera, 'fov', 30, 180).name('Field of Vision')
  // cameraSettings.open();
  
  // Rotation
  skyboxSettings.add(skybox.rotation, 'x', 0, 0.1, 0.0005).listen().name('Rotation X');
  skyboxSettings.add(skybox.rotation, 'y', 0, 0.1, 0.0005).listen().name('Rotation Y');
  skyboxSettings.add(skybox.rotation, 'z', 0, 0.1, 0.0005).listen().name('Rotation Z');
  
  
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
  
  // Geometry
  dodecahedron.rotation.x += guiObj.rotationSpeedX;
  dodecahedron.rotation.y += guiObj.rotationSpeedY;
  dodecahedron.rotation.z += guiObj.rotationSpeedZ;
  dodecahedron.position.x = -7*Math.sin(t*guiObj.translationSpeedX);
  dodecahedron.position.y = -7*Math.sin(t*guiObj.translationSpeedY);
  dodecahedron.position.z = -7*Math.sin(t*guiObj.translationSpeedZ);
  controls.update();
  renderer.render(scene, camera);
  

    // Camera
    camera.updateProjectionMatrix();
    // camera.position.set(1200, -250, 2000);

}
render();
createPanel();
