'use strict';

const conf = require('../conf');

var helper = {};

helper.getAge = function (birthdateString) {
	var birthdate = new Date(birthdateString);
	// return [this.firstname, this.lastname].join(' ');
	var ageDifMs = Date.now() - birthdate.getTime();
	var ageDate = new Date(ageDifMs); // miliseconds from epoch
	return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// helper.isWeekday = function () {
// 	var d = new Date();

// 	var dayOfWeek = d.getDay();

// 	var isWeekday = true;
// 	if (dayOfWeek > 5) {
// 		isWeekday = false;
// 	}

// 	return isWeekday;
// }
helper.isWeekday = function (date1) {
	var dt = new Date(date1);
	var isWeekday = true;
	if (dt.getDay() == 6 || dt.getDay() == 0) {
		isWeekday = false;
	}
	return isWeekday;
}

helper.getTodayString = function () {

	var date = new Date();
	var year = date.getFullYear();
	var month = new String(date.getMonth() + 1);
	var day = new String(date.getDate());

	// 한자리수일 경우 0을 채워준다. 
	if (month.length == 1) {
		month = "0" + month;
	}
	if (day.length == 1) {
		day = "0" + day;
	}
	return year + '-' + month + '-' + day;

}

helper.getDateString = function (dateString) {

	var date = new Date(dateString);
	var year = date.getFullYear();
	var month = new String(date.getMonth() + 1);
	var day = new String(date.getDate());

	// 한자리수일 경우 0을 채워준다. 
	if (month.length == 1) {
		month = "0" + month;
	}
	if (day.length == 1) {
		day = "0" + day;
	}
	return year + '-' + month + '-' + day;

}

helper.getWeekOfMonth = function (date) {
	var month = date.getMonth(),
		year = date.getFullYear(),
		firstWeekday = new Date(year, month, 1).getDay(),
		lastDateOfMonth = new Date(year, month + 1, 0).getDate(),
		offsetDate = 7 - firstWeekday,
		daysAfterFirstWeek = lastDateOfMonth - offsetDate,
		weeksInMonth = Math.ceil(daysAfterFirstWeek / 7) + 1;
	var week = 0;
	var noOfDaysAfterRemovingFirstWeek = date.getDate() - offsetDate;
	if (noOfDaysAfterRemovingFirstWeek <= 0) {
		week = 1;
	} else if (noOfDaysAfterRemovingFirstWeek <= 7) {
		week = 2;
	} else if (noOfDaysAfterRemovingFirstWeek <= 14) {
		week = 3;
	} else if (noOfDaysAfterRemovingFirstWeek <= 21) {
		week = 4;
	} else if (weeksInMonth >= 5 && noOfDaysAfterRemovingFirstWeek <= 28) {
		week = 5;
	} else if (weeksInMonth === 6) {
		week = 6;
	}
	return week;
};

module.exports = helper;