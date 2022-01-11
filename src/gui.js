function createPanel() {
    const panel = new dat.GUI( {width: 310});
    
    const geometrySettings = panel.addFolder('Geometry');
    const cameraSettings = panel.addFolder('Camera');
    const skyboxSettings = panel.addFolder('Skybox');
    
    geometrySettings.add(guiObj, 'fractalOrder', 1, 5, 1).name('Fractal Order');
    var selectedObject = scene.getObjectByName('fractalGeometry');

    // Scale
    geometrySettings.add(selectedObject.scale, 'x', 0, 10, 0.01).name('Width').listen();
    geometrySettings.add(selectedObject.scale, 'y', 0, 10, 0.01).name('Height').listen();
    geometrySettings.add(selectedObject.scale, 'z', 0, 10, 0.01).name('Length').listen();
    
    // Rotation
    geometrySettings.add(guiObj, 'rotationSpeedX', 0, 10, 0.1).listen();
    geometrySettings.add(guiObj, 'rotationSpeedY', 0, 10, 0.1).listen();
    geometrySettings.add(guiObj, 'rotationSpeedZ', 0, 10, 0.1).listen();
    
    // Translation
    geometrySettings.add(guiObj, 'translationSpeedX', 0, 50, 1).listen();
    geometrySettings.add(guiObj, 'translationSpeedY', 0, 50, 1).listen();
    geometrySettings.add(guiObj, 'translationSpeedZ', 0, 50, 1).listen();
    
    // Wireframe setting
    // geometrySettings.add(parent.material, 'wireframe').listen();
    
    // Reset buttons
    geometrySettings.add(guiObj, 'resetCamera').name('Reset Camera');
    geometrySettings.add(guiObj, 'resetGeometry').name('Reset Geometry');
    geometrySettings.add(guiObj, 'deleteFractal').name('Delete Fractal Geometry');
    geometrySettings.add(guiObj, 'generateMengerButton').name('Add Fractal Geometry');
    // geometrySettings.add(guiObj, 'regenerateMengerButton').name('Regenerate Fractal Geometry');
    
    cameraSettings.add(camera, 'fov', 30, 180).name('Field of Vision')
    
    // Rotation
    skyboxSettings.add(guiObj, 'skyboxRotationSpeedX', 0, 5, 0.01).listen().name('Rotation X');
    skyboxSettings.add(guiObj, 'skyboxRotationSpeedY', 0, 5, 0.01).listen().name('Rotation Y');
    skyboxSettings.add(guiObj, 'skyboxRotationSpeedZ', 0, 5, 0.01).listen().name('Rotation Z');
    
    
    panel.open();
  }
  
  function createGuiObject() {
    return {
      fractalOrder: 2,
      rotationSpeedX: 0,
      rotationSpeedY: 1,
      rotationSpeedZ: 0,
      skyboxRotationSpeedX: 0,
      skyboxRotationSpeedY: 0.005,
      skyboxRotationSpeedZ: 0,
      translationSpeedX: 0,
      translationSpeedY: 0,
      translationSpeedZ: 0,
      geometrySize: 7,
      resetCamera: function() {
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 50;
      },
      resetGeometry: function() {
        this.rotationSpeedX = 0,
        this.rotationSpeedY = 1,
        this.rotationSpeedZ = 0,
        this.skyboxRotationSpeedX = 0,
        this.skyboxRotationSpeedY = 0.05,
        this.skyboxRotationSpeedZ = 0,
        this.translationSpeedX = 0,
        this.translationSpeedY = 2,
        this.translationSpeedZ = 0,
        this.geometrySize = 7
      },
      generateMengerButton: function() {
        generateMenger(this.fractalOrder);
      },
      deleteFractal: function() {
        delete3DOBJ('fractalGeometry');
      }
    }
  }