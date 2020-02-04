import ValidatorBase from './ValidatorBase';

import { validateValue } from 'shared/components/Error/util/errorUtil';

export default class ValidatorStringRange extends ValidatorBase {
  constructor(
    min = 0,
    max = Number.MAX_SAFE_INTEGER,
    minMessage = 'Input must be at least ${min} characters',
    maxMessage = 'Input must be at most ${max} characters',
  ) {
    super({
      min,
      max,
      minMessage,
      maxMessage,
    });
  }

  validate(value) {
    value = value || '';
    validateValue(value, false, 'string', 'value provided to validate()');

    // Empty allowed; required should be enforced by ValidatorRequired instead
    if (!value) return true;

    if (value.length > this.options.max) {
      return this.options.maxMessage;
    } else if (value.length < this.options.min) {
      return this.options.minMessage;
    }

    return true;
  }
}
