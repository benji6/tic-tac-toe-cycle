import {map} from 'ramda';
export default DOM => ({move$: map(e => e.target.id,
                                   DOM.get('.board .cell', 'click'))});
