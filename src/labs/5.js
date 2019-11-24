import Plotly from 'plotly.js-dist';
import {layout, trace} from '../utils/plotly_helper';
import helper from '../utils/data_helper';
import solveFConsolidationClayWithMassTransferProblem from '../problems/FConsolidationClayWithMassTransfer';

// Load page
document.getElementById('root').innerHTML = `
  <div id="counter"></div>
  <div id="mass-chart"></div>
  <div id="consolidation-chart"></div>
`;

const counter = document.getElementById('counter');
const massChart = document.getElementById('mass-chart');
const consolidationChart = document.getElementById('consolidation-chart');

const props = {
  L: 100,
  h: 1,
  T: 31,
  tau: 1,
};

const {C, H} = solveFConsolidationClayWithMassTransferProblem(props);
const x = helper.linspace(0, props.L, 100);
let t = 0;

setInterval(() => {
  counter.innerHTML = t.toFixed(2);
  Plotly.react(
    massChart,
    [trace(x, C[t], 'Mass Transfer')],
    layout('Mass Transfer', 'X', 'C')
  );

  Plotly.react(
    consolidationChart,
    [trace(x, H[t], 'Consolidation')],
    layout('Consolidation', 'X', 'H')
  );

  t >= props.T ? t = 0 : t++;
}, 50);
