const { getParsedDate } = require('.');

describe('When parsing a IFTTT date', () => {
  // Arrange
  const iftttDate = 'December 14, 2020 at 09:55AM';

  // Act
  const result = getParsedDate(iftttDate);

  // Assert
  it('should return a date object', () => {
    expect(result).toBeInstanceOf(Date);
  });

  it('should return a date with the expected date values', () => {
    expect(result.getDate()).toEqual(14);
    expect(result.getMonth()).toEqual(11); // it's zero-based
    expect(result.getFullYear()).toEqual(2020);
    expect(result.getHours()).toEqual(9);
    expect(result.getMinutes()).toEqual(55);
    expect(result.getSeconds()).toEqual(0);
    expect(result.getMilliseconds()).toEqual(0);
  });

  it('should return a date in UTC', () => {
    expect(result.getDate()).toEqual(result.getUTCDate());
  });
});
