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

import React, { CSSProperties, ComponentType, createContext } from 'react';
import { z } from 'zod';
import mapValues from 'lodash/mapValues';
import { Typography } from '@material-ui/core';

/**
 * App structure
 * - Root
 *   - GroceryLayout (fruit + vegetable columns}
 *     - Apple [grocery, fruit, title, component]
 *     - Orange [grocery, fruit, title, component]
 *     - Carrot [grocery, vegetable, component]
 *     - Tomato [grocery, vegetable, title, component]
 *     - Banana [grocery, title, component]
 *     - Metallica [band, title]
 */

interface ExtensionDataRef<T> {
  id: string;
  T: T;
  $$type: 'extension-data';
}

function createExtensionDataRef<T>(id: string) {
  return { id } as ExtensionDataRef<T>;
}

const coreExtensionData = {
  reactComponent: createExtensionDataRef<{ Component: ComponentType }>(
    'core.reactComponent',
  ),
  routable: createExtensionDataRef<{ path: string }>('core.routable'),
  title: createExtensionDataRef<{ title: string }>('core.title'),
};

createPlugin({
  id: 'catalog',
  extension: [],
});

function createExtension(options: { id: string }) {
  return options;
}

createExtension1({
  // id: 'catalog',
  // features: [
  //   {
  //     typeRef: coreExtensionData.routable,
  //     data: {
  //       path: 'catalog'
  //     }
  //   }
  // ],
  // init({ bind }) {
  //   bind(coreExtensionData.routable, {
  //     path: 'catalog'
  //   })
  // },
  // factory(bind, config, mountConfig) {
  //   bind(coreExtensionData.routable, {
  //     path: 'catalog'
  //   })
  // },
  extensionData: {
    // Record<typeRef, Partial<typeRef.T>> ?
    routable: { ref: coreExtensionData.routable, optional: true },
    title: coreExtensionData.title,
    component: coreExtensionData.reactComponent,
  },
  configSchema: z.object({
    path: z.string(),
    title: z.string().default('Ma title'),
  }),
  factory(bind, config) {
    bind.title({ title: config.title });
    const Component = () => <div>hello</div>;
    bind.component({ Component });
    bind.routable({ path: config.path });
  },
});

function createEntityContentExtension() {}

const AboutCard = createEntityContentExtension({
  component: () => <div>hello</div>,
  extensionData: {
    // Record<typeRef, Partial<typeRef.T>> ?
    channels: coreExtensionData.notificationChannels,
  },
  configSchema: z.object({
    channelName: z.string(),
  }),
  factory(bind, config) {},
});

function createEntityCardExtension(options: { configSchema }) {
  return createExtension({
    configSchema: options.configSchema(
      z.object({
        path: z.string(),
        title: z.string(),
      }),
    ),
    factory() {},
  });
}

const createEntityCardExtension = createExtensionFactory({
  baseConfigSchema: z.object({
    path: z.string(),
    title: z.string(),
  }),
});

const AboutCard = createEntityCardExtension({
  // features: [catalogCard],
  configSchema: parent => parent.union(),
});
