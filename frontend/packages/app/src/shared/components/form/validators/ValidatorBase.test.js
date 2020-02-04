import ValidatorBase from './ValidatorBase';

describe('ValidatorBase', () => {
  it('instantiates with an error since ValidatorBase is an abstract class', () => {
    expect(() => new ValidatorBase()).toThrow();
  });

  describe('getMessageReplacements', () => {
    it('properly provides a placeholder label if the label does not exist', () => {
      class ValidatorExtension extends ValidatorBase {}

      let validator = new ValidatorExtension();

      let replacements = validator.getMessageReplacements({});

      expect(replacements.label).toBe('Field');
    });

    it('properly provides the element label if it exists', () => {
      class ValidatorExtension extends ValidatorBase {}

      let validator = new ValidatorExtension();

      let replacements = validator.getMessageReplacements({
        label: 'Some Label',
      });

      expect(replacements.label).toBe('Some Label');
    });

    it('properly provides the element label if it exists in the React props', () => {
      class ValidatorExtension extends ValidatorBase {}

      let validator = new ValidatorExtension();

      let replacements = validator.getMessageReplacements({
        props: {
          label: 'Some Label',
        },
      });

      expect(replacements.label).toBe('Some Label');
    });

    it('properly integrates ValivatorBase::options into the replacements', () => {
      class ValidatorExtension extends ValidatorBase {
        constructor(someValue) {
          super({
            someValue,
          });
        }
      }

      let validator = new ValidatorExtension("Gettin ' jiggy with it");
      let replacements = validator.getMessageReplacements({});

      expect(replacements.someValue).toBe("Gettin ' jiggy with it");
    });
  });

  describe('has a working _validate() method', () => {
    it('provides a _validate() method that calls validate()', done => {
      class ValidatorExtension extends ValidatorBase {}

      let validator = new ValidatorExtension();

      validator.validate = () => {
        done();
      };

      validator._validate('', {});
    });

    it('returns a Promise when validate() returns true', () => {
      class ValidatorExtension extends ValidatorBase {
        validate() {
          return true;
        }
      }

      let validator = new ValidatorExtension();
      let ret = validator._validate('', {});

      expect(ret instanceof Promise).toBe(true);
    });

    it('returns a Promise when validate() returns a String', () => {
      class ValidatorExtension extends ValidatorBase {
        validate() {
          return 'This is some error message';
        }
      }

      let validator = new ValidatorExtension();
      let ret = validator._validate('', {});

      expect(ret instanceof Promise).toBe(true);
    });

    it('returns a Promise when validate() returns an object', () => {
      class ValidatorExtension extends ValidatorBase {
        validate() {
          return {
            message: 'this is some message',
          };
        }
      }

      let validator = new ValidatorExtension();
      let ret = validator._validate('', {});

      expect(ret instanceof Promise).toBe(true);
    });

    it('returns a new Promise when validate() returns a Promise', () => {
      let internalPromise;

      class ValidatorExtension extends ValidatorBase {
        validate() {
          internalPromise = new Promise(resolve => resolve());
          return internalPromise;
        }
      }

      let validator = new ValidatorExtension();
      let ret = validator._validate('', {});

      expect(ret !== internalPromise).toBe(true);
    });

    it('returns a Promise that resolves to a valid object structure for validate() returning true', done => {
      class ValidatorExtension extends ValidatorBase {
        validate() {
          return true;
        }
      }

      let validator = new ValidatorExtension();
      validator._validate('', {}).then(result => {
        try {
          expect(result).toEqual({
            valid: true,
          });
        } catch (error) {
          done(`_validate Promise did not result to the right structure: ${error.toString()}`);
        }

        done();
      });
    });

    it('returns a Promise that resolves to a valid object structure for validate() returning String', done => {
      class ValidatorExtension extends ValidatorBase {
        validate() {
          return 'Some error';
        }
      }

      let validator = new ValidatorExtension();
      validator
        ._validate('', {
          label: 'Some Field',
        })
        .then(result => {
          try {
            expect(result).toEqual({
              valid: false,
              message: 'Some error',
            });
          } catch (error) {
            done(`_validate Promise did not result to the right structure: ${error.toString()}`);
          }

          done();
        });
    });

    it('returns a Promise that resolves to a valid object structure for validate() returning an Object with a message', done => {
      class ValidatorExtension extends ValidatorBase {
        validate() {
          return {
            valid: false,
            message: 'Some error',
          };
        }
      }

      let validator = new ValidatorExtension();
      validator
        ._validate('', {
          label: 'Some Field',
        })
        .then(result => {
          try {
            expect(result).toEqual({
              valid: false,
              message: 'Some error',
            });
          } catch (error) {
            done(`_validate Promise did not result to the right structure: ${error.toString()}`);
          }

          done();
        });
    });

    it('returns a Promise that resolves to a valid object structure for validate() returning an Object with a valid true', done => {
      class ValidatorExtension extends ValidatorBase {
        validate() {
          return {
            valid: true,
          };
        }
      }

      let validator = new ValidatorExtension();
      validator
        ._validate('', {
          label: 'Some Field',
        })
        .then(result => {
          try {
            expect(result).toEqual({
              valid: true,
            });
          } catch (error) {
            done(`_validate Promise did not result to the right structure: ${error.toString()}`);
          }

          done();
        });
    });

    it('returns a Promise that resolves to a valid object structure for validate() returning a Promise that results in true', done => {
      class ValidatorExtension extends ValidatorBase {
        validate() {
          return new Promise(resolve => resolve(true));
        }
      }

      let validator = new ValidatorExtension();
      validator
        ._validate('', {
          label: 'Some Field',
        })
        .then(result => {
          try {
            expect(result).toEqual({
              valid: true,
            });
          } catch (error) {
            done(`_validate Promise did not result to the right structure: ${error.toString()}`);
          }

          done();
        });
    });

    it('returns a Promise that resolves to a valid object structure for validate() returning a Promise that results in a message', done => {
      class ValidatorExtension extends ValidatorBase {
        validate() {
          return new Promise(resolve =>
            resolve({
              message: 'Some error',
            }),
          );
        }
      }

      let validator = new ValidatorExtension();
      validator
        ._validate('', {
          label: 'Some Field',
        })
        .then(result => {
          try {
            expect(result).toEqual({
              valid: false,
              message: 'Some error',
            });
          } catch (error) {
            done(`_validate Promise did not result to the right structure: ${error.toString()}`);
          }

          done();
        });
    });
  });
});
