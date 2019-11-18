import helper from "../utils/data_helper";

const defaultProps = {
  D: 1,
  Q: 1,
  y: 1,
  L: 10,
  x0: 2.82,
};

function solveOneDimSourceOfPollutionProblem(props) {
  const {
    D,
    Q,
    y,
    L,
    x0,
  } = {...defaultProps, ...props};

  const w = Math.sqrt((y / D));
  const Ko = Q / (w * D * Math.sinh(w * L));

  const grin = (x0, x1, x2) => [
    ...x1.map((x) => Ko * Math.sinh(w * (L - x0)) * Math.sinh(w * x)),
    ...x2.map((x) => Ko * Math.sinh(w * (L - x)) * Math.sinh(w * x0)),
  ];

  const Y = [];
  const X = [];

  [x0, 1.0, 2.0, 7.0, 8.0, L / 2.0].forEach((x, i) => {
    const x1 = helper.linspace(0, x, 50);
    const x2 = helper.linspace(x, L, 50);
    Y[i] = grin(x, x1, x2);
    X[i] = x1.concat(x2);
  });

  const X1 = X[5][5];
  const C1 = Y[5][5];

  const targetX0 = L - (1.0 / w) * Math.asinh(C1 / (Ko * Math.sinh(w * X1)));
  const targetAproxX0 = L - (1.0 / w) * Math.asinh((C1 * (0.9 + 0.2 * Math.random())) / (Ko * Math.sinh(w * X1)));

  return {
    X,
    Y,
    targetX0,
    targetAproxX0,
  }
}

export default solveOneDimSourceOfPollutionProblem;
