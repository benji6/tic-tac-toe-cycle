export default DOM => ({
  move$: DOM.get('.board .cell', 'click').map(e => e.target.id),
});
