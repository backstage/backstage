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

import React from 'react';
import { Content, Header, Page, pageTheme } from '@backstage/core';
import { RollbarProjectTable } from '../RollbarProjectTable/RollbarProjectTable';
import { useRollbarEntities } from '../../hooks/useRollbarEntities';

export const RollbarHome = () => {
  const { entities, loading, error } = useRollbarEntities();

  return (
    <Page theme={pageTheme.tool}>
      <Header
        title="Rollbar"
        subtitle="Real-time error tracking & debugging tools for developers"
      />
      <Content>
        <RollbarProjectTable
          entities={entities || []}
          loading={loading}
          error={error}
        />
      </Content>
    </Page>
  );
};
