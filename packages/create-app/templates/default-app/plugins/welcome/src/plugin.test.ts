import { plugin } from './plugin';

describe('welcome', () => {
  it('should export plugin', () => {
    expect(plugin).toBeDefined();
  });
});
