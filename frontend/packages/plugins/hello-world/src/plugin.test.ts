import plugin from './plugin';

describe('plugin', () => {
  it('should export plugin', () => {
    expect(plugin.id).toBe('hello-world');
  });
});
