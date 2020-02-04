import EventDispatcher from './EventDispatcher';
import { validateValue } from 'shared/components/Error/util/errorUtil';
import { ValidatorBase, ValidatorRequired } from 'shared/components/form/validators';

import debounce from 'lodash.debounce';

/**
 * The ValidatedFormModel is a FE framework agnostic model designed to take an arbitrary set of
 * form elements that fulfill an expected interface and automatically validate them whenever either
 * the user changes a value in one of the elements or the model is programmatically instructed to
 * perform validation updates.
 *
 * Features it provides:
 *
 * 1) Validation via the ValidatorBase abstract class
 * 2) Keeps track of elements the user has "touched" to display errors on only those elements
 * 3) Keeps an overarching 'valid' property always refreshed so that you can disable or hide your
 *    submit button until everything is valid.
 * 4) Debounces validation and all validation is assumed to be asynchronous to help with complex
 *    validation that might require a server call.
 * 5) If you provide a localStorageId to your form, all form values can be persisted and read back.
 */
export default class ValidatedFormModel extends EventDispatcher {
  //-----------------------------------
  // Events
  //-----------------------------------
  static VALID_CHANGED = 'validChanged';
  static VALUE_CHANGED = 'valueChanged';
  static USER_VALUE_CHANGED = 'userValueChanged';
  static ERRORS_CHANGED = 'errorsChanged';

  //-----------------------------------
  // Statics
  //-----------------------------------
  static VALIDATORS = {
    required: ValidatorRequired,
  };

  //-----------------------------------
  // Properties
  //-----------------------------------
  elements = [];
  elementsById = {};
  touchedElementsId = [];
  touchedElementsById = {};
  valuesByElementId = {};
  defaultValuesByElementId = {};
  localStorageValuesByElementId = {};
  validatorsByElementId = {};
  validateDebounce = undefined;
  errorsByElementId = {};
  elementsWithValidators = [];

  dirtyElementIds = [];

  get valid() {
    return this._valid;
  }

  set valid(value) {
    const oldValue = this.valid;
    this._valid = value;
    if (oldValue !== value) {
      this.dispatchEvent(ValidatedFormModel.VALID_CHANGED);
    }
  }

