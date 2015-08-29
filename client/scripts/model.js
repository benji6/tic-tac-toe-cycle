import {
  always, all, any, compose, empty, equals, F, filter, flatten, flip,
  inc, ifElse, length, map, nth, or, range, repeat, unfold
} from 'ramda';
import {mapIndexed} from './tools';

const sideLength = 3;
const codeToCellValue = flip(nth)([, 'O', 'X']);
const filterLength = compose(length, filter);
const isThreeInARow = list => or(all(equals(1))(list), all(equals(2))(list));
const isVictory = board => any(isThreeInARow,
                               [...board,
                                ...map(x => map(nth(x),
                                                board),
                                       range(0, sideLength)),
                                ...[]]);
const computeBoardViewModel = map(map(codeToCellValue));
const computeMessageViewModel = ifElse(isVictory, always('someone wins'), empty);

export default ({move$}) => move$
  .startWith(unfold(ifElse(equals(sideLength), F, n => [repeat(0, sideLength), inc(n)]), 0))
  .scan((acc, [row, col]) => mapIndexed((x, i) => mapIndexed((y, j) => i === Number(row) && j === Number(col) && acc[row][col] === 0 ?
    filterLength(equals(1), flatten(acc)) > filterLength(equals(2), flatten(acc)) ?
      2 :
      1
    : y, x), acc))
    .map(board => ({board: computeBoardViewModel(board),
                    message: computeMessageViewModel(board)}));
