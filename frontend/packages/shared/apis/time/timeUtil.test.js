import { isValidDateAndFormat, getTimeBasedGreeting } from './timeUtil';

it('validates time format', () => {
  const valid = isValidDateAndFormat('1970-01-01T00:00:00', 'YYYY-MM-DD[T]HH:mm:ss');
  const invalid = isValidDateAndFormat('1970/01/01T00:00:00', 'YYYY-MM-DD[T]HH:mm:ss');
  expect(valid).toBe(true);
  expect(invalid).toBe(false);
});

it('has greeting and language', () => {
  const greeting = getTimeBasedGreeting();
  expect(greeting).toHaveProperty('greeting');
  expect(greeting).toHaveProperty('language');
});

it('greets late at night', () => {
  jest.spyOn(global.Date, 'now').mockImplementationOnce(() => new Date('1970-01-01T23:00:00').valueOf());
  const greeting = getTimeBasedGreeting();
  expect(greeting.greeting).toBe('Get some rest');
});
