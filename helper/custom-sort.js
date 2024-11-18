/**
 * Custom sort function to handle numbers represented as strings and special cases.
 * It assigns the lowest priority to null, undefined, or "--" values.
 * @param {object} rowA - First row to compare
 * @param {object} rowB - Second row to compare
 * @param {string} columnId - The column being sorted
 * @returns {number} - Sort order (-1, 0, or 1)
 */
const customSort = (rowA, rowB, columnId) => {
  // Helper function to parse values and assign low priority to invalid or missing data

  const parseValue = (value) => {
    if (
      value === null ||
      value === '--' ||
      value === undefined ||
      value === ''
    ) {
      return -Infinity; // Low priority for invalid data
    }

    const parsed = parseFloat(value);

    // Check if the parsed value is a valid number or NaN
    if (isNaN(parsed)) {
      return -Infinity; // Treat non-numeric values as low priority
    }
    return parsed; // Return the valid parsed number
  };
  // Extract the values from the rows for comparison
  const a = parseValue(rowA.original[columnId]);
  const b = parseValue(rowB.original[columnId]);
  // Perform the comparison and return the sort order
  return a > b ? 1 : a < b ? -1 : 0;
};

export default customSort;
