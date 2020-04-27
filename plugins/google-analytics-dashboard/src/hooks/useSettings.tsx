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

import { useState, useCallback } from 'react';
import { ContextType } from 'contexts/Context';
import { View } from 'components/Views/Views';
import { TimeRange } from 'components/TimeRanges/TimeRanges';
import { Account } from 'components/Accounts/Accounts';

export const useSettings = (): ContextType => {
  const [view, setView] = useState<View>({
    id:
      localStorage.getItem('@backstage/google-analytics-plugin/ga_view_id') ||
      '',
    name:
      localStorage.getItem('@backstage/google-analytics-plugin/ga_view_name') ||
      undefined,
  });

  const [timeRange, setTimeRange] = useState<TimeRange>({
    'start-date': '7daysAgo',
    'end-date': 'today',
  });

  const [account, setAccount] = useState<Account>({
    id:
      localStorage.getItem(
        '@backstage/google-analytics-plugin/ga_account_id',
      ) || '',
    name:
      localStorage.getItem(
        '@backstage/google-analytics-plugin/ga_account_name',
      ) || undefined,
  });

  const setCurrentView = useCallback((selectedView: View): void => {
    setView(selectedView);
    localStorage.setItem(
      '@backstage/google-analytics-plugin/ga_view_id',
      selectedView.id,
    );
    localStorage.setItem(
      '@backstage/google-analytics-plugin/ga_view_name',
      selectedView.name || '',
    );
  }, []);

  const setCurrentTimeRange = useCallback(
    (selectedTimeRange: TimeRange): void => {
      setTimeRange(selectedTimeRange);
    },
    [],
  );

  const setCurrentAccount = useCallback((selectedAccount: Account): void => {
    setAccount(selectedAccount);
    localStorage.setItem(
      '@backstage/google-analytics-plugin/ga_account_id',
      selectedAccount.id,
    );
    localStorage.setItem(
      '@backstage/google-analytics-plugin/ga_account_name',
      selectedAccount.name || '',
    );
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
