import {all, always, and, any, compose, empty, equals, filter, flatten,
        flip, gt, ifElse, length, map, none, nth, or, range} from 'ramda';
import {mapIndexed} from './tools';

let gameOver = false;
const sideLength = 3;
const seedRange = range(0, sideLength);
const [equals0, equals1, equals2] = map(equals, seedRange);
const codeToCellValue = flip(nth)([, 'O', 'X']);
const filterLength = compose(length, filter);
const isThreeInARow = list => or(all(equals1)(list), all(equals2)(list));
const allLines = board => [...board,
                           ...map(x => map(nth(x), board), seedRange),
                           map(x => board[x][x], seedRange),
                           map(x => board[x][sideLength - 1 - x], seedRange)];
const isVictory = compose(any(isThreeInARow), allLines);
const boardFull = compose(none(equals0), flatten);
const currentPlayerCode = board => gt(filterLength(equals1, flatten(board)),
                                      filterLength(equals2, flatten(board))) ? 2 : 1;
const computeBoardViewModel = map(map(codeToCellValue));
const computeMessageViewModel = ifElse(isVictory,
                                       board => equals1(currentPlayerCode(board)) ? 'Victory for crosses!' : 'Victory for noughts!',
                                       ifElse(boardFull,
                                              always('Draw!'),
                                              empty));

export default ({move$}) => move$
  .startWith([for (i of seedRange) [for (j of seedRange) 0]]) // eslint-disable-line no-unused-vars
  .scan((acc, [row, col]) => mapIndexed((x, i) => mapIndexed((y, j) => and(and(equals(i, Number(row)),
                                                                               equals(j, Number(col))),
                                                                           equals0(acc[row][col])) ? currentPlayerCode(acc) : y,
                                                             x),
                                        acc))
  .filter(() => !gameOver)
  .do(x => gameOver = isVictory(x))
  .map(board => ({board: computeBoardViewModel(board),
                  message: computeMessageViewModel(board)}));
