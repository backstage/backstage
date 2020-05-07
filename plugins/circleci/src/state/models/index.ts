import { settings } from './settings';

// no need to extend from Models
export interface RootModel {
  settings: typeof settings;
}

export const models: RootModel = { settings };
