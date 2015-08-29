import {
  always, all, any, compose, empty, equals, filter, flatten,
  flip, ifElse, length, map, nth, or, range,
} from 'ramda';
import {mapIndexed} from './tools';

const sideLength = 3;
const seedRange = range(0, sideLength);
const codeToCellValue = flip(nth)([, 'O', 'X']);
const filterLength = compose(length, filter);
const isThreeInARow = list => or(all(equals(1))(list), all(equals(2))(list));
const allLines = board => [...board,
                           ...map(x => map(nth(x), board), seedRange),
                           map(x => board[x][x], seedRange),
                           map(x => board[x][sideLength - 1 - x], seedRange)];
const isVictory = compose(any(isThreeInARow), allLines);
const computeBoardViewModel = map(map(codeToCellValue));
const computeMessageViewModel = ifElse(isVictory, always('someone wins'), empty);

export default ({move$}) => move$
  .startWith([for (i of seedRange) [for (j of seedRange) 0]]) // eslint-disable-line no-unused-vars
  .scan((acc, [row, col]) => mapIndexed((x, i) => mapIndexed((y, j) => i === Number(row) && j === Number(col) && acc[row][col] === 0 ?
    filterLength(equals(1), flatten(acc)) > filterLength(equals(2), flatten(acc)) ?
      2 :
      1
    : y, x), acc))
    .map(board => ({board: computeBoardViewModel(board),
                    message: computeMessageViewModel(board)}));
