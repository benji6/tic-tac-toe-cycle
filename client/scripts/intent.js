import {map} from 'ramda';
export default DOM => ({move$: map(e => e.target.id,
                                   DOM.select('.board .cell').events('click'))});
