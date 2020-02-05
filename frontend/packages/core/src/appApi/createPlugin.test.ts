import createPlugin from './createPlugin';

describe('createPlugin', () => {
  it('should create a plugin', () => {
    const plugin = createPlugin({ id: 'my-plugin' });
    expect(plugin.id).toBe('my-plugin');
  });
});
