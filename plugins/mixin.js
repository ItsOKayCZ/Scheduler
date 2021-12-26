import Color from './mixins/Color';
import Events from './mixins/Events';
import Categories from './mixins/Categories';

export default {
	...Categories,
	...Events,
	...Color,
};