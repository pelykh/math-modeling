import heatmap from 'heatmap.js';
import solveConvectionDiffusionWithTempProblem from "../problems/ConvectionDiffusionWithTemp";

const props = {
  tau: 1,
  t: 100,
};

const {C, T} = solveConvectionDiffusionWithTempProblem(props);

const height = window.innerHeight / 3;
const width = window.innerWidth / 3;
document.getElementById('root').innerHTML = `
    <h1>Temperature</h1>
    <div id="temp-heatmap" style="height: ${height}px;width: ${width}px"></div>
    <h1>Consolidation</h1>
    <div id="consolidation-heatmap" style="height: ${height}px;width: ${width}px"></div>
`;

const getHeatmapData = (data, k = 0) => {
  const points = [];
  const flat = data[k].flat();
  const min = Math.min(...flat);
  const max = Math.max(...flat);
  const lx = data[k][0].length;
  const ly = data[k].length;

  for (let i = 0; i < ly; i++) {
    for (let j = 0; j < lx; j++) {
      points.push({
        x: j * Math.floor(width / lx) + 10,
        y: i * Math.floor(height / ly) + 10,
        value: data[k][i][j],
      })
    }
  }

  return {
    min,
    max,
    data: points,
  }
};

const tempHeatmap = heatmap.create({
  container: document.getElementById('temp-heatmap'),
});

const consolidationHeatmap = heatmap.create({
  container: document.getElementById('consolidation-heatmap'),
});

let k = 0;

setInterval(() => {
  console.log(`k = ${k}`);
  tempHeatmap.setData(getHeatmapData(T, k));
  consolidationHeatmap.setData(getHeatmapData(C, k));
  k >= props.t - 1 ? k = 0 : k += props.tau;
}, 100);
