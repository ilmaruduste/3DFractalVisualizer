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