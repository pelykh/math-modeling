import helper from '../utils/data_helper';
// Lab 5
const defaultProps = {
  h1: 59,
  h2: 26,
  l: 100,
  k: 0.001,
  tau: 1,
  h: 1,
  t: 31,
  sigma: 0.2,
  d: 0.02,
  n: 2,
  gamma: 0.0065,
  c1: 350,
  c2: 8,
  cg: 100,
  e: 0.6,
  gammaGr: 2 * Math.pow(10, 4),
  aGr: 51.2 * Math.pow(10, -6),
  vOs: 2.5 * Math.pow(10, -5),
  nGr: 0.4,
};

function solveSubProblem(props) {
  props = {...defaultProps, ...props};

  const {l, h, t, tau, k, h1, h2, d, lam, cn, c1, c2, gamma, sigma, cg } = props;

  const nt = cn / lam;
  const cx0 = (x) => c1 * Math.exp(-x / l * Math.log(c1 / c2));
  const c0t = (t) => c1;
  const clt = (t) => c2;
  const steps = parseInt(l / h);
  const tSteps = parseInt(t / tau);
  const v = k * (h1 - h2) / l;
  const rMinus = - v / d;
  const rPlus = 0;
  const mu =  1 / (1 + 0.5 * h * Math.abs(rMinus + rPlus));
  const a = mu / Math.pow(h,2) - rMinus / h;
  const b = mu / Math.pow(h,2) + rPlus / h;
  const c = a + b + gamma / d + sigma / (d * tau);
  const data = helper.initializeMultiDimArray(tSteps, steps);
  const f = (i, j) => (gamma / d) * cg + (sigma / (d * tau)) * data[i-i][j];
  const alpha = [0];

  for(let i = 1; i < steps; i++) {
    alpha[i] = (b / (c - a * alpha[i-1]));
  }

  const getBeta = (i) => {
    const beta =  [data[i][0]];
    for (let j = 1; j < steps; j += 1) {
      beta[j] = (a * beta[j-1] + f(i, j)) / (c - a * alpha[j-1]);
    }
    return beta;
  };

  // Задаю граничні умови справа та зліва
  for (let i = 0; i <= tSteps; i += 1) {
    data.push([]);
    data[i][0] = t1;
    data[i][steps - 1] = t2;
    data[i][steps] = t2;
  }

  // Задаю граничні умови в початковий момент часу
  for (let i = 1; i < steps - 1; i += 1) {
    data[0][i] = t0(i * h);
  }

  //Методом прогонки знаходжу розв'язок
  for (let i = 1; i <= tSteps; i += 1) {
    const beta = getBeta(i);

    for (let j = steps - 2; j > 0; j -= 1) {
      data[i][j] = alpha[j + 1] * data[i][j + 1] + beta[j + 1];
    }
  }

  return data;
}

function solveSoilConsolidationProblem(props) {
  props = {...defaultProps, ...props};

  const {l, h, t, tau, k, h1, h2, d, gamma, sigma, cg, dt, c1, c2, c0,} = props;
  const temp = solveTempSubproblem(props);

  const steps = parseInt(l / h);
  const tSteps = parseInt(t / tau);
  const v = k * (h1 - h2) / l;
  const rMinus = -v / d;
  const rPlus = 0;
  const mu = 1 / (1 + 0.5 * h * Math.abs(rMinus + rPlus));
  const a = mu / Math.pow(h, 2) - rMinus / h;
  const b = mu / Math.pow(h, 2) + rPlus / h;
  const c = a + b + gamma / d + sigma / (d * tau);
  const data = [];
  const f = (i, j) => (
    gamma / 2 * d * cg +
    (dt / d) * (temp[i][j - 1] - 2 * temp[i][j] + temp[i][j + 1]) / Math.pow(h, 2) +
    sigma / tau / d * data[i - 1][j - 1]
  );

  const alpha = [0];
  for (let i = 1; i < steps; i++) {
    alpha[i] = (b / (c - a * alpha[i - 1]));
  }

  const getBeta = (i) => {
    const beta = [data[i][0]];
    for (let j = 1; j < steps; j += 1) {
      beta[j] = (a * beta[j - 1] + f(i, j)) / (c - a * alpha[j - 1]);
    }
    return beta;
  };

  // Задаю граничні умови справа та зліва
  for (let i = 0; i <= tSteps; i += 1) {
    data.push([]);
    data[i][0] = c1(i * tau);
    data[i][steps - 1] = c2(i * tau);
  }

  // Задаю граничні умови в початковий момент часу
  for (let i = 1; i < steps - 1; i += 1) {
    data[0][i] = c0(i * h);
  }

  //Методом прогонки знаходжу розв'язок
  for (let i = 1; i <= tSteps; i += 1) {
    const beta = getBeta(i);

    for (let j = steps - 2; j > 0; j -= 1) {
      data[i][j] = alpha[j + 1] * data[i][j + 1] + beta[j + 1];
    }
  }

  return {
    mass: data,
    temp,
  };
}

export default solveSoilConsolidationProblem;
