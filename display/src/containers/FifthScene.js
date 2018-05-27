import { Component } from 'react';
import * as THREE from 'three-full';
import * as dat from 'dat.gui';
import TWEEN from '@tweenjs/tween.js';
import gifshot from 'gifshot';
import firebase from '../firebase';
import { generateSlist } from '../util/';
export default class extends Component {
  render() {
    const storageRef = firebase.storage().ref();
    const sceneFiveRef = storageRef.child('scene_5');

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    let renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
    renderer.setSize(document.body.clientWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
    // let axesHelper = new THREE.AxesHelper(5);
    let directLight = new THREE.DirectionalLight( 0xffffff , 0.7 );
    let ambient = new THREE.AmbientLight( 0x4f4f4f );
    const radius = 0.5;
    let geometry = new THREE.SphereGeometry(radius, 32, 32);
    let sphereList = [];
    let stopped = false;
    let particleCount = 500;
    let gui = new dat.GUI();
    let slist = generateSlist(1.5, 9);
    let picStrings = [], interval;
    let t = 0;
    const rotateLight = (light, target) => {
      const x = 15 * Math.sqrt(2) * Math.sin(t + Math.PI / 4);
      const y = 15 * Math.sqrt(2) * Math.cos(t + Math.PI / 4);
      t = (t > Math.PI * 2) ? 0 : t + 0.02;
      light.position.x = x;
      light.position.y = y;
      // light.target = target;
      // light.lookAt(target.position);
      light.lookAt(0, 0, 0);
    }


    directLight.position.set( 2, 2, 1 );
    camera.position.set(15, 15, 15);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);
    
    scene.add(directLight);
    scene.add(ambient);
    // scene.add(axesHelper);
    
    const colors = {
      'lala': 0xff1493,
      'wooow': 0x00ffff,
      'woohoo': 0xffff00,
    };

    let i = 0;
    const addSphere = () => {
      const colorList = Object.values(colors);
      const color = colorList[Math.floor(Math.random() * colorList.length)];
      const material = new THREE.MeshLambertMaterial({color});
      
      // const material = new THREE.MeshStandardMaterial({color});
      let sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(0, 0, 0);
      sphere.position.set(slist[i].x, slist[i].y, 0);
      i = (++i) % slist.length;
      scene.add(sphere);
      sphere.color = color;
      sphereList.push(sphere);
      let state = { scale: 0.01 };
      let to = { scale: 1 };
      const tweenAdd = new TWEEN.Tween(state).to(to, 1500);
      tweenAdd.onUpdate(() => {
        const { scale } = state;
        sphere.scale.set(scale, scale, scale);
      })
      tweenAdd.easing(TWEEN.Easing.Elastic.Out);
      tweenAdd.onComplete(() => {
        to.scale = 0.01;
        state.scale = 1;
      })
      const tweenRemove = new TWEEN.Tween(state).to(to, 1000);
      tweenRemove.delay(5000);
      tweenRemove.onUpdate(() => {
        const { scale } = state;
        if(!stopped) {
          sphere.scale.set(scale, scale, scale);
        }
      })
      tweenRemove.onComplete(() => {
        if(!stopped) {
          scene.remove(sphere);
          sphereList.splice(sphereList.indexOf(sphere), 1);
          sphere = null;
        }
      })
      tweenRemove.easing(TWEEN.Easing.Exponential.Out);
      tweenAdd.chain(tweenRemove);
      tweenAdd.start();
    }


    const explodeBall = (pos, color) => {
      
      const planeMaterial = new THREE.MeshPhongMaterial({ color, side: THREE.DoubleSide });
      const particleSystem = [];
      const { x, y, z } = pos;
      for(let i = 0; i < particleCount; i++) {
        const planeGeo = new THREE.PlaneGeometry(Math.random() , Math.random() , 1, 1);
        let plane = new THREE.Mesh(planeGeo, planeMaterial);
        plane.position.set(
          x + radius * Math.random(),
          y + radius * Math.random(),
          z + radius * Math.random()
        );
        plane.rotation.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
        particleSystem.push(plane);
        scene.add(plane);
        const duration = 3000;
        let position = {
          x: plane.position.x,
          y: plane.position.y,
          z: plane.position.z,
          scale: 1,
        };
        let target = {
          x: plane.position.x + duration * (Math.random()-0.5) * 0.02,
          y: plane.position.y + duration * (Math.random()-0.5) * 0.02,
          z: plane.position.z + duration * (Math.random()-0.5)* 0.02,
          scale: 0.01,
        }
        const tweenPlane = new TWEEN.Tween(position).to(target, duration);
        tweenPlane.onUpdate(() => {
          // plane.position.set(position);
          const { x, y, z, scale } = position;
          plane.position.x = x;
          plane.position.y = y;
          plane.position.z = z;
          plane.rotation.x += 0.1;
          plane.rotation.y += 0.1;
          plane.rotation.z += 0.1;
          plane.scale.set(scale, scale, scale);
        });
        tweenPlane.onComplete(() => {
          particleSystem.splice(particleSystem.indexOf(plane), 1);
          scene.remove(plane);
          plane = null;
        })
        tweenPlane.easing(TWEEN.Easing.Exponential.Out);
        // tweenPlane.easing(TWEEN.Easing.Quadratic.InOut);
        tweenPlane.start();
      }
    }

    const explode = () => {
      if(sphereList.length) {
        let sphere = sphereList.pop();
        const pos = {
            x: sphere.position.x,
            y: sphere.position.y,
            z: sphere.position.z,
          };
        explodeBall(pos, sphere.color);
        scene.remove(sphere);
        sphere = null;
      }
    }
    const stop = () => {
      stopped = true;
      console.log(sphereList.length);
    }

    
    
    // const firebaseRef = firebase.database().ref('/records');
    //   firebaseRef.on('value', (snap) => {
    //     const keys = Object.keys(snap.val());
    //     console.log(keys.length)
    //     const latestKey = keys[keys.length - 1];
    //     const { type } = snap.val()[latestKey];
    //     addSphere(colors[type]);
    // })

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
        const ref = sceneFiveRef.child(`pic_${i+1}.png`);
        ref.putString(url, 'data_url').then((snap) => {
          console.log('uploaded pics');
        })
      }
    }

    const getURLs = () => new Promise((resolve) => {
      let promises = [];
      for(let i = 0; i < picStrings.length; i++) {
        promises.push(sceneFiveRef.child(`pic_${i+1}.png`).getDownloadURL());
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
            const ref = sceneFiveRef.child('result.gif');
            ref.putString(img, 'data_url').then((snap) => {
            console.log('uploaded gif');
          })
          }
        })
      })
    }
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    }

    window.addEventListener('resize', onWindowResize, false);

    let options = {
      addSphere: addSphere,
      rotateCamera: false,
      stop: stop,
      explode: explode,
      start: start,
      export: exportFirebase,
      exportGIF: exportGIF,
    };
    gui.add(options, 'addSphere');
    gui.add(options, 'rotateCamera');
    gui.add(options, 'stop');
    gui.add(options, 'explode');
    gui.add(options, 'start');
    gui.add(options, 'export');
    gui.add(options, 'exportGIF');
    

    const animate = () => {
      requestAnimationFrame(animate);
      // sphereContainer.enlarge(1);
      // popSphere(sphere);
      // if(start_shrink)
      // shrink(sphere, 1);
      TWEEN.update();
      if(options.rotateCamera)
        rotateLight(camera);
      renderer.render(scene, camera);
    }
    animate();
    return null;
  }
}