const { intervalToDuration, format, subMinutes } = require('date-fns');
const { map, zipWith } = require('ramda');
const { getParsedDate } = require('../dates');

const LUNCH_LIMIT = 4;

const parseExtraTime = rawTime => {
  if (!rawTime) {
    return 0;
  }
  const signal = rawTime.startsWith('-') ? -1 : 1;
  const [hours, minutes] = rawTime.split(':');
  return signal * (signal * hours * 60 + new Number(minutes));
};

const parseEnterRow = row => {
  if (typeof row !== 'string') {
    return subMinutes(getParsedDate(row[0]), parseExtraTime(row[2]));
  }
  return getParsedDate(row);
};

const updateHours = ({ hours }) => (hours > LUNCH_LIMIT ? hours - 9 : hours - 8);
const getRowDuration = (enterDate, exitDate) => {
  const start = parseEnterRow(enterDate);
  const interval = intervalToDuration({
    start,
    end: getParsedDate(exitDate),
  });
  const date = format(start, 'dd/MM/yyyy');
  return { ...interval, date };
};

const subtractWorkHours = workHours => {
  return map(item => ({ ...item, ...{ hours: updateHours(item) } }), workHours);
};

const getHourBalance = (enterRows, exitRows) => subtractWorkHours(zipWith(getRowDuration, enterRows, exitRows));

module.exports = { getHourBalance };
