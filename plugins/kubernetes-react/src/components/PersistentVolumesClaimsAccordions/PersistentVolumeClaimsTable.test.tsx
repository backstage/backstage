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
import * as onePersistentVolumeClaimsFixture from '../../__fixtures__/1-persistentvolumeclaims.json';
import * as twoPersistentVolumeClaimsFixture from '../../__fixtures__/2-persistentvolumeclaims.json';
import { renderInTestApp } from '@backstage/test-utils';
import { PersistentVolumeClaimsTable } from './PersistentVolumeClaimsTable';

describe('PersistentVolumeClaimsTable', () => {
  it('should render persistent volume claim table with columns', async () => {
    await renderInTestApp(
      <PersistentVolumeClaimsTable
        persistentVolumeClaims={
          (onePersistentVolumeClaimsFixture as any).persistentVolumeClaims
        }
      />,
    );

    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('phase')).toBeInTheDocument();
    expect(screen.getByText('status')).toBeInTheDocument();
    expect(screen.getByText('capacity')).toBeInTheDocument();
    expect(screen.getByText('volume')).toBeInTheDocument();

    expect(screen.getByText('pvc-web-storage')).toBeInTheDocument();
    expect(screen.getAllByText('Bound').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('10Gi')).toBeInTheDocument();
  });

  it('should render multiple persistent volume claims', async () => {
    await renderInTestApp(
      <PersistentVolumeClaimsTable
        persistentVolumeClaims={
          (twoPersistentVolumeClaimsFixture as any).persistentVolumeClaims
        }
      />,
    );

    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('phase')).toBeInTheDocument();
    expect(screen.getByText('status')).toBeInTheDocument();
    expect(screen.getByText('capacity')).toBeInTheDocument();
    expect(screen.getByText('volume')).toBeInTheDocument();

    expect(screen.getByText('pvc-web-storage')).toBeInTheDocument();
    expect(screen.getByText('pvc-database-storage')).toBeInTheDocument();

    expect(screen.getAllByText('Bound').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Pending').length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText('10Gi')).toBeInTheDocument();
    expect(screen.getByText('50Gi')).toBeInTheDocument();
  });
});
