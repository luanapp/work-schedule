const { subMinutes, intervalToDuration } = require('date-fns');
const { map, zipWith, props } = require('ramda');
const { getParsedDate } = require('../dates');

const LUNCH_LIMIT = 4;
const parseEnterRow = row => {
  if (typeof row == Array) {
    return subMinutes(getParsedDate(row[0]), row[2]);
  }
  return getParsedDate(row);
};

const updateHours = ({ hours }) => (hours > LUNCH_LIMIT ? hours - 9 : hours - 8);
const getRowDuration = (enterDate, exitDate) =>
  intervalToDuration({
    start: parseEnterRow(enterDate),
    end: getParsedDate(exitDate),
  });

const subtractWorkHours = workHours => {
  return map(item => ({ ...item, ...{ hours: updateHours(item) } }), workHours);
};

const getHourBalance = (enterRows, exitRows) => subtractWorkHours(zipWith(getRowDuration, enterRows, exitRows));

module.exports = { getHourBalance };
