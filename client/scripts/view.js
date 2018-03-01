import {h} from '@cycle/dom'
import {mapIndexed} from './tools'

export default state$ => ({
  audioGraph: state$.map(({audioGraphParams}) => audioGraphParams),
  DOM: state$.map(({board, message}) => h('div.center', [
    h('table.board', mapIndexed((x, i) => h('tr', mapIndexed((y, j) => h(`td#${String(i) + String(j)}.cell`, {id: String(i) + String(j)}, y),
      x)),
    board)),
    h('div', message),
  ])),
})
