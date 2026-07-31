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

import { ReactNode } from 'react';
import {
  createExtensionBlueprint,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';

const componentDataRef = createExtensionDataRef<
  (props: { children: ReactNode }) => JSX.Element | null
>().with({ id: 'app.router.wrapper' });

let hasWarnedDeprecation = false;

/**
 * Creates an extension that replaces the root router component. This blueprint
 * is limited to use by the app plugin.
 *
 * @public
 * @deprecated Browser history is owned by the app itself, so this blueprint no
 * longer controls plugin routing. It remains fully supported and there is no
 * removal date, but new code should pick a page-level router through
 * `PageRouterBlueprint` or `pageRouterApiRef` instead.
 */
export const RouterBlueprint = createExtensionBlueprint({
  kind: 'app-router-component',
  attachTo: { id: 'app/root', input: 'router' },
  output: [componentDataRef],
  dataRefs: {
    component: componentDataRef,
  },
  *factory(params: {
    /** @deprecated use the `component` parameter instead */
    Component?: [error: 'Use the `component` parameter instead'];
    component: (props: { children: ReactNode }) => JSX.Element | null;
  }) {
    if (!hasWarnedDeprecation && process.env.NODE_ENV !== 'test') {
      hasWarnedDeprecation = true;
      // eslint-disable-next-line no-console
      console.warn(
        'DEPRECATION WARNING: RouterBlueprint is deprecated and no longer controls plugin routing, ' +
          'since browser history is owned by the app itself. It remains supported, but new code ' +
          'should pick a page-level router through PageRouterBlueprint or pageRouterApiRef.',
      );
    }
    yield componentDataRef(params.component);
  },
});
