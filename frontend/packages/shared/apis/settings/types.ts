import { createContext } from 'react';

export type SettingValue = boolean | number | string;
export type SettingsData = { [id: string]: SettingValue };
export type SettingSetFunc<T> = (value: T) => Promise<void>;
export type SettingListener<T = SettingValue> = (value: T | undefined) => void;
export type Unsubscribe = () => void;

export type SettingsStore = {
  set<T extends SettingValue>(id: string, value: T): Promise<void>;
  subscribe<T extends SettingValue>(id: string, listener: SettingListener<T>): Unsubscribe;
};

export type SettingConfig<T extends SettingValue> = {
  id: string;
  defaultValue: T;
};

export const SettingsStoreContext = createContext<SettingsStore | undefined>(undefined);
