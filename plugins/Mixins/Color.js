export default {
	methods: {
		isContrastingColor(hexColor){
			return this.luma(hexColor) >= 165;
		},
		luma(hexColor){
			let rgb = this.RGBAStringToArray(hexColor);
			return (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]); // SMPTE C, Rec. 709 weightings
		},
		RGBAStringToArray(color){
			return color = color.slice(
				color.indexOf('(') + 1,
				color.indexOf(')')
			).split(', ');
		},
	},
}