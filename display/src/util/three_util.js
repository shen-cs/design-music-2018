import { easeOutElastic, easeOutBack } from './easing';
import * as THREE from 'three-full';

class ObjContainer {
  constructor(obj, scene, camera, renderer, dismissable=true) {
    this.obj = obj;
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.timer = 0;
    this.popState = false;
    this.dismissState = false;
    this.scene.add(this.obj);
    this.dismissable = dismissable;
  }

  scale(s) {
    this.obj.scale.set(s, s, s);
  }

  enlarge(sat, easing, timestep) {
    if(!this.popState) {
      requestAnimationFrame(() => this.enlarge(sat, easing, timestep));
      this.timer++;
      const s = easing(this.timer, 0, sat, timestep);
      this.scale(s, s, s);
      this.renderer.render(this.scene, this.camera);
      if(this.timer > timestep) {
        this.popState = true;
        this.timer = 0;
        if (this.dismissable) setTimeout(() => this.dismiss(sat, easing, timestep), 2000);
      }
    }
  }
  pop(sat, easing=easeOutElastic, time=150) {
    this.enlarge(sat, easing, time);
  }

  shrink(sat, easing, timestep) {
    if(!this.dismissState) {
      requestAnimationFrame(() => this.shrink(sat, easing, timestep));
      this.timer++;
      const s = easing(this.timer, sat, -sat, timestep);
      this.scale(s, s, s);
      this.renderer.render(this.scene, this.camera);
      if(this.timer > timestep) {
        this.dismissState = true;
        this.timer = 0;
      }
    }
  }

  dismiss(sat, easing=easeOutBack, timestep=150) {
    this.shrink(sat, easing, timestep);
  }
}

function add(item, list) {
  if(!list.find((element => element.x === item.x && element.y === item.y))) {
    list.push(item);
  }
}
function mirror(coor, list) {
  const {x, y} = coor;
  add({x, y}, list);
  add({x: 0-x, y}, list);
  add({x: 0-x, y: 0-y}, list);
  add({x, y: 0-y}, list);
  add({x: y, y: x}, list);
  add({x: 0-y, y: 0-x}, list);
  add({x: y, y: 0-x}, list);
  add({x: 0-y, y: x}, list)
}

function shuffle(arr) {
  let currentIdx = arr.length, tempVal, randomIdx;
  while(currentIdx !== 0) {
    randomIdx = Math.floor(Math.random() * currentIdx);
    currentIdx -= 1;
    tempVal = arr[currentIdx];
    arr[currentIdx] = arr[randomIdx];
    arr[randomIdx] = tempVal;
  }
  return arr;
}
function generateSlist(spacing, numLayers) {
  let slist = [];
  for(let layer = 0; layer < numLayers; layer++) {
    let x = layer * spacing;
    for(let i = 0; i < layer + 1; i++) {
      let y = i * spacing;
      mirror({x, y}, slist);
    }
  }
  return shuffle(slist);
}

// slist = shuffle(slist);


