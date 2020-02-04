import ValidatorSysmodelComponent from './ValidatorSysmodelComponent';
import SysmodelClient from 'shared/apis/sysmodel/SysmodelClient';

describe('ValidatorSysmodelComponent', () => {
  it('instantiates without error', () => {
    expect(() => {
      let validator = new ValidatorSysmodelComponent();
      expect(validator).toBeDefined();
    }).not.toThrow();
  });

  describe('has a working validate() method', () => {
    it('has sane defaults', async () => {
      const result = await new ValidatorSysmodelComponent().validate('');
      expect(result).toContain('Must be 4 to 255 lowercase');
    });

    it('Treats 200 as failure because component already exists', async () => {
      const sysmodelResponse = { response: { status: 200 } };
      jest.spyOn(SysmodelClient, 'getComponent').mockImplementation(() => Promise.resolve(sysmodelResponse));
      const result = await new ValidatorSysmodelComponent().validate('uniq-component-name');
      expect(result).toContain("'uniq-component-name' already exists");
    });

    it('Treats 404 as successful', async () => {
      const sysmodelResponse = { response: { status: 404 } };
      jest.spyOn(SysmodelClient, 'getComponent').mockImplementation(() => Promise.reject(sysmodelResponse));
      const result = await new ValidatorSysmodelComponent().validate('uniq-component-name');
      expect(result).toBeTruthy();
    });

    it('Catches 500 errors', async () => {
      const sysmodelResponse = { response: { status: 500 } };
      jest.spyOn(SysmodelClient, 'getComponent').mockImplementation(() => Promise.reject(sysmodelResponse));
      const result = await new ValidatorSysmodelComponent().validate('uniq-component-name');
      expect(result).toContain('Error response (500) from sysmodel preventing validation');
    });
  });
});
