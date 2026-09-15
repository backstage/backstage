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

import { screen, waitFor } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import { PageBlueprint } from '@backstage/frontend-plugin-api';
import { usePageMount } from '@internal/frontend';
import {
  UNSAFE_RouteContext,
  useInRouterContext,
  useLocation,
  useParams,
  useResolvedPath,
} from 'react-router-dom';
import { ReactRouterV6PageRouter } from './ReactRouterV6PageRouter';

/**
 * Two copies of `react-router-dom` in one app, which is the realistic dynamic
 * plugin failure: the adapter is federated and React Router is bundled, or the
 * reverse. React contexts are identified by object, not by name or version, so
 * the two copies cannot see each other at all — an adapter binds one copy's
 * contexts and the component's hooks read the other's, and nothing anywhere
 * says so.
 *
 * The second copy is a real second copy: `jest.isolateModules` gives the
 * module a registry of its own, so it runs its own `createContext` calls and
 * produces context objects the first copy has never heard of. React and
 * ReactDOM are deliberately *shared* into that registry — two Reacts would
 * fail for their own reasons ("invalid hook call") and would prove nothing
 * about routing.
 *
 * What this file is for is not that the mismatch breaks things — of course it
 * does — but *how loudly*. The two directions are very different, and the
 * difference decides what an adopter debugging a white page has to go on.
 *
 * The contrast that matters is with `PageMountContext`, which is deliberately
 * not identified by object: it goes through `@backstage/version-bridge`'s
 * global singleton precisely so it survives this. Page router adapters are
 * separately built packages that read the mount from it, so a duplicated copy
 * of the framework has to keep answering. Both halves are asserted below,
 * because the whole design rests on exactly one of these two contexts being
 * copy-proof.
 */

const sharedReact = jest.requireActual('react');
const sharedReactDom = jest.requireActual('react-dom');

let otherCopy: typeof import('react-router-dom');
let otherInternal: typeof import('@internal/frontend');
let otherAdapterModule: typeof import('./ReactRouterV6PageRouter');

jest.isolateModules(() => {
  jest.doMock('react', () => sharedReact);
  jest.doMock('react-dom', () => sharedReactDom);
  otherCopy = require('react-router-dom');
  otherInternal = require('@internal/frontend');
  otherAdapterModule = require('./ReactRouterV6PageRouter');
});
jest.dontMock('react');
jest.dontMock('react-dom');

/** Records what a hook answered, or the error it threw instead. */
function attempt(fn: () => string): string {
  try {
    return fn();
  } catch (error) {
    return `THREW: ${(error as Error).message.split('\n')[0]}`;
  }
}

function renderPage(loader: () => Promise<JSX.Element>) {
  const page = PageBlueprint.make({
    name: 'dup-copy',
    params: { path: '/dup/:id', loader },
  });
  return renderTestApp({
    extensions: [page],
    initialRouteEntries: ['/dup/alpha'],
  });
}

function readReport() {
  return JSON.parse(screen.getByTestId('report').textContent!) as Record<
    string,
    unknown
  >;
}

describe('a duplicated copy of react-router-dom', () => {
  it('should genuinely be a second copy, while the page mount context stays one', () => {
    // The premise of every case below. If module isolation ever stopped
    // producing a distinct copy, the tests would keep passing while testing
    // nothing at all, so it is asserted rather than assumed.
    expect(otherCopy.UNSAFE_RouteContext).not.toBe(UNSAFE_RouteContext);
    expect(otherCopy.useParams).not.toBe(useParams);
    // The framework package is a second copy too — same isolation, same
    // reasoning. Its page mount context is not, which is the point of routing
    // it through the version bridge's global singleton, and is what the
    // behavioural assertions below rely on.
    expect(otherInternal.usePageMount).toBeInstanceOf(Function);
    expect(otherInternal.usePageMount).not.toBe(usePageMount);
    expect(otherAdapterModule.ReactRouterV6PageRouter).not.toBe(
      ReactRouterV6PageRouter,
    );
  });

  it('should fail loudly when the component reads a copy nothing provides', async () => {
    // Adapter bundled, React Router federated. Nothing in the app provides the
    // component's copy of the contexts — not the page adapter, not the app
    // root projection — so its hooks are answering from their context
    // defaults.
    const Probe = () => {
      const report = {
        // Every hook with a router invariant of its own reports the missing
        // router, which is exactly the outcome wanted: the failure announces
        // itself instead of rendering a plausible wrong page.
        location: attempt(() => otherCopy.useLocation().pathname),
        resolved: attempt(() => otherCopy.useResolvedPath('./deep').pathname),
        // `useParams` has no invariant. It reads the last match off an empty
        // default stack and hands back `{}` — the one genuinely silent hole,
        // and the reason the detector below matters.
        params: JSON.stringify(otherCopy.useParams()),
        // React Router's own "is there a router" probe, which answers `false`
        // even though the page really does have one. That makes even the
        // silent case programmatically detectable from the component's side.
        inRouterContext: otherCopy.useInRouterContext(),
        // The framework's mount crosses copies intact, because it is not
        // carried on a copy-local context object.
        mount: otherInternal.usePageMount() ?? null,
      };
      return <span data-testid="report">{JSON.stringify(report)}</span>;
    };

    renderPage(async () => (
      <ReactRouterV6PageRouter>
        <Probe />
      </ReactRouterV6PageRouter>
    ));
    await waitFor(() =>
      expect(screen.getByTestId('report')).toBeInTheDocument(),
    );

    expect(readReport()).toEqual({
      location:
        'THREW: useLocation() may be used only in the context of a <Router> component.',
      resolved: expect.stringContaining('THREW:'),
      params: '{}',
      inRouterContext: false,
      mount: expect.objectContaining({
        basePath: '/dup/alpha',
        routePattern: '/dup/:id',
      }),
    });
  });

  it('keeps the app copy working through implicit compatibility when an adapter uses another copy', async () => {
    const OtherAdapter = otherAdapterModule.ReactRouterV6PageRouter;
    const Probe = () => {
      const location = useLocation();
      const resolved = useResolvedPath('./deep');
      const params = useParams();
      const inRouterContext = useInRouterContext();
      const mount = usePageMount();
      const report = {
        location: location.pathname,
        resolved: resolved.pathname,
        params: JSON.stringify(params),
        inRouterContext,
        mount: mount ?? null,
      };
      return <span data-testid="report">{JSON.stringify(report)}</span>;
    };

    renderPage(async () => (
      <OtherAdapter>
        <Probe />
      </OtherAdapter>
    ));
    await waitFor(() =>
      expect(screen.getByTestId('report')).toBeInTheDocument(),
    );

    expect(readReport()).toEqual({
      location: '/dup/alpha',
      resolved: '/dup/alpha/deep',
      params: JSON.stringify({ id: 'alpha', '*': '' }),
      inRouterContext: true,
      mount: expect.objectContaining({
        basePath: '/dup/alpha',
        routePattern: '/dup/:id',
      }),
    });
  });
});