class Bird extends THREE.Geometry {
  constructor() {
    super();
    // this.v = this.v.bind(this);
    // this.f3 = this.f3.bind(this);
    this.v(   5,   0,   0 );
    this.v( - 5, - 2,   1 );
    this.v( - 5,   0,   0 );
    this.v( - 5, - 2, - 1 );
    this.v(   0,   2, - 6 );
    this.v(   0,   2,   6 );
    this.v(   2,   0,   0 );
    this.v( - 3,   0,   0 );
    this.f3( 0, 2, 1 );
    this.f3( 4, 7, 6 );
    this.f3( 5, 6, 7 );
    this.computeFaceNormals();
    
  }
  v( x, y, z ) {
    this.vertices.push( new THREE.Vector3( x, y, z ).multiplyScalar(2) );
  }
  f3( a, b, c ) {
    this.faces.push( new THREE.Face3( a, b, c ) );
  }
}
// Based on https://www.openprocessing.org/sketch/6910
var Boid = function () {
  var vector = new THREE.Vector3(),
  _acceleration, _width = 500, _height = 500, _depth = 200, _goal, _neighborhoodRadius = 100,
  _maxSpeed = 4, _maxSteerForce = 0.1, _avoidWalls = false;
  let _planes = [];
  this.position = new THREE.Vector3();
  this.velocity = new THREE.Vector3();
  _acceleration = new THREE.Vector3();
  this.setGoal = function ( target ) {
    _goal = target;
  };
  this.setAvoidWalls = function ( value ) {
    _avoidWalls = value;
  };
  this.setWorldSize = function ( width, height, depth ) {
    _width = width;
    _height = height;
    _depth = depth;
  };
  this.setWorldPlanes = function(planes) {
    _planes = planes;
  }
  this.run = function ( boids ) {
    if ( _avoidWalls ) {
      // this.avoidSymmetric();
      this.avoidPlanes();
    }/* else {
      this.checkBounds();
    }
    */
    if ( Math.random() > 0.5 ) {
      this.flock( boids );
    }
    this.move();
  };
  this.avoidPlanes = function() {
    _planes.forEach((plane, index, planes) => {
      if(index === 6) {
        // Note that this is ad-hoc if statement
        // const xz_plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 40);
        // console.log(planes[7].distanceToPoint(this.position));
        if(planes[7].distanceToPoint(this.position) > 0) {
          return;
        }
      }
      else if(index === 7) {
        // const xz_plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 40);
        if(planes[6].distanceToPoint(this.position) > 0 || planes[6].distanceToPoint(this.position) < -5) {
          return;
        }
      }
      // let normal = plane.normal;
      let projection = new THREE.Vector3();
      plane.projectPoint(this.position, projection);
      // console.log(projection);
      vector.set(projection.x, projection.y, projection.z);
      vector = this.avoid(vector);
      // console.log(vector);
      vector.multiplyScalar(5);
      _acceleration.add(vector);
    })

  }
  this.avoidSymmetric = function() {
    vector.set( - _width, this.position.y, this.position.z );
    vector = this.avoid( vector );
    vector.multiplyScalar( 5 );
    _acceleration.add( vector );
    vector.set( _width, this.position.y, this.position.z );
    vector = this.avoid( vector );
    vector.multiplyScalar( 5 );
    _acceleration.add( vector );
    vector.set( this.position.x, - _height, this.position.z );
    vector = this.avoid( vector );
    vector.multiplyScalar( 5 );
    _acceleration.add( vector );
    vector.set( this.position.x, _height, this.position.z );
    vector = this.avoid( vector );
    vector.multiplyScalar( 5 );
    _acceleration.add( vector );
    vector.set( this.position.x, this.position.y, - _depth );
    vector = this.avoid( vector );
    vector.multiplyScalar( 5 );
    _acceleration.add( vector );
    vector.set( this.position.x, this.position.y, _depth );
    vector = this.avoid( vector );
    vector.multiplyScalar( 5 );
    _acceleration.add( vector );
  }
  this.flock = function ( boids ) {
    if ( _goal ) {
      _acceleration.add( this.reach( _goal, 0.005 ) );
    }
    _acceleration.add( this.alignment( boids ) );
    _acceleration.add( this.cohesion( boids ) );
    _acceleration.add( this.separation( boids ) );
  };
  this.move = function () {
    this.velocity.add( _acceleration );
    var l = this.velocity.length();
    if ( l > _maxSpeed ) {
      this.velocity.divideScalar( l / _maxSpeed );
    }
    this.position.add( this.velocity );
    _acceleration.set( 0, 0, 0 );
  };
  this.checkBounds = function () {
    if ( this.position.x >   _width ) this.position.x = - _width;
    if ( this.position.x < - _width ) this.position.x =   _width;
    if ( this.position.y >   _height ) this.position.y = - _height;
    if ( this.position.y < - _height ) this.position.y =  _height;
    if ( this.position.z >  _depth ) this.position.z = - _depth;
    if ( this.position.z < - _depth ) this.position.z =  _depth;
  };
  //
  this.avoid = function ( target ) {
    var steer = new THREE.Vector3();
    steer.copy( this.position );
    steer.sub( target );
    steer.multiplyScalar( 1 / this.position.distanceToSquared( target ) );
    return steer;
  };
  this.repulse = function ( target ) {
    var distance = this.position.distanceTo( target );
    if ( distance < 150 ) {
      var steer = new THREE.Vector3();
      steer.subVectors( this.position, target );
      steer.multiplyScalar( 0.5 / distance );
      _acceleration.add( steer );
    }
  };
  this.reach = function ( target, amount ) {
    var steer = new THREE.Vector3();
    steer.subVectors( target, this.position );
    steer.multiplyScalar( amount );
    return steer;
  };
  this.alignment = function ( boids ) {
    var count = 0;
    var velSum = new THREE.Vector3();
    for ( var i = 0, il = boids.length; i < il; i++ ) {
      if ( Math.random() > 0.6 ) continue;
      var boid = boids[ i ];
      var distance = boid.position.distanceTo( this.position );
      if ( distance > 0 && distance <= _neighborhoodRadius ) {
        velSum.add( boid.velocity );
        count++;
      }
    }
    if ( count > 0 ) {
      velSum.divideScalar( count );
      var l = velSum.length();
      if ( l > _maxSteerForce ) {
        velSum.divideScalar( l / _maxSteerForce );
      }
    }
    return velSum;
  };
  this.cohesion = function ( boids ) {
    var count = 0;
    var posSum = new THREE.Vector3();
    var steer = new THREE.Vector3();
    for ( var i = 0, il = boids.length; i < il; i ++ ) {
      if ( Math.random() > 0.6 ) continue;
      var boid = boids[ i ];
      var distance = boid.position.distanceTo( this.position );
      if ( distance > 0 && distance <= _neighborhoodRadius ) {
        posSum.add( boid.position );
        count++;
      }
    }
    if ( count > 0 ) {
      posSum.divideScalar( count );
    }
    steer.subVectors( posSum, this.position );
    var l = steer.length();
    if ( l > _maxSteerForce ) {
      steer.divideScalar( l / _maxSteerForce );
    }
    return steer;
  };
  this.separation = function ( boids ) {
    var posSum = new THREE.Vector3();
    var repulse = new THREE.Vector3();
    for ( var i = 0, il = boids.length; i < il; i ++ ) {
      if ( Math.random() > 0.6 ) continue;
      var boid = boids[ i ];
      var distance = boid.position.distanceTo( this.position );
      if ( distance > 0 && distance <= _neighborhoodRadius ) {
        repulse.subVectors( this.position, boid.position );
        repulse.normalize();
        repulse.divideScalar( distance );
        posSum.add( repulse );
      }
    }
    return posSum;
  }
}
export { ObjContainer, generateSlist, Bird, Boid };

