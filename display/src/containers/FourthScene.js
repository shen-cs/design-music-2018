import { Component } from 'react';
import * as PIXI from 'pixi.js';
import * as dat from 'dat.gui';
import 'pixi-tween';
import gifshot from 'gifshot';
import firebase from '../firebase';
import { buildingConfig } from '../util';
import mapPic from '../assets/scene_4/map.png';
import temple from '../assets/scene_4/temple.png';
import storeOne from '../assets/scene_4/store_1.png';
import storeTwo from '../assets/scene_4/store_2.png';
import storeThree from '../assets/scene_4/store_3.png';
import storeFour from '../assets/scene_4/store_4.png';
import bikeOne from '../assets/scene_4/bike_1.png';
import bikeTwo from '../assets/scene_4/bike_2.png';

export default class extends Component {
  render() {
    const storageRef = firebase.storage().ref();
    const sceneFourRef = storageRef.child('scene_4');
    const databaseRef = firebase.database().ref('/records_4');
    let records = [];
    const renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
    const stage = new PIXI.Container();
    document.body.appendChild(renderer.view)
    window.addEventListener('resize', onWindowResize);
    let picStrings = [], interval;
    let indexState = {
      temple: 0,
      storeOne: 0,
      storeTwo: 0,
      storeThree: 0,
      storeFour: 0,
      bikeOne: 0,
      bikeTwo: 0,
    };

    const typeToAction = {
      temple: () => buildObj('temple', templeList),
      store: buildStore,
      bike: buildBike,
    };

    databaseRef.on('value', (snap) => {
      const newRecords = Object.values(snap.val());
      if(newRecords.length !== records.length) {
        const lastRecord = newRecords[newRecords.length - 1]
        records.push(lastRecord);
        // console.log(records);
        const { type } = lastRecord;
        typeToAction[type]();
      }
    })
    PIXI.loader
      .add('map', mapPic)
      .add('temple', temple)
      .add('storeOne', storeOne)
      .add('storeTwo', storeTwo)
      .add('storeThree', storeThree)
      .add('storeFour', storeFour)
      .add('bikeOne', bikeOne)
      .add('bikeTwo', bikeTwo)
      .load(setup);

    const {
      templeList,
      storeOneList,
      storeTwoList,
      storeThreeList,
      storeFourList,
      bikeOneList,
      bikeTwoList,
    } = buildingConfig;
    const gui = new dat.GUI();
    let map;
    templeList.key = 'temple';
    storeOneList.key = 'storeOne';
    storeTwoList.key = 'storeTwo';
    storeThreeList.key = 'storeThree';
    storeFourList.key = 'storeFour';
    bikeOneList.key = 'bikeOne';
    bikeTwoList.key = 'bikeTwo';

    const options = {
      buildTemple: () => buildObj('temple', templeList),
      buildStore: buildStore,
      buildBike: buildBike,
      start: start,
      export: exportFirebase,
      exportGIF: exportGIF,
    }
    gui.add(options, 'buildTemple');
    gui.add(options, 'buildStore');
    gui.add(options, 'buildBike');
    gui.add(options, 'start');
    gui.add(options, 'export');
    gui.add(options, 'exportGIF');


    function setup() {
      const mapTexture = PIXI.loader.resources.map.texture;
      map = new PIXI.Sprite(mapTexture);
      
      stage.addChild(map);
      map.height = window.innerHeight;
      map.width = window.innerWidth;
    }


    function buildStore() {
      const nameList = [ 'storeOne', 'storeTwo', 'storeThree', 'storeFour'];
      const resources = [storeOneList, storeTwoList, storeThreeList, storeFourList];
      const name = nameList[Math.floor(Math.random() * nameList.length)];
      const resList = resources[Math.floor(Math.random() * resources.length)];
      buildObj(name, resList, false);
    }
    function buildBike() {
      const bikeList = [
        { name: 'bikeOne', resList: bikeOneList },
        { name: 'bikeTwo', resList: bikeTwoList },
      ];
      const item = bikeList[Math.floor(Math.random() * bikeList.length)];
      const { name, resList } = item;
      buildObj(name, resList, false);
    }
    function buildObj(name, resList, drag) {
      // name is just for rendering texture, resList.key for index updating
      const obj = new PIXI.Sprite(PIXI.loader.resources[name].texture);
      stage.addChild(obj);
      const index = indexState[resList.key];
      // if(drag) enableDrag(obj, index.toString());
      const { from, to } = resList[index];
      scaleObj(obj, resList[index].scale);
      // scaleObj(obj, 0.08);
      build(obj, from, to, name);
      
      
      indexState[resList.key] = (index + 1) % resList.length;
    }

    function build(obj, from, to, name) {
      let { fromX } = from;
      let { toY } = to;
      const list = ['storeOne', 'storeTwo', 'storeThree', 'storeFour', 'bikeOne', 'bikeTwo'];
      if(list.includes(name)) {
        obj.anchor.set(0.5);
        fromX *= window.innerWidth;
        toY *= window.innerHeight;
      }
      if(name.startsWith('bike')) {
        // obj.zIndex = 1;
        let toX = fromX;
        fromX = toX + 0.1 * window.innerWidth;
        obj.position.set(fromX, toY);
        const tween = PIXI.tweenManager.createTween(obj);
        tween.time = 1000;
        tween.easing = PIXI.tween.Easing.inOutSine();
        tween.from({
          x: fromX
        })
        tween.to({
          x: toX
        })
        tween.start();
      }
      else {
        const fromY = toY - 0.25 * window.innerHeight;
        obj.position.set(fromX, fromY);
        const tween = PIXI.tweenManager.createTween(obj);
        tween.time = 1000;
        tween.easing = PIXI.tween.Easing.outBounce();
        tween.from({
          y: fromY
        })
        tween.to({
          y: toY
        })
        tween.start();
      }
    }
    function scaleObj(obj, widthPercent) {
      const scale = window.innerWidth * widthPercent / obj.width;
      obj.scale.set(scale);
    }
    function reScale() {
      map.height = window.innerHeight;
      map.width = window.innerWidth;
    }
    function onWindowResize() {
      renderer.resize(window.innerWidth, window.innerHeight);
      if(map) {
        reScale();
      }
    }

    function screenshot() {
      const renderTexture = PIXI.RenderTexture.create(renderer.width, renderer.height);
      renderer.render(stage, renderTexture);

      const canvas = renderer.extract.canvas(renderTexture);
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
        const ref = sceneFourRef.child(`pic_${i+1}.png`);
        ref.putString(url, 'data_url').then((snap) => {
          console.log('uploaded pics');
        })
      }
    }

    const getURLs = () => new Promise((resolve) => {
      let promises = [];
      for(let i = 0; i < picStrings.length; i++) {
        promises.push(sceneFourRef.child(`pic_${i+1}.png`).getDownloadURL());
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
            const ref = sceneFourRef.child('result.gif');
            ref.putString(img, 'data_url').then((snap) => {
            console.log('uploaded gif');
          })
          }
        })
      })
    }
    function animate() {
      requestAnimationFrame(animate);
      PIXI.tweenManager.update();
      renderer.render(stage);
    }
    animate();
    return null;
  }
}