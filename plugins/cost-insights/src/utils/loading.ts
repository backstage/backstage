/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
