import { SettingListener, Unsubscribe, SettingValue, SettingsData, SettingsStore } from './types';

export default class MemorySettingsStore implements SettingsStore {
  private data: SettingsData;
  private listeners: Map<string, Set<SettingListener>> = new Map();

  constructor(data: SettingsData = {}) {
    this.data = data;
  }

  async set<T extends SettingValue>(id: string, value: T): Promise<void> {
    this.data[id] = value;

    const listeners = this.listeners.get(id);

    Promise.resolve().then(() => {
      (listeners as Set<SettingListener>).forEach(listener => {
        listener(value);
      });
    });
  }

  subscribe<T extends SettingValue>(id: string, listener: SettingListener<T>): Unsubscribe {
    let listeners = this.listeners.get(id) || new Set();
    this.listeners.set(id, listeners);
    listeners.add(listener as SettingListener);

    Promise.resolve().then(() => {
      listener(this.data[id] as T);
    });

    return () => {
      listeners.delete(listener as SettingListener);
    };
  }
}
