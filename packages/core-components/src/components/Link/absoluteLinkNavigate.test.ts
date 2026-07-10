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
} from './absoluteLinkNavigate';
import type {
  NavigationControllerApi,
  RoutingContract,
} from '@backstage/frontend-plugin-api';

const controller = {} as NavigationControllerApi;
const scopedContract = { basePath: '/create' } as unknown as RoutingContract;
const rootContract = { basePath: '/' } as unknown as RoutingContract;

describe('AbsoluteLinkNavigate', () => {
  describe('hasFrameworkNavigationSignals', () => {
    it('is false when neither signal is present (OFS)', () => {
      expect(hasFrameworkNavigationSignals(undefined, undefined)).toBe(false);
    });

    it('is true when the navigation controller is registered', () => {
      expect(hasFrameworkNavigationSignals(controller, undefined)).toBe(true);
    });

    it('is true when a routing contract is in context', () => {
      expect(hasFrameworkNavigationSignals(undefined, scopedContract)).toBe(
        true,
      );
    });
  });

  describe('shouldNavigateViaFramework', () => {
    it('does not use the framework without NFS signals (OFS unchanged)', () => {
      expect(
        shouldNavigateViaFramework({
          to: '/catalog/default/component/foo',
          navigationController: undefined,
          routingContract: undefined,
        }),
      ).toBe(false);
    });

    it('does not use the framework for relative targets under a scoped contract', () => {
      expect(
        shouldNavigateViaFramework({
          to: './templates/foo',
          navigationController: controller,
          routingContract: scopedContract,
        }),
      ).toBe(false);
    });

    it('does not use the framework for in-scope absolute targets (scoped RR handles them)', () => {
      expect(
        shouldNavigateViaFramework({
          to: '/create/templates/default/foo',
          navigationController: controller,
          routingContract: scopedContract,
        }),
      ).toBe(false);
    });

    it('uses the framework for cross-plugin absolute targets outside the contract', () => {
      expect(
        shouldNavigateViaFramework({
          to: '/catalog/default/component/foo',
          navigationController: controller,
          routingContract: scopedContract,
        }),
      ).toBe(true);
    });

    it('uses the framework for absolute targets under the root contract', () => {
      expect(
        shouldNavigateViaFramework({
          to: '/catalog',
          navigationController: controller,
          routingContract: rootContract,
        }),
      ).toBe(true);
    });

    it('does not use the framework when only a contract is present without a controller', () => {
      expect(
        shouldNavigateViaFramework({
          to: '/catalog/default/component/foo',
          navigationController: undefined,
          routingContract: scopedContract,
        }),
      ).toBe(false);
    });
  });
});
