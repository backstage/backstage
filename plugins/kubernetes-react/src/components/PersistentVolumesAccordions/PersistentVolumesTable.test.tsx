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
import * as onePersistentVolumesFixture from '../../__fixtures__/1-persistentvolumes.json';
import * as twoPersistentVolumesFixture from '../../__fixtures__/2-persistentvolumes.json';
import { renderInTestApp } from '@backstage/test-utils';
import { PersistentVolumesTable } from './PersistentVolumesTable';

describe('PersistentVolumesTable', () => {
  it('should render persistent volume table with columns', async () => {
    await renderInTestApp(
      <PersistentVolumesTable
        persistentVolumes={
          (onePersistentVolumesFixture as any).persistentVolumes
        }
      />,
    );

    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('phase')).toBeInTheDocument();
    expect(screen.getByText('status')).toBeInTheDocument();
    expect(screen.getByText('capacity')).toBeInTheDocument();
    expect(screen.getByText('type')).toBeInTheDocument();
    expect(screen.getByText('claim')).toBeInTheDocument();

    expect(screen.getByText('pv-hostpath')).toBeInTheDocument();
    expect(screen.getAllByText('Available').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('10Gi')).toBeInTheDocument();
  });

  it('should render multiple persistent volumes with cloud provider types', async () => {
    await renderInTestApp(
      <PersistentVolumesTable
        persistentVolumes={
          (twoPersistentVolumesFixture as any).persistentVolumes
        }
      />,
    );

    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('phase')).toBeInTheDocument();
    expect(screen.getByText('status')).toBeInTheDocument();
    expect(screen.getByText('capacity')).toBeInTheDocument();
    expect(screen.getByText('type')).toBeInTheDocument();
    expect(screen.getByText('claim')).toBeInTheDocument();

    expect(screen.getByText('pv-aws-ebs')).toBeInTheDocument();
    expect(screen.getByText('pv-aws-efs')).toBeInTheDocument();
    expect(screen.getByText('pv-aws-s3')).toBeInTheDocument();
    expect(screen.getByText('pv-gcp-pd')).toBeInTheDocument();
    expect(screen.getByText('pv-gcp-filestore')).toBeInTheDocument();

    expect(screen.getByText('AWS EBS Volume')).toBeInTheDocument();
    expect(screen.getByText('AWS EFS')).toBeInTheDocument();
    expect(screen.getByText('S3 Bucket')).toBeInTheDocument();
    expect(screen.getByText('GCP Persistent Disk')).toBeInTheDocument();
    expect(screen.getByText('GCP Filestore')).toBeInTheDocument();

    expect(screen.getAllByText('Bound').length).toBeGreaterThanOrEqual(3);
    expect(screen.getAllByText('Available').length).toBeGreaterThanOrEqual(2);

    expect(screen.getByText('100Gi')).toBeInTheDocument();
    expect(screen.getByText('5Ti')).toBeInTheDocument();
    expect(screen.getByText('10Ti')).toBeInTheDocument();
    expect(screen.getByText('200Gi')).toBeInTheDocument();
  });
});
