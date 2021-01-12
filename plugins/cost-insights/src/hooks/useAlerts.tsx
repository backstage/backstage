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
import React, {
  useReducer,
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  PropsWithChildren,
} from 'react';
import { Alert, Maybe } from '../types';

export type AlertsContextProps = {
  alerts: AlertState;
  setAlerts: Dispatch<SetStateAction<Partial<AlertState>>>;
};

export const AlertsContext = createContext<AlertsContextProps | undefined>(
  undefined,
);

export type AlertState = {
  alerts: Alert[];
  snoozed: Maybe<Alert>;
  accepted: Maybe<Alert>;
  dismissed: Maybe<Alert>;
};

const initialState: AlertState = {
  alerts: [],
  snoozed: null,
  accepted: null,
  dismissed: null,
};

const reducer = (
  prevState: AlertState,
  action: SetStateAction<Partial<AlertState>>,
): AlertState => ({
  ...prevState,
  ...action,
});

export const AlertsProvider = ({ children }: PropsWithChildren<{}>) => {
  const [alerts, setAlerts] = useReducer(reducer, initialState);

  return (
    <AlertsContext.Provider value={{ alerts, setAlerts }}>
      {children}
    </AlertsContext.Provider>
  );
};

export function useAlerts() {
  const context = useContext(AlertsContext);
  return context
    ? ([context.alerts, context.setAlerts] as const)
    : assertNever();
}

function assertNever(): never {
  throw new Error('useAlerts cannot be used outside AlertsContext provider');
}
