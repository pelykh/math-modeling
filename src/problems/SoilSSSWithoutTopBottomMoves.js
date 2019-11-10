// Lab7
const defaultProps = {
  lam_1: 13500,
  lam_2: 17000,
  mu_1: 9000,
  mu_2: 11500,
  y_w: 10.5,
  y_n: 17.0,
  L_1: 0.5,
};

function solveSoilSSSWithoutTopBottomMovesProblem(props) {
  const {
    lam_1,
    lam_2,
    mu_1,
    mu_2,
    y_w,
    y_n,
    L_1,
  } = {...defaultProps, ...props};

  const a_1 = (y_w) / (lam_1 + 2 * mu_1);
  const a_2 = (y_n) / (lam_2 + 2 * mu_2);
  const C2 = 0;
  const C3 = ((a_2 / 2.0) - ((a_1 + a_2) * Math.pow(L_1, 2)) / 2.0 + ((lam_2 + 2 * mu_2)
    / (lam_1 + 2 * mu_1)) * (a_2 * Math.pow(L_1, 2)))
    / ((1.0 - ((lam_2 + 2 * mu_2) / (lam_1 + 2 * mu_1))) * L_1 - 1.0);
  const C4 = -C3 - a_2 / 2.0;
  const C1 = ((lam_2 + 2 * mu_2) / (lam_1 + 2 * mu_1)) * (a_2 * L_1 + C3) - a_1 * L_1;

  const solution = (a, c1, c2, lam, mu) => (data) => [
    data.map((x) => a * Math.pow(x, 2) / 2 + c1 * x + c2),
    data.map((x) => a * x + c1),
    data.map((x) => (lam + 2 * mu) * (a * x + c1)),
  ];

  const wetSolution = solution(a_1, C1, C2, lam_1, mu_1);
  const drySolution = solution(a_2, C3, C4, lam_2, mu_2);

  const x1 = Array.from(Array(50), (x, i) => i / 100);
  const x2 = Array.from(Array(50), (x, i) => 0.5 + i / 100);

  const wetResult = wetSolution(x1);
  const dryResult = drySolution(x2);

  return [x1, wetResult, x2, dryResult];
}

export {
  solveSoilSSSWithoutTopBottomMovesProblem,
};
