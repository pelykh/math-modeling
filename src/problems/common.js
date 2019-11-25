import helper from "../utils/data_helper";

export function solveMonotoneScheme(props) {
  const {
    n, Tn, h, tau,
    f0t, fLt, fx0,
    a, b, c,
    f, data,
  } = props;

  const alpha = helper.initializeMultiDimArray([n - 1]);
  const beta = helper.initializeMultiDimArray([n - 1]);

  for (let i = 0; i < Tn; i++) {
    data[i][0] = f0t(i * tau);
    data[i][n - 1] = fLt(i * tau);
  }

  for (let i = 1; i < n - 1; i++) {
    alpha[i] = b / (c - alpha[i - 1] * a);
    data[0][i] = fx0(i * h);
  }

  for (let k = 1; k < Tn; k++) {
    beta[0] = data[k][0];

    for (let i = 1; i < n - 1; i++) {
      beta[i] = ((a * beta[i - 1]) + f(k, i)) / (c - alpha[i - 1] * a);
    }

    for (let i = n - 2; i > 0; i--) {
      data[k][i] = alpha[i] * data[k][i + 1] + beta[i];
    }
  }

  return data;
}

export function solveMonotoneSchemeTwoDim(props) {
  const {
    lx, ly, hx, hy, t, tau,
    fx0, f0t, flt, fx0t, fxlt,
    ax, bx, cx,
    ay, by, cy,
    fx, fy, data,
  } = props;

  const nx = parseInt(lx / hx);
  const ny = parseInt(ly / hy);
  const nt = parseInt(t / tau);
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
      data[i][j][0] = f0t(i * tau);
      data[i][j][nx - 1] = flt(i * tau);
    }
  }

  for (let i = 0; i < nt; i++) {
    for (let j = 0; j < nx - 1; j++) {
      data[i][0][j] = fx0t(i * tau);

      if(fxlt) {
        data[i][ny - 1][j] = fxlt(i * tau);
      }
    }
  }

  for (let i = 0; i < ny - 1; i++) {
    for (let j = 0; j < nx - 1; j++) {
      data[0][i][j] = fx0(j * hx);
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
