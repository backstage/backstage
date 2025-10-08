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
import { PersistentVolumeClaimsAccordions } from './PersistentVolumeClaimsAccordions';
import * as onePersistentVolumeClaimsFixture from '../../__fixtures__/1-persistentvolumeclaims.json';
import * as twoPersistentVolumeClaimsFixture from '../../__fixtures__/2-persistentvolumeclaims.json';
import { renderInTestApp } from '@backstage/test-utils';
import { kubernetesProviders } from '../../hooks/test-utils';

describe('PersistentVolumeClaimsAccordions', () => {
  it('should render 1 persistent volume claim', async () => {
    const wrapper = kubernetesProviders(
      onePersistentVolumeClaimsFixture,
      new Set<string>(),
    );

    await renderInTestApp(wrapper(<PersistentVolumeClaimsAccordions />));

    expect(screen.getByText('pvc-web-storage')).toBeInTheDocument();
    expect(screen.getByText('PersistentVolumeClaim')).toBeInTheDocument();
    expect(screen.getByText('Bound')).toBeInTheDocument();
    expect(screen.getByText('namespace: default')).toBeInTheDocument();
  });

  it('should render 5 persistent volume claims with different statuses and namespaces', async () => {
    const wrapper = kubernetesProviders(
      twoPersistentVolumeClaimsFixture,
      new Set<string>(),
    );

    await renderInTestApp(wrapper(<PersistentVolumeClaimsAccordions />));

    // Check PVC names
    expect(screen.getByText('pvc-web-storage')).toBeInTheDocument();
    expect(screen.getByText('pvc-database-storage')).toBeInTheDocument();
    expect(screen.getByText('pvc-cache-storage')).toBeInTheDocument();
    expect(screen.getByText('pvc-logs-storage')).toBeInTheDocument();
    expect(screen.getByText('pvc-backup-storage')).toBeInTheDocument();

    expect(screen.getAllByText('PersistentVolumeClaim')).toHaveLength(5);

    // Check statuses
    expect(screen.getAllByText('Bound')).toHaveLength(3);
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Lost')).toBeInTheDocument();

    // Check namespaces
    expect(screen.getByText('namespace: default')).toBeInTheDocument();
    expect(screen.getByText('namespace: production')).toBeInTheDocument();
    expect(screen.getByText('namespace: staging')).toBeInTheDocument();
    expect(screen.getByText('namespace: logging')).toBeInTheDocument();
    expect(screen.getByText('namespace: backup')).toBeInTheDocument();
  });
});
