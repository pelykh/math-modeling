import helper from '../utils/data_helper';

const defaultProps = {
  T_MAX: 60,
  tau: 1,
  L: 10,
  hx: 0.1,
  sigma: 0.4,
  gamma: 0.0065,
  D: 0.4,
  Cm: 350,
  C0: 0,
  C1: 0,
  C2: 15,
  H1: 1.8,
  H2: 1.4,
  v: 2.8 * Math.pow(10, -5),
  k: 3.5,
  ro: 1000,
  g: 9.8,
};

function solveOneDimMassTransferWithOsmosis(props) {
  const {
    T_MAX,
    tau,
    L,
    hx,
    H2,
    H1,
    Cm,
    C0,
    C1,
    C2,
    k,
    v,
    gamma,
    sigma,
    D,
    ro,
    g,
  } = {...defaultProps, props};

  const T = Math.floor(T_MAX / tau);
  const n = Math.floor(L / hx);

  const H = helper.initializeMultiDimArray([T, n]);
  const C = helper.initializeMultiDimArray([T, n]);

  for (let i = 0; i < n; i++) {
    H[0][i] = ((H2 - H1) / L) * (i * hx) + H1;
    C[0][i] = C0;
  }

  for (let i = 0; i < T; i++) {
    H[i][0] = H1;
    H[i][n - 1] = H2;
    C[i][0] = C1;
    C[i][n - 1] = C2;
  }

  for (let t = 1; t < T; t++) {
    let a = helper.initializeMultiDimArray([n]);
    let b = helper.initializeMultiDimArray([n]);
    let c = helper.initializeMultiDimArray([n]);
    const f = helper.initializeMultiDimArray([n]);

    for (let i = 1; i < n - 1; i++) {
      const V = -k * ((H[t - 1][i + 1] - H[t - 1][i - 1]) / (2 * hx)) + v * ((C[t - 1][i + 1] - C[t - 1][i - 1]) / (2 * hx));
      const rPlus = (V + Math.abs(V)) / 2;
      const rMinus = (V - Math.abs(V)) / 2;
      const eta = 1.0 / (1.0 + 0.5 * hx * Math.abs(rPlus + rMinus));
      a[i] = eta / Math.pow(hx, 2) - rMinus / hx;
      b[i] = eta / Math.pow(hx, 2) + rPlus / hx;
      c[i] = a[i] + b[i] + gamma / D + sigma / tau;
      f[i] = gamma * Cm + (sigma / tau) * C[t - 1][i];
    }

    let alpha = helper.initializeMultiDimArray([n]);
    alpha[0] = 0;
    let beta = helper.initializeMultiDimArray([n]);
    beta[0] = C[t][0];

    for (let i = 1; i < n - 1; i++) {
      alpha[i] = b[i] / (c[i] - alpha[i - 1] * a[i]);
      beta[i] = (beta[i - 1] * a[i] + f[i]) / (c[i] - alpha[i - 1] * a[i]);
    }

    for (let i = n - 2; i > 0; i--) {
      C[t][i] = alpha[i] * C[t][i + 1] + beta[i];
    }

    let mu = 1 * ro * g * ((1.0 - (2 * hx)) / (H[t - 1][1] - H[t - 1][n - 1])); // (H[t-1][i+1] - H[t-1][i-1])
    a = k / Math.pow(hx, 2);
    b = k / Math.pow(hx, 2);
    c = mu / tau + a + b;

    alpha = helper.initializeMultiDimArray([n]);
    alpha[0] = 0;
    beta = helper.initializeMultiDimArray([n]);
    beta[0] = H[t][0];

    for (let i = 1; i < n - 1; i++) {
      alpha[i] = b / (c - alpha[i - 1] * a);
      beta[i] = (beta[i - 1] * a + (mu / tau * H[t - 1][i - 1] - (sigma / Math.pow(hx, 2)) * (C[t][i - 1] - 2 * C[t][i] + C[t][i + 1]))) / (c - alpha[i - 1] * a);
    }

    for (let i = n - 2; i > 0; i--) {
      H[t][i] = alpha[i] * H[t][i + 1] + beta[i];
    }
  }

  return { C, H };
}

export default solveOneDimMassTransferWithOsmosis;
