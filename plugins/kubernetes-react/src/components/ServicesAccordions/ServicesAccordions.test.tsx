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

import { screen } from '@testing-library/react';
import * as twoDeployFixture from './__fixtures__/2-services.json';
import { renderInTestApp } from '@backstage/test-utils';
import { ServicesAccordions } from './ServicesAccordions';
import { kubernetesProviders } from '../../hooks/test-utils';

describe('ServicesAccordions', () => {
  it('should render 2 services', async () => {
    const wrapper = kubernetesProviders(twoDeployFixture, new Set());

    await renderInTestApp(wrapper(<ServicesAccordions />));

    expect(screen.getByText('awesome-service-grpc')).toBeInTheDocument();
    expect(screen.getByText('Type: ClusterIP')).toBeInTheDocument();

    expect(screen.getByText('awesome-service-pg')).toBeInTheDocument();
    expect(screen.getByText('Type: ExternalName')).toBeInTheDocument();
  });
});
