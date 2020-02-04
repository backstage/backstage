import ValidatedFormModel from './ValidatedFormModel';

import ValidatorRegex from './validators/ValidatorRegex';
import ValidatorStringRange from './validators/ValidatorStringRange';
import { ValidatorBase, ValidatorRequired } from './validators';

describe('ValidatedFormModel', () => {
  it('instantiates without error', () => {
    expect(() => new ValidatedFormModel()).not.toThrow();
  });

  it('element without id throws error', () => {
    expect(() => {
      new ValidatedFormModel().registerElement({});
    }).toThrowError("Expected 'id' to be defined");
  });

  it('element with id and no validators works', () => {
    expect(() => {
      new ValidatedFormModel().registerElement({ id: 'name' });
    }).not.toThrow();
  });

  it('element with id and validators works', () => {
    expect(() => {
      new ValidatedFormModel().registerElement({ id: 'name', validators: ['required'] });
    }).not.toThrow();
  });

  it('element with string validator (not array) works', () => {
    expect(() => {
      new ValidatedFormModel().registerElement({ id: 'name', validators: 'required' });
    }).not.toThrow();
  });

  it('set default valid to true', () => {
    const validatedFormModel = new ValidatedFormModel({
      defaultValid: true,
    });
    expect(validatedFormModel.valid).toBeTruthy();
  });

  it('set default valid to false', () => {
    const validatedFormModel = new ValidatedFormModel({
      defaultValid: false,
    });
    expect(validatedFormModel.valid).toBeFalsy();
  });

  it('register element twice with same id', () => {
    const validatedFormModel = new ValidatedFormModel();
    expect(() => {
      validatedFormModel.registerElement({ id: 'name' });
      validatedFormModel.registerElement({ id: 'name' });
    }).toThrowError('Trying to register an element twice with ValidatedFormModel: name');
  });

  it('resolve custom validator', () => {
    class CustomValidator extends ValidatorBase {}
    const validatedFormModel = new ValidatedFormModel();
    const customValidator = new CustomValidator();
    expect(validatedFormModel.resolveValidator(customValidator)).toBe(customValidator);
  });

  it('resolve validator object with valid type', () => {
    const validatedFormModel = new ValidatedFormModel();
    const validator = { type: 'required' };
    expect(validatedFormModel.resolveValidator(validator)).toBeInstanceOf(ValidatorRequired);
  });

  it('resolve validator object with invalid type', () => {
    const validatedFormModel = new ValidatedFormModel();
    const validator = { type: 'regex' };
    expect(() => {
      validatedFormModel.resolveValidator(validator);
    }).toThrow("Could not find a validator for 'regex'");
  });

  it('resolve validator type function', () => {
    const validatedFormModel = new ValidatedFormModel();
    const validatorFunction = () => {};
    const validator = validatedFormModel.resolveValidator(validatorFunction);
    expect(validator.validate).toBe(validatorFunction);
  });

  it('has a working clear() method', () => {
    const validatedFormModel = new ValidatedFormModel();
    const element = { id: 'name' };

    validatedFormModel.registerElement(element, 1, false);
    validatedFormModel.userTouchElement(element);
    validatedFormModel.setValueFor(element, 2);
    validatedFormModel.clear();

    expect(validatedFormModel.getValueFor(element)).toEqual(1);
    expect(validatedFormModel.isTouched(element)).toBe(false);
  });

  describe('validate()', () => {
    describe('required', () => {
      const validatedFormModel = new ValidatedFormModel();

      const element = {
        id: 'name',
        label: 'Name',
        validators: 'required',
        value: '',
      };

      validatedFormModel.registerElement(element);

      it('when set a blank value on a required form element and call validate it fails', async () => {
        const result = await validatedFormModel.validate({ onlyTouched: false });
        expect(result).toEqual({ name: 'Name is required.' });
      });

      it('when set a value on a required form element and call validate it succeeds', async () => {
        validatedFormModel.setValueFor(element, 'test');
        const result = await validatedFormModel.validate({ onlyTouched: false });
        expect(result).toEqual({});
      });
    });

    describe('ValidatorRegex', () => {
      const errorMessage =
        'Must be 6 to 30 lowercase letters, digits, or hyphens. It must start with a letter. Trailing hyphens are prohibited.';
      const element = {
        id: 'name',
        validators: [new ValidatorRegex(/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/, errorMessage)],
        value: '',
      };

      it('fails when value on a form element does not match regex', async () => {
        const valuesExpectedToFail = [
          '1test',
          'test',
          'longstringmorethanthirtycharacters',
          'newproject-',
          'Newproject',
        ];

        await promiseUtilFailure(element, valuesExpectedToFail, errorMessage);
      });

      it('succeeds when value on a form element matches regex', async () => {
        const valuesExpectedToSucceed = ['newproject', 'new1project', 'new-project'];

        await promiseUtilSuccess(element, valuesExpectedToSucceed);
      });
    });

    describe('ValidatorStringRange', () => {
      const min = 6;
      const max = 20;

      const element = {
        id: 'name',
        validators: [new ValidatorStringRange(min, max)],
        value: '',
      };

      it('succeeds for empty values', async () => {
        const valuesExpectedToSuccess = ['', undefined, null];
        await promiseUtilSuccess(element, valuesExpectedToSuccess);
      });

      it('fails when value on a form element is defined, but less than min', async () => {
        const valuesExpectedToFail = ['a', 'test'];
        await promiseUtilFailure(element, valuesExpectedToFail, `Input must be at least ${min} characters`);
      });

      it('fails when value on a form element is more than max', async () => {
        const valuesExpectedToFail = ['123456789012345678901', '123456789012345678901asdf'];
        await promiseUtilFailure(element, valuesExpectedToFail, `Input must be at most ${max} characters`);
      });

      it('succeeds when value on a form element is between min and max', async () => {
        const valuesExpectedToSucceed = ['newproject', '12345678901234567890'];
        await promiseUtilSuccess(element, valuesExpectedToSucceed);
      });
    });

    describe('Multiple validators', () => {
      const validatedFormModel = new ValidatedFormModel();
      const regexValidator = {
        regex: /^[a-z][a-z0-9-]{4,28}[a-z0-9]$/,
        message:
          'Must be 6 to 30 lowercase letters, digits, or hyphens. It must start with a letter. Trailing hyphens are prohibited.',
      };
      const element = {
        id: 'name',
        label: 'Name',
        validators: ['required', new ValidatorRegex(regexValidator.regex, regexValidator.message)],
        value: '',
      };

      validatedFormModel.registerElement(element);

      it('fails at the first validator(required)', async () => {
        validatedFormModel.setValueFor('name', '');
        const result = await validatedFormModel.validate({ onlyTouched: false });
        expect(validatedFormModel.valid).toBeFalsy();
        expect(result).toEqual({ name: 'Name is required.' });
      });

      it('fails at the second validator(regex)', async () => {
        validatedFormModel.setValueFor('name', 'hello');
        const result = await validatedFormModel.validate({ onlyTouched: false });
        expect(validatedFormModel.valid).toBeFalsy();
        expect(result).toEqual({
          name:
            'Must be 6 to 30 lowercase letters, digits, or hyphens. It must start with a letter. Trailing hyphens are prohibited.',
        });
      });

      it('succeed when value satisfies all validators', async () => {
        validatedFormModel.setValueFor('name', 'helloworld');
        await validatedFormModel.validate({ onlyTouched: false });
        expect(validatedFormModel.valid).toBeTruthy();
      });
    });
  });

  describe('form validity on user interaction', () => {
    const nameElement = {
      id: 'name',
      label: 'Name',
      validators: 'required',
      value: '',
    };

    const descriptionElement = {
      id: 'description',
      label: 'Description',
      value: '',
    };

    const ownerElement = {
      id: 'owner',
      label: 'Owner',
      validators: ['required'],
      value: '',
    };

    const validatedFormModel = new ValidatedFormModel();
    validatedFormModel.registerElement(nameElement);
    validatedFormModel.registerElement(descriptionElement);
    validatedFormModel.registerElement(ownerElement);

    it('should set form model to invalid when all elements to be validated are not valid', async () => {
      validatedFormModel.userChangeElementValue(nameElement, 'test');

      await validatedFormModel.validate({});
      expect(validatedFormModel.valid).toBeFalsy();
    });

    it('should set form model to valid when all elements to be validated are valid', async () => {
      validatedFormModel.userChangeElementValue(ownerElement, 'testOwner');

      await validatedFormModel.validate({});
      expect(validatedFormModel.valid).toBeTruthy();
    });
  });
});

const promiseUtilSuccess = (element, testcases) => {
  return new Promise(resolve => {
    const successTestCasePromises = [];
    testcases.forEach(testcase => {
      successTestCasePromises.push(
        new Promise(resolve => {
          const validatedFormModel = new ValidatedFormModel();
          validatedFormModel.registerElement(element, testcase);
          validatedFormModel.validate({ onlyTouched: false }).then(error => {
            expect(error).toEqual({});
            resolve(true);
          });
        }),
      );
    });

    Promise.all(successTestCasePromises).then(() => {
      resolve(true);
    });
  });
};

const promiseUtilFailure = (element, testcases, errorMessage) => {
  return new Promise(resolve => {
    const failureTestCasePromises = [];

    testcases.forEach(testcase => {
      failureTestCasePromises.push(
        new Promise(resolve => {
          const validatedFormModel = new ValidatedFormModel();
          validatedFormModel.registerElement(element, testcase);

          validatedFormModel.validate({ onlyTouched: false }).then(errors => {
            expect(errors[element.id]).toEqual(errorMessage);
            expect(errors).not.toEqual({});
            resolve(true);
          });
        }),
      );
    });

    Promise.all(failureTestCasePromises).then(() => {
      resolve(true);
    });
  });
};
