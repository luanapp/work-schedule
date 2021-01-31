const { values, compose, props, map } = require('ramda');
const { getSheetRows, writeSheetRows } = require('./worksheet/google-sheets');
const { ENTRANCE_SHEET_ID, EXIT_SHEET_ID, BALANCE_SHEET_ID } = require('./config');
const { getHourBalance } = require('./hour-balance');

const filterProperties = map(compose(values, props(['date', 'hours', 'minutes'])));

const makeWorkSchedule = async event => {
  const processedRows = await getSheetRows(BALANCE_SHEET_ID, 'Sheet1!A1:A');
  const nextRow = !!processedRows ? processedRows.length + 1 : 0;

  const enterRows = await getSheetRows(ENTRANCE_SHEET_ID, `Sheet1!A${nextRow}:C`);
  const exitRows = await getSheetRows(EXIT_SHEET_ID, `Sheet1!A${nextRow}:A`);
  const hourBalance = getHourBalance(enterRows, exitRows);

  console.log(hourBalance);

  await writeSheetRows({
    spreadsheetId: BALANCE_SHEET_ID,
    values: filterProperties(hourBalance),
    initialIndex: nextRow,
  });

  return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports = { makeWorkSchedule };
