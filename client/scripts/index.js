import {run} from '@cycle/run'
import {makeDOMDriver} from '@cycle/dom'
import {compose} from 'ramda'
import intent from './intent'
import model from './model'
import view from './view'
import makeAudioGraphDriver from 'cycle-audio-graph'
import audioContext from './audioContext'

const main = compose(view, model, intent)
const drivers = {
  audioGraph: makeAudioGraphDriver({
    audioContext,
    output: audioContext.destination,
  }),
  DOM: makeDOMDriver('#app'),
}

run(main, drivers)
