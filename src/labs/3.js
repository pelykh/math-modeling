import Plotly from 'plotly.js-dist';
import solveConvectionDiffusionProblem from "../problems/ConvectionDiffusion";
const props = {
  t: 100,
};

const result = solveConvectionDiffusionProblem(props);
const graphDiv = document.getElementById('graphDiv');

const getLayout = (t, range=[0, 2]) => ({
  title: `t = ${t}`,
});

const renderPlot = (t, data=[], div, range=[0, 0.5]) => {
  const renderData = [{
    z: data[t],
    type: 'contour',
    autocontour: false,
    colorscale: [
      ['0.0', 'rgb(133,165,33)'],
      ['1.0', 'rgb(255,0,4)']
    ],
  }];

  Plotly.react(div, renderData, getLayout(t, range));
};

let interval = true;
let t = 0;

setInterval(() => {
  if (interval) {
    renderPlot(t, result, graphDiv);

    tRange.value = t;
    t = t < props.t ? t + 1 : 0;
  }
}, 500);

const tInterval =  document.getElementById('tInterval');
const tRange = document.getElementById('tRange');

tInterval.checked = interval;

tInterval.addEventListener('input', (e) => {
  interval = tInterval.checked;
});

tRange.addEventListener('input', (e) => {
  interval = false;
  tInterval.checked = false;
  t = parseInt(e.target.value);
  renderPlot(t, result, graphDiv);
});

