import SettingCollection from './SettingCollection';
import { SettingsStore } from './types';

describe('SettingCollection', () => {
  it('should be created', async () => {
    const collection = new SettingCollection();
    expect(collection.bind()).toBeDefined();
  });

  it('should register settings', async () => {
    const collection = new SettingCollection();

    const mySetting = collection.register({ id: 'my.setting', defaultValue: 4 });
    mySetting.set(5).catch(() => {}); // make sure any number is allowed

    expect(() => {
      collection.register({ id: 'my.setting', defaultValue: 2 });
    }).toThrowError('already exists');

    const myOtherSetting = collection.register({ id: 'my.other.setting', defaultValue: false });
    myOtherSetting.set(true).catch(() => {}); // make sure type allows all boolean values
  });

  it('should bind a store', async () => {
    const mockStore: SettingsStore = {
      set: jest.fn(),
      subscribe: jest.fn(),
    };

    const collection = new SettingCollection();

    const mySetting = collection.register({ id: 'my.setting', defaultValue: 'initial-value' });

    collection.bind()(mockStore);

    await mySetting.set('other-value');

    expect(mockStore.set).toHaveBeenCalledWith('my.setting', 'other-value');
  });
});
