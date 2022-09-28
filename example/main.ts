import { Vector3 } from 'three';
import { ClipMode, PointCloudOctree, PointColorType, PointShape, PointSizeType } from '../src';
import { Viewer } from './viewer';

require('./main.css');

const targetEl = document.createElement('div');
targetEl.className = 'container';
document.body.appendChild(targetEl);

const viewer = new Viewer();
viewer.initialize(targetEl);

let pointCloud: PointCloudOctree | undefined;
let loaded: boolean = false;

const unloadBtn = document.createElement('button');
unloadBtn.textContent = 'Unload';
unloadBtn.addEventListener('click', () => {
  if (!loaded) {
    return;
  }

  viewer.unload();
  loaded = false;
  pointCloud = undefined;
});

const loadBtn = document.createElement('button');
loadBtn.textContent = 'Load';
loadBtn.addEventListener('click', () => {
  if (loaded) {
    return;
  }

  loaded = true;

  viewer
    .load(
      'cloud.js',
      //'https://raw.githubusercontent.com/potree/potree/develop/pointclouds/lion_takanawa/',
      'https://potree-laz.pages.dev/',
      //'https://potree-upload.pages.dev/',
    )
    .then(pco => {
      pointCloud = pco;
      pointCloud.rotateX(-Math.PI / 2);
      pointCloud.material.size = 0.2;
      pointCloud.material.pointSizeType = PointSizeType.FIXED;
      pointCloud.material.pointColorType = PointColorType.COLOR;
      pointCloud.material.shape = PointShape.CIRCLE;
      pointCloud.material.clipMode = ClipMode.DISABLED;
      pointCloud.material.clipExtent = [0.0, 0.0, 0.5, 1.0];
      pointCloud.position.x = 0;
      pointCloud.position.y = 0;
      pointCloud.position.z = 0;
      
      const camera = viewer.camera;
      camera.far = 10000;
      camera.updateProjectionMatrix();
      camera.position.set(100, 300, -100);
      camera.lookAt(new Vector3());

      viewer.add(pco);
      console.log(pco);
    })
    .catch(err => console.error(err));

    // viewer
    // .load(
    //   'cloud.js',
    //   //'https://raw.githubusercontent.com/potree/potree/develop/pointclouds/lion_takanawa/',
    //    'https://potree-laz.pages.dev/',
    //   //'https://potree-upload.pages.dev/',
    // )
    // .then(pco => {
    //   pointCloud = pco;
    //   pointCloud.rotateX(-Math.PI / 2);
    //   pointCloud.material.size = 1;
    //   pointCloud.material.pointColorType = PointColorType.COLOR;
    //   pointCloud.material.clipMode = ClipMode.DISABLED;
    //   pointCloud.material.clipExtent = [0.0, 0.0, 0.5, 1.0];
    //   pointCloud.position.x = 0;
    //   pointCloud.position.y = 0;
    //   pointCloud.position.z = 0;

    //   viewer.add(pco);
    //   console.log(pco);
    // })
    // .catch(err => console.error(err));
});

const slider = document.createElement('input');
slider.type = 'range';
slider.min = String(100);
slider.max = String(300_000);
slider.className = 'budget-slider';

slider.addEventListener('change', () => {
  if (!pointCloud) {
    return;
  }

  pointCloud.potree.pointBudget = parseInt(slider.value, 10);
  console.log(pointCloud.potree.pointBudget);
});

const btnContainer = document.createElement('div');
btnContainer.className = 'btn-container';
document.body.appendChild(btnContainer);
btnContainer.appendChild(unloadBtn);
btnContainer.appendChild(loadBtn);
btnContainer.appendChild(slider);
