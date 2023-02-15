import { octopusDeployPlugin } from './plugin';

describe('octopus-deploy', () => {
  it('should export plugin', () => {
    expect(octopusDeployPlugin).toBeDefined();
  });
});
