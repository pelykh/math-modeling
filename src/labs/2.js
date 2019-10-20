import Plotly from 'plotly.js-dist';
import OneDimMassTransfer from "../problems/OneDimMassTransfer";
import solveOneDimMassTempTransferProblem from "../problems/OneDimTempMassTransfer";

// // Розв'язок задачі
// const problem = new OneDimMassTransfer();
// const result = problem.solve();
//
// // Виведення даних на графіку
// const xAxis = problem.getXAxis();

const props = { h: 1, t: 400 };
const result = solveOneDimMassTempTransferProblem(props);


const xAxis = [];

for (let i = 0; i < result.mass[0].length; i += 1) {
  xAxis.push(i * props.h);
}
const graphDiv = document.getElementById('graphDiv');
const massDiv = document.getElementById('massDiv');

const getLayout = (t, range=[0, 2]) => ({
  title: `t = ${t}`,
  uirevision: 'true',
  yaxis: {
    range: range,
    autorange: false,
  },
});

const renderPlot = (t, data=[], div, range=[0, 0.5]) => {
  const renderData = [{
    mode: 'lines',
    line: {color: "#b55400"},
    y: data[t],
    x: xAxis,
  }];

  Plotly.react(div, renderData, getLayout(t, range));
};

let interval = true;
let t = 0;

setInterval(() => {
  if (interval) {
    renderPlot(t, result.temp, graphDiv, [0, 200]);
    renderPlot(t, result.mass, massDiv);

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

  renderPlot(t, result.temp, graphDiv, [0, 200]);
  renderPlot(t, result.mass, massDiv);
});
