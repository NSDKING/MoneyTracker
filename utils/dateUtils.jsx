// dateUtils.js

/**
 * Formats a date string into a more readable format, e.g., "Jul 1, 2024".
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string.
 */
export function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Converts a timestamp to a date string in the format "YYYY-MM-DD".
 * @param {Date} timestamp - The timestamp to convert.
 * @returns {string} The formatted date string in "YYYY-MM-DD" format.
 */
export function convertTimestampToDate(timestamp) {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
}

/**
 * Returns the name of the day of the week for a given date string.
 * @param {string} dateInput - The date string to get the day of the week for.
 * @returns {string} The name of the day of the week.
 */
export function getDayOfWeek(dateInput) {
    const date = new Date(dateInput);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
}
