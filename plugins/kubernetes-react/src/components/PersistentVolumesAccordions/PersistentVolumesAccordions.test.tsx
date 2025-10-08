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

import { screen } from '@testing-library/react';
import { PersistentVolumesAccordions } from './PersistentVolumesAccordions';
import * as onePersistentVolumesFixture from '../../__fixtures__/1-persistentvolumes.json';
import * as twoPersistentVolumesFixture from '../../__fixtures__/2-persistentvolumes.json';
import { renderInTestApp } from '@backstage/test-utils';
import { kubernetesProviders } from '../../hooks/test-utils';

describe('PersistentVolumesAccordions', () => {
  it('should render 1 persistent volume', async () => {
    const wrapper = kubernetesProviders(
      onePersistentVolumesFixture,
      new Set<string>(),
    );

    await renderInTestApp(wrapper(<PersistentVolumesAccordions />));

    expect(screen.getByText('pv-hostpath')).toBeInTheDocument();
    expect(screen.getByText('PersistentVolume')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('should render 9 persistent volumes with all cloud provider types', async () => {
    const wrapper = kubernetesProviders(
      twoPersistentVolumesFixture,
      new Set<string>(),
    );

    await renderInTestApp(wrapper(<PersistentVolumesAccordions />));

    expect(screen.getByText('pv-aws-ebs')).toBeInTheDocument();
    expect(screen.getByText('pv-aws-efs')).toBeInTheDocument();
    expect(screen.getByText('pv-aws-s3')).toBeInTheDocument();

    expect(screen.getByText('pv-gcp-pd')).toBeInTheDocument();
    expect(screen.getByText('pv-gcp-filestore')).toBeInTheDocument();
    expect(screen.getByText('pv-gcp-gcsfuse')).toBeInTheDocument();

    expect(screen.getByText('pv-azure-disk')).toBeInTheDocument();
    expect(screen.getByText('pv-azure-file')).toBeInTheDocument();
    expect(screen.getByText('pv-azure-blob')).toBeInTheDocument();

    expect(screen.getAllByText('PersistentVolume')).toHaveLength(9);
    expect(screen.getAllByText('Bound')).toHaveLength(5);
    expect(screen.getAllByText('Available')).toHaveLength(4);
  });
});
