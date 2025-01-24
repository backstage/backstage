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

import React from 'react';
import * as deployments from '../../__fixtures__/2-deployments.json';
import {
  renderInTestApp,
  TestApiProvider,
  textContentMatcher,
} from '@backstage/test-utils';
import { DeploymentDrawer } from './DeploymentDrawer';
import { kubernetesClusterLinkFormatterApiRef } from '../../api';

describe('DeploymentDrawer', () => {
  it('should render deployment drawer', async () => {
    const { getByText, getAllByText } = await renderInTestApp(
      <TestApiProvider apis={[[kubernetesClusterLinkFormatterApiRef, {}]]}>
        <DeploymentDrawer
          deployment={(deployments as any).deployments[0]}
          expanded
        />
        ,
      </TestApiProvider>,
    );

    expect(getAllByText('dice-roller')).toHaveLength(2);
    expect(getAllByText('Deployment')).toHaveLength(2);
    expect(getByText('YAML')).toBeInTheDocument();
    expect(getByText('Strategy')).toBeInTheDocument();
    expect(getByText('rollingUpdate:')).toBeInTheDocument();
    expect(getByText(textContentMatcher('maxSurge: 25%'))).toBeInTheDocument();
    expect(
      getByText(textContentMatcher('maxUnavailable: 25%')),
    ).toBeInTheDocument();
    expect(
      getByText(textContentMatcher('type: RollingUpdate')),
    ).toBeInTheDocument();
    expect(getByText('Min Ready Seconds')).toBeInTheDocument();
    expect(getByText('???')).toBeInTheDocument();
    expect(getByText('Progress Deadline Seconds')).toBeInTheDocument();
    expect(getByText('600')).toBeInTheDocument();
    expect(getByText('Progressing')).toBeInTheDocument();
    expect(getByText('Available')).toBeInTheDocument();
    expect(getByText('namespace: default')).toBeInTheDocument();
    expect(getAllByText('True')).toHaveLength(2);
  });

  it('should render deployment drawer without namespace', async () => {
    const deployment = (deployments as any).deployments[0];
    const { queryByText } = await renderInTestApp(
      <TestApiProvider apis={[[kubernetesClusterLinkFormatterApiRef, {}]]}>
        <DeploymentDrawer
          deployment={{
            ...deployment,
            metadata: { ...deployment.metadata, namespace: undefined },
          }}
          expanded
        />
        ,
      </TestApiProvider>,
    );

    expect(queryByText('namespace: default')).not.toBeInTheDocument();
  });
});
