import { Component } from 'react';
import * as THREE from 'three-full';
import * as dat from 'dat.gui';
import TWEEN from '@tweenjs/tween.js';
import firebase from '../firebase';
import gifshot from 'gifshot';
import { Bird, Boid } from '../util';
import reservoir from '../assets/scene_1/reservoir_2.png';
import leafOne from '../assets/scene_1/leaf_1.png';
import leafTwo from '../assets/scene_1/leaf_2.png';
import frog from '../assets/scene_1/frog.png';

// import Anime from 'react-anime';
// import { dataToWeight } from '../util/';
// import '../css/App.css';
// import '../css/common.css';

export default class extends Component {
  
  // componentWillMount() {
  //   const firebaseRef = firebase.database().ref('/records');
  //   firebaseRef.on('value', (snap) => {
  //     this.setState({
  //       data: snap.val(),
  //     })
  //   })
  // }
  render() {
    const storageRef = firebase.storage().ref();
    const sceneOneRef = storageRef.child('scene_1');

    let camera, scene, renderer, birds, bird, boid, boids, leaves;
    let frogGeometry, frogMaterial, leafGeometry, leafOneMaterial, leafTwoMaterial;
    let worldPlanes;
    // let contols;   
    let picStrings, interval;
    const gui = new dat.GUI();

    const options = {
      addFrog: addFrog,
      addBird: addBird,
      addLeaf: addLeaf,
      start: start,
      export: exportFirebase,
      exportGIF: exportGIF,
    }

    gui.add(options, 'addFrog');
    gui.add(options, 'addBird');
    gui.add(options, 'addLeaf');
    gui.add(options, 'start');
    gui.add(options, 'export');
    gui.add(options, 'exportGIF');

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    };
    
