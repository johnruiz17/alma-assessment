const fs = require('fs');
const csv = require('csv-parser');

function bookingSystem() {
	this.bookings = [];
}

// removes the booking interval from the current bookings at the specified index
bookingSystem.prototype.removeInterval = function (value, index) {
	if (value !== 0) return null;
	this.bookings.splice(index, 1);
	return this.bookings;
};

// books room and returns true if room is available for the given interval, returns false otherwise
bookingSystem.prototype.book = function (start, end) {
	// if a 0 is found, call the remove interval method instead and return
	if (start === 0) {
		this.removeInterval(start, end);
		return;
	}

	// iterate through every current booking (does not execute if bookings array is empty)
	for (let booking of this.bookings) {
		const [bookingStart, bookingEnd] = booking;

		// if the end time is less than any of the current end times, return false
		if (end <= bookingEnd) {
			console.log('false');
			return false;
		}
	}

	// store interval as an array [start, end] and return true
	this.bookings.push([start, end]);
	console.log('true');
	return true;
};

// create two booking systems and test their outputs
const testBookingSystem1 = new bookingSystem();
const testBookingSystem2 = new bookingSystem();
const results1 = [];
const results2 = [];

// read input intervals from first csv file
fs.createReadStream('file-1.csv')
	.pipe(csv([]))
	.on('data', data => results1.push(data))
	.on('end', () => {
		let intervals = [];

		for (let interval of results1) {
			let startAndEnd = [];
			for (let key in interval) {
				startAndEnd.push(Number(interval[key]));
			}
			intervals.push(startAndEnd);
		}

		for (let interval of intervals) {
			const [start, end] = interval;
			testBookingSystem1.book(start, end);
		}
	}); // -> correct output is logged to the console: true, true, false

// read input intervals from second csv file
fs.createReadStream('file-2.csv')
	.pipe(csv([]))
	.on('data', data => results2.push(data))
	.on('end', () => {
		let intervals = [];

		for (let interval of results2) {
			let startAndEnd = [];
			for (let key in interval) {
				startAndEnd.push(Number(interval[key]));
			}
			intervals.push(startAndEnd);
		}

		for (let interval of intervals) {
			const [start, end] = interval;
			testBookingSystem2.book(start, end);
		}
	}); // -> correct output is logged to the console: true, true, false, true
