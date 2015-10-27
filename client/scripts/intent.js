import {map} from 'ramda';
const ids = map(e => e.target.id);
export default ({DOM}) => ({move$: ids(DOM.select('.board .cell').events('click'))});
