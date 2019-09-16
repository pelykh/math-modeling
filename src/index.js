import Plotly from 'plotly.js-dist';
import OneDimMassTransfer from "./problems/OneDimMassTransfer";

const problem = new OneDimMassTransfer();
const result = problem.solve();

console.log(problem.getXAxis())

const graphDiv = document.getElementById('graphDiv');
let t = 0;

setInterval(() => {
  var layout = {
    title: `t = ${t}`,
    uirevision: 'true',
    yaxis: {
      range: [0, 100],
      autorange: false,
    },
  };


  const data = [{
    mode: 'lines',
    line: {color: "#b55400"},
    y: result[t],
    x: problem.getXAxis(),
  }];

  Plotly.react(graphDiv, data, layout);

  t = t < problem.props.t ? t + 1 : 0;
}, 500);
