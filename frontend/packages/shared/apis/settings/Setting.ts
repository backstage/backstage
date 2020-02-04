import { SettingValue, SettingListener, SettingsStore } from './types';

export default class Setting<T extends SettingValue> {
  readonly id: string;
  readonly defaultValue: T;

  private readonly storeAccessor: () => SettingsStore | undefined;

  constructor(id: string, defaultValue: T, storeAccessor: () => SettingsStore | undefined) {
    this.id = id;
    this.defaultValue = defaultValue;
    this.storeAccessor = storeAccessor;
  }

  async set(value: T): Promise<void> {
    const store = this.storeAccessor();
    if (!store) {
      throw new Error('no settings store available');
    }
    return store.set(this.id, value);
  }

  subscribe(listener: SettingListener<T>) {
    const store = this.storeAccessor();
    if (!store) {
      throw new Error('no settings store available');
    }
    return store.subscribe(this.id, listener);
  }
}
