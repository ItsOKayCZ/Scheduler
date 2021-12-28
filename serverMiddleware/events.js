const app = require('express')();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const moment = require('moment');

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
	repeatAfter: Number,
	repeatTo: Date,

	exclude: [Date],
});
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

app.use(bodyParser.json());
app.post('/api/createEvent', async (req, res) => {
	const { body } = req;
	if(!body){
		res.status(400).send();
		return;
	}

	const event = new Event(getEventFromBody(body));
	await event.save();
	console.log('[EVENTS] Saved');

	res.status(200).json({
		event
	});
});

app.post('/api/editEvent', async (req, res) => {
	const event = req.body;
	if(!event){
		res.status(400).send();
		return;
	}

	console.log(`[EVENTS] Editing ${event._id}`);
	await Event.updateOne({ _id: event._id }, getEventFromBody(event));
	const events = await Event.find();

	res.status(200).json({
		events
	});
})

app.post('/api/removeEvent', async (req, res) => {
	const event = req.body;
	if(!event){
		res.status(400).send();
		return;
	}
	console.log(`[EVENTS] Deleting ${event._id}`);

	await Event.deleteOne({ _id: event._id });
	const events = await Event.find();

	res.status(200).json({
		events
	});
});

app.post('/api/removeCurrentEvent', async (req, res) => {
	const event = req.body;
	if(!event){
		res.status(400).send();
		return;
	}

	console.log(`[EVENTS] Deleting ${moment(event.start).format('DD.MM.YYYY HH:mm')}; id: ${event._id}`);
	const exclude = event.exclude;
	exclude.push(event.start);
	await Event.updateOne({ _id: event._id }, { exclude })

	const events = await Event.find();
	res.status(200).json({
		events
	});
});

app.post('/api/getEvents', async (req, res) => {
	console.log('[EVENTS] Sending');

	const events = await Event.find();

	res.status(200).json({
		events
	});
});

function getEventFromBody(body){
	return {
		name: body.name,
		start: body.start,
		end: body.end,
		category: body.category,
		timed: body.timed,

		repeat: body.repeat,
		repeatAfter: body.repeatAfter,
		repeatTo: body.repeatTo,

		exclude: body.exclude,
	};
}

module.exports = app;