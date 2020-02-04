import { replace } from 'prop-replace';
import { safeStringify } from './JSON';

/**
 * Assert that an value is defined and/or a valid type and throw an error if it is invalid.
 *
 * Designed to run live, not during tests.
 *
 * Examples:
 *
 *     let myVar = undefined;
 *     validateValue(undefined, true); // Will throw error
 *
 *     let myVar = 0;
 *     validateValue(myVar, false, 'string') // Will throw error saying should be string
 *
 *     let myVar = new MyClass();
 *     validateValue(myVar, false, SomeOtherClass); // Will throw error saying wrong type
 *
 * @param value The value to test
 * @param required True if the value should be defined (e.g. not undefined and not null)
 * @param types A single or Array of types (e.g. MyClass, 'string', 'function')
 * @param name The debugging name of the argument (e.g. 'myArgumentName')
 * @param errorStringsObject Custom error strings to provide when the required or type check fails.
 *                           a Javascript Object with 'wrongType' and 'required' strings
 */
export function validateValue(value, required, types, name = '[no name provided]', errorStringsObject = {}) {
  errorStringsObject.wrongTypeMessage =
    errorStringsObject.wrongTypeMessage || "Expected '${name}' to be of type '${type}' but was '${actualType}'";
  errorStringsObject.requiredMessage = errorStringsObject.requiredMessage || "Expected '${name}' to be defined";

  if (required && (value === undefined || value === null)) {
    throw new Error(
      replace(errorStringsObject.requiredMessage, {
        name,
      }),
    );
  }

  if (types) {
    types = types instanceof Array ? types : [types];

    types.forEach(type => {
      if (typeof type === 'string') {
        if ((typeof value).toLowerCase() !== type.toLowerCase()) {
          throw new Error(
            replace(errorStringsObject.wrongTypeMessage, {
              type,
              name,
              actualType: typeof value,
            }),
          );
        }
      } else if (typeof type === 'function' && type.prototype && type.prototype.constructor) {
        if (!(value instanceof type)) {
          throw new Error(
            replace(errorStringsObject.wrongTypeMessage, {
              type: type.prototype.constructor.name,
              name,
              actualType: typeof value,
            }),
          );
        }
      } else {
        throw Error('Improper use of validateValue. Invalid types provided.');
      }
    });
  }
}

/**
 * Given an error string and an Array of errorMappings, this method checks the error against all
 * of the mappings and returns the message associated with a match, if it exists.
 *
 * The goal of this utility is to provide a way that every error (thrown or server-returned)
 * could pass through a single configurable array of test objects and the first match is given
 * the responsibility of returning a user-friendly way of displaying the error.
 *
 * Testing Types:
 *
 *   Basic example (error contains a string):
 *
 *     errorReducer('some error from the server', [{
 *       errorContains: 'some error',
 *       message: 'API V2 just had an error: ${errorString}'
 *     }]);
 *
 *   Regex matching (error matches a regular expression):
 *
 *     errorReducer('503: some error from the server', [{
 *       errorMatchesRegex: /5[0-9][0-9]/g,
 *       message: 'A critical server error occurred: ${errorString}'
 *     }]);
 *
 *   Custom match function:
 *
 *     errorReducer({status: 400, error: 'This is some complicated error object'}, [{
 *       errorMatchesFunction: (error, context) => error.status === 400,
 *       message: 'Some gosh-darned thing couldn\'t be found. Sad bananas.'
 *     }]);
 *
 * Messaging:
 *
 *   Custom messaging function:
 *
 *     errorReducer('ERROR: some error', [{
 *       errorContains: 'ERROR',
 *       message: error => error.replace('ERROR:', 'Whoops! Things fell apart:')
 *     }]);
 *
 * Default Error Message:
 *
 *   Custom messaging function:
 *
 *     errorReducer('ERROR: some error', [{errorContains: 'ERROR'}],
 *     undefined,
 *     'This error will be shown for all mappings that do not have an error message defined');
 *
 * Arbitrary context object (e.g. if you want your custom mappings to have access to some other data)
 *
 *     errorReducer('ERROR: some error', [{errorContains: 'ERROR'}],
 *     {
 *       ownerEmail: 'monty@python.com'
 *     },
 *     'Please contact ${ownerEmail}');
 *
 *     OR
 *
 *     errorReducer('ERROR: some error', [{
 *       errorContains: 'ERROR',
 *       message: (error, context) => `Please contact ${context.ownerEmail}`
 *     }],
 *     {
 *       ownerEmail: 'monty@python.com'
 *     });
 */
export function errorReducer(
  errorStringOrObject,
  errorMappings,
  context,
  defaultErrorMessage = 'An error occurred: ${errorString}',
) {
  if (!errorStringOrObject) {
    return undefined;
  }

  if (!(errorMappings instanceof Array)) {
    throw new Error('errorReducer(): errorMappings is expected to be an Array!');
  }

  let errorString = typeof errorStringOrObject === 'string' ? errorStringOrObject : safeStringify(errorStringOrObject);

  /**
   * Example errorMapping:
   *
   * {
   *   errorMatchesRegex: /getUserData/g, // OR
   *   errorContains: 'some text in the error',
   *   message: 'Some message'
   * }
   */
  const foundErrorMapping = errorMappings.find(errorMapping => {
    try {
      if (errorMapping.errorContains) {
        // String
        return errorString.indexOf(errorMapping.errorContains) !== -1;
      } else if (errorMapping.errorMatchesRegex) {
        // Regex
        return errorMapping.errorMatchesRegex.test(errorString);
      } else if (errorMapping.errorMatchesFunction) {
        // Function
        return errorMapping.errorMatchesFunction(errorStringOrObject, context);
      } else {
        // Warning if invalid errorMapping provided
        console.warn(
          'errorReducer(): error mapping is invalidly configured! Expected' +
            ' errorMatchesRegex, errorContains, or errorMatchesFunction',
          errorMapping,
        );
      }
    } catch (error) {
      console.error('errorReducer(): error with errorMapping:', errorMapping, error);
    }

    return undefined;
  });

  let messageString;

  if (!foundErrorMapping) {
    return undefined;
  } else if (typeof foundErrorMapping.message === 'string') {
    messageString = replace(
      foundErrorMapping.message,
      Object.assign(
        {
          errorString,
          error: errorStringOrObject,
        },
        context,
      ),
    );
  } else if (typeof foundErrorMapping.message === 'function') {
    const message = foundErrorMapping.message(errorStringOrObject, context, foundErrorMapping);

    return Object.assign(
      {
        errorMapping: foundErrorMapping,
      },
      typeof message === 'string'
        ? {
            message,
          }
        : message,
    );
  } else {
    messageString = replace(
      defaultErrorMessage,
      Object.assign(
        {
          errorString,
          error: errorStringOrObject,
        },
        context,
      ),
    );
  }

  return {
    message: messageString,
    errorMapping: foundErrorMapping,
  };
}
