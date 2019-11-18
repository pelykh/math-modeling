export const trace = (x, y, title) => ({
  mode: 'lines',
  name: title,
  x,
  y,
  line: {
    width: 2,
    color: '#EE655A',
  }
});

export const layout = (title, xTitle, yTitle) => ({
  title: title,
  xaxis: {
    title: xTitle,
    zeroline: false,
  },
  yaxis: {
    title: yTitle,
    zeroline: false,
  }
});
