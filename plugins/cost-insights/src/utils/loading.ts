import { Loading } from '../types';

export enum DefaultLoadingAction {
  UserGroups = 'user-groups',
  LastCompleteBillingDate = 'billing-date',
  CostInsightsInitial = 'cost-insights-initial',
  CostInsightsPage = 'cost-insights-page',
}

export const INITIAL_LOADING_ACTIONS = [
  DefaultLoadingAction.UserGroups,
  DefaultLoadingAction.CostInsightsInitial,
];

export const getDefaultState = (loadingActions: string[]): Loading => {
  return loadingActions.reduce(
    (defaultState, action) => ({ ...defaultState, [action]: true }),
    {},
  );
};

export const getResetState = (loadingActions: string[]): Loading => {
  return loadingActions.reduce(
    (defaultState, action) => ({ ...defaultState, [action]: false }),
    {},
  );
};

export const getResetStateWithoutInitial = (
  loadingActions: string[],
): Loading => {
  return loadingActions.reduce((defaultState, action) => {
    const loadingActionState = (INITIAL_LOADING_ACTIONS as string[]).includes(
      action,
    )
      ? false
      : true;
    return { ...defaultState, [action]: loadingActionState };
  }, {});
};

export function getLoadingActions(products: string[]): string[] {
  return ([
    DefaultLoadingAction.UserGroups,
    DefaultLoadingAction.CostInsightsInitial,
    DefaultLoadingAction.CostInsightsPage,
  ] as string[]).concat(products);
}
