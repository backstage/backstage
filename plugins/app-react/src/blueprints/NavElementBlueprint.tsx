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

import { z } from 'zod/v4';
import {
  ExtensionBoundary,
  coreExtensionData,
  createExtensionBlueprint,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';

/**
 * Where a navigation element goes, relative to the page links.
 *
 * @remarks
 * `start` comes before the page links and `end` after them, whichever way the
 * app lays out its navigation.
 *
 * @public
 */
export type NavElementSlot = 'start' | 'end';

const slotDataRef = createExtensionDataRef<NavElementSlot>().with({
  id: 'core.nav-element.slot',
});

/**
 * Adds content to the app's navigation that is not a link to a page, such as
 * a list of user shortcuts or a search button.
 *
 * @remarks
 * Links to pages come from `PageBlueprint` extensions and need no extension of
 * their own. The plugin picks a default slot; the app can move, order or
 * disable the element through config.
 *
 * @public
 */
export const NavElementBlueprint = createExtensionBlueprint({
  kind: 'nav-element',
  attachTo: { id: 'app/nav', input: 'elements' },
  output: [coreExtensionData.reactElement, slotDataRef],
  dataRefs: { slot: slotDataRef },
  configSchema: {
    slot: z.enum(['start', 'end']).optional(),
  },
  *factory(
    params: {
      /** The default slot. Defaults to `end`. */
      slot?: NavElementSlot;
      loader: () => Promise<JSX.Element>;
    },
    { node, config },
  ) {
    yield coreExtensionData.reactElement(
      ExtensionBoundary.lazy(node, params.loader),
    );
    yield slotDataRef(config.slot ?? params.slot ?? 'end');
  },
});
