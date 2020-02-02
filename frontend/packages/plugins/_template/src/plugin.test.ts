import plugin from './plugin';

describe('plugin-1', () => {
  it('should export plugin', () => {
    expect(plugin.id).toBe('change-me-id');
  });
});
