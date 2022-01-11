var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColor(0xDDDDDD, 1);
document.body.appendChild(renderer.domElement);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(70, WIDTH/HEIGHT, 0.1, 20000);
camera.position.z = 50;
scene.add(camera);

const controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.update();

// Skybox
// https://codinhood.com/post/create-skybox-with-threejs
// Cloudy sky from here: https://opengameart.org/content/sky-box-sunny-day
// Space nebula from here: https://opengameart.org/content/space-nebulas-skybox
const skyboxImage = "skybox";
const materialArray = createMaterialArray(skyboxImage);

skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
skybox = new THREE.Mesh(skyboxGeo, materialArray);
scene.add(skybox);


// Create the menger sponge and center it (kind of) on the page
var parent = new THREE.Object3D();
parent.position.set(0, 0, 0);
parent.name = 'fractalGeometry';
scene.add(parent);

// Render the sponge
var width = 80;
mengerSponge(-3 * width, -3 * width, -3 * width, width, 0, guiObj.fractalOrder);
requestAnimationFrame(render);


function addLightAndHelper(x, y, z, lightIntensity) {
  var light = new THREE.PointLight(0xFFFFFF,lightIntensity);
  light.position.set(x, y, z);
  scene.add(light);
  pointLightHelper = new THREE.PointLightHelper(light, 10);
  scene.add(pointLightHelper);
}


// Add light sources to different places with different intensities
addLightAndHelper(0,0,0,0.05);
addLightAndHelper(500,0,0,0.5);
addLightAndHelper(-500,0,0,0.3);
addLightAndHelper(0,500,0,0.5);
addLightAndHelper(0,-500,0,0.3);
addLightAndHelper(0,-500,500,0.3);
addLightAndHelper(0,0,500,0.5);


scene.background = new THREE.Color(0xFFFFFF);
scene.add(new THREE.AxesHelper(1000));

var t = 0;

// RENDER

function render() {
  t += 0.01;
  requestAnimationFrame(render);
  
  // Skybox
  var skyboxRotationCoef = 0.0001
  skybox.rotation.x += skyboxRotationCoef*guiObj.skyboxRotationSpeedX;
  skybox.rotation.y += skyboxRotationCoef*guiObj.skyboxRotationSpeedY;
  skybox.rotation.z += skyboxRotationCoef*guiObj.skyboxRotationSpeedZ;
  
  // Geometry
  var selectedObject = scene.getObjectByName('fractalGeometry');

  // Scale
  selectedObject.scale.x = guiObj.scaleX
  selectedObject.scale.y = guiObj.scaleY
  selectedObject.scale.z = guiObj.scaleZ

  // Rotation
  var fractalRotationCoef = 0.01
  selectedObject.rotation.x += fractalRotationCoef*guiObj.rotationSpeedX;
  selectedObject.rotation.y += fractalRotationCoef*guiObj.rotationSpeedY;
  selectedObject.rotation.z += fractalRotationCoef*guiObj.rotationSpeedZ;
  
  // Translation
  var fractalTranslationCoef = 0.01
  selectedObject.position.x = -500*Math.sin(t*fractalTranslationCoef*guiObj.translationSpeedX);
  selectedObject.position.y = -500*Math.sin(t*fractalTranslationCoef*guiObj.translationSpeedY);
  selectedObject.position.z = -500*Math.sin(t*fractalTranslationCoef*guiObj.translationSpeedZ);
  controls.update();
  renderer.render(scene, camera);
  

  // Camera
  camera.updateProjectionMatrix();

}

render();
createPanel();
