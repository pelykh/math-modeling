import {solveSoilSSSWithoutTopBottomMovesProblem} from '../problems/SoilSSSWithoutTopBottomMoves';
import Plotly from 'plotly.js-dist';

// Load page
document.getElementById('root').innerHTML = `
<div id="translation-chart"></div>
<div id="deformation-chart"></div>
<div id="tension-chart"></div>
`;

const [x1, wetResult, x2, dryResult] = solveSoilSSSWithoutTopBottomMovesProblem();
const x = x1.concat(x2);
const translation = wetResult[0].concat(dryResult[0]).map((x) => x * 100000);
const deformation = wetResult[1].concat(dryResult[1]).map((x) => x * 10000);
const tension = wetResult[2].concat(dryResult[2]);

const waterLevelTrace = (x, y) => ({
  x: y,
  y: x.map(() => 0.5),
  mode: 'lines',
  name: 'Water level',
  line: {
    dash: 'dot',
    width: 1,
    color: '#4a8de0',
  }
});

const translationTrace = {
  mode: 'lines',
  name: 'Translation',
  x: translation,
  y: x,
  line: {
    width: 2,
    color: '#EE655A',
  }
};

const translationLayout = {
  title: 'Translation',
  xaxis: {
    title: 'u(x) * 10^-5',
  },
  yaxis: {
    title: 'X',
    zeroline: false,
  }
}

Plotly.react(
  document.getElementById('translation-chart'),
  [translationTrace, waterLevelTrace(x1, translation)],
  translationLayout
);

const deformationTrace = {
  mode: 'lines',
  name: 'Deformation',
  x: deformation,
  y: x,
  line: {
    width: 2,
    color: '#EE655A',
  }
};

const deformationLayout = {
  title: 'Deformation',
  xaxis: {
    title: 'E(x) * 10^-4',
  },
  yaxis: {
    title: 'X',
    zeroline: false,
  }
}

Plotly.react(
  document.getElementById('deformation-chart'),
  [deformationTrace, waterLevelTrace(x, deformation)],
  deformationLayout
);

const tensionTrace = {
  mode: 'lines',
  name: 'Tension',
  x: tension,
  y: x,
  line: {
    width: 2,
    color: '#EE655A',
  }
};

const tensionLayout = {
  title: 'Tension',
  xaxis: {
    title: 'G(x)',
  },
  yaxis: {
    title: 'X',
    zeroline: false,
  }
}

Plotly.react(
  document.getElementById('tension-chart'),
  [tensionTrace, waterLevelTrace(x, tension)],
  tensionLayout
);
