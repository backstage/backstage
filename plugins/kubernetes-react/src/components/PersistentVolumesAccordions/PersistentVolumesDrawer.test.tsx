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
import * as onePersistentVolumesFixture from '../../__fixtures__/1-persistentvolumes.json';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { PersistentVolumesDrawer } from './PersistentVolumesDrawer';
import { kubernetesClusterLinkFormatterApiRef } from '../../api';

describe('PersistentVolumesDrawer', () => {
  it('should render persistent volume drawer', async () => {
    const { getByText, getAllByText } = await renderInTestApp(
      <TestApiProvider apis={[[kubernetesClusterLinkFormatterApiRef, {}]]}>
        <PersistentVolumesDrawer
          persistentVolume={
            (onePersistentVolumesFixture as any).persistentVolumes[0]
          }
          expanded
        />
      </TestApiProvider>,
    );

    expect(getAllByText('pv-hostpath')).toHaveLength(3);
    expect(getAllByText('PersistentVolume')).toHaveLength(3);
    expect(getByText('YAML')).toBeInTheDocument();
  });
});
