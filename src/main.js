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

skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
skybox = new THREE.Mesh(skyboxGeo, materialArray);
scene.add(skybox);


// Geometry
var guiObj = createGuiObject();
// var strangeGeometry = new THREE.DodecahedronGeometry(guiObj.geometrySize);
// var lambertMaterial = new THREE.MeshLambertMaterial({color: 0x0095DD});
// var dodecahedron = new THREE.Mesh(strangeGeometry, lambertMaterial);
// // dodecahedron.position.x = 25;
// scene.add(dodecahedron);

// Create the menger sponge and center it (kind of) on the page
var parent = new THREE.Object3D();
parent.position.set(0, 0, 0);
scene.add(parent);

// Render the sponge
var width = 80;
var last = 2; 
mengerSponge(-3 * width, -3 * width, 0, width, 0, last);
requestAnimationFrame(render);

function addLightAndHelper(x, y, z, lightIntensity) {
  var light = new THREE.PointLight(0xFFFFFF,lightIntensity);
  light.position.set(x, y, z);
  scene.add(light);
  pointLightHelper = new THREE.PointLightHelper(light, 10);
  scene.add(pointLightHelper);
}

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


function createPanel() {
  const panel = new dat.GUI( {width: 310});
  
  const geometrySettings = panel.addFolder('Geometry');
  const cameraSettings = panel.addFolder('Camera');
  const skyboxSettings = panel.addFolder('Skybox');
  
  // Scale
  geometrySettings.add(parent.scale, 'x', 0, 10, 0.01).name('Width').listen();
  geometrySettings.add(parent.scale, 'y', 0, 10, 0.01).name('Height').listen();
  geometrySettings.add(parent.scale, 'z', 0, 10, 0.01).name('Length').listen();
  
  // Rotation
  geometrySettings.add(guiObj, 'rotationSpeedX', 0, 0.2, 0.005).listen();
  geometrySettings.add(guiObj, 'rotationSpeedY', 0, 0.2, 0.005).listen();
  geometrySettings.add(guiObj, 'rotationSpeedZ', 0, 0.2, 0.005).listen();
  
  // Translation
  geometrySettings.add(guiObj, 'translationSpeedX', 0, 10, 0.01).listen();
  geometrySettings.add(guiObj, 'translationSpeedY', 0, 10, 0.01).listen();
  geometrySettings.add(guiObj, 'translationSpeedZ', 0, 10, 0.01).listen();
  
  // Wireframe setting
  // geometrySettings.add(parent.material, 'wireframe').listen();
  
  // Reset buttons
  geometrySettings.add(guiObj, 'resetCamera').name('Reset Camera');
  geometrySettings.add(guiObj, 'resetGeometry').name('Reset Geometry');
  
  cameraSettings.add(camera, 'fov', 30, 180).name('Field of Vision')
  
  // Rotation
  skyboxSettings.add(guiObj, 'skyboxRotationSpeedX', 0, 5, 0.01).listen().name('Rotation X');
  skyboxSettings.add(guiObj, 'skyboxRotationSpeedY', 0, 5, 0.01).listen().name('Rotation Y');
  skyboxSettings.add(guiObj, 'skyboxRotationSpeedZ', 0, 5, 0.01).listen().name('Rotation Z');
  
  
  panel.open();
}

function createGuiObject() {
  return {
    rotationSpeedX: 0,
    rotationSpeedY: 0.01,
    rotationSpeedZ: 0,
    skyboxRotationSpeedX: 0,
    skyboxRotationSpeedY: 0.005,
    skyboxRotationSpeedZ: 0,
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
      this.skyboxRotationSpeedX = 0,
      this.skyboxRotationSpeedY = 0.05,
      this.skyboxRotationSpeedZ = 0,
      this.translationSpeedX = 0,
      this.translationSpeedY = 2,
      this.translationSpeedZ = 0,
      this.geometrySize = 7
    }
  }
}



// MengerSponge creation courtesy of cacabo:
// https://github.com/cacabo/mengersponge/blob/master/three.js
/**
 * Construct sponge
 * @param x       - starting x position for the sponge
 * @param y       - starting y position for the sponge
 * @param z       - starting z position for the sponge
 * @param width   - width of the sponge to be constructed
 * @param current - current level of recursive depth in constructing the sponge
 * @param last    - last level of recursive depth to be reached
 */
 function mengerSponge(x, y, z, width, current, last) {
  // Error checking
  if (last < 0) {
    alert("Invalid negative last parameter");
    return;
  } else if (last > 5) {
    alert("Last parameter will cause too much lag");
    return;
  } else if (last == 0) {
    cube(0, 0, 0, x, y, z, width * 3);
    return;
  }

  // iterate over the x axis
  for (var i = 1; i <= 3; i++) {
    // iterate over the y axis
    for (var j = 1; j <= 3; j++) {
      // iterate over the z axis
      for (var k = 1; k <= 3; k++) {
        // count the number of overlaps between x, y, and z coordinates
        // relative to the middle third of each cube
        var num2 = 0;
        if (i == 2) num2++;
        if (j == 2) num2++;
        if (k == 2) num2++;

        // If there are less than 2 overlaps, then there should be a mengerSponge
        // in the specified area
        if (num2 < 2) {
          // Recurse further if there are more levels
          if (current < last - 1) {
            mengerSponge(
              (x + i * width),
              (y + j * width),
              (z + k * width),
              (width / 3),
              (current + 1),
              last
            );
          } else if (current == last - 1) {
            // Otherwise draw a cube in the specified location
            cube(i, j, k, x, y, z, width);
          }
        }
      }
    }
  }
}

/**
 * Draw a cube of the passed in width in the passed in coordinates
 * @param i     - x index out of 2 of the cubes in the sponge
 * @param j     - y index out of 2 of the cubes in the sponge
 * @param k     - z index out of 2 of the cubes in the sponge
 * @param x     - starting x pixel index of the sponge
 * @param y     - starting y pixel index of the sponge
 * @param z     - starting z pixel index of the sponge
 * @param width - width of the cube to be added
 */
function cube(i, j, k, x, y, z, width) {
  // create a cube of the passed in width
  var geometry = new THREE.BoxGeometry(width, width, width);
  var material = new THREE.MeshPhongMaterial({color: 0x0095DD});
  var cube = new THREE.Mesh(geometry, material);

  // Set the position of the cube
  cube.position.set(
    x + ((i + 1) * width),
    y + ((j + 1) * width),
    z + ((k + 1) * width)
  );

  // Add the cube to the screen
  parent.add(cube);
}


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
  parent.rotation.x += guiObj.rotationSpeedX;
  parent.rotation.y += guiObj.rotationSpeedY;
  parent.rotation.z += guiObj.rotationSpeedZ;
  parent.position.x = -7*Math.sin(t*guiObj.translationSpeedX);
  parent.position.y = -7*Math.sin(t*guiObj.translationSpeedY);
  parent.position.z = -7*Math.sin(t*guiObj.translationSpeedZ);
  controls.update();
  renderer.render(scene, camera);
  

    // Camera
    camera.updateProjectionMatrix();
    // camera.position.set(1200, -250, 2000);

}
render();
createPanel();
