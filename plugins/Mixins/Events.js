import * as moment from 'moment';

export default {
	methods: {
		getAllEventsInRange(start, end){
			if(!start){
				console.error('Start date is not defined');
				console.error(new Error().stack);
				return;
			}
			if(!end){
				console.error('End date is not defined');
				console.error(new Error().stack);
				return;
			}

			start = start.clone();
			end = end.clone();

			const events = [];
			for (const event of this.$store.state.events.data) {
				const eventStart = moment(event.start);
				const eventEnd = moment(event.end);

				if(!event.repeat && doRangesIntersect(eventStart, eventEnd, start, end)){
					events.push({
						...event,
						start: maxTime(eventStart, start).toDate(),
						end: minTime(eventEnd, end).toDate()
					});
				} else if(event.repeat){
					for(let day = start.clone(); day.isSameOrBefore(end); day.add(1, 'day')){
						const dayDiff = Math.ceil(moment.duration(day.diff(eventStart)).asDays());
						if(dayDiff % event.repeatAfter == 0){

							let modifiedStart = day.clone().set({
								hours: eventStart.hours(),
								minutes: eventStart.minutes()
							});
							modifiedStart = maxTime(modifiedStart, start);

							const duration = eventEnd.diff(eventStart, 'minute');
							let modifiedEnd = modifiedStart.clone().add(duration, 'minute');
							modifiedEnd = minTime(modifiedEnd, end);

							events.push({
								...event,
								start: modifiedStart.toDate(),
								end: modifiedEnd.toDate()
							});
						}
					}
				}
			}

			return events;
		}
	}
};

function doRangesIntersect(start1, end1, start2, end2){
	return start1.isBetween(start2, end2, 'minutes', '[]')
	|| end1.isBetween(start2, end2, 'minutes', '[]')
	|| start2.isBetween(start1, end1, 'minutes', '[]')
	|| end2.isBetween(start1, end1, 'minutes', '[]');
}

function maxTime(time1, time2){
	return time1.isBefore(time2, 'minutes') ? time2 : time1;
}
function minTime(time1, time2){
	return time1.isAfter(time2, 'minutes') ? time2 : time1;
}