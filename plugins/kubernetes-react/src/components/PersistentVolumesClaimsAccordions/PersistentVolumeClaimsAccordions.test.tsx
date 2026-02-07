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
  it('should render 1 persistent volume claim with summary', async () => {
    const wrapper = kubernetesProviders(
      onePersistentVolumeClaimsFixture,
      new Set<string>(),
    );

    await renderInTestApp(wrapper(<PersistentVolumeClaimsAccordions />));

    expect(screen.getByText('PersistentVolumeClaims')).toBeInTheDocument();
    expect(screen.getByText('1 claims')).toBeInTheDocument();
    expect(screen.getByText('1 bound')).toBeInTheDocument();
  });

  it('should render multiple persistent volume claims with summary', async () => {
    const wrapper = kubernetesProviders(
      twoPersistentVolumeClaimsFixture,
      new Set<string>(),
    );

    await renderInTestApp(wrapper(<PersistentVolumeClaimsAccordions />));

    expect(screen.getByText('PersistentVolumeClaims')).toBeInTheDocument();
    expect(screen.getByText('5 claims')).toBeInTheDocument();
    expect(screen.getByText('3 bound')).toBeInTheDocument();
    expect(screen.getByText('1 claim lost')).toBeInTheDocument();
  });
});
