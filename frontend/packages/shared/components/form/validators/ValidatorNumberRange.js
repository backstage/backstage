import ValidatorBase from './ValidatorBase';

export default class ValidatorNumberRange extends ValidatorBase {
  constructor(
    min = 0,
    max = Number.MAX_SAFE_INTEGER,
    minMessage = 'Input must be at least ${min}',
    maxMessage = 'Input must be at most ${max}',
  ) {
    super({
      min,
      max,
      minMessage,
      maxMessage,
    });
  }

  validate(inpValue) {
    let value = inpValue;

    // Empty allowed; required should be enforced by ValidatorRequired instead
    if (!inpValue) return true;

    if (typeof value !== 'number') {
      value = Number(value);
      if (isNaN(value)) {
        return `Expected number but got '${inpValue}' (${typeof inpValue})`;
      }
    }

    if (value > this.options.max) {
      return this.options.maxMessage;
    } else if (value < this.options.min) {
      return this.options.minMessage;
    }

    return true;
  }
}
