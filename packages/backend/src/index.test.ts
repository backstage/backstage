import { PluginEnvironment } from './types';

describe('test', () => {
  it('unbreaks the test runner', () => {
    const unbreaker = {} as PluginEnvironment;
    expect(unbreaker).toBeTruthy();
  });
});
