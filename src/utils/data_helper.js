function initializeMultiDimArray(dims=[]) {
  const result = [];
  dims = [...dims];
  const dim = dims.shift();

  if(dim) {
    for(let i = 0; i < dim; i++) {
      result[i] = initializeMultiDimArray(dims);
    }
  } else {
    return 0;
  }

  return result
}

function linspace(a=0, b=0, n=1) {
  return Array.from(Array(n), (x, i) => a + i * (b - a) / n);
}

export default {
  initializeMultiDimArray,
  linspace,
};
