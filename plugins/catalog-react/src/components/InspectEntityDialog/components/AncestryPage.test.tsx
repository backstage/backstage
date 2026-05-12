/*
 * Copyright 2026 The Backstage Authors
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

import { Entity } from '@backstage/catalog-model';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';
import { catalogApiRef } from '../../../api';
import { entityRouteRef } from '../../../routes';
import { catalogApiMock } from '../../../testUtils';
import { AncestryPage } from './AncestryPage';

const mountedRoutes = {
  '/catalog/:namespace/:kind/:name/*': entityRouteRef,
};

const entity: Entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Location',
  metadata: {
    namespace: 'Default',
    name: 'generated-37616cd91ff362d0d5e93176ea63756c41145697',
  },
};

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
};

describe('AncestryPage', () => {
  const getBBoxDescriptor = Object.getOwnPropertyDescriptor(
    window.SVGElement.prototype,
    'getBBox',
  );

  beforeAll(() => {
    Object.defineProperty(window.SVGElement.prototype, 'getBBox', {
      value: () => ({ width: 100, height: 20 }),
      configurable: true,
    });
  });

  afterAll(() => {
    if (getBBoxDescriptor) {
      Object.defineProperty(
        window.SVGElement.prototype,
        'getBBox',
        getBBoxDescriptor,
      );
    } else {
      Reflect.deleteProperty(window.SVGElement.prototype, 'getBBox');
    }
  });

  it('navigates to normalized entity route params when clicking a graph node', async () => {
    const user = userEvent.setup();
    const catalogApi = catalogApiMock.mock({
      getEntityAncestors: jest.fn().mockResolvedValue({
        rootEntityRef:
          'location:default/generated-37616cd91ff362d0d5e93176ea63756c41145697',
        items: [
          {
            entity,
            parentEntityRefs: [],
          },
        ],
      }),
    });

    renderInTestApp(
      <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
        <AncestryPage entity={entity} />
        <LocationDisplay />
      </TestApiProvider>,
      { mountedRoutes },
    );

    await user.click(
      await screen.findByText(
        /generated-37616cd91ff362d0d5e93176ea63756c41145697/,
      ),
    );

    expect(screen.getByTestId('location')).toHaveTextContent(
      '/catalog/default/location/generated-37616cd91ff362d0d5e93176ea63756c41145697',
    );
  });
});
