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

export default {
  initializeMultiDimArray,
};
