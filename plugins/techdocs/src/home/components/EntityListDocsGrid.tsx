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
  CodeSnippet,
  Progress,
  WarningPanel,
} from '@backstage/core-components';
import { useEntityListProvider } from '@backstage/plugin-catalog-react';
import React from 'react';
import { DocsCardGrid } from './DocsCardGrid';

export const EntityListDocsGrid = () => {
  const { loading, error, entities } = useEntityListProvider();

  if (error) {
    return (
      <WarningPanel
        severity="error"
        title="Could not load available documentation."
      >
        <CodeSnippet language="text" text={error.toString()} />
      </WarningPanel>
    );
  }

  if (loading || !entities) {
    return <Progress />;
  }

  entities.sort((a, b) =>
    (a.metadata.title ?? a.metadata.name).localeCompare(
      b.metadata.title ?? b.metadata.name,
    ),
  );

  return <DocsCardGrid entities={entities} />;
};
