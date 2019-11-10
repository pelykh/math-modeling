import helper from "../utils/data_helper";

const defaultProps = {
  h1: 1.5,
  h2: 0.5,
  lx: 100,
  ly: 10,
  hx: 1,
  hy: 1,
  t: 3, //31
  tau: 1,
  k: 1.5,
  d: 0.02,
  sigma: 0.4,
  gamma: 0.0065,
  c1: 350,
  c2: 16,
  cm: 350,
  cg: 35,
};

function solveConvectionDiffusionProblem(props) {
  props = {...defaultProps, ...props};
  const {lx, ly, hx, hy, c2, c1, cm, cg, k, t, tau, h1, h2, sigma, gamma, d,} = props;
  const nx = parseInt(lx / hx);
  const ny = parseInt(ly / hy);
  const nt = parseInt(t / tau);
  const cx0 = (x) => x * (c2 - c1) / lx + c1;
  const c0t = (t) => c1;
  const clt = (t) => c2;
  const cx0t = (x) => cm;
  const v = k * (h1 - h2) / lx;
  const data = helper.initializeMultiDimArray([nt, ny, nx]);
  const fx = (t, y, x) => (gamma / (2 * d)) * cg + (sigma / (d * tau)) * data[t - 1][y][x];
  const fy = (t, y, x) => (gamma / (2 * d)) * cg + (sigma / (d * tau)) * data[t][y][x];
  const rPlusX = 0;
  const rMinusX = -v / d;
  const mx = 1.0 / (1 + 0.5 * hx * Math.abs(rPlusX + rMinusX));
  const ax = mx / hx ** 2 - rMinusX / hx;
  const bx = mx / hx ** 2 + rPlusX / hx;
  const cx = (2 * mx) / Math.pow(hx, 2) - rMinusX / hx + rPlusX / hx + gamma / (2 * d) + sigma / (d * tau);
  const ay = 1.0 / Math.pow(hy, 2);
  const by = 1.0 / Math.pow(hy, 2);
  const cy = 2.0 / Math.pow(hy, 2) + gamma / (2 * d) + sigma / (d * tau);
  const alphaX = [0];
  const betaX = [];
  const alphaY = [0];
  const betaY = [];


  // Визначаю альфи
  for (let i = 1; i < nx - 1; i++) {
    alphaX[i] = bx / (cx - ax * alphaX[i - 1]);
  }

  for (let i = 1; i < ny - 1; i++) {
    alphaY[i] = by / (cy - ay * alphaY[i - 1]);
  }

  // Початкові та граничні умови
  for (let i = 0; i < nt; i++) {
    for (let j = 0; j < ny; j++) {
      data[i][j][0] = c0t(i * tau);
      data[i][j][nx - 1] = clt(i * tau);
    }
  }

  for (let i = 0; i < nt; i++) {
    for (let j = 0; j < nx - 1; j++) {
      data[i][ny - 1][j] = cx0t(i * tau);
    }
  }

  for (let i = 0; i < ny - 1; i++) {
    for (let j = 0; j < nx - 1; j++) {
      data[0][i][j] = cx0(j * hx);
    }
  }

  // Розв'язок задачі
  for (let i = 1; i < nt; i++) {
    // X
    for (let j = 1; j < ny - 1; j++) {
      betaX[0] = data[i][j][0];

      for (let p = 1; p < nx - 1; p++) {
        betaX[p] = (ax * betaX[p - 1] + fx(i, j, p)) / (cx - ax * alphaX[p - 1])
      }

      for (let p = nx - 2; p > 0; p -= 1) {
        data[i][j][p] = alphaX[p] * data[i][j][p + 1] + betaX[p];
      }
    }
    // Y
    for (let p = 1; p < nx - 1; p++) {
      betaY[0] = data[i][ny - 1][p];

      for (let j = 1; j < ny - 1; j++) {
        betaY[j] = (ay * betaY[j - 1] + fy(i, j, p)) / (cy - ay * alphaY[j - 1]);
      }

      data[i][0][p] = betaY[ny - 2] / (1 - alphaY[ny - 2]);

      for (let j = ny - 2; j > 0; j -= 1) {
        data[i][j][p] = alphaX[j] * data[i][j + 1][p] + betaX[j];
      }
    }
  }

  return data;
}

export default solveConvectionDiffusionProblem;
