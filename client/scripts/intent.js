export default ({DOM}) => ({
  move$: DOM
    .select('.cell')
    .events('click')
    .map(e => e.target.id),
})
