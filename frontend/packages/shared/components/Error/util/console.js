export const consoleStack = [];

const _consoleLog = console.log;
const _consoleWarn = console.warn;
const _consoleError = console.error;

console.log = (...args) => {
  consoleStack.push({
    type: 'log',
    timestamp: new Date().getTime(),
    arguments: args,
    url: window.location.href,
  });

  _consoleLog.apply(console, args);
};

console.warn = (...args) => {
  consoleStack.push({
    timestamp: new Date().getTime(),
    arguments: args,
    url: window.location.href,
  });

  _consoleWarn.apply(console, args);
};

console.error = (...args) => {
  consoleStack.push({
    timestamp: new Date().getTime(),
    arguments: args,
    url: window.location.href,
  });

  _consoleError.apply(console, args);
};
