import ValidatorStringRange from './ValidatorStringRange';

describe('ValidatorStringRange', () => {
  it('instantiates without error', () => {
    expect(() => new ValidatorStringRange()).not.toThrow();
  });

  describe('has a working validate() method', () => {
    it('has sane defaults', () => {
      expect(new ValidatorStringRange().validate('', {})).toEqual(true);
    });

    it('returns the min length message when minimum length is not met', () => {
      expect(new ValidatorStringRange(5).validate('1234', {})).toEqual('Input must be at least ${min} characters');
    });

    it('returns the custom min length message when minimum length is not met', () => {
      expect(new ValidatorStringRange(5, undefined, 'Min length not met!').validate('1234', {})).toEqual(
        'Min length not met!',
      );
    });

    it('returns the min length message when minimum length is not met (_validate call)', done => {
      new ValidatorStringRange(5)._validate('1234', {}).then(result => {
        try {
          expect(result).toEqual({
            valid: false,
            message: 'Input must be at least 5 characters',
          });
        } catch (error) {
          done(error.toString());
        }

        done();
      });
    });

    it('returns the max length message when maximum length is not met', () => {
      expect(new ValidatorStringRange(0, 5).validate('123456', {})).toEqual('Input must be at most ${max} characters');
    });

    it('returns the custom max length message when maximum length is not met', () => {
      expect(new ValidatorStringRange(0, 5, undefined, 'Max length not met!').validate('123456', {})).toEqual(
        'Max length not met!',
      );
    });

    it('returns the max length message when maximum length is not met (_validate call)', done => {
      let validator = new ValidatorStringRange(0, 5);
      validator._validate('123456', {}).then(result => {
        try {
          expect(result).toEqual({
            valid: false,
            message: 'Input must be at most 5 characters',
          });
        } catch (error) {
          done(error.toString());
        }

        done();
      });
    });
  });
});
