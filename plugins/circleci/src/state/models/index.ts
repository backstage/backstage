import { settings } from './settings';
import { builds } from './builds';

// no need to extend from Models
export interface RootModel {
  settings: typeof settings;
  builds: typeof builds;
}

export const models = {
  settings,
  builds,
};
