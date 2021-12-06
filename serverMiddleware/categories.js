const app = require('express')();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/scheduler', function(err){
	if(err)
		console.log(err);
});
const categorySchema = new mongoose.Schema({
	title: String,
	color: String
});
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

app.use(bodyParser.json());
app.post('/api/getCategories', async (req, res) => {
	console.log('[CATEGORIES] Sending');

	const categories = await Category.find();

	res.status(200).json({
		categories
	});
});

app.post('/api/createCategory', async (req, res) => {
	const { body } = req;
	if(!body){
		res.status(400).send();
		return;
	}

	const category = new Category({
		title: body.title,
		color: body.color
	});
	await category.save();
	console.log('[CATEGORIES] Saved');

	res.status(200).json({
		category
	});
});

module.exports = app;