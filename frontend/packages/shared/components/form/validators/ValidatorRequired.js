import ValidatorBase from './ValidatorBase';

export default class ValidatorRequired extends ValidatorBase {
  constructor(message = '${label} is required.') {
    super({ message });
  }

  validate(value /* , element */) {
    return !value ? this.options.message : true;
  }
}
