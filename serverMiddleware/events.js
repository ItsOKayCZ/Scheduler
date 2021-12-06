const app = require('express')();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/scheduler', function(err){
	if(err)
		console.log(err);
});
const eventSchema = new mongoose.Schema({
	name: String,
	start: Date,
	end: Date,

	category: String,
	timed: Boolean,

	repeat: Boolean,
	repeatAfter: Number
});
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

app.use(bodyParser.json());
app.post('/api/getEvents', async (req, res) => {
	console.log('[EVENTS] Sending');

	const events = await Event.find();

	res.status(200).json({
		events
	});
});

app.post('/api/createEvent', async (req, res) => {
	const { body } = req;
	if(!body){
		res.status(400).send();
		return;
	}

	const event = new Event({
		name: body.name,
		start: body.start,
		end: body.end,
		category: body.category,
		timed: body.timed,

		repeat: body.repeat,
		repeatAfter: body.repeatAfter
	});
	await event.save();
	console.log('[EVENTS] Saved');

	res.status(200).json({
		event
	});
});

module.exports = app;