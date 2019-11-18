export const trace = (x, y, name, color='#EE655A', mode='lines') => ({
  mode,
  name,
  x,
  y,
  line: {
    width: 2,
    color
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
