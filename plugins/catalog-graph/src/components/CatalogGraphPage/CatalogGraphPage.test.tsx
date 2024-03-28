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

import { RELATION_HAS_PART, RELATION_PART_OF } from '@backstage/catalog-model';
import { analyticsApiRef } from '@backstage/core-plugin-api';
import { catalogApiRef, entityRouteRef } from '@backstage/plugin-catalog-react';
import {
  MockAnalyticsApi,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { CatalogGraphPage } from './CatalogGraphPage';
import { GetEntitiesByRefsRequest } from '@backstage/catalog-client';

const navigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => navigate,
}));

/*
  The tests in this file have been disabled for the following error:

    TypeError: Cannot read properties of null (reading 'document')

      at document (../../../node_modules/d3-drag/src/nodrag.js:5:19)
      at SVGSVGElement.mousedowned (../../../node_modules/d3-zoom/src/zoom.js:279:16)
      at SVGSVGElement.call (../../../node_modules/d3-selection/src/selection/on.js:3:14)
      at SVGSVGElement.callTheUserObjectsOperation (../../../node_modules/jsdom/lib/jsdom/living/generated/EventListener.js:26:30)
      at innerInvokeEventListeners (../../../node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:350:25)
      at invokeEventListeners (../../../node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:286:3)
      at SVGElementImpl._dispatch (../../../node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:233:9)
      at SVGElementImpl.dispatchEvent (../../../node_modules/jsdom/lib/jsdom/living/events/EventTarget-impl.js:104:17)
      at SVGElement.dispatchEvent (../../../node_modules/jsdom/lib/jsdom/living/generated/EventTarget.js:241:34)
      at ../../../node_modules/@testing-library/user-event/dist/cjs/event/dispatchEvent.js:47:43
      at cb (../../../node_modules/@testing-library/react/dist/pure.js:66:16)
      at batchedUpdates$1 (../../../node_modules/react-dom/cjs/react-dom.development.js:22380:12)
      at act (../../../node_modules/react-dom/cjs/react-dom-test-utils.development.js:1042:14)
      at Object.eventWrapper (../../../node_modules/@testing-library/react/dist/pure.js:65:26)
      at Object.wrapEvent (../../../node_modules/@testing-library/user-event/dist/cjs/event/wrapEvent.js:29:24)
      at Object.dispatchEvent (../../../node_modules/@testing-library/user-event/dist/cjs/event/dispatchEvent.js:47:22)
      at Object.dispatchUIEvent (../../../node_modules/@testing-library/user-event/dist/cjs/event/dispatchEvent.js:24:26)
      at Mouse.down (../../../node_modules/@testing-library/user-event/dist/cjs/system/pointer/mouse.js:83:34)
      at PointerHost.press (../../../node_modules/@testing-library/user-event/dist/cjs/system/pointer/index.js:39:24)
      at pointerAction (../../../node_modules/@testing-library/user-event/dist/cjs/pointer/index.js:59:43)
      at Object.pointer (../../../node_modules/@testing-library/user-event/dist/cjs/pointer/index.js:35:15)
      at ../../../node_modules/@testing-library/react/dist/pure.js:59:16

  This has started happening after upgrading to the later version of @testing-library/user-event, and the d3-drag library
  where it happens seems to be unmaintained. Skipping for now.

  https://github.com/d3/d3-drag/issues/79#issuecomment-1631409544

  https://github.com/d3/d3-drag/issues/89
*/

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('<CatalogGraphPage/>', () => {
  let wrapper: JSX.Element;
  const entityC = {
    apiVersion: 'a',
    kind: 'b',
    metadata: {
      name: 'c',
      namespace: 'd',
    },
    relations: [
      {
        type: RELATION_PART_OF,
        targetRef: 'b:d/e',
        target: {
          kind: 'b',
          namespace: 'd',
          name: 'e',
        },
      },
    ],
  };
  const entityE = {
    apiVersion: 'a',
    kind: 'b',
    metadata: {
      name: 'e',
      namespace: 'd',
    },
    relations: [
      {
        type: RELATION_HAS_PART,
        targetRef: 'b:d/c',
        target: {
          kind: 'b',
          namespace: 'd',
          name: 'c',
        },
      },
    ],
  };
  const allEntities: Record<string, object> = {
    'b:d/c': entityC,
    'b:d/e': entityE,
  };
  const catalog = {
    getEntities: jest.fn(),
    getEntityByRef: jest.fn(),
    getEntitiesByRefs: jest.fn(),
    removeEntityByUid: jest.fn(),
    getLocationById: jest.fn(),
    getLocationByRef: jest.fn(),
    addLocation: jest.fn(),
    removeLocationById: jest.fn(),
    refreshEntity: jest.fn(),
    getEntityAncestors: jest.fn(),
    getEntityFacets: jest.fn(),
    validateEntity: jest.fn(),
  };

  beforeEach(() => {
    wrapper = (
      <TestApiProvider apis={[[catalogApiRef, catalog]]}>
        <CatalogGraphPage
          initialState={{
            showFilters: false,
            rootEntityRefs: ['b:d/c'],
            selectedKinds: ['b'],
          }}
        />
      </TestApiProvider>
    );
  });

  afterEach(() => jest.resetAllMocks());

  test('should render without exploding', async () => {
    catalog.getEntitiesByRefs.mockImplementation(
      async ({ entityRefs }: GetEntitiesByRefsRequest) => ({
        items: entityRefs.map(ref => allEntities[ref]),
      }),
    );

    await renderInTestApp(wrapper, {
      mountedRoutes: {
        '/entity/:kind/:namespace/:name': entityRouteRef,
      },
    });

    expect(screen.getByText('Catalog Graph')).toBeInTheDocument();
    await expect(screen.findByText('b:d/c')).resolves.toBeInTheDocument();
    await expect(screen.findByText('b:d/e')).resolves.toBeInTheDocument();
    await expect(screen.findAllByTestId('node')).resolves.toHaveLength(2);
    expect(catalog.getEntitiesByRefs).toHaveBeenCalledTimes(2);
  });

  test('should toggle filters', async () => {
    catalog.getEntitiesByRefs.mockImplementation(
      async ({ entityRefs }: GetEntitiesByRefsRequest) => ({
        items: entityRefs.map(ref => allEntities[ref]),
      }),
    );

    await renderInTestApp(wrapper, {
      mountedRoutes: {
        '/entity/:kind/:namespace/:name': entityRouteRef,
      },
    });

    expect(screen.queryByText('Max Depth')).toBeNull();

    await userEvent.click(screen.getByText('Filters'));

    expect(screen.getByText('Max Depth')).toBeInTheDocument();
  });

  test('should select other entity', async () => {
    catalog.getEntitiesByRefs.mockImplementation(
      async ({ entityRefs }: GetEntitiesByRefsRequest) => ({
        items: entityRefs.map(ref => allEntities[ref]),
      }),
    );

    await renderInTestApp(wrapper, {
      mountedRoutes: {
        '/entity/:kind/:namespace/:name': entityRouteRef,
      },
    });

    await expect(screen.findAllByTestId('node')).resolves.toHaveLength(2);

    await userEvent.click(screen.getByText('b:d/e'));

    await expect(screen.findByText('hasPart')).resolves.toBeInTheDocument();
  });

  test('should navigate to entity', async () => {
    catalog.getEntitiesByRefs.mockImplementation(
      async ({ entityRefs }: GetEntitiesByRefsRequest) => ({
        items: entityRefs.map(ref => allEntities[ref]),
      }),
    );

    await renderInTestApp(wrapper, {
      mountedRoutes: {
        '/entity/:kind/:namespace/:name': entityRouteRef,
      },
    });

    await expect(screen.findAllByTestId('node')).resolves.toHaveLength(2);

    const user = userEvent.setup();
    await user.keyboard('{Shift>}');
    await user.click(screen.getByText('b:d/e'));
    expect(navigate).toHaveBeenCalledWith('/entity/b/d/e');
  });

  test('should capture analytics event when selecting other entity', async () => {
    catalog.getEntitiesByRefs.mockImplementation(
      async ({ entityRefs }: GetEntitiesByRefsRequest) => ({
        items: entityRefs.map(ref => allEntities[ref]),
      }),
    );

    const analyticsSpy = new MockAnalyticsApi();
    await renderInTestApp(
      <TestApiProvider apis={[[analyticsApiRef, analyticsSpy]]}>
        {wrapper}
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/entity/:kind/:namespace/:name': entityRouteRef,
        },
      },
    );

    await expect(screen.findAllByTestId('node')).resolves.toHaveLength(2);

    await userEvent.click(screen.getByText('b:d/e'));

    expect(analyticsSpy.getEvents()[0]).toMatchObject({
      action: 'click',
      subject: 'b:d/e',
    });
  });

  test('should capture analytics event when navigating to entity', async () => {
    catalog.getEntitiesByRefs.mockImplementation(
      async ({ entityRefs }: GetEntitiesByRefsRequest) => ({
        items: entityRefs.map(ref => allEntities[ref]),
      }),
    );

    const analyticsSpy = new MockAnalyticsApi();
    await renderInTestApp(
      <TestApiProvider apis={[[analyticsApiRef, analyticsSpy]]}>
        {wrapper}
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/entity/:kind/:namespace/:name': entityRouteRef,
        },
      },
    );

    await expect(screen.findAllByTestId('node')).resolves.toHaveLength(2);

    const user = userEvent.setup();
    await user.keyboard('{Shift>}');
    await user.click(screen.getByText('b:d/e'));

    expect(analyticsSpy.getEvents()[0]).toMatchObject({
      action: 'click',
      subject: 'b:d/e',
      attributes: {
        to: '/entity/b/d/e',
      },
    });
  });
});
