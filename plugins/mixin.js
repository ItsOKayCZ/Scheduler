import Color from './Mixins/Color';
import Events from './Mixins/Events';
import Categories from './Mixins/Categories';

export default {
	...Categories,
	...Events,
	...Color,
};