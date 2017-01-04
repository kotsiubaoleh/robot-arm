
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;

var camera, scene, renderer, light;

var viewportWidth, viewportHeight;

var base, mesh2, mesh3, mesh4, hand;  // robot parts

var segments, arm;

// use this for keyboard control
var tabValue = 0;

// cameria variables
var radious = 7000, theta = 45, phi = 60, onMouseDownTheta = 45, onMouseDownPhi = 60,
  isMouseDown = false, onMouseDownPosition, mouse3D, projector, ray;

init();
animate();

function init() {

  container = document.getElementById( 'container' );

  // Perspective Camera
  //camera = new THREE.Camera( 60, window.innerWidth / window.innerHeight, 1, 15000 );
  //camera.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
  //camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
  //camera.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
  //camera.target.position.y = 200;

  // Orthographic Camera
  var aspect = window.innerWidth / window.innerHeight;
  viewportHeight = 80;
  viewportWidth = viewportHeight * aspect;
  camera = new THREE.OrthographicCamera( viewportWidth / - 2, viewportWidth / 2, viewportHeight / 2, viewportHeight / - 2, 1, 15000 );
  camera.position.z =  5000;

  camera.lookAt(0,200,0);

  scene = new THREE.Scene();

  scene.add( new THREE.AmbientLight( 0xffffff )  );
  //
  // light = new THREE.DirectionalLight( 0xffffff );
  // light.position.set( 0, 0, 1 );
  // light.position.normalize();
  // scene.add( light );

  arm = new Arm([
    {length: 20},
    {length: 20},
    {length: 20}]);

  arm.onChanged = onArmUpdate;

  segments = [];

  for (var i = 0; i < arm.segments.length; ++i) {
    var geometry = new THREE.CylinderGeometry(2,2,arm.segments[i].length,4);
    geometry.translate(0,arm.segments[i].length / 2,0); // Move pivot point to the bottom
    var material = new THREE.MeshBasicMaterial( {color: Math.random() * 0xffffff} );
    segments[i] = new THREE.Mesh(geometry, material);

    if (i > 0) {
      segments[i - 1].add(segments[i]);
      segments[i].position.y = arm.segments[i-1].length;
    }
  }

  scene.add(segments[0]);

  // renderer start
  //renderer = new THREE.CanvasRenderer();
  renderer = new THREE.WebGLRenderer( /*{ antialias: true }*/ );
  renderer.setSize( window.innerWidth, window.innerHeight );

  container.appendChild( renderer.domElement );
  container.addEventListener('mousemove', onMouseMove);
  container.addEventListener('mousedown', onMouseDown);

  //document.addEventListener( 'keydown', onDocumentKeyDown, false );
  //document.addEventListener( 'click', moveRobot, false );

  //setInterval(function () {moveRobot()}, 3000);
}
//keyboard events
// function onDocumentKeyDown( event ) {

// 	switch( event.keyCode ) {

// 		case 32: toggleJoint(); break;         // space
// 		case 37: offsetScene(-1,0); break;     //arrow <-
// 		case 39: offsetScene( 1,0); break;     //arrow ->
//        case 13: moveRobot(); break;           //enter

// 	}

// }
function toggleJoint() {

  if (tabValue === dummyArray.length - 1) {
    tabValue = 0;
  }
  else {
    tabValue++;
  }

}
function offsetScene( offsetX, offsetY ) {

  var mag = 0.01;
  // currently offsetY not used
  if (dummyArray[tabValue].control === 'y') {
    dummyArray[tabValue].rotation.y = dummyArray[tabValue].rotation.y + Math.sin(offsetX*mag);
  }
  if (dummyArray[tabValue].control === 'z') {
    dummyArray[tabValue].rotation.z = dummyArray[tabValue].rotation.z + Math.sin(offsetX*mag);
  }
}


function cloneMesh() {

  // base  geom[0]
  // mesh2 geom[1]
  // mesh3 geom[2]
  // mesh4 geom[3]
  // hand  geom[4]

  var material = new THREE.MultiMaterial();
  var tempMesh = new THREE.Mesh( geom[2], material);

  tempMesh.scale.x = tempMesh.scale.y = tempMesh.scale.z = 75;

  tempMesh.position.copy( mesh3.matrixWorld.getPosition() );

  scene.add(tempMesh);

  flower.push(tempMesh);
}

function animate() {

  requestAnimationFrame( animate );
  // TWEEN.update();
  render();

}

function render() {

  renderer.render( scene, camera );

}
function moveRobot () {

  // check to make sure no tween is active
  for (var i in tweens) {
    if (tweens[i].status) {  // if status = true then tween in progress
      return false;
    }
  }

  var mag  = 4;
  var time = 6000;
  // currently offsetY not used
  for (var i in dummyArray) {

    if (Math.random() > 0.5) {

      var sign  = -1;

    } else {

      var sign = 1;

    }

    if (dummyArray[i].control === 'y') {
      tweens[i].status = true;
      tweens[i].tween = new TWEEN.Tween( { y : dummyArray[i].rotation.y, obj : dummyArray[i], tween : tweens[i] } )
        .to( { y : dummyArray[i].rotation.y + ((mag * Math.random()) * sign) }, time * Math.random() )
        .onUpdate( function () {
          this.obj.rotation.y = this.y;
        } )
        .easing( TWEEN.Easing.Exponential.InOut )
        .onComplete( function () {
          this.tween.status = false;
        })
        .start();
    }
    if (dummyArray[i].control === 'z') {
      tweens[i].status = true;
      tweens[i].tween = new TWEEN.Tween( { z : dummyArray[i].rotation.z, obj : dummyArray[i], tween : tweens[i] } )
        .to( { z : dummyArray[i].rotation.z + ((mag * Math.random())*sign) }, time * Math.random() )
        .onUpdate( function () {
          this.obj.rotation.z = this.z;
        } )
        .easing( TWEEN.Easing.Exponential.InOut )
        .onComplete( function () {
          this.tween.status = false;
        })
        .start();
    }
  }
  return true;
}

function onMouseMove(event) {
  // var scenePos = screenToScene(event.clientX, event.clientY);
  // // console.log(scenePos);
  // segments.forEach(function (segment) {
  //   segment.rotation.z = event.clientX / window.innerWidth  * 2 * Math.PI;
  // })
}

function onMouseDown(event) {
  var to = screenToScene(event.clientX, event.clientY);
  arm.moveTo(to.x, to.y);
}

function onArmUpdate() {
  arm.segments.forEach(function(armSegment, i) {
    segments[i].rotation.z = armSegment.angle;

  });
}

function screenToScene(x, y) {
  var xRatio = viewportWidth / window.innerWidth;
  var sceneX  = (x - window.innerWidth / 2) * xRatio + camera.position.x;
  var yRation = viewportHeight / window.innerHeight;
  var sceneY = -(y - window.innerHeight / 2) * yRation + camera.position.y;

  return new THREE.Vector2(sceneX, sceneY);
}