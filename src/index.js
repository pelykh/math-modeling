import Plotly from 'plotly.js-dist';
import OneDimMassTransfer from "./problems/OneDimMassTransfer";

const problem = new OneDimMassTransfer();
const result = problem.solve();

const xAxis = problem.getXAxis();
const graphDiv = document.getElementById('graphDiv');

const getLayout = (t) => ({
  title: `t = ${t}`,
  uirevision: 'true',
  yaxis: {
    range: [0, 100],
    autorange: false,
  },
});

const renderPlot = (t) => {
  const data = [{
    mode: 'lines',
    line: {color: "#b55400"},
    y: result[t],
    x: xAxis,
  }];

  Plotly.react(graphDiv, data, getLayout(t));
};

let interval = true;
let t = 0;

setInterval(() => {
  if (interval) {
    renderPlot(t);

    tRange.value = t;
    t = t < problem.props.t ? t + 1 : 0;
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
  t = e.target.value;

  renderPlot(t);
});
