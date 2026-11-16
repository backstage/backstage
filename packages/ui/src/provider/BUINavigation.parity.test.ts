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

import type { AppNavigate } from '@backstage/frontend-plugin-api';
import type { BUINavigationOptions } from './BUINavigation';

/**
 * Parity with the navigation options of `AppNavigate` in
 * `packages/frontend-plugin-api/src/routing/useAppNavigate.ts`. BUI is a
 * standalone design system and cannot depend on the frontend framework at
 * runtime, so `BUINavigationOptions` is declared separately. The two types
 * must stay structurally identical: every navigation option the framework
 * accepts must be honored by BUI hosts and vice versa. Change one and you
 * must change the other.
 */
type FrameworkNavigateOptions = Parameters<AppNavigate>[1];

const buiOptions: BUINavigationOptions = { replace: true, state: { a: 1 } };
const frameworkOptions: FrameworkNavigateOptions = {
  replace: true,
  state: { a: 1 },
};

// These assignments only compile while the types remain mutually assignable.
const frameworkToBui: BUINavigationOptions = frameworkOptions;
const buiToFramework: FrameworkNavigateOptions = buiOptions;

describe('BUINavigationOptions parity with AppNavigate options', () => {
  it('stays structurally identical', () => {
    expect(frameworkToBui).toEqual(buiOptions);
    expect(buiToFramework).toEqual(frameworkOptions);
  });
});
