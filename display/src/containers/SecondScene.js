import { Component } from 'react';
import * as PIXI from 'pixi.js';
import * as dat from 'dat.gui';
import TWEEN from '@tweenjs/tween.js';
import gifshot from 'gifshot';
import firebase from '../firebase';
import { getEmitter } from '../util/emitter';
import bankBehind from '../assets/scene_2/bank_behind.png';
import bankFront from '../assets/scene_2/bank_front.png';
import bankMiddle from '../assets/scene_2/bank_middle.png';
import bikeOne from '../assets/scene_2/bike_1.png';
import bikeTwo from '../assets/scene_2/bike_2.png';
import cloudOne from '../assets/scene_2/cloud_1.png';
import cloudTwo from '../assets/scene_2/cloud_2.png';
import cloudThree from '../assets/scene_2/cloud_3.png';
import cloudFour from '../assets/scene_2/cloud_4.png';

import sunPic from '../assets/scene_2/sun.png';

export default class extends Component {

  render() {
    const storageRef = firebase.storage().ref();
    const sceneTwoRef = storageRef.child('scene_2');
    const databaseRef = firebase.database().ref('/records_2');
    let records = [];
    // const renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
    const renderer = new PIXI.CanvasRenderer(window.innerWidth, window.innerHeight);
    const stage = new PIXI.Container();
    document.body.appendChild(renderer.view);
    window.addEventListener('resize', onWindowResize);
    let bank, bike, front, bankTextureWidth, bankTextureHeight, frontTextureWidth, frontTextureHeight;
    let middle, middleTextureWidth, middleTextureHeight;
    let clouds = [], cloudSpeed = 1;
    let cloudsLimit = 10;
    const defaultNumClouds = 5;
    let sun, tweenEnlargeSun, tweenShrinkSun;
    let brightness = 1;
    let emitter;
    let picStrings = [], interval;
    let colorMatrix = new PIXI.filters.ColorMatrixFilter();
    stage.filters = [colorMatrix];
    colorMatrix.brightness(1);


    const gui = new dat.GUI();
    const options = {
      exhilirating: exhiliratingHandler,
      peaceful: peacefulHandler,
      grieving: grievingHandler,
      start: start,
      export: exportFirebase,
      exportGIF: exportGIF,
    };
    
    gui.add(options, 'exhilirating');
    gui.add(options, 'peaceful');
    gui.add(options, 'grieving');
    gui.add(options, 'start');
    gui.add(options, 'export');
    gui.add(options, 'exportGIF');

    const typeToAction = {
      exhilirating: exhiliratingHandler,
      peaceful: peacefulHandler,
      grieving: grievingHandler,
    };

    databaseRef.on('value', (snap) => {
      const newRecords = Object.values(snap.val());
      if(newRecords.length !== records.length) {
        const lastRecord = newRecords[newRecords.length - 1]
        records.push(lastRecord);
        // console.log(records);
        const { type } = lastRecord;
        // console.log(type);
        typeToAction[type]();
      }
    })

    PIXI.loader
      .add('bank', bankBehind)
      .add('front', bankFront)
      .add('middle', bankMiddle)
      .add('bikeOne', bikeOne)
      .add('bikeTwo', bikeTwo)
      .add('cloudOne', cloudOne)
      .add('cloudTwo', cloudTwo)
      .add('cloudThree', cloudThree)
      .add('cloudFour', cloudFour)
      .add('sun', sunPic)
      .load(setup);

    function setup() {
      let bankTexture = PIXI.loader.resources.bank.texture;
      let frontTexture = PIXI.loader.resources.front.texture;
      let middleTexture = PIXI.loader.resources.middle.texture;
      
      bankTextureWidth = bankTexture.baseTexture.width;
      bankTextureHeight = bankTexture.baseTexture.height;
      const trimRect = new PIXI.Rectangle(1, 0, bankTextureWidth-1, bankTextureHeight);
      bankTexture.frame = trimRect;
      bankTexture._updateUvs(); 

      frontTextureWidth = frontTexture.baseTexture.width
      frontTextureHeight = frontTexture.baseTexture.height;
      middleTextureWidth = middleTexture.baseTexture.width;
      middleTextureHeight = middleTexture.baseTexture.height;
      const trimRectMiddle = new PIXI.Rectangle(0, 0, middleTextureWidth-7, middleTextureHeight);
      middleTexture.frame = trimRectMiddle;
      middleTexture._updateUvs(); 
      bank = new PIXI.extras.TilingSprite(bankTexture, bankTextureWidth, bankTextureHeight);
      middle = new PIXI.extras.TilingSprite(middleTexture, middleTextureWidth, middleTextureHeight);
      front = new PIXI.extras.TilingSprite(frontTexture, frontTextureWidth, frontTextureHeight);
      const bikeOneTexture = PIXI.loader.resources.bikeOne.texture;
      const bikeTwoTexture = PIXI.loader.resources.bikeTwo.texture;
      bike = new PIXI.Sprite(bikeOneTexture);
      setInterval(() => {
        if(bike.texture === bikeOneTexture)
          bike.texture = bikeTwoTexture
        else bike.texture = bikeOneTexture
      }, 200)
      const graphics = new PIXI.Graphics();
      graphics.beginFill(0xb0d648);
      graphics.drawRect(0, 0, window.innerWidth, window.innerHeight);
      stage.addChild(graphics);
      stage.addChild(bank);
      stage.addChild(middle);
      stage.addChild(bike);
      stage.addChild(front);
      for(let i = 0; i < defaultNumClouds; i++) {
        addCloud();
      }
      
      reScale();
      const container = new PIXI.Container();
      stage.addChild(container);
      emitter = getEmitter(container);
      emitter.emit = false;
    }

    function reScale() {
      const bankScaleX = window.innerWidth / bankTextureWidth;
      const frontScaleX = window.innerWidth / frontTextureWidth;
      const frontScaleY = frontScaleX;
      const middleScale = window.innerWidth / middleTextureWidth;
      const height_orig =  middleTextureHeight * middleScale + bankTextureHeight * bankScaleX;
      const heightScale = window.innerHeight / height_orig;

      const bankScaleY = heightScale*bankScaleX;  
      bank.scale.set(bankScaleX, bankScaleY);
      bank.position.set(0, 0);
      bike.anchor.set(0, 1);
      bike.position.set(bankTextureWidth*bankScaleX*0.5, window.innerHeight * 0.8);
      bike.scale.set(middleScale*1.5);
      front.anchor.set(0, 1);
      front.scale.set(frontScaleX, frontScaleY);
      front.position.set(0, window.innerHeight);
      const middleScaleY = heightScale * middleScale * 1.2;
      middle.scale.set(middleScale, middleScaleY);
      middle.position.set(0, bank.height*bank.scale.y*0.75);
    }

    function exhiliratingHandler() {
      if(brightness < 1) {
        adjustBrightness(0.05);
      }
      else if(clouds.length !== 0) {
        emitter.emit = false;
        removeCloud();
      }
      else {
        addSun();
        adjustBrightness(0.05);
      }

    }

    function peacefulHandler() {
      cloudSpeed = Math.max(0, cloudSpeed - 0.01);
    }

    function grievingHandler() {
      if(brightness > 1) {
        adjustBrightness(-0.05);
      }
      else if(clouds.length < cloudsLimit) {
        removeSun();
        addCloud();
      }
      else if(brightness > 0.5) {
        adjustBrightness(-0.05);
      }
      else {
        console.log('lightning and rain!!');
        emitter.emit = true;
      }
      
    }

    function addSun() {
      if(!sun) {
        const sunTex = PIXI.loader.resources.sun.texture;
        sun = new PIXI.Sprite(sunTex);
        const scale = window.innerHeight / sun.height * 0.2;
        sun.scale.set(scale);
        sun.anchor.set(0.5);
        sun.position.set(window.innerWidth*0.15, window.innerHeight*0.15);
        stage.addChild(sun);
        tweenAddSun(scale);
      }
    }
    function removeSun() {
      if(sun) {
        // tweenRemoveSun(sun)
        stage.removeChild(sun);
        tweenShrinkSun.stop();
        tweenEnlargeSun.stop();
        sun = null;
      }

    }
    function tweenAddSun(scale) {
      let pos = { scale };
      let to = { scale: scale * 0.8 }
      tweenShrinkSun = new TWEEN.Tween(pos).to(to, 1000);
      tweenShrinkSun.onUpdate(() => {
        sun.scale.set(pos.scale);
      })
      tweenEnlargeSun = new TWEEN.Tween(to).to(pos, 1000);
      tweenEnlargeSun.onUpdate(() => {
        sun.scale.set(to.scale);
      })
      tweenShrinkSun.onComplete(() => {
        pos.scale = scale;
        to.scale = scale * 0.8;
      })
      tweenEnlargeSun.onComplete(() => {
        pos.scale = scale;
        to.scale = scale * 0.8;
      })
      tweenShrinkSun.easing(TWEEN.Easing.Sinusoidal.InOut);
      tweenEnlargeSun.easing(TWEEN.Easing.Sinusoidal.InOut);
      tweenShrinkSun.chain(tweenEnlargeSun);
      tweenEnlargeSun.chain(tweenShrinkSun);
      tweenShrinkSun.start();
    }

    function addCloud() {
      const cloudList = ['cloudOne', 'cloudTwo', 'cloudThree', 'cloudFour'];
      const randomIndex = Math.floor(Math.random() * 4);
      const texture = PIXI.loader.resources[cloudList[randomIndex]].texture;
      const cloud = new PIXI.Sprite(texture);
      clouds.push(cloud);
      stage.addChild(cloud);
      cloud.position.set(window.innerWidth * Math.random()* 0.8, bank.height * bank.scale.y * Math.random()*0.5 );
      cloud.scale.set(0.05);
    }

    function removeCloud() {
      if(clouds.length) {
        stage.removeChild(clouds.pop());
      }
    }
    function manageClouds() {
      // temporary method, may be revised
      for(let i = 0; i < clouds.length; i++) {
        if(clouds[i].position.x > window.innerWidth) {
          stage.removeChild(clouds[i]);
          clouds[i] = null;
          // console.log('remove cloud')
        }
      }
      let newClouds = [];
      for(let i = 0; i < clouds.length; i++) {
        if(clouds[i]) newClouds.push(clouds[i])
      }
      clouds = newClouds.splice(0);

    }
    function moveCloud() {
      for(let i = 0; i < clouds.length; i++) {
        clouds[i].position.x += cloudSpeed;
      }
      manageClouds();
    }

    function adjustBrightness(amount) {
      if(amount > 0) {
        brightness = Math.min(1.5, brightness + 0.05);
      }
      else {
        brightness = Math.max(0.5, brightness - 0.05);
      }
      colorMatrix.brightness(brightness);
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
        interval = setInterval(screenshot, 5000);
      }

    }

