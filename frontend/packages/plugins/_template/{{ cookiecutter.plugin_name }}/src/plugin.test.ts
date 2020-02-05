import plugin from './plugin';

describe('{{ cookiecutter.plugin_name }}', () => {
  it('should export plugin', () => {
    expect(plugin).toBeDefined();
  });
});
