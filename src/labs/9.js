import Plotly from 'plotly.js-dist';
import OneDimSourceOfPollution from '../problems/OneDimSourceOfPollution';
import {layout, trace} from "../utils/plotly_helper";

const colors = [
  '#2A80CF',
  '#00A4E1',
  '#00C2D4',
  '#00DCB0',
  '#94EF88',
  '#F9F871',
];

// Load page
document.getElementById('root').innerHTML = `
<div id="chart"></div>
`;


const {X, Y, targetAproxX0, targetX0} = OneDimSourceOfPollution();

const traces = X.map((x, i) => trace(
  X[i],
  Y[i],
  `Y[${i}]`,
  colors[i],
));

traces.push(trace(
  [targetX0],
  [0],
  'targetX0',
  '#000000',
  'markers',
));

traces.push(trace(
  [targetAproxX0],
  [0],
  'targetAproxX0',
  '#7c7c7c',
  'markers',
));

Plotly.react(
  document.getElementById('chart'),
  traces,
  layout('Source of Pollution', 'X', 'Y'),
);
