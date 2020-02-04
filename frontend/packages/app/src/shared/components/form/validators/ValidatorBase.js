import { replace } from 'prop-replace';
import { validateValue } from 'shared/components/Error/util/errorUtil';

/**
 * ValidatorBase is an abstract base class to be extended to run validation on a user input.
 */
export default class ValidatorBase {
  /**
   * Constructor is designed to have abstract options passed in. The options are shared across
   * every control using this validator instance. This is useful if you have site-wide rules for
   * a custom validator like an email, url, or id validator.
   *
   * @param options
   */
  constructor(options) {
    this.options = options;

    if (this.constructor.name === 'ValidatorBase') {
      throw new Error('ValidatorBase is an abstract class and should not be instantiated without extension.');
    }
  }

  set parentValidatedFormModel(value) {
    this._parentValidatedFormModel = value;
  }

  get parentValidatedFormModel() {
    return this._parentValidatedFormModel;
  }

  get context() {
    return this.parentValidatedFormModel.validatorContext;
  }

  /**
   * Every extension of ValidatorBase can return an error message.
   *
   * @param element
   * @returns {{label: (*|string)}}
   */
  getMessageReplacements(element) {
    return Object.assign(
      {},
      {
        label: element.label || (element.props && element.props.label) || 'Field',
      },
      this.options,
    );
  }

  /**
   * Given an error message returned from a ValidatorBase::validate(...) call, this ensures
   * that all '${var}' replacements are processed.
   *
   * @param message The error message to process.
   * @param element The element instance on which the error occurred.
   * @returns {String} The final processed error message.
   */
  processErrorMessage(message, element) {
    validateValue(element, true);

    message = replace(message, this.getMessageReplacements(element));

    return message;
  }

  /**
   * Internally, the ValidatedFormModel calls the _validate method first on a ValidatorBase.
   *
   * The ValidatorBase makes sure that the response of a validator is converted into a promise
   * and that any replacement values (e.g. when message is something like '${label} is required.'
   * are swapped with their replacements.
   *
   * @param result
   * @returns {*}
   */
  processErrorOrValid(result, element) {
    validateValue(element, true);

    if (result === true) {
      return {
        valid: true,
      };
    } else if (typeof result === 'string') {
      return {
        valid: false,
        message: this.processErrorMessage(result, element),
      };
    } else if (typeof result === 'object') {
      if (result.valid === true) {
        return result;
      } else {
        return {
          valid: false,
          message: this.processErrorMessage(result.message, element),
        };
      }
    } else {
      console.warn('Invalid processErrorOrValid parameters', result, element);
    }
  }

  /**
   * This is the method called by ValidatedFormModel when running a validator. It is responsible
   * for 'cleaning' a validation response, doing text replacements on an error message (e.g.
   * '${label} is required' for ValidatorRequired).
   *
   * @param value The value to be validated.
   * @param element The element the user entered the value into.
   * @returns {Promise} Must return a promise, as ValidatedFormModel expects it of all validators.
   * @private
   */
  _validate(value, element) {
    const validateReturn = this.validate(value, element);

    validateValue(element, true);

    return new Promise(response => {
      if (validateReturn instanceof Promise) {
        validateReturn.then(result => {
          result = this.processErrorOrValid(result, element);

          response(result);
        });
      } else {
        const result = this.processErrorOrValid(validateReturn, element);

        response(result);
      }
    });
  }

  /**
   * Abstract function that returns true by default. This is to be overridden by a subclass.
   *
   * Can return:
   *
   *     true: if value is valid.
   *     String: an error message if the value is invalid
   *     {valid: true}: if value is valid.
   *     {valid: false, message: String} if value is invalid.
   *     Promise: a Promise to resolve to one of the above when it is validated.
   *
   * @param value The input value (e.g. a string for text inputs) to be validated.
   * @param element The element that the user entered the value into (e.g. the TextField or RadioButton)
   * @returns {*} One of the possible return values above
   */
  validate(/* value, element */) {
    return true;
  }
}