    function exportFirebase() {
      clearInterval(interval);
      for(let i = 0; i < picStrings.length; i++) {
        const url = picStrings[i];
        const ref = sceneTwoRef.child(`pic_${i+1}.png`);
        ref.putString(url, 'data_url').then((snap) => {
          console.log('uploaded pics');
        })
      }
    }

    const getURLs = () => new Promise((resolve) => {
      let promises = [];
      for(let i = 0; i < 8; i++) {
        promises.push(sceneTwoRef.child(`pic_${i+1}.png`).getDownloadURL());
      }
      Promise.all(promises).then(urls => resolve(urls));
    })
    
    function exportGIF() {
      getURLs().then(imageURLs =>
        // console.log(imageURLs)
        gifshot.createGIF({
          'images': imageURLs,
          'gifWidth': window.innerWidth,
          'gifHeight': window.innerHeight,
          'interval': 1,
        }, (obj) => {
          if(!obj.error) {
            const img = obj.image;
            const ref = sceneTwoRef.child('test.gif');
            ref.putString(img, 'data_url').then((snap) => {
            console.log('uploaded gif');
          })
          }
        })
      )
    }
    function onWindowResize() {
      renderer.resize(window.innerWidth, window.innerHeight);
      if(bank) {
        reScale();
      }
    }

    let elapsed = Date.now();
    function animate() {
      requestAnimationFrame(animate);
      TWEEN.update();
      let now = Date.now();
      if(emitter)
        emitter.update((now - elapsed) * 0.001);
      elapsed = now;
      if(bank) {
        bank.tilePosition.x += 1;
        middle.tilePosition.x += 10;
        front.tilePosition.x += 100;
        moveCloud();
        if(sun) sun.rotation += 0.01;
      }
      renderer.render(stage);
    }

    animate();
   
    return null;
  }
}