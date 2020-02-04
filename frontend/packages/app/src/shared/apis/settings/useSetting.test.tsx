import React, { FC } from 'react';
import useSetting from './useSetting';
import SettingCollection from './SettingCollection';
import { SettingsStore, SettingValue } from './types';
import Setting from './Setting';
import { render } from '@testing-library/react';
import MemorySettingsStore from './MemorySettingsStore';
import { renderWithEffects } from 'testUtils';

type TestProps = {
  setting: Setting<SettingValue>;
  mock: (ret: ReturnType<typeof useSetting>) => void;
};

const TestComponent: FC<TestProps> = ({ setting, mock }) => {
  mock(useSetting(setting));
  return null;
};

describe('useSetting', () => {
  it('should return default value', async () => {
    const collection = new SettingCollection();

    const mySetting = collection.register({ id: 'my.setting', defaultValue: 4 });

    const mock = jest.fn();
    render(<TestComponent setting={mySetting} mock={mock} />);

    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith([4, undefined, true]);
  });

  it('should interact with a store', async () => {
    const mockStore: SettingsStore = {
      set: jest.fn(),
      subscribe: jest.fn(),
    };

    const collection = new SettingCollection();
    const mySetting = collection.register({ id: 'my.setting', defaultValue: 6 });
    const Provider = collection.bind()(mockStore);

    const retFn = jest.fn();
    render(
      <Provider>
        <TestComponent setting={mySetting} mock={retFn} />
      </Provider>,
    );

    expect(retFn).toHaveBeenCalledTimes(1);
    expect(mockStore.subscribe).toHaveBeenCalledTimes(1);
    expect(retFn).toHaveBeenNthCalledWith(1, [6, expect.any(Function), true]);

    const listener = (mockStore.subscribe as jest.Mock).mock.calls[0][1];

    listener(7);
    expect(retFn).toHaveBeenCalledTimes(2);
    expect(retFn).toHaveBeenLastCalledWith([7, expect.any(Function), false]);

    listener(8);
    expect(retFn).toHaveBeenCalledTimes(3);
    expect(retFn).toHaveBeenLastCalledWith([8, expect.any(Function), false]);

    listener(undefined);
    expect(retFn).toHaveBeenCalledTimes(4);
    expect(retFn).toHaveBeenLastCalledWith([6, expect.any(Function), false]);

    const setValue = retFn.mock.calls[0][0][1];
    expect(mockStore.set).not.toHaveBeenCalled();
    setValue(9);
    expect(mockStore.set).toHaveBeenCalledWith('my.setting', 9);
  });

  it('should interact with memory store', async () => {
    const store = new MemorySettingsStore();
    const collection = new SettingCollection();
    const mySetting = collection.register({ id: 'my.setting', defaultValue: 6 });
    const Provider = collection.bind()(store);

    const retFn = jest.fn();
    await renderWithEffects(
      <Provider>
        <TestComponent setting={mySetting} mock={retFn} />
      </Provider>,
    );

    expect(retFn).toHaveBeenCalledTimes(2);
    expect(retFn).toHaveBeenNthCalledWith(1, [6, expect.any(Function), true]);
    expect(retFn).toHaveBeenNthCalledWith(2, [6, expect.any(Function), false]);

    await store.set('my.setting', 5);

    expect(retFn).toHaveBeenCalledTimes(3);
    expect(retFn).toHaveBeenLastCalledWith([5, expect.any(Function), false]);

    const listener = jest.fn();
    const unsubscribe = store.subscribe('my.setting', listener);
    await Promise.resolve();
    expect(listener).toHaveBeenCalledWith(5);

    const setValue = retFn.mock.calls[0][0][1];
    await setValue(4);

    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenCalledWith(4);
    expect(retFn).toHaveBeenCalledTimes(4);
    expect(retFn).toHaveBeenLastCalledWith([4, expect.any(Function), false]);

    unsubscribe();

    await setValue(3);
    expect(listener).toHaveBeenCalledTimes(2);
    expect(retFn).toHaveBeenCalledTimes(5);
    expect(retFn).toHaveBeenLastCalledWith([3, expect.any(Function), false]);
  });
});
