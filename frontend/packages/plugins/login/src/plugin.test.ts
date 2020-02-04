import plugin from './plugin';

describe('login', () => {
  it('should export plugin', () => {
    expect(plugin.id).toBe('login');
  });
});
