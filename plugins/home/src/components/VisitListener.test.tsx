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
import React from 'react';
import { TestApiProvider, renderInTestApp } from '@backstage/test-utils';
import { Visit, visitsApiRef } from '../api';
import { DoNotTrack, VisitListener, useVisitListener } from './VisitListener';
import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import { MemoryRouter } from 'react-router-dom';

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
  saveVisit: jest.fn(async () => visits[0]),
  listVisits: jest.fn(async () => visits),
};

describe('<VisitListener/>', () => {
  afterEach(jest.resetAllMocks);

  it('registers a visit', async () => {
    jest.spyOn(document, 'title', 'get').mockReturnValue('MockedTitle');
    const pathname = '/catalog/default/component/playback-order';

    await renderInTestApp(
      <TestApiProvider apis={[[visitsApiRef, mockVisitsApi]]}>
        <VisitListener />
      </TestApiProvider>,
      { routeEntries: [pathname] },
    );

    await waitFor(() =>
      expect(mockVisitsApi.saveVisit).toHaveBeenCalledTimes(1),
    );
    expect(mockVisitsApi.saveVisit).toHaveBeenCalledWith({
      visit: {
        pathname,
        entityRef: 'component:default/playback-order',
        name: 'MockedTitle',
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
    jest.spyOn(document, 'title', 'get').mockReturnValue('MockedTitle');
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
      expect(mockVisitsApi.saveVisit).toHaveBeenCalledWith({
        visit: {
          pathname,
          entityRef: 'component:default/playback-order',
          name: pathname,
        },
      }),
    );
  });

  it('is able to override how entityRefs are defined', async () => {
    jest.spyOn(document, 'title', 'get').mockReturnValue('MockedTitle');
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
      expect(mockVisitsApi.saveVisit).toHaveBeenCalledWith({
        visit: {
          pathname,
          entityRef: pathname,
          name: 'MockedTitle',
        },
      }),
    );
  });
});

describe('<DoNotTrack/>', () => {
  afterEach(jest.resetAllMocks);

  it("doesn't register a visit", async () => {
    const requestAnimationFrameSpy = jest.spyOn(
      window,
      'requestAnimationFrame',
    );
    await renderInTestApp(
      <TestApiProvider apis={[[visitsApiRef, mockVisitsApi]]}>
        <VisitListener>
          <DoNotTrack />
        </VisitListener>
      </TestApiProvider>,
    );
    await waitFor(() => expect(requestAnimationFrameSpy).toHaveBeenCalled());
    expect(mockVisitsApi.saveVisit).not.toHaveBeenCalled();
  });

  it('renders its children', async () => {
    const requestAnimationFrameSpy = jest.spyOn(
      window,
      'requestAnimationFrame',
    );
    const { getByTestId } = await renderInTestApp(
      <TestApiProvider apis={[[visitsApiRef, mockVisitsApi]]}>
        <VisitListener>
          <DoNotTrack>
            <div data-testid="child">child</div>
          </DoNotTrack>
        </VisitListener>
      </TestApiProvider>,
    );
    await waitFor(() => expect(requestAnimationFrameSpy).toHaveBeenCalled());
    expect(getByTestId('child')).toBeTruthy();
  });
});

describe('useVisitListener()', () => {
  it('returns the default context', () => {
    const { result } = renderHook(() => useVisitListener());
    expect(result.current.doNotTrack).toBeFalsy();
    expect(result.current.setDoNotTrack).toBeInstanceOf(Function);
  });

  it('changes the doNotTrack flag', () => {
    const { result } = renderHook(() => useVisitListener(), {
      wrapper: ({ children }) => (
        <MemoryRouter>
          <TestApiProvider apis={[[visitsApiRef, mockVisitsApi]]}>
            <VisitListener>{children}</VisitListener>
          </TestApiProvider>
        </MemoryRouter>
      ),
    });
    act(() => {
      result.current.setDoNotTrack(true);
    });
    expect(result.current.doNotTrack).toBeTruthy();
  });
});