  get valuesLoadedFromLocalStorage() {
    return Object.keys(this.localStorageValuesByElementId).length > 0;
  }

  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(options = {}) {
    super();

    this.options = options;
    this.options.debounceMillis = options.debounceMillis || 500;
    this._valid = options.defaultValid !== undefined ? options.defaultValid : false;

    this.validateDebounce = debounce((onlyTouched = true, hideErrorMessages = false) => {
      this.validate({ onlyTouched, hideErrorMessages });
    }, this.options.debounceMillis);
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  initialize(validatedForm, validatorContext, localStorageId) {
    this.validatedForm = validatedForm;
    this.validatorContext = validatorContext;
    this.localStorageId = localStorageId;
    this.loadValuesFromLocalStorage();
  }

  setValuesToLocalStorage() {
    if (this.localStorageId) {
      localStorage.setItem(
        this.localStorageId,
        JSON.stringify({
          valuesByElementId: this.valuesByElementId,
          touchedElementsById: this.touchedElementsById,
        }),
      );
    }
  }

  loadValuesFromLocalStorage() {
    if (this.localStorageId) {
      try {
        const localStorageSavedValues = JSON.parse(localStorage.getItem(this.localStorageId)) || {};

        this.localStorageValuesByElementId = localStorageSavedValues.valuesByElementId || {};

        Object.keys(localStorageSavedValues.touchedElementsById).forEach(key => {
          this.touchedElementsById[key] = true;
          this.touchedElementsId.push(key);
        });
      } catch (e) {
        this.localStorageValuesByElementId = {};
      }
    }
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  /**
   * Clears all the form values and resets its valid state to options.defaultValid. Also wipes the
   * local storage saved values.
   */
  clear() {
    this.touchedElementsById = {};
    this.touchedElementsId = [];

    this.elements.forEach(element => {
      this.setValueFor(element, this.getDefaultValueFor(element));
    });

    let oldErrorsByElementId = this.errorsByElementId;
    this.errorsByElementId = {};

    if (JSON.stringify(oldErrorsByElementId) !== JSON.stringify(this.errorsByElementId)) {
      this.dispatchEvent(ValidatedFormModel.ERRORS_CHANGED);
    }

    this.localStorageValuesByElementId = {};

    this.valid = this.options.defaultValid !== undefined ? this.options.defaultValid : false;

    this.setValuesToLocalStorage();

    this.validateDebounce(false, true);
  }

  isTouched(elementOrId) {
    if (typeof elementOrId === 'string') {
      return this.touchedElementsId.indexOf(elementOrId) !== -1;
    }

    return this.touchedElementsId.indexOf(elementOrId.id) !== -1;
  }

  registerElement(element, defaultValue, forceValidate = true) {
    validateValue(element.id, true, undefined, 'id');

    if (this.elementsById[element.id]) {
      throw new Error(`Trying to register an element twice with ValidatedFormModel: ${element.id}`);
    }

    this.elementsById[element.id] = element;
    this.validatorsByElementId[element.id] = element.validators;
    this.elements.push(element);
    this.dirtyElementIds.push(element.id);

    if (element.validators && element.validators.length) {
      this.elementsWithValidators.push(element);
    }

    // Our recorded default value is NOT the one in local storage, it is the value we want to
    // reset to if someone calls clear()
    this.defaultValuesByElementId[element.id] = defaultValue;

    try {
      if (this.localStorageValuesByElementId[element.id] !== undefined) {
        defaultValue = this.localStorageValuesByElementId[element.id];
      }
    } catch (error) {
      console.error(
        `Form had an issue loading values from local storage: ${error.toString()}. Skipping element ${element.id}`,
      );
    }

    this.valuesByElementId[element.id] = defaultValue;

    if (this.elementsById[element.id].valueChangeHandler) {
      this.elementsById[element.id].valueChangeHandler();
    }

    if (forceValidate) {
      /**
       * We run on all elements, including non-touched AND we also hide the errors. This is because
       * when the form is first created we need to determine if it is valid or not each time a new
       * element is added.
       *
       * NOTE: if we are loading the form values from local storage, we need to make sure to show
       * errors to the user right away since they were halfway through filling out the form the
       * last time they left.
       */
      const hideErrorsFromUserOnMount = !this.valuesLoadedFromLocalStorage;

      this.validateDebounce(false, hideErrorsFromUserOnMount);
    }
  }

  unregisterElement(element) {
    if (this.elementsById[element.id]) {
      this.elements.splice(this.elements.indexOf(element), 1);
      delete this.elementsById[element.id];
    }
  }

  resolveValidator(validator) {
    if (validator instanceof ValidatorBase) {
      return validator;
    }

    switch (typeof validator) {
      case 'object': {
        const ValidatorType = ValidatedFormModel.VALIDATORS[validator.type];

        if (!ValidatorType) {
          throw new Error(`Could not find a validator for '${validator.type}'`);
        }

        return new ValidatorType(validator);
      }
      case 'function':
        return {
          validate: validator,
        };
      case 'string':
        return ValidatedFormModel.VALIDATORS[validator] && new ValidatedFormModel.VALIDATORS[validator]();
      default:
        throw new Error(
          `The validator provided must be a string, function, or subclass of ValidatorBase, but was ${typeof validator}`,
        );
    }
  }

  getErrorsFor(elementOrId) {
    return this.errorsByElementId[typeof elementOrId === 'string' ? elementOrId : elementOrId.id];
  }

  getValueFor(elementOrId) {
    return (
      this.valuesByElementId[typeof elementOrId === 'string' ? elementOrId : elementOrId.id] ||
      elementOrId.defaultValue ||
      ''
    );
  }

  getDefaultValueFor(elementOrId) {
    return this.defaultValuesByElementId[typeof elementOrId === 'string' ? elementOrId : elementOrId.id];
  }

  setValueFor(elementOrId, value) {
    const elementId = typeof elementOrId === 'string' ? elementOrId : elementOrId.id;

    const oldValue = this.getValueFor(elementOrId);

    if (oldValue !== value) {
      this._setValueFor(elementId, value);

      this.dispatchEvent(ValidatedFormModel.VALUE_CHANGED, {
        elementId,
        value,
        oldValue,
      });

      if (this.elementsById[elementId].valueChangeHandler) {
        this.elementsById[elementId].valueChangeHandler();
      }
    }
  }

  /**
   * Validates value for all elements in the model. An element can have multiple validators.
   * Validators are evaluated one-by-one in order and an element is marked invalid when a validation
   * fails and we move on to the next element.
   *
   * @param hideErrorMessages - validate but dont show error messages
   */
  validate({ hideErrorMessages = false }) {
    const previousErrors = { ...this.errorsByElementId };

    this.elementPromises = [];

    this.dirtyElementIds.forEach(elementId => {
      const element = this.elementsById[elementId];

      if (!element) return;

      if (this.errorsByElementId) {
        delete this.errorsByElementId[element.id];
      }

      const v = this.validatorsByElementId[element.id];

      // skip iteration if no validators
      if (!v) return;

      const validators = v instanceof Array ? v : [v];

      if (validators.length) {
        // collect promises for all elements in the form
        this.elementPromises.push(
          new Promise(elementResult => {
            const value = this.valuesByElementId[element.id];

            // promise for each individual validator for an element
            const _validatorPromise = validatorIx => {
              return new Promise(validatorResult => {
                if (!validators[validatorIx]) {
                  throw new Error(`An undefined validator was supplied to ${typeof element} with id ${element.id}`);
                }

                const validator = this.resolveValidator(validators[validatorIx]);

                validator.parentValidatedFormModel = this;

                validator._validate(value, element).then(test => {
                  if (!test.valid) {
                    this.errorsByElementId[element.id] = test.message;

                    validatorResult(test.valid);

                    // fail fast and return when the first validation for an element fails
                    return;
                  } else {
                    delete this.errorsByElementId[element.id];
                  }

                  // if previous validation was successful then proceed to next validator
                  // else validation is  complete for the element and return
                  if (validatorIx < validators.length - 1) {
                    _validatorPromise(validatorIx + 1).then(response => {
                      validatorResult(response);
                    });
                  } else {
                    validatorResult(test.valid);
                  }
                });
              });
            };

            // start with the first validator
            _validatorPromise(0).then(response => {
              elementResult(response);
            });
          }),
        );
      }
    });

    this.dirtyElementIds = [];

    return Promise.all(this.elementPromises).then(() => {
      this.valid = Object.keys(this.errorsByElementId).length === 0;

      if (!hideErrorMessages && JSON.stringify(previousErrors) !== JSON.stringify(this.errorsByElementId)) {
        this.dispatchEvent(ValidatedFormModel.ERRORS_CHANGED);
      }

      return this.errorsByElementId;
    });
  }

  /**
   * Should only be called when a user touches the element.
   *
   * @param element
   * @param newValue
   */
  userChangeElementValue(element, newValue) {
    this.userTouchElement(element, false);

    const oldValue = this.getValueFor(element);

    this._setValueFor(element.id, newValue);

    this.dispatchEvent(ValidatedFormModel.USER_VALUE_CHANGED, {
      elementId: element.id,
      value: newValue,
      oldValue,
    });

    this.validateDebounce();
  }

  _setValueFor(elementId, value) {
    if (value === this.valuesByElementId[elementId]) {
      return;
    }

    this.valuesByElementId[elementId] = value;

    this.dirtyElementIds.push(elementId);

    this.setValuesToLocalStorage();
  }

  /**
   * Should only be called when a user touches the element.
   *
   * @param element
   * @param newValue
   */
  userTouchElement(element, forceValidate = true) {
    if (!this.touchedElementsById[element.id]) {
      this.touchedElementsId.push(element.id);
      this.touchedElementsById[element.id] = true;
    }

    if (this.dirtyElementIds.indexOf(element.id) === -1) {
      this.dirtyElementIds.push(element.id);
    }

    if (forceValidate) {
      this.validateDebounce();
    }
  }
}