    const init = () => {
      camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000)
      camera.position.set(0, 0, 500);
      // camera.position.set(800, 0, 0);
      camera.lookAt(0, 0, 0);
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xffffff);
      birds = [];
      boids = [];
      leaves = [];
      picStrings = [];
      
      // renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
      renderer = new THREE.CanvasRenderer();
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);
      window.addEventListener('resize', onWindowResize, false);
      // contols = new THREE.OrbitControls(camera);
      const loader = new THREE.TextureLoader();
      loader.load(reservoir, (floorTexture) => {
        const floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
        const floorGeometry = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight, 1, 1);
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.z = -10;
        floor.rotation.x = Math.PI;
        floor.rotation.y = Math.PI;
        floor.rotation.z = Math.PI;
        scene.add(floor);
      });
      loader.load(frog, (texture) => {
        frogMaterial = new THREE.MeshBasicMaterial({ 
          map: texture,
          side: THREE.DoubleSide,
          transparent: true
        });
        frogGeometry = new THREE.PlaneGeometry(70, 70 , 1, 1);
      });

      leafGeometry = new THREE.PlaneGeometry(40, 40);
      loader.load(leafOne, (texture) => {
        leafOneMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
        });
      })
      loader.load(leafTwo, (texture) => {
        leafTwoMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
        })
      })
      worldPlanes = generateWorldPlanes();
    }
    function generateWorldPlanes() {
      const planes = [];
      planes.push(new THREE.Plane(new THREE.Vector3(1, 0, 0), -(window.innerWidth/2 + 100)));
      planes.push(new THREE.Plane(new THREE.Vector3(-1, 0, 0), -(window.innerWidth/2 + 100)));
      planes.push(new THREE.Plane(new THREE.Vector3(0, 1, 0), -(window.innerHeight/2 + 50)));
      planes.push(new THREE.Plane(new THREE.Vector3(0, -1, 0), -(window.innerHeight/3)));
      planes.push(new THREE.Plane(new THREE.Vector3(0, 0, 1), -700));
      planes.push(new THREE.Plane(new THREE.Vector3(0, 0, -1), -200));
      planes.push(new THREE.Plane(new THREE.Vector3(0, 0, 1), -5));
      planes.push(new THREE.Plane(new THREE.Vector3(0, 1, 0), 40));
      // planes.forEach(plane => {
      //   helper = new THREE.PlaneHelper(plane, 1000, 0xffff00);
      //   scene.add(helper);
      // })
      return planes;
    }
    function addFrog() {
      let frog = new THREE.Mesh(frogGeometry, frogMaterial);
      scene.add(frog);
      frog.position.z = 0;
      tweenFrog(frog);
    }


    function tweenFrog(frog) {
      let randomX = window.innerWidth * (Math.random()*0.77 - 0.3);
      let randomY = -(Math.random() * 0.2 +0.1)* window.innerHeight - 100;
      let pos = { x: randomX, y: randomY };
      let to = { x: randomX, y: randomY + 100 };
      const tween = new TWEEN.Tween(pos).to(to, 1000);
      tween.onUpdate(() => {
        frog.position.x = pos.x;
        frog.position.y = pos.y;
      });
      // tween.easing(TWEEN.Easing.Bounce.In);
      tween.easing(TWEEN.Easing.Elastic.Out);
      tween.start();
    }

    function addBird() {
      boid = new Boid();
      // boid.setWorldSize(500, 500, 400);
      boid.velocity.set(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      )
      boid.setAvoidWalls(true);
      boid.position.set(
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10,
      );
      boid.setWorldSize(window.innerWidth/2 +100, window.innerHeight/2+50, 400)
      // boid.setWorldSize(20, 20, 100);
      boid.setWorldPlanes(worldPlanes);
      bird = new THREE.Mesh(new Bird(), new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff, side: THREE.DoubleSide }));
      bird.phase = Math.floor(Math.random() * 62.83);
      scene.add(bird);
      birds.push(bird);
      boids.push(boid);
    }

    function addLeaf() {
      const materials = [leafOneMaterial, leafTwoMaterial];
      const randomMaterial = materials[Math.floor(Math.random() * 2)];
      const leaf = new THREE.Mesh(leafGeometry, randomMaterial);
      leaf.position.set(-Math.random()*window.innerWidth/2, Math.random()*window.innerHeight/2, 0);
      // leaf.rotation.x = Math.PI / 2;
      leaf.position.z = 2;
      scene.add(leaf);
      tweenLeaf(leaf);
      leaves.push(leaf);
    }
    function tweenLeaf(leaf) {
      let pos = { x: leaf.position.x, y: leaf.position.y };
      const to = { x: window.innerWidth/2+10, y: -Math.random()*window.innerHeight/2 };
      const tween = new TWEEN.Tween(pos).to(to, 2000);
      tween.onUpdate(() => {
        leaf.position.x = pos.x;
        leaf.position.y = pos.y;
        leaf.rotation.z += 0.05;
        leaf.rotation.y += 0.05;
        leaf.rotation.x += 0.05;
      })
      tween.easing(TWEEN.Easing.Linear.None);
      tween.start();
      tween.onComplete(() => scene.remove(leaf))
    }

    function screenshot() {
      const canvas = renderer.domElement;
      const url = canvas.toDataURL();
      // const a = document.createElement("a");
      // a.href = url;
      // a.download = 'wow';
      // a.click();
      picStrings.push(url);
    }

    function start() {
      if(!interval) {
        interval = setInterval(screenshot, 2000);
      }
    }

    function exportFirebase() {
      clearInterval(interval);
      for(let i = 0; i < picStrings.length; i++) {
        const url = picStrings[i];
        const ref = sceneOneRef.child(`pic_${i+1}.png`);
        ref.putString(url, 'data_url').then((snap) => {
          console.log('uploaded pics');
        })
      }
    }

    const getURLs = () => new Promise((resolve) => {
      let promises = [];
      for(let i = 0; i < picStrings.length; i++) {
        promises.push(sceneOneRef.child(`pic_${i+1}.png`).getDownloadURL());
      }
      Promise.all(promises).then(urls => resolve(urls));
    })
   
    function exportGIF() {
      getURLs().then(imageURLs => {
        console.log(imageURLs.length);
        gifshot.createGIF({
          'images': imageURLs,
          'gifWidth': window.innerWidth,
          'gifHeight': window.innerHeight,
          'interval': 1,
        }, (obj) => {
          if(!obj.error) {
            const img = obj.image;
            const ref = sceneOneRef.child('result.gif');
            ref.putString(img, 'data_url').then((snap) => {
            console.log('uploaded gif');
          })
          }
        })
      })
    }
    const renderScene = () => {
      for(let i = 0; i < birds.length; i++) {
        boid = boids[i];
        boid.run(boids);
        bird = birds[i];
        bird.position.copy(boids[i].position);

        let color = bird.material.color;
        color.r = color.g = color.b = ( 500 - bird.position.z*1.5 ) / 1000;
        bird.rotation.y = Math.atan2(-boid.velocity.z, boid.velocity.x);
        bird.rotation.z = Math.asin(boid.velocity.y / boid.velocity.length());
        bird.phase = (bird.phase + (Math.max(0, bird.rotation.z) + 0.1)) % 62.83;
        bird.geometry.vertices[5].y = bird.geometry.vertices[4].y = Math.sin(bird.phase) * 5;
      }
      // rotateLeaves();
      renderer.render(scene, camera);
    }
    const animate = () => {
      requestAnimationFrame(animate);
      // contols.update();
      TWEEN.update();
      renderScene();
    }
    init();
    animate();

    return null;
//     return (
//       <div className="col-flex-container dark" style={{width: '100vw', height: '100vh', alignItems: 'center', justifyContent: 'center'}}>
//         <Anime
//           easing="easeOutExpo"
//           rotate={360}
//           duration={3600}
//           loop={true}>
//            <svg width="128" height="128" viewBox="0 0 128 128">
//   <polygon points="64 68.64 8.574 100 63.446 67.68 64 4 64.554 67.68 119.426 100 " fill="white"></polygon>
// </svg>  
//         </Anime> 
//       </div>
//     );

  }
}