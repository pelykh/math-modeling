import helper from "../utils/data_helper";
import {solveMonotoneScheme} from "./common";

const defaultProps = {
  H1: 59,
  H2: 26,
  L: 100,
  K: Math.pow(10, -3),
  tau: 1,
  h: 1,
  T: 31,
  sigma: 0.2,
  D: 2 * 10 ** -2,
  N: 2,
  gamma: 0.0065,
  C1: 350,
  C2: 8,
  Cg: 100,
  e_: 0.6,
  gammaGr: 2 * Math.pow(10, 4),
  aGr: 51.2 * Math.pow(10, -6),
  vOs: 2.5 * Math.pow(10, -5),
};

function solveSubProblem(props) {
  const {
    H1,
    H2,
    L,
    K,
    tau,
    h,
    T,
    sigma,
    D,
    gamma,
    C1,
    C2,
    Cg,
  } = {...defaultProps, ...props};

  const n = parseInt(`${L / h}`);
  const Tn = parseInt(`${T / tau}`);

  const fx0 = (x) => C1 * Math.exp(-x / L * Math.log(C1 / C2));
  const f0t = (t) => C1;
  const fLt = (t) => C2;

  const V = -K * ((H2 - H1) / L);
  const rMinus = -V / D;
  const rPlus = 0;
  const mu = 1.0 / (1 + 0.5 * h * Math.abs(rMinus + rPlus));
  const a = mu / h - rMinus / h;
  const b = mu / h + rPlus / h;
  const c = (2 * mu / Math.pow(h, 2)) + rPlus / h - rMinus / h + gamma / D + sigma / (D * tau);
  const data = helper.initializeMultiDimArray([Tn, n]);
  const f = (k, i) => (gamma / D) * Cg + (sigma / (D * tau)) * data[k - 1][i];

  return solveMonotoneScheme({
    n, Tn, h, tau,
    a, b, c,
    f0t, fLt, fx0,
    f, data,
  });
}

function solveFConsolidationClayWithMassTransferProblem(props) {
  const {
    H1,
    H2,
    L,
    T,
    K,
    tau,
    h,
    e_,
    gammaGr,
    aGr,
    vOs,
  } = {...defaultProps, ...props};

  const n = parseInt(`${L / h}`);
  const Tn = parseInt(`${T / tau}`);
  const C = solveSubProblem(props);
  const fx0 = (x) => ((H2 - H1) / L) * x + H1;
  const f0t = (t) => H1;
  const fLt = (t) => H2;
  const data = helper.initializeMultiDimArray([Tn, n]);
  const a_ = K * ((1 + e_) / (gammaGr * aGr));
  const b_ = vOs * ((1 + e_) / (gammaGr * aGr));
  const a = a_ / Math.pow(h, 2);
  const b = a_ / Math.pow(h, 2);
  const c = 1.0 / tau - ((2 * a_) / Math.pow(h, 2));
  const f = (k, i) => 1.0 / tau * data[k - 1][i] + b_ * ((C[k][i - 1] - 2 * C[k][i] + C[k][i - 1]) / Math.pow(h, 2));

  solveMonotoneScheme({
    n, Tn, h, tau,
    a, b, c,
    f0t, fLt, fx0,
    f, data,
  });

  return {
    C,
    H: data,
  };
}

export default solveFConsolidationClayWithMassTransferProblem;
