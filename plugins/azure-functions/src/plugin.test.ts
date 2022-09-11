import { azureFunctionsPlugin } from './plugin';

describe('azure-functions', () => {
  it('should export plugin', () => {
    expect(azureFunctionsPlugin).toBeDefined();
  });
});
