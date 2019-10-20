const defaultProps = {
  l: 100, // Довжина пласта
  h: 20, // Крок довжини
  k: 1.5,
  h1: 1.5, // Напір в лівому басейні
  h2: 0.5,  // Напір в правому басейні
  d: 0.2, // Коефіцієнт конвективної дифузії
  gamma:  0.0065, // Коефіцієнт масообміну (в умові немає, використовуй це значення)
  sigma: 0.2, // Пористість грунту
  c0: (x) => 0,
  c1: (t) => Math.pow(t, 2) * Math.exp(-t), // с(0,t)
  c2: (t) => Math.pow(t, 2) * Math.exp(-2 * t), // с(l,t)
  t: 30, // Кількість днів
  tau: 1, // Крок часу в днях
  cg: 12, // Граничне насичення (в умові немає, використовуй це значення)

  dt: 0.04,
  cp: 0.42,
  cn: 3,
  t1: 200,
  t2: 18,
  lam: 1.5,
};

function solveTempSubproblem(props) {
  props = { ...defaultProps, ...props };

  const { l, h, t, tau, k, h1, h2, cp, lam, cn, t2, t1 } = props;

  const nt = cn / lam;
  const t0 = (x) => (t2 - t1) / l * x + t1;
  const steps = parseInt( l / h);
  const tSteps = parseInt( t / tau);
  const v = k * (h1 - h2) / l;
  const rMinus = - v * cp / lam;
  const rPlus = 0;
  const mu =  1 / (1 + 0.5 * h * Math.abs(rMinus + rPlus));
  const a = mu / Math.pow(h,2) - rMinus / h;
  const b = mu / Math.pow(h,2) + rPlus / h;
  const c = a + b + nt / tau;
  const data = [];
  const f = (i, j) => nt / tau * data[i-1][j-1];

  const alpha = [0];
  for(let i = 1; i < steps; i++) {
    alpha[i] = (b / (c - a * alpha[i-1]));
  }

  const getBeta = (i) => {
    const beta =  [t1];
    for (let j = 1; j < steps; j += 1) {
      beta[j] = (a * beta[j-1] + f(i, j)) / (c - a * alpha[j-1]);
    }
    return beta;
  };

  // Задаю граничні умови справа та зліва
  for (let i = 0; i <= tSteps; i += 1) {
    data.push([]);
    data[i][0] = t1;
    data[i][steps-1] = t2;
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
      data[i][j] = alpha[j+1] * data[i][j+1] + beta[j+1];
    }
  }

  return data;
}

function solveOneDimMassTempTransferProblem(props) {
  props = { ...defaultProps, ...props };

  const { l, h, t, tau, k, h1, h2, d, gamma, sigma, cg, dt, c1, c2, c0,} = props;
  const temp = solveTempSubproblem(props);

  const steps = parseInt( l / h);
  const tSteps = parseInt( t / tau);
  const v = k * (h1 - h2) / l;
  const rMinus = - v / d;
  const rPlus = 0;
  const mu =  1 / (1 + 0.5 * h * Math.abs(rMinus + rPlus));
  const a = mu / Math.pow(h,2) - rMinus / h;
  const b = mu / Math.pow(h,2) + rPlus / h;
  const c = a + b + gamma / d + sigma / (d * tau);
  const data = [];
  const f = (i, j) => {
    return (
      gamma / 2 * d * cg +
      (dt / d) * (temp[i][j-1] - 2 * temp[i][j] + temp[i][j+1]) / Math.pow(h, 2) +
      sigma / tau / d * data[i-1][j-1]
    )
  };

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
    data[i][0] = c1(i * tau);
    data[i][steps-1] = c2(i * tau);
  }

  // Задаю граничні умови в початковий момент часу
  for (let i = 1; i < steps - 1; i += 1) {
    data[0][i] = c0(i * h);
  }

  //Методом прогонки знаходжу розв'язок
  for (let i = 1; i <= tSteps; i += 1) {
    const beta = getBeta(i);

    for (let j = steps - 2; j > 0; j -= 1) {
      data[i][j] = alpha[j+1] * data[i][j+1] + beta[j+1];
    }
  }

  return {
    mass: data,
    temp,
  };
}

export default solveOneDimMassTempTransferProblem;
