const { google } = require('googleapis');
const { loadAuth } = require('./google-auth');

/**
 *
 * @param {String} spreadsheetId
 * @param {function(Array)} callback
 */
const getSheetRows = async (spreadsheetId, range) => {
  return new Promise((resolve, reject) => {
    try {
      loadAuth(async auth => {
        const sheets = google.sheets({ version: 'v4', auth });
        sheets.spreadsheets.values.get(
          {
            spreadsheetId,
            range,
          },
          async (err, res) => {
            resolve(getWorkSheetValues(err, res));
          }
        );
      });
    } catch (err) {
      reject(error);
    }
  });
};

const getWorkSheetValues = (err, res) => {
  if (err) {
    console.error('The API returned an error: ' + err);
    return [];
  }

  const rows = res.data.values;
  if (rows && rows.length) {
    return rows;
  }

  console.log('No data found.');
  return [];
};

/**
 * Appends the given values in the spreadsheet
 *
 * @param {String} spreadsheetId
 * @param {Array} values values to be appended to the spreadsheet
 */
const writeSheetRows = ({ spreadsheetId, values, initialIndex }) => {
  const range = `Sheet1!A${initialIndex}:D${initialIndex + values.length}`;

  return new Promise((resolve, reject) => {
    try {
      loadAuth(async auth => {
        const sheets = google.sheets({ version: 'v4', auth });
        resolve(
          sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            resource: {
              values,
            },
          })
        );
      });
    } catch (err) {
      reject(error);
    }
  });
};

module.exports = { getSheetRows, writeSheetRows };
