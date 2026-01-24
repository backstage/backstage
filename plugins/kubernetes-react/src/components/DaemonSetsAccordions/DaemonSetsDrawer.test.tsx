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

import * as daemonsets from '../../__fixtures__/2-daemonsets.json';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { DaemonSetDrawer } from './DaemonSetsDrawer';
import { kubernetesClusterLinkFormatterApiRef } from '../../api';

describe('DaemonsetsDrawer', () => {
  it('should render daemonsets drawer', async () => {
    const { getByText, getAllByText } = await renderInTestApp(
      <TestApiProvider apis={[[kubernetesClusterLinkFormatterApiRef, {}]]}>
        <DaemonSetDrawer
          daemonset={(daemonsets as any).daemonSets[0]}
          expanded
        />
        ,
      </TestApiProvider>,
    );
    expect(getAllByText('fluentd-elasticsearch')).toHaveLength(2);
    expect(getAllByText('DaemonSet')).toHaveLength(2);
    expect(getByText('YAML')).toBeInTheDocument();
    expect(getByText('Update Strategy Type')).toBeInTheDocument();
    expect(getByText('RollingUpdate')).toBeInTheDocument();
    expect(getByText('Min Ready Seconds')).toBeInTheDocument();
    expect(getByText('???')).toBeInTheDocument();
    expect(getByText('Min Ready Seconds')).toBeInTheDocument();
    expect(getByText('Revision History Limit')).toBeInTheDocument();
    expect(getByText('Current Number Scheduled')).toBeInTheDocument();
    expect(getByText('Desired Number Scheduled')).toBeInTheDocument();
    expect(getByText('Number Available')).toBeInTheDocument();
    expect(getByText('Number Misscheduled')).toBeInTheDocument();
    expect(getByText('Number Ready')).toBeInTheDocument();
    expect(getByText('namespace: default')).toBeInTheDocument();
  });

  it('should render deployment drawer without namespace', async () => {
    const daemonset = (daemonsets as any).daemonSets[0];
    const { queryByText } = await renderInTestApp(
      <TestApiProvider apis={[[kubernetesClusterLinkFormatterApiRef, {}]]}>
        <DaemonSetDrawer
          daemonset={{
            ...daemonset,
            metadata: { ...daemonset.metadata, namespace: undefined },
          }}
          expanded
        />
        ,
      </TestApiProvider>,
    );

    expect(queryByText('namespace: default')).not.toBeInTheDocument();
  });
});
