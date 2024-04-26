/*
 * Copyright 2020 The Backstage Authors
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

import { CostInsightsHeader } from './CostInsightsHeader';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import React from 'react';
import { ApiProvider } from '@backstage/core-app-api';
import { IdentityApi, identityApiRef } from '@backstage/core-plugin-api';

describe('<CostInsightsHeader/>', () => {
  const identityApi: Partial<IdentityApi> = {
    getProfileInfo: async () => ({
      email: 'test-email@example.com',
      displayName: 'User 1',
    }),
  };

  const apis = TestApiRegistry.from([identityApiRef, identityApi]);

  it('Shows nothing to do when no alerts exist', async () => {
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <CostInsightsHeader
          groupId="test-user-group-1"
          groups={[{ id: 'test-user-group-1' }]}
          hasCostData
          alerts={0}
        />
      </ApiProvider>,
    );

    expect(rendered.getByText(/doing great/)).toBeInTheDocument();
  });

  it('Shows work to do when alerts > 1', async () => {
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <CostInsightsHeader
          groupId="test-user-group-1"
          groups={[{ id: 'test-user-group-1' }]}
          hasCostData
          alerts={4}
        />
      </ApiProvider>,
    );
    expect(rendered.getByText(/few things/)).toBeInTheDocument();
  });

  it('Handles grammar with a single alert', async () => {
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <CostInsightsHeader
          groupId="test-user-group-1"
          groups={[{ id: 'test-user-group-1' }]}
          hasCostData
          alerts={1}
        />
      </ApiProvider>,
    );

    expect(rendered.queryByText(/things/)).not.toBeInTheDocument();
    expect(rendered.getByText(/one thing/)).toBeInTheDocument();
  });

  it('Shows no costs when hasCostData is false', async () => {
    const rendered = await renderInTestApp(
      <ApiProvider apis={apis}>
        <CostInsightsHeader
          groupId="test-user-group-1"
          groups={[{ id: 'test-user-group-1' }]}
          hasCostData={false}
          alerts={1}
        />
      </ApiProvider>,
    );
    expect(rendered.getByText(/this is awkward/)).toBeInTheDocument();
  });

  describe.each`
    hasCostData | alerts
    ${true}     | ${0}
    ${true}     | ${1}
    ${false}    | ${0}
  `('Shows proper group name', ({ hasCostData, alerts }) => {
    it('Shows group display name when available', async () => {
      const rendered = await renderInTestApp(
        <ApiProvider apis={apis}>
          <CostInsightsHeader
            groupId="test-user-group-1"
            groups={[
              { id: 'test-user-group-1', name: 'Test group display name' },
            ]}
            hasCostData={hasCostData}
            alerts={alerts}
          />
        </ApiProvider>,
      );
      expect(rendered.getByText(/Test group display name/)).toBeInTheDocument();
    });

    it('Fallbacks to group id when display name not available', async () => {
      const rendered = await renderInTestApp(
        <ApiProvider apis={apis}>
          <CostInsightsHeader
            groupId="test-user-group-1"
            groups={[{ id: 'test-user-group-1' }]}
            hasCostData={hasCostData}
            alerts={alerts}
          />
        </ApiProvider>,
      );
      expect(rendered.getByText(/test-user-group-1/)).toBeInTheDocument();
    });
  });
});
