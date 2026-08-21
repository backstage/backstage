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

import {
  hasFrameworkNavigationSignals,
  shouldNavigateViaFramework,
  shouldResolveViaPageMount,
} from './absoluteLinkNavigate';
import type { AppHistoryApi } from '@backstage/frontend-plugin-api';
import type { PageMount } from '@internal/frontend';

const appHistory = {} as AppHistoryApi;
const scopedMount: PageMount = {
  basePath: '/create',
  routePattern: '/create',
};
const rootMount: PageMount = { basePath: '/', routePattern: '/' };

describe('AbsoluteLinkNavigate', () => {
  describe('hasFrameworkNavigationSignals', () => {
    it('is false when neither signal is present (OFS)', () => {
      expect(hasFrameworkNavigationSignals(undefined, undefined)).toBe(false);
    });

    it('is true when the app history is registered', () => {
      expect(hasFrameworkNavigationSignals(appHistory, undefined)).toBe(true);
    });

    it('is true when a page mount is in context', () => {
      expect(hasFrameworkNavigationSignals(undefined, scopedMount)).toBe(true);
    });
  });

  describe('shouldNavigateViaFramework', () => {
    it('does not use the framework without NFS signals (OFS unchanged)', () => {
      expect(
        shouldNavigateViaFramework({
          to: '/catalog/default/component/foo',
          appHistory: undefined,
          pageMount: undefined,
        }),
      ).toBe(false);
    });

    it('does not use the framework for relative targets under a scoped page mount', () => {
      expect(
        shouldNavigateViaFramework({
          to: './templates/foo',
          appHistory,
          pageMount: scopedMount,
        }),
      ).toBe(false);
    });

    it('does not use the framework for in-scope absolute targets (scoped RR handles them)', () => {
      expect(
        shouldNavigateViaFramework({
          to: '/create/templates/default/foo',
          appHistory,
          pageMount: scopedMount,
        }),
      ).toBe(false);
    });

    it('uses the framework for cross-plugin absolute targets outside the page mount', () => {
      expect(
        shouldNavigateViaFramework({
          to: '/catalog/default/component/foo',
          appHistory,
          pageMount: scopedMount,
        }),
      ).toBe(true);
    });

    it('uses the framework for absolute targets under the root page mount', () => {
      expect(
        shouldNavigateViaFramework({
          to: '/catalog',
          appHistory,
          pageMount: rootMount,
        }),
      ).toBe(true);
    });

    it('does not use the framework when only a page mount is present without app history', () => {
      expect(
        shouldNavigateViaFramework({
          to: '/catalog/default/component/foo',
          appHistory: undefined,
          pageMount: scopedMount,
        }),
      ).toBe(false);
    });
  });

  describe('shouldResolveViaPageMount', () => {
    const inPageWithoutRouteMatch = {
      appHistory,
      pageMount: scopedMount,
      hasAmbientRouteMatch: false,
    };

    it('resolves relative path targets inside a page that React Router has no match for', () => {
      expect(
        shouldResolveViaPageMount({
          to: '../templates',
          ...inPageWithoutRouteMatch,
        }),
      ).toBe(true);
      expect(
        shouldResolveViaPageMount({
          to: 'templates',
          ...inPageWithoutRouteMatch,
        }),
      ).toBe(true);
      expect(
        shouldResolveViaPageMount({ to: '', ...inPageWithoutRouteMatch }),
      ).toBe(true);
    });

    it('leaves everything React Router can already resolve alone', () => {
      // A page-scoped route context knows how far up `..` goes; a base path
      // does not, so the ambient context stays authoritative wherever it has a
      // match.
      expect(
        shouldResolveViaPageMount({
          to: '../templates',
          ...inPageWithoutRouteMatch,
          hasAmbientRouteMatch: true,
        }),
      ).toBe(false);
      // App-absolute targets need no base, and search-only / fragment-only
      // targets are relative to the location rather than to any base.
      expect(
        shouldResolveViaPageMount({
          to: '/catalog',
          ...inPageWithoutRouteMatch,
        }),
      ).toBe(false);
      expect(
        shouldResolveViaPageMount({
          to: '?filter=owned',
          ...inPageWithoutRouteMatch,
        }),
      ).toBe(false);
      expect(
        shouldResolveViaPageMount({
          to: '#summary',
          ...inPageWithoutRouteMatch,
        }),
      ).toBe(false);
    });

    it('never takes over on the old frontend system or outside a page', () => {
      expect(
        shouldResolveViaPageMount({
          to: '../templates',
          ...inPageWithoutRouteMatch,
          appHistory: undefined,
        }),
      ).toBe(false);
      // App chrome has no page mount, and there the framework and React Router
      // agree already - both resolve from the app root.
      expect(
        shouldResolveViaPageMount({
          to: '../templates',
          ...inPageWithoutRouteMatch,
          pageMount: undefined,
        }),
      ).toBe(false);
    });
  });
});
