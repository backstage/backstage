import { BuildSummary, BuildWithSteps } from '../api';

export type SettingsState = {
  owner: string;
  repo: string;
  token: string;
};

export type BuildsState = BuildSummary[];

export type State = {
  settings: SettingsState;
  builds: BuildsState;
  buildsWithSteps: BuildsWithStepsState;
};

type SettingsAction = {
  type: 'setCredentials';
  payload: {
    repo: string;
    owner: string;
    token: string;
  };
};

type BuildsAction = {
  type: 'setBuilds';
  payload: BuildSummary[];
};

type BuildsWithStepsAction = {
  type: 'setBuildWithSteps';
  payload: BuildWithSteps;
};

export type BuildsWithStepsState = Record<number, BuildWithSteps>;

export type Action = SettingsAction | BuildsAction | BuildsWithStepsAction;
