import Plotly from 'plotly.js-dist';
import solveSoilSSSProblem from "../problems/SoilSSS";
import {layout, trace} from "../utils/plotly_helper";

// Load page
document.getElementById('root').innerHTML = `
<button class="button8" id="dry-button">Dry</button>
<button class="button8" id="wet-button">Wet</button>
<button class="button8" id="filtration-button">Filtration</button>
<div id="translation-chart"></div>
<div id="deformation-chart"></div>
<div id="tension-chart"></div>
<div id="soil-type"></div>
`;

const translationChart = document.getElementById('translation-chart');
const deformationChart = document.getElementById('deformation-chart');
const tensionChart = document.getElementById('tension-chart');
const title = document.getElementById('soil-type');

const result = solveSoilSSSProblem();
const {x} = result;

const render = (soilType = 'dry') => {
  title.innerHTML = soilType.toUpperCase();

  Plotly.react(
    translationChart,
    [trace(result[soilType][0], x, 'Translation')],
    layout('Translation', 'Y', 'X'),
  );

  Plotly.react(
    deformationChart,
    [trace(result[soilType][1], x, 'Deformation')],
    layout('Deformation', 'Y', 'X'),
  );

  Plotly.react(
    tensionChart,
    [trace(result[soilType][2], x, 'Tension')],
    layout('Tension', 'Y', 'X'),
  );
};

render();

document.getElementById('dry-button')
  .addEventListener('click', () => render('dry'));
document.getElementById('wet-button')
  .addEventListener('click', () => render('wet'));
document.getElementById('filtration-button')
  .addEventListener('click', () => render('filtration'));




