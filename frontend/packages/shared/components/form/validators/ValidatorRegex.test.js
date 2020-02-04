import { ValidatorRegex } from 'shared/components/form/validators';

describe('ValidatorRegex', () => {
  it('instantiates without error if a regex is provided', () => {
    expect(() => new ValidatorRegex(/a/)).not.toThrow();
  });

  it('instantiates with error if a regex is not provided', () => {
    expect(() => new ValidatorRegex()).toThrow();
  });

  describe('has a working validate() method', () => {
    it('has sane defaults', () => {
      let validator = new ValidatorRegex(/a/);

      expect(validator.validate('a', {})).toEqual(true);
    });

    it('returns the proper default error message when the regex does not match', () => {
      let validator = new ValidatorRegex(/a/);

      expect(validator.validate('b', {})).toEqual('${label}: entry does not match regex: ${regex}');
    });

    it('returns the proper custom error message when the regex does not match', () => {
      let validator = new ValidatorRegex(/a/, 'Hodor');

      expect(validator.validate('b', {})).toEqual('Hodor');
    });
  });
});
