import plugin from './plugin';

describe('{{ cookiecutter.plugin_name }}', () => {
  it('should export plugin', () => {
    expect(plugin.id).toBe('{{ cookiecutter.plugin_name }}');
  });
});
