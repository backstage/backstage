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
import { createContext, useState, useCallback } from 'react';

export type View = {
  id: string;
  name: string | undefined;
};

export type TimeRange = {
  'start-date': '7daysAgo' | '30daysAgo';
  'end-date': 'today';
};

export type Account = {
  id: string;
  name: string | undefined;
};

export type ContextType = {
  view: View;
  timeRange: TimeRange;
  account: Account;
  setCurrentView: (view: View) => void;
  setCurrentTimeRange: (timeRange: TimeRange) => void;
  setCurrentAccount: (account: Account) => void;
};

export const Context = createContext<ContextType>({
  view: {
    id: '',
    name: undefined,
  },
  timeRange: {
    'start-date': '7daysAgo',
    'end-date': 'today',
  },
  account: {
    id: '',
    name: undefined,
  },
  setCurrentView: () => {},
  setCurrentTimeRange: () => {},
  setCurrentAccount: () => {},
});

export const useSettings = (): ContextType => {
  const [view, setView] = useState<View>({
    id: '',
    name: undefined,
  });

  const [timeRange, setTimeRange] = useState<TimeRange>({
    'start-date': '7daysAgo',
    'end-date': 'today',
  });

  const [account, setAccount] = useState<Account>({
    id: '',
    name: undefined,
  });

  const setCurrentView = useCallback((selectedView: View): void => {
    setView(selectedView);
  }, []);

  const setCurrentTimeRange = useCallback(
    (selectedTimeRange: TimeRange): void => {
      setTimeRange(selectedTimeRange);
    },
    [],
  );

  const setCurrentAccount = useCallback((selectedAccount: Account): void => {
    setAccount(selectedAccount);
  }, []);

  return {
    view,
    timeRange,
    account,
    setCurrentView,
    setCurrentTimeRange,
    setCurrentAccount,
  };
};
