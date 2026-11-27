/*
 * Copyright 2024 The Backstage Authors
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
  createExtensionInput,
  ApiBlueprint,
  IconElement,
  iconsApiRef,
} from '@backstage/frontend-plugin-api';
import { IconBundleBlueprint } from '@backstage/plugin-app-react';
import { lazy, Suspense } from 'react';
import { DefaultIconsApi } from '../apis/DefaultIconsApi';

export const defaultIconKeys = [
  'brokenImage',
  'catalog',
  'scaffolder',
  'techdocs',
  'search',
  'chat',
  'dashboard',
  'docs',
  'email',
  'github',
  'group',
  'help',
  'kind:api',
  'kind:component',
  'kind:domain',
  'kind:group',
  'kind:location',
  'kind:system',
  'kind:user',
  'kind:resource',
  'kind:template',
  'user',
  'warning',
  'star',
  'unstarred',
  'externalLink',
];

const loadDefaultIcons = () =>
  // eslint-disable-next-line @backstage/no-relative-monorepo-imports
  import('../../../../packages/app-defaults/src/defaults/icons');

// The shared defaults are components for the old frontend system. Passing
// elements keeps DefaultIconsApi's deprecation warning for icon bundles only.
const defaultIcons: { [key in string]: IconElement } = Object.fromEntries(
  defaultIconKeys.map(key => {
    const Icon = lazy(async () => ({
      default: (await loadDefaultIcons()).icons[
        key as keyof Awaited<ReturnType<typeof loadDefaultIcons>>['icons']
      ],
    }));
    return [
      key,
      <Suspense fallback={null}>
        <Icon fontSize="inherit" />
      </Suspense>,
    ];
  }),
);

/**
 * Contains the shareable icons installed into the app.
 */
export const IconsApi = ApiBlueprint.makeWithOverrides({
  name: 'icons',
  inputs: {
    icons: createExtensionInput([IconBundleBlueprint.dataRefs.icons], {
      replaces: [{ id: 'app', input: 'icons' }],
      internal: true,
    }),
  },
  factory: (originalFactory, { inputs }) => {
    return originalFactory(defineParams =>
      defineParams({
        api: iconsApiRef,
        deps: {},
        factory: () => {
          return new DefaultIconsApi(
            inputs.icons
              .map(i => i.get(IconBundleBlueprint.dataRefs.icons))
              .reduce((acc, bundle) => ({ ...acc, ...bundle }), defaultIcons),
          );
        },
      }),
    );
  },
});
