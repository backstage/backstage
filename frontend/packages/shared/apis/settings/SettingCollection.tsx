import React, { FC } from 'react';
import { SettingConfig, SettingValue, SettingsStore, SettingsStoreContext } from './types';
import Setting from './Setting';

export default class SettingCollection {
  private readonly settings: Map<string, Setting<SettingValue>> = new Map();
  private store: SettingsStore | undefined;

  register(config: SettingConfig<boolean>): Setting<boolean>;
  register(config: SettingConfig<string>): Setting<string>;
  register(config: SettingConfig<number>): Setting<number>;
  register<T extends SettingValue>(config: SettingConfig<T>): Setting<T> {
    if (this.settings.has(config.id)) {
      throw new Error(`Setting '${config.id}' already exists`);
    }
    const setting = new Setting(config.id, config.defaultValue, () => this.store);
    this.settings.set(config.id, setting);
    return setting;
  }

  // Creates a function that is used to bind this settings collection to a settings store,
  // and returns a context provider for that store.
  bind(): (store: SettingsStore) => FC<{}> {
    return store => {
      this.store = store;

      return ({ children }) => <SettingsStoreContext.Provider value={store} children={children} />;
    };
  }
}
