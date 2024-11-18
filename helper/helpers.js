export function data_get(obj, path = null, defaultValue = null) {
  if (path === null) {
    return obj;
  }
  if (!obj || (typeof obj !== 'object' && !Array.isArray(obj))) {
    return defaultValue;
  }

  const keys = Array.isArray(path) ? path : path.split('.');

  let result = obj;

  for (const key of keys) {
    if (result && (typeof result === 'object' || Array.isArray(result))) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        result = result[key];
      } else {
        return defaultValue;
      }
    } else {
      return defaultValue;
    }
  }

  return result !== undefined ? result : defaultValue;
}

/**
 * Formats a given date based on the specified format string.
 *
 * Supported format tokens:
 * - `d`: Day of the month without leading zeros (1-31)
 * - `dd`: Day of the month with leading zeros (01-31)
 * - `M`: Month without leading zeros (1-12)
 * - `MM`: Month with leading zeros (01-12)
 * - `MMM`: Short month name (Jan, Feb, etc.)
 * - `MMMM`: Full month name (January, February, etc.)
 * - `yy`: Last two digits of the year (e.g., 24)
 * - `yyyy`: Full year (e.g., 2024)
 * - `H`: Hours in 24-hour format without leading zero (0-23)
 * - `HH`: Hours in 24-hour format with leading zero (00-23)
 * - `h`: Hours in 12-hour format without leading zero (1-12)
 * - `hh`: Hours in 12-hour format with leading zero (01-12)
 * - `m`: Minutes without leading zero (0-59)
 * - `mm`: Minutes with leading zero (00-59)
 * - `s`: Seconds without leading zero (0-59)
 * - `ss`: Seconds with leading zero (00-59)
 * - `a`: AM/PM notation
 * - `EEE`: Short weekday name (Sun, Mon, etc.)
 * - `EEEE`: Full weekday name (Sunday, Monday, etc.)
 *
 * @param {string|Date} dateInput - A valid date string or Date object.
 * @param {string} format - The format string containing tokens for formatting.
 * @returns {string} The formatted date string based on the given format.
 *
 * @example
 * // Example 1: Using a date string
 * const stockDetails = { ep_timestamp: '2024-09-02T14:35:22Z' };
 * const formattedDate = formatDate(stockDetails.ep_timestamp, 'EEEE, MMMM dd, yyyy HH:mm:ss a');
 * console.log(formattedDate); // Output: "Monday, September 02, 2024 14:35:22 PM"
 *
 * @example
 * // Example 2: Using a Date object
 * const now = new Date();
 * const formattedNow = formatDate(now, 'dd.MM.yy HH:mm');
 * console.log(formattedNow); // Output: "02.09.24 14:35" (depending on current date and time)
 */
export function formatDate(dateInput, format) {
  const date = new Date(dateInput);

  // Precompute date components once
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const weekday = date.getDay();

  // Compute 12-hour format and AM/PM
  const hour12 = hours % 12 || 12;
  const ampm = hours < 12 ? 'AM' : 'PM';

  // Pad helper for two-digit numbers
  const pad = (num) => (num < 10 ? '0' + num : num);

  // Arrays for month and weekday names
  const shortMonthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const fullMonthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const shortWeekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const fullWeekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  // Token map with precomputed values
  const tokenMap = {
    d: day,
    dd: pad(day),
    M: month,
    MM: pad(month),
    MMM: shortMonthNames[month - 1],
    MMMM: fullMonthNames[month - 1],
    yy: String(year).slice(-2),
    yyyy: year,
    H: hours,
    HH: pad(hours),
    h: hour12,
    hh: pad(hour12),
    m: minutes,
    mm: pad(minutes),
    s: seconds,
    ss: pad(seconds),
    a: ampm,
    EEE: shortWeekdays[weekday],
    EEEE: fullWeekdays[weekday],
  };

  // Replace tokens using the precomputed token map
  return format.replace(
    /d{1,2}|M{1,4}|yy(?:yy)?|H{1,2}|h{1,2}|m{1,2}|s{1,2}|a|E{3,4}/g,
    (match) => tokenMap[match],
  );
}
