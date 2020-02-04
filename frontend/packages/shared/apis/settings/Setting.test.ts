import Setting from './Setting';
import { SettingsStore } from './types';

describe('Setting', () => {
  it('should be created', async () => {
    const setting = new Setting('my.id', 3 as number, () => undefined);
    expect(setting.id).toBe('my.id');
    expect(setting.defaultValue).toBe(3);

    expect(() => {
      setting.subscribe(() => {});
    }).toThrowError('no settings store available');

    await expect(setting.set(4)).rejects.toThrowError('no settings store available');
  });

  it('should be accessible directly', async () => {
    const mockStore: SettingsStore = {
      set: jest.fn(),
      subscribe: jest.fn(),
    };
    const setting = new Setting('my.id', 3 as number, () => mockStore);

    const listener = () => {};
    setting.subscribe(listener);
    setting.set(4);

    expect(mockStore.set).toHaveBeenCalledWith('my.id', 4);
    expect(mockStore.subscribe).toHaveBeenCalledWith('my.id', listener);
  });
});
