import data_helper from "../utils/data_helper";
import {solveMonotoneSchemeTwoDim} from "./common";

const defaultProps = {
  H1: 1.5,
  H2: 0.5,
  lx: 100,
  ly: 10,
  hx: 1,
  hy: 1,
  tau: 1,
  t: 31,
  K: 1.5,
  D: 0.02,
  Dt: Math.pow(10, -3),
  sigma: 0.4,
  gamma: 0.0065,
  C1: 350,
  C2: 80,
  T1: 35,
  T2: 18,
  // C2: 16,
  // T1: 27,
  // T2: 10,
  T3: 10,
  T4: 18,
  Cp: 0.4200,
  Cn: 0.3000,
  lam: 1.5,
  Cm: 350,
  Cg: 35,
};

function solveTempSubProblem(props) {
  const {
    T1, T2, T3, T4,
    lx, hx, ly, hy,
    t, tau,
    Cn, lam, Cp,
    H1, H2, K,
  } = {...defaultProps, ...props};

  const xn = parseInt(lx / hx);
  const yn = parseInt(ly / hy);
  const Tn = parseInt(t / tau);
  const fx0 = (x) => ((T2 - T1) / lx) * x + T1;
  const f0t = (t) => T1;
  const flt = (t) => T2;
  const fx0t = (x) => T4;
  const fxlt = (x) => T3;

  const data = data_helper.initializeMultiDimArray([Tn, yn, xn]);

  const fx = (k, i, j) => nt / tau * data[k - 1][i][j];
  const fy = (k, i, j) => nt / tau * data[k][i][j];

  const V = ((H1 - H2) / lx) * K;
  const nt = Cn / lam;
  const r_plus_x = 0;
  const r_minus_x = (-V * Cp) / lam;
  const mx = 1.0 / (1 + 0.5 * hx * Math.abs(r_plus_x + r_minus_x));
  const ax = mx / Math.pow(hx, 2) - r_minus_x / hx;
  const bx = mx / Math.pow(hx, 2) + r_plus_x / hx;
  const cx = (2 * mx) / Math.pow(hx, 2) - r_minus_x / hx + r_plus_x / hx + nt / tau;
  const ay = 1.0 / Math.pow(hy, 2);
  const by = 1.0 / Math.pow(hy, 2);
  const cy = 2.0 / Math.pow(hy, 2) + nt / tau;

  return solveMonotoneSchemeTwoDim({
    lx, ly, hx, hy, t, tau,
    fx0, f0t, flt, fx0t, //fxlt,
    ax, bx, cx,
    ay, by, cy,
    fx, fy, data,
  });
}

function solveConvectionDiffusionWithTempProblem(props) {
  const {
    H1,
    H2,
    lx,
    ly,
    hx,
    hy,
    tau,
    t,
    K,
    D,
    Dt,
    sigma,
    gamma,
    C1,
    C2,
    Cp,
    Cn,
    lam,
    Cm,
    Cg,
  } = {...defaultProps, ...props};

  const T = solveTempSubProblem(props);
  const fx0 = (x) => ((C2 - C1) / lx) * x + C1;
  const f0t = (t) => C1;
  const flt = (t) => C2;
  const fx0t = (x) => Cm;
  const xn = parseInt(lx / hx);
  const yn = parseInt(ly / hy);
  const Tn = parseInt(t / tau);
  const data = data_helper.initializeMultiDimArray([Tn, yn, xn]);

  const gwa = (gamma / (2 * D)) * Cg + (Dt / D);
  const fx = (k, i, j) => (
    gwa * ((T[k][i - 1][j] - 2 * T[k][i][j] + T[k][i + 1][j]) / Math.pow(hx, 2))
    + (sigma / (D * tau)) * data[k - 1][i][j]
  );

  const fy = (k, i, j) => gwa * ((T[k][i - 1][j] - 2 * T[k][i][j] + T[k][i + 1][j]) / Math.pow(hy, 2)) +
    (sigma / (D * tau)) * data[k][i][j];

  const V = ((H1 - H2) / lx) * K;
  const r_plus_x = 0;
  const r_minus_x = -V / D;
  const mx = 1.0 / (1 + 0.5 * hx * Math.abs(r_plus_x + r_minus_x));
  const ax = mx / Math.pow(hx, 2) - r_minus_x / hx;
  const bx = mx / Math.pow(hx, 2) + r_plus_x / hx;
  const cx = (2 * mx) / Math.pow(hx, 2) - r_minus_x / hx + r_plus_x / hx + gamma / (2 * D) + sigma / (D * tau);
  const ay = 1.0 / Math.pow(hy, 2);
  const by = 1.0 / Math.pow(hy, 2);
  const cy = 2.0 / Math.pow(hy, 2) + sigma / (D * tau);

  solveMonotoneSchemeTwoDim({
    lx, ly, hx, hy, t, tau,
    fx0, f0t, flt, fx0t,
    ax, bx, cx,
    ay, by, cy,
    fx, fy, data,
  });


  return {
    C: data,
    T,
  }
}

export default solveConvectionDiffusionWithTempProblem;
