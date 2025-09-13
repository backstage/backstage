/*
 * Copyright 2023 The Backstage Authors
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
import { TestApiProvider, renderInTestApp } from '@backstage/test-utils';
import { Visit, visitsApiRef } from '../api';
import { VisitListener, VisitEnrichmentFunction } from './VisitListener';
import { waitFor } from '@testing-library/react';

const visits: Array<Visit> = [
  {
    id: 'tech-radar',
    name: 'Tech Radar',
    pathname: '/tech-radar',
    hits: 40,
    timestamp: Date.now() - 360_000,
  },
  {
    id: 'explore',
    name: 'Explore Backstage',
    pathname: '/explore',
    hits: 35,
    timestamp: Date.now() - 86400_000 * 1,
  },
  {
    id: 'user-1',
    name: 'Guest',
    pathname: '/catalog/default/user/guest',
    hits: 30,
    timestamp: Date.now() - 86400_000 * 2,
    entityRef: 'User:default/guest',
  },
];

const mockVisitsApi = {
  save: jest.fn(async () => visits[0]),
  list: jest.fn(async () => visits),
};

describe('<VisitListener/>', () => {
  beforeEach(() => {
    jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb: FrameRequestCallback): number => {
        cb(0);
        return 0;
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  it('uses requestAnimationFrame to defer visit saving', async () => {
    const pathname = '/catalog/default/component/test-component';

    await renderInTestApp(
      <TestApiProvider apis={[[visitsApiRef, mockVisitsApi]]}>
        <VisitListener />
      </TestApiProvider>,
      { routeEntries: [pathname] },
    );

    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(mockVisitsApi.save).toHaveBeenCalledTimes(1));
  });

  it('registers a visit', async () => {
    const pathname = '/catalog/default/component/playback-order';

    await renderInTestApp(
      <TestApiProvider apis={[[visitsApiRef, mockVisitsApi]]}>
        <VisitListener />
      </TestApiProvider>,
      { routeEntries: [pathname] },
    );

    await waitFor(() => expect(mockVisitsApi.save).toHaveBeenCalledTimes(1));
    expect(mockVisitsApi.save).toHaveBeenCalledWith({
      visit: {
        pathname,
        entityRef: 'component:default/playback-order',
        name: 'playback-order',
      },
    });
  });

  it('renders its children', async () => {
    const { getByTestId } = await renderInTestApp(
      <TestApiProvider apis={[[visitsApiRef, mockVisitsApi]]}>
        <VisitListener>
          <div data-testid="child">child</div>
        </VisitListener>
      </TestApiProvider>,
    );

    expect(getByTestId('child')).toBeTruthy();
  });

  it('is able to override how visit names are defined', async () => {
    const pathname = '/catalog/default/component/playback-order';

    const visitNameOverride = ({ pathname: path }: { pathname: string }) =>
      path;

    await renderInTestApp(
      <TestApiProvider apis={[[visitsApiRef, mockVisitsApi]]}>
        <VisitListener visitName={visitNameOverride} />
      </TestApiProvider>,
      { routeEntries: [pathname] },
    );

    await waitFor(() =>
      expect(mockVisitsApi.save).toHaveBeenCalledWith({
        visit: {
          pathname,
          entityRef: 'component:default/playback-order',
          name: pathname,
        },
      }),
    );
  });

  it('is able to override how entityRefs are defined', async () => {
    const pathname = '/catalog/default/component/playback-order';

    const toEntityRefOverride = ({ pathname: path }: { pathname: string }) =>
      path;

    await renderInTestApp(
      <TestApiProvider apis={[[visitsApiRef, mockVisitsApi]]}>
        <VisitListener toEntityRef={toEntityRefOverride} />
      </TestApiProvider>,
      { routeEntries: [pathname] },
    );

    await waitFor(() =>
      expect(mockVisitsApi.save).toHaveBeenCalledWith({
        visit: {
          pathname,
          entityRef: pathname,
          name: 'playback-order',
        },
      }),
    );
  });

  it('saves base visit when no enrichment function is provided', async () => {
    const pathname = '/catalog/default/component/test-component';

    await renderInTestApp(
      <TestApiProvider apis={[[visitsApiRef, mockVisitsApi]]}>
        <VisitListener />
      </TestApiProvider>,
      { routeEntries: [pathname] },
    );

    await waitFor(() =>
      expect(mockVisitsApi.save).toHaveBeenCalledWith({
        visit: {
          pathname,
          entityRef: 'component:default/test-component',
          name: 'test-component',
        },
      }),
    );
  });

  it('enriches visit with additional data when enrichVisit function is provided', async () => {
    const pathname = '/catalog/default/component/test-component';
    const enrichVisit: VisitEnrichmentFunction = jest.fn(async _visit => ({
      customProperty: 'custom-value',
      category: 'test-category',
      priority: 1,
    }));

    await renderInTestApp(
      <TestApiProvider apis={[[visitsApiRef, mockVisitsApi]]}>
        <VisitListener enrichVisit={enrichVisit} />
      </TestApiProvider>,
      { routeEntries: [pathname] },
    );

    await waitFor(() => {
      expect(enrichVisit).toHaveBeenCalledWith({
        pathname,
        entityRef: 'component:default/test-component',
        name: 'test-component',
      });
      expect(mockVisitsApi.save).toHaveBeenCalledWith({
        visit: {
          pathname,
          entityRef: 'component:default/test-component',
          name: 'test-component',
          customProperty: 'custom-value',
          category: 'test-category',
          priority: 1,
        },
      });
    });
  });

  it('handles synchronous enrichment function', async () => {
    const pathname = '/catalog/default/component/test-component';
    const enrichVisit: VisitEnrichmentFunction = jest.fn(_visit => ({
      syncProperty: 'sync-value',
    }));

    await renderInTestApp(
      <TestApiProvider apis={[[visitsApiRef, mockVisitsApi]]}>
        <VisitListener enrichVisit={enrichVisit} />
      </TestApiProvider>,
      { routeEntries: [pathname] },
    );

    await waitFor(() => {
      expect(enrichVisit).toHaveBeenCalledWith({
        pathname,
        entityRef: 'component:default/test-component',
        name: 'test-component',
      });
      expect(mockVisitsApi.save).toHaveBeenCalledWith({
        visit: {
          pathname,
          entityRef: 'component:default/test-component',
          name: 'test-component',
          syncProperty: 'sync-value',
        },
      });
    });
  });

  it('enrichment function can override base visit properties', async () => {
    const pathname = '/catalog/default/component/test-component';
    const enrichVisit: VisitEnrichmentFunction = jest.fn(async _visit => ({
      name: 'Overridden Name',
      entityRef: 'overridden:ref/value',
      customField: 'additional-data',
    }));

    await renderInTestApp(
      <TestApiProvider apis={[[visitsApiRef, mockVisitsApi]]}>
        <VisitListener enrichVisit={enrichVisit} />
      </TestApiProvider>,
      { routeEntries: [pathname] },
    );

    await waitFor(() => {
      expect(mockVisitsApi.save).toHaveBeenCalledWith({
        visit: {
          pathname,
          name: 'Overridden Name',
          entityRef: 'overridden:ref/value',
          customField: 'additional-data',
        },
      });
    });
  });

  it('is able to override transformPathname and change the pathname', async () => {
    const pathname = '/catalog/default/component/playback-order-2/sub-path';

    const transformPathnameOverride = ({
      pathname: mypathname,
    }: {
      pathname: string;
    }) => mypathname.replace('/sub-path', '');

    await renderInTestApp(
      <TestApiProvider apis={[[visitsApiRef, mockVisitsApi]]}>
        <VisitListener transformPathname={transformPathnameOverride} />
      </TestApiProvider>,
      { routeEntries: [pathname] },
    );

    await waitFor(() =>
      expect(mockVisitsApi.save).toHaveBeenCalledWith({
        visit: {
          pathname: '/catalog/default/component/playback-order-2',
          entityRef: 'component:default/playback-order-2',
          name: 'playback-order-2',
        },
      }),
    );
  });

  it('is able to override canSave and save under set conditions', async () => {
    const pathname = '/catalog';

    const canSaveOverride = ({ pathname: path }: { pathname: string }) =>
      path === '/catalog';

    await renderInTestApp(
      <TestApiProvider apis={[[visitsApiRef, mockVisitsApi]]}>
        <VisitListener canSave={canSaveOverride} />
      </TestApiProvider>,
      { routeEntries: [pathname] },
    );

    await waitFor(() =>
      expect(mockVisitsApi.save).toHaveBeenCalledWith({
        visit: {
          pathname,
          entityRef: undefined,
          name: 'catalog',
        },
      }),
    );
  });

  it('is able to override canSave and not save under set conditions', async () => {
    const pathname = '/catalog';

    const canSaveOverride = ({ pathname: path }: { pathname: string }) =>
      path !== '/catalog';

    await renderInTestApp(
      <TestApiProvider apis={[[visitsApiRef, mockVisitsApi]]}>
        <VisitListener canSave={canSaveOverride} />
      </TestApiProvider>,
      { routeEntries: [pathname] },
    );

    await waitFor(() => expect(mockVisitsApi.save).not.toHaveBeenCalled());
  });
});
