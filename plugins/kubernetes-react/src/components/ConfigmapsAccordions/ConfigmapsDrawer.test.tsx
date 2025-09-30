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
import * as oneConfigmapsFixture from '../../__fixtures__/1-configmaps.json';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { ConfigmapsDrawer } from './ConfigmapsDrawer';
import { kubernetesClusterLinkFormatterApiRef } from '../../api';

describe('ConfigmapsDrawer', () => {
  it('should render configmap drawer', async () => {
    const { getByText, getAllByText } = await renderInTestApp(
      <TestApiProvider apis={[[kubernetesClusterLinkFormatterApiRef, {}]]}>
        <ConfigmapsDrawer
          configmap={(oneConfigmapsFixture as any).configMaps[0]}
          expanded
        />
      </TestApiProvider>,
    );

    expect(getAllByText('app-config')).toHaveLength(3);
    expect(getAllByText('ConfigMap')).toHaveLength(3);
    expect(getByText('YAML')).toBeInTheDocument();
    expect(getByText('namespace: default')).toBeInTheDocument();
  });
});
