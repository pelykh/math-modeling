const defaultProps = {
  roRid: 1000,
  roGru: 1650,
  E: 3.0 * Math.pow(10, 6),
  v: 0.35,
  H1: 1,
  H2: 5,
  L: 10,
  g: 9.8,
};

function solveSoilSSSProblem(props) {
  const {
    roRid,
    roGru,
    E,
    v,
    H1,
    H2,
    L,
    g,
  } = {...props, ...defaultProps};

  const lam = (E * v) / ((1 + v) * (1 - 2 * v));
  const mu = E / (2 * (1 + v));
  const x = Array.from(Array(50), (x, i) => i);

  const solution = (a) => (data) => [
    data.map((x) => x * a / 2.0 * (x - 1)),
    data.map((x) => a * x - a / 2.0),
    data.map((x) => (lam + 2 * mu) * (a * x - a / 2.0)),
  ];

  const drySolution = solution((roGru * g) / (lam + 2 * mu));
  const wetSolution = solution(((-roRid + roGru) * g) / (lam + 2 * mu));
  const filtrationSolution = solution(((roGru + ((H2 - H1) / L - 1) * roRid) * g) / (lam + 2 * mu));

  return {
    x,
    dry: drySolution(x),
    wet: wetSolution(x),
    filtration: filtrationSolution(x),
  }
}

export default solveSoilSSSProblem;
