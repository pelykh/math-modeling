import Plotly from 'plotly.js-dist';
import solveOneDimMassTransferWithOsmosis from "../problems/OneDimMassTransferWithOsmosis";
import helper from "../utils/data_helper";

const props = {
  T_MAX: 60,
  tau: 1,
  L: 10,
  hx: 0.1,
};

const {C, H} = solveOneDimMassTransferWithOsmosis(props);

const n = Math.floor(props.L / props.hx);
const T = Math.floor(props.T_MAX / props.tau);
const x = helper.initializeMultiDimArray([n])
  .map((el, i) => (i * props.hx));

// Load page
document.getElementById('root').innerHTML = `
<div id="counter"></div>
<div id="moisture-chart"></div>
<div id="mass-chart"></div>
`;

const counter = document.getElementById('counter');
const moistureChart = document.getElementById('moisture-chart');
const massChart = document.getElementById('mass-chart');

const trace = (x, y, title) => ({
  mode: 'lines',
  name: title,
  x,
  y,
  line: {
    width: 2,
    color: '#EE655A',
  }
});

const layout = (title, xTitle, yTitle) => ({
  title: title,
  xaxis: {
    title: xTitle,
    zeroline: false,
  },
  yaxis: {
    title: yTitle,
    zeroline: false,
  }
});

let t = 0;

setInterval(() => {
  counter.innerHTML = t.toFixed(2);
  Plotly.react(
    moistureChart,
    [trace(x, H[t], 'Moisture Transfer')],
    layout('Moisture Transfer', 'X', 'H')
  );

  Plotly.react(
    massChart,
    [trace(x, C[t], 'Mass Transfer')],
    layout('Mass Transfer', 'X', 'C')
  );

  t >= T ? t = 0 : t ++;
}, 50);
