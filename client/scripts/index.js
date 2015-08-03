import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import intent from './intent';
import model from './model';
import view from './view';

const main = ({DOM}) => ({DOM: view(model(intent(DOM)))});
const drivers = {DOM: makeDOMDriver('body')};

run(main, drivers);
