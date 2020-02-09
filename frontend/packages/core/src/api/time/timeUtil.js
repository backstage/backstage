import moment from 'moment';

/**
 * Validates that a date is a valid ISO string.
 *
 * @param date A date string
 * @returns {bool} Whether the date is valid or not.
 */
export function isValidDate(date) {
  return moment(date).isValid();
}

/**
 * Validates that a date is a valid ISO string and a specific format.
 *
 * @param date A date string
 * @param format A format string or an array of format strings to validate against.
 * @returns {bool} Whether the date is valid or not according to the format.
 */
export function isValidDateAndFormat(date, format) {
  return moment(date, format, true).isValid();
}

export function relativeTime(timestamp) {
  return moment(timestamp).fromNow();
}

// Select a large random integer at startup, to prevent the greetings to change every time the user
// navigates.
const greetingRandomSeed = Math.floor(Math.random() * 1000000);

export function getTimeBasedGreeting() {
  const random = array => array[greetingRandomSeed % array.length];

  const hour = new Date(Date.now()).getHours();
  if (hour >= 23) {
    return {
      language: 'Seriously',
      greeting: 'Get some rest',
    };
  }
  const timeOfDay = hour => {
    if (hour < 12) return 'goodMorning';
    if (hour < 17) return 'goodAfternoon';
    if (hour < 23) return 'goodEvening';
  };
  const greetings = require(`./locales/${timeOfDay(hour)}.locales.json`);
  const greetingsKey = random(Object.keys(greetings));
  return {
    language: greetingsKey,
    greeting: greetings[greetingsKey],
  };
}
