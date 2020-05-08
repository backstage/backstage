import { settings } from './settings';
import { builds } from './builds';
import { buildWithSteps } from './buildWithSteps';

// no need to extend from Models
export interface RootModel {
  settings: typeof settings;
  builds: typeof builds;
  buildWithSteps: typeof buildWithSteps;
}

export const models = {
  settings,
  builds,
  buildWithSteps,
};
