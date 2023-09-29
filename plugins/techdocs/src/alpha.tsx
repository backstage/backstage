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
import {
  createPlugin,
  createSchemaFromZod,
} from '@backstage/frontend-plugin-api';
import { createSearchResultListItemExtension } from '@backstage/plugin-search-react/alpha';

/** @alpha */
export const TechDocsSearchResultListItemExtension =
  createSearchResultListItemExtension({
    id: 'techdocs',
    configSchema: createSchemaFromZod(z =>
      z.object({
        // TODO: Define how the icon can be configurable
        title: z.string().optional(),
        lineClamp: z.number().default(5),
        asLink: z.boolean().default(true),
        asListItem: z.boolean().default(true),
        noTrack: z.boolean().default(false),
      }),
    ),
    predicate: result => result.type === 'techdocs',
    component: async ({ config }) => {
      const { TechDocsSearchResultListItem } = await import(
        './search/components/TechDocsSearchResultListItem'
      );
      return props => <TechDocsSearchResultListItem {...props} {...config} />;
    },
  });

/** @alpha */
export default createPlugin({
  id: 'techdocs',
  extensions: [TechDocsSearchResultListItemExtension],
});
