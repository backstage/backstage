import { BuildSummary, BuildWithSteps } from '../../api';

export type SettingsState = {
  owner: string;
  repo: string;
  token: string;
};

export enum PollingState {
  Polling,
  Idle,
}

export type BuildsState = {
  builds: BuildSummary[];
  pollingIntervalId: number | null;
  pollingState: PollingState;
};

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

type BuildsAction =
  | {
      type: 'setBuilds';
      payload: BuildSummary[];
    }
  | {
      type: 'setPollingIntervalId';
      payload: number | null;
    };

type BuildsWithStepsAction =
  | {
      type: 'setBuildWithSteps';
      payload: BuildWithSteps;
    }
  | {
      type: 'setPollingIntervalIdForBuildsWithSteps';
      payload: number | null;
    };

export type BuildsWithStepsState = {
  builds: Record<number, BuildWithSteps>;
  pollingIntervalId: number | null;
  pollingState: PollingState;
  getBuildError: Error | null;
};

export type Action = SettingsAction | BuildsAction | BuildsWithStepsAction;
