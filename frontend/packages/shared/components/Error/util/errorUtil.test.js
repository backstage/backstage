import { validateValue, errorReducer } from 'shared/components/Error/util/errorUtil';

describe('errorUtil', () => {
  describe('validateValue()', () => {
    it('throws proper error when required element is invalid', () => {
      expect(() => {
        validateValue(undefined, true, undefined, 'myVar');
      }).toThrowError("Expected 'myVar' to be defined");
    });

    it('throws no error when required element is valid (1/2)', () => {
      expect(() => {
        validateValue(0, true, undefined, 'myVar');
      }).not.toThrow();
    });

    it('throws no error when required element is valid (2/2)', () => {
      expect(() => {
        validateValue('', true, undefined, 'myVar');
      }).not.toThrow();
    });

    it('throws no error when non-required element is valid', () => {
      expect(() => {
        validateValue(undefined, false, undefined, 'myVar');
      }).not.toThrow();
    });

    it('throws error when required element is wrong string type', () => {
      expect(() => {
        validateValue(0, true, 'string', 'myVar');
      }).toThrowError("Expected 'myVar' to be of type 'string' but was 'number'");
    });

    it('throws error when required element is wrong Object type', () => {
      expect(() => {
        validateValue({}, true, 'string', 'myVar');
      }).toThrowError("Expected 'myVar' to be of type 'string' but was 'object'");
    });

    it('throws error when required element is wrong Array type', () => {
      expect(() => {
        validateValue([], true, 'string', 'myVar');
      }).toThrowError("Expected 'myVar' to be of type 'string' but was 'object'");
    });

    it('throws error when required element is wrong Class type', () => {
      class TestClass {}

      expect(() => {
        validateValue('', true, TestClass, 'myVar');
      }).toThrowError("Expected 'myVar' to be of type 'TestClass' but was 'string'");
    });

    it('throws no error when required element is correct Class type', () => {
      class TestClass {}

      expect(() => {
        validateValue(new TestClass(), true, TestClass, 'myVar');
      }).not.toThrow();
    });

    it('throws error when improper type is provided', () => {
      expect(() => {
        validateValue('', true, {}, 'myVar');
      }).toThrowError('Improper use of validateValue. Invalid types provided.');
    });

    it('works with a custom requiredMessage', () => {
      expect(() => {
        validateValue(undefined, true, 'string', 'myVar', {
          requiredMessage: '${name} is required!!!',
        });
      }).toThrowError('myVar is required!!!');
    });

    it('works with a custom wrongTypeMessage', () => {
      expect(() => {
        validateValue(0, true, 'string', 'myVar', {
          wrongTypeMessage: '${name} should be a string. It was a ${actualType} instead.',
        });
      }).toThrowError('myVar should be a string. It was a number instead.');
    });
  });

  describe('errorReducer()', () => {
    it('returns undefined if no error provided', () => {
      expect(errorReducer(undefined)).toBe(undefined);
    });

    it('throws an error if errorMappings is invalid type', () => {
      expect(() => {
        errorReducer('some men just want to watch the tests burn');
      }).toThrow();

      expect(() => {
        errorReducer('some men just want to watch the tests burn', 'should not be a string');
      }).toThrow();

      expect(() => {
        errorReducer('some men just want to watch the tests burn', 100);
      }).toThrow();

      expect(() => {
        errorReducer('some men just want to watch the tests burn', {});
      }).toThrow();
    });

    it('works with a string mapping and default message', () => {
      expect(
        errorReducer('some ERROR text', [
          {
            errorContains: 'ERROR',
          },
        ]),
      ).toEqual({
        message: 'An error occurred: some ERROR text',
        errorMapping: {
          errorContains: 'ERROR',
        },
      });
    });

    it('works with a regex mapping and default message', () => {
      expect(
        errorReducer('some ERROR text', [
          {
            errorMatchesRegex: /ERROR/g,
          },
        ]),
      ).toEqual({
        message: 'An error occurred: some ERROR text',
        errorMapping: {
          errorMatchesRegex: /ERROR/g,
        },
      });
    });

    it('works with a function mapping and default message', () => {
      const mapFunction = () => true;

      expect(
        errorReducer('some ERROR text', [
          {
            errorMatchesFunction: mapFunction,
          },
        ]),
      ).toEqual({
        message: 'An error occurred: some ERROR text',
        errorMapping: {
          errorMatchesFunction: mapFunction,
        },
      });
    });

    it('works with a string mapping and custom message', () => {
      expect(
        errorReducer('some ERROR text', [
          {
            errorContains: 'ERROR',
            message: 'royal with cheese: ${errorString}',
          },
        ]),
      ).toEqual({
        message: 'royal with cheese: some ERROR text',
        errorMapping: {
          errorContains: 'ERROR',
          message: 'royal with cheese: ${errorString}',
        },
      });
    });

    it('works with a regex mapping and custom message', () => {
      expect(
        errorReducer('some ERROR text', [
          {
            errorMatchesRegex: /ERROR/g,
            message: 'royal with cheese: ${errorString}',
          },
        ]),
      ).toEqual({
        message: 'royal with cheese: some ERROR text',
        errorMapping: {
          errorMatchesRegex: /ERROR/g,
          message: 'royal with cheese: ${errorString}',
        },
      });
    });

    it('works with a regex mapping and custom message and context', () => {
      expect(
        errorReducer(
          'some ERROR text',
          [
            {
              errorMatchesRegex: /ERROR/g,
              message: 'royal with cheese: ${someVariableToPassAsContext}',
            },
          ],
          {
            someVariableToPassAsContext: true,
          },
        ),
      ).toEqual({
        message: 'royal with cheese: true',
        errorMapping: {
          errorMatchesRegex: /ERROR/g,
          message: 'royal with cheese: ${someVariableToPassAsContext}',
        },
      });
    });

    it('works with a function mapping and custom message', () => {
      const mapFunction = () => true;

      expect(
        errorReducer('some ERROR text', [
          {
            errorMatchesFunction: mapFunction,
            message: 'royal with cheese: ${errorString}',
          },
        ]),
      ).toEqual({
        message: 'royal with cheese: some ERROR text',
        errorMapping: {
          errorMatchesFunction: mapFunction,
          message: 'royal with cheese: ${errorString}',
        },
      });
    });

    it('works with a string mapping and custom message function', () => {
      const messageFunction = () => {
        return 'SOMETHING IS TERRIBLY WRONG';
      };

      expect(
        errorReducer('some ERROR text', [
          {
            errorContains: 'ERROR',
            message: messageFunction,
          },
        ]),
      ).toEqual({
        message: 'SOMETHING IS TERRIBLY WRONG',
        errorMapping: {
          errorContains: 'ERROR',
          message: messageFunction,
        },
      });
    });

    it('works with a regex mapping and custom message function', () => {
      const messageFunction = () => {
        return {
          message: 'SOMETHING IS TERRIBLY WRONG',
          showThisInAPopupPlease: true,
        };
      };

      expect(
        errorReducer('some ERROR text', [
          {
            errorMatchesRegex: /ERROR/g,
            message: messageFunction,
          },
        ]),
      ).toEqual({
        message: 'SOMETHING IS TERRIBLY WRONG',
        showThisInAPopupPlease: true,
        errorMapping: {
          errorMatchesRegex: /ERROR/g,
          message: messageFunction,
        },
      });
    });

    it('works with a function mapping and custom message function', () => {
      const mapFunction = () => true;
      const messageFunction = () => {
        return {
          message: 'SOMETHING IS TERRIBLY WRONG',
          showThisInAPopupPlease: true,
        };
      };

      expect(
        errorReducer('some ERROR text', [
          {
            errorMatchesFunction: mapFunction,
            message: messageFunction,
          },
        ]),
      ).toEqual({
        message: 'SOMETHING IS TERRIBLY WRONG',
        showThisInAPopupPlease: true,
        errorMapping: {
          errorMatchesFunction: mapFunction,
          message: messageFunction,
        },
      });
    });
  });
});
