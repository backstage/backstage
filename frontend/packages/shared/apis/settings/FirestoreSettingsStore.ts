import { SettingsStore, SettingValue, SettingListener, Unsubscribe, SettingsData } from './types';
import { FirestoreApi, JsonObject } from 'shared/apis/firestore';

export default class FirestoreSettingsStore implements SettingsStore {
  private api: FirestoreApi;
  private data: SettingsData | undefined;
  private listeners: Map<string, Set<SettingListener>> = new Map();

  constructor(api: FirestoreApi) {
    this.api = api;
    this.start();
  }

  private start() {
    this.api.observe<{ settings: SettingsData }>('/').forEach(snapshot => {
      const data = snapshot.data?.settings;
      this.data = data;

      this.listeners.forEach((listenerSet, id) => {
        listenerSet.forEach(listener => {
          listener(data && data[id]);
        });
      });
    });
  }

  async set<T extends SettingValue>(id: string, value: T): Promise<void> {
    const snapshot = await this.api.get('/');
    const data = snapshot.data?.settings || {};
    const settings = data as JsonObject;
    if (settings[id] === value) {
      return;
    }

    settings[id] = value;
    await this.api.merge('/', { settings });
  }

  subscribe<T extends SettingValue>(id: string, listener: SettingListener<T>): Unsubscribe {
    let currentValue = this.data && (this.data[id] as T);
    let calledListenerOnce = false;

    if (this.data) {
      listener(currentValue);
      calledListenerOnce = true;
    }

    const internalListener = (newValue: T) => {
      if (newValue !== currentValue || !calledListenerOnce) {
        currentValue = newValue;
        listener(newValue);
        calledListenerOnce = true;
      }
    };

    const listeners = this.listeners.get(id) || new Set();
    this.listeners.set(id, listeners);
    listeners.add(internalListener as SettingListener);

    return () => {
      listeners.delete(internalListener as SettingListener);
    };
  }
}
