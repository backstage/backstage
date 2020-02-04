import ValidatorBase from './ValidatorBase';
import { validateValue } from 'shared/components/Error/util/errorUtil';

export default class ValidatorRegex extends ValidatorBase {
  constructor(regex, message = '${label}: entry does not match regex: ${regex}') {
    super({
      regex,
      message,
    });

    validateValue(regex, true, RegExp, 'regex');
  }

  validate(value /* , element */) {
    value = value || '';
    return this.options.regex.test(value) || this.options.message;
  }
}
