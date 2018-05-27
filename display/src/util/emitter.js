import * as PIXI from 'pixi.js';
import 'pixi-particles';
import rain from '../assets/scene_2/HardRain.png';
const getEmitter = (container) => {
  const textureList = [PIXI.Texture.fromImage(rain)];
  const config = {
    "alpha": {
      "start": 0.5,
      "end": 0.5
    },
    "scale": {
      "start": 1,
      "end": 1
    },
    "color": {
      "start": "ffffff",
      "end": "ffffff"
    },
    "speed": {
      "start": 3000,
      "end": 3000
    },
    "startRotation": {
      "min": 65,
      "max": 65
    },
    "rotationSpeed": {
      "min": 0,
      "max": 0
    },
    "lifetime": {
      "min": 0.81,
      "max": 0.81
    },
    "blendMode": "normal",
    "frequency": 0.004,
    "emitterLifetime": 0,
    "maxParticles": 1000,
    "pos": {
      "x": 0,
      "y": 0
    },
    "addAtBack": false,
    "spawnType": "rect",
    "spawnRect": {
      "x": -600,
      "y": -460,
      "w": window.innerWidth,
      "h": 20
    }
  };
  return new PIXI.particles.Emitter(container, textureList, config);
}

export { getEmitter };