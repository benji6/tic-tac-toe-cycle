import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import {compose} from 'ramda';
import intent from './intent';
import model from './model';
import view from './view';
import makeAudioGraphDriver from '../../cycle-audio-graph/index';
import audioContext from './audioContext';

run(compose(view, model, intent),
    {DOM: makeDOMDriver('body'),
     audioGraph: makeAudioGraphDriver({audioContext,
                                       output: audioContext.destination})});
