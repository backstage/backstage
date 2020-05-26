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

import React, { FC, useEffect } from 'react';
import {
  ErrorApi,
  errorApiRef,
  InfoCard,
  Progress,
  useApi,
} from '@backstage/core';
import SentryIssuesTable from '../SentryIssuesTable/SentryIssuesTable';
import { useAsync } from 'react-use';
import { sentryApiFactory } from '../../data/api-factory';

const api = sentryApiFactory('spotify');

export const SentryPluginWidget: FC<{
  sentryProjectId: string;
  statsFor: '24h' | '12h';
}> = ({ sentryProjectId, statsFor }) => {
  const errorApi = useApi<ErrorApi>(errorApiRef);

  const { loading, value, error } = useAsync(
    () => api.fetchIssues(sentryProjectId, statsFor),
    [statsFor, sentryProjectId],
  );

  useEffect(() => {
    if (error) {
      errorApi.post(error);
    }
  }, [error]);

  if (loading) {
    return (
      <InfoCard title="Sentry issues">
        <Progress />
      </InfoCard>
    );
  }

  return <SentryIssuesTable sentryIssues={value || []} />;
};
