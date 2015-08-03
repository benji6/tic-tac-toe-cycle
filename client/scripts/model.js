import {
  all, any, compose, concat, equals, filter, flatten, flip, length, map, nth, or, range
} from 'ramda';
import {mapIndexed} from './tools';

const sideLength = 3;
const codeToCellValue = flip(nth)([, 'O', 'X']);
const filterLength = compose(length, filter);

const isThreeInARow = list => or(all(equals(1))(list), all(equals(2))(list));

const computeBoardViewModel = map(map(codeToCellValue));
const computeMessageViewModel = board => any(isThreeInARow,
                                             concat(board,
                                                    map(x => map(nth(x),
                                                                 board),
                                                        range(0, sideLength)))) ?
                                                          'someone wins' :
                                                          '';

export default ({move$}) => move$
  .startWith(Array.from({length: sideLength}, () => Array.from({length: sideLength}, () => 0)))
  .scan((acc, [row, col]) => mapIndexed((x, i) => mapIndexed((y, j) => i === Number(row) && j === Number(col) && acc[row][col] === 0 ?
    filterLength(equals(1))(flatten(acc)) > filterLength(equals(2))(flatten(acc)) ?
      2 :
      1
    : y, x), acc))
    .map(board => ({board: computeBoardViewModel(board),
                    message: computeMessageViewModel(board)}));
