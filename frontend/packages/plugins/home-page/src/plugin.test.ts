import plugin from './plugin';

describe('home-page', () => {
  it('should export plugin', () => {
    expect(plugin.id).toBe('home-page');
  });
});
