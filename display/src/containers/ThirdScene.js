import { Component } from 'react';
import * as THREE from 'three-full';
import * as dat from 'dat.gui';
import gifshot from 'gifshot';
import firebase from '../firebase';
import spark from '../assets/spark1.png';
import { ObjContainer, easeOutCubic } from '../util/';
export default class extends Component {
  render() {
    const storageRef = firebase.storage().ref();
    const sceneThreeRef = storageRef.child('scene_3');
    const databaseRef = firebase.database().ref('/records_3');
    let records = [];
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    let renderer = new THREE.WebGLRenderer();
    const gui = new dat.GUI();
    let controls = new THREE.OrbitControls(camera);
    renderer.setSize(document.body.clientWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    let picStrings = [], interval;
    const loader = new THREE.TextureLoader();
    const particleTexture = loader.load(spark);
    camera.position.set(0, 0, 15);
    camera.lookAt(0, 0, 0);

    const colors = {
      'lala': new THREE.Color(255, 20, 147),
      'wooow': new THREE.Color(0, 255, 255),
      'woohoo': new THREE.Color(255, 255, 0)
    };

    const typeToAction = {
      exhilirating: () => addSprite(new THREE.Color('#FF9373')), // red
      peaceful: () => addSprite(new THREE.Color('#FFCF48')), // yellow
      grieving: () => addSprite(new THREE.Color('#9BD3F9')), // cyan
    };

    databaseRef.on('value', (snap) => {
      const newRecords = Object.values(snap.val());
      if(newRecords.length !== records.length) {
        const lastRecord = newRecords[newRecords.length - 1]
        records.push(lastRecord);
        // console.log(records);
        const { type } = lastRecord;
        console.log(type);
        typeToAction[type]();
      }
    })

    const addSprite = (color) => {
      const spriteMaterial = new THREE.SpriteMaterial({
          map: particleTexture, 
        });
        let sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(5, 5, 1);
        sprite.position.set(
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 20
        );
        // sprite.material.color.setRGB( Math.random(),  Math.random(),  Math.random() ); 
        sprite.material.color = color;
        // sprite.material.color.setRGB(255, 20, 147);
        sprite.material.blending = THREE.AdditiveBlending;
        const spriteContainer = new ObjContainer(sprite, scene, camera, renderer, false);
        spriteContainer.pop(5, easeOutCubic, 30);
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
        const ref = sceneThreeRef.child(`pic_${i+1}.png`);
        ref.putString(url, 'data_url').then((snap) => {
          console.log('uploaded pics');
        })
      }
    }

    const getURLs = () => new Promise((resolve) => {
      let promises = [];
      for(let i = 0; i < picStrings.length; i++) {
        promises.push(sceneThreeRef.child(`pic_${i+1}.png`).getDownloadURL());
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
            const ref = sceneThreeRef.child('result.gif');
            ref.putString(img, 'data_url').then((snap) => {
            console.log('uploaded gif');
          })
          }
        })
      })
    }
    const options = {
      addPink: () => addSprite(colors['lala']),
      addYellow: () => addSprite(colors['woohoo']),
      addCyan: () => addSprite(colors['wooow']),
      start: start,
      export: exportFirebase,
      exportGIF: exportGIF,
    }
    gui.add(options, 'addPink');
    gui.add(options, 'addYellow');
    gui.add(options, 'addCyan');
    gui.add(options, 'start');
    gui.add(options, 'export');
    gui.add(options, 'exportGIF');

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    }

    window.addEventListener('resize', onWindowResize, false);
    
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
    return null;
  }
}



