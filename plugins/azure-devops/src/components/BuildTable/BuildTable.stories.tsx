/*
 * Copyright 2021 The Backstage Authors
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

import {
  BuildResult,
  BuildStatus,
  RepoBuild,
} from '@backstage/plugin-azure-devops-common';

import { BuildTable } from './BuildTable';
import { MemoryRouter } from 'react-router';
import React from 'react';

export default {
  title: 'Plugins/Azure Devops/Build Table',
  component: BuildTable,
};

const buildStatuses: Array<[BuildStatus, BuildResult]> = [
  [BuildStatus.InProgress, BuildResult.None], // In Progress
  [BuildStatus.Completed, BuildResult.Succeeded], // Succeeded
  [BuildStatus.Completed, BuildResult.Failed], // Failed
  [BuildStatus.Completed, BuildResult.PartiallySucceeded], // Partially Succeeded
  [BuildStatus.Completed, BuildResult.Canceled], // Cancelled
  [BuildStatus.Completed, BuildResult.None], // Unknown
  [BuildStatus.Cancelling, BuildResult.None], // Cancelling
  [BuildStatus.Postponed, BuildResult.None], // Postponed
  [BuildStatus.NotStarted, BuildResult.None], // Not Started
  [BuildStatus.None, BuildResult.None], // Unknown
];

const generateTestData = (rows = 10): RepoBuild[] => {
  const repoBuilds: RepoBuild[] = [];

  for (let i = 0; i < rows; i++) {
    const [status, result] = buildStatuses[i] ?? [
      BuildStatus.Completed,
      BuildResult.Succeeded,
    ];

    repoBuilds.push({
      id: rows - i + 12534,
      title: `backstage ci - 1.0.0-preview-${rows - i}`,
      status,
      result,
      queueTime: new Date(Date.now() - i * 60000),
      source: 'refs/heads/main',
      link: '',
    });
  }

  return repoBuilds;
};

export const Default = () => (
  <MemoryRouter>
    <BuildTable items={generateTestData()} loading={false} error={undefined} />
  </MemoryRouter>
);

export const Empty = () => (
  <MemoryRouter>
    <BuildTable items={[]} loading={false} error={undefined} />
  </MemoryRouter>
);

export const Loading = () => (
  <MemoryRouter>
    <BuildTable items={[]} loading error={undefined} />
  </MemoryRouter>
);

export const ErrorMessage = () => (
  <MemoryRouter>
    <BuildTable
      items={[]}
      loading={false}
      error={new Error('Failed to load builds!')}
    />
  </MemoryRouter>
);
