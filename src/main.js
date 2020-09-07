import ms from 'ms';
import lunchtime from './lunchtime.js';
import millisecondsUntil from './millisecondsUntil.js';

export default function howLongUntilLunch(hours, minutes) {
	// lunch is at 12.30
	if (hours === undefined) hours = 12;
	if (minutes === undefined) minutes = 30;

	const a = 1;
	const b = 2;
	console.log(a, b);
	const sum = () => {
		return a + b;
	}
	console.log(sum())

	var millisecondsUntilLunchTime = millisecondsUntil(lunchtime(hours, minutes));
	return ms(millisecondsUntilLunchTime, { long: true });
}