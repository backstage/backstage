import { ValidatorRequired } from 'shared/components/form/validators';

describe('ValidatorRequired', () => {
  it('instantiates without error', () => {
    expect(() => new ValidatorRequired()).not.toThrow();
  });

  describe('has a working validate() method', () => {
    it('returns the proper default message on an empty string', () => {
      expect(new ValidatorRequired().validate('', {})).toEqual('${label} is required.');
    });

    it('returns the proper custom message on an empty string', () => {
      expect(new ValidatorRequired('The darn input is invalid yo').validate('', {})).toEqual(
        'The darn input is invalid yo',
      );
    });
  });
});
