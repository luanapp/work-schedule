const { intervalToDuration, format, subMinutes, addHours, differenceInHours, isAfter } = require('date-fns');
const { zipWith } = require('ramda');
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

const getRowDuration = (enterDate, exitDate) => {
  const start = parseEnterRow(enterDate);
  const end = getParsedDate(exitDate);
  const hours = differenceInHours(end, start);
  const interval = intervalToDuration({
    start: addHours(start, hours > LUNCH_LIMIT ? 9 : 8),
    end,
  });
  const date = format(start, 'dd/MM/yyyy');
  return { ...interval, date, isNegative: isAfter(addHours(start, hours > LUNCH_LIMIT ? 9 : 8), end) };
};

const getHourBalance = (enterRows, exitRows) => zipWith(getRowDuration, enterRows, exitRows);

module.exports = { getHourBalance };
