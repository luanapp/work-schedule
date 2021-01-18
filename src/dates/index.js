const { parse } = require('date-fns');
const { __, compose } = require('ramda');

const preFormatDate = rawStr => String(rawStr).replace('at ', '');
const parseDate = date => parse(date, 'MMMM d, yyyy hh:mmaa', new Date());
const getParsedDate = compose(parseDate, preFormatDate);

module.exports = { getParsedDate };
