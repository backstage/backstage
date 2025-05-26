/*
 * Copyright 2025 The Backstage Authors
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

import { IconLinkVerticalProps } from '@backstage/core-components';
import {
  createExtensionBlueprint,
  createExtensionDataRef,
} from '@backstage/frontend-plugin-api';

const entityIconLinkPropsDataRef = createExtensionDataRef<
  () => IconLinkVerticalProps
>().with({
  id: 'entity-icon-link-props',
});

/** @alpha */
export const EntityIconLinkBlueprint = createExtensionBlueprint({
  kind: 'entity-icon-link',
  attachTo: { id: 'entity-card:catalog/about', input: 'iconLinks' },
  output: [entityIconLinkPropsDataRef],
  dataRefs: {
    props: entityIconLinkPropsDataRef,
  },
  config: {
    schema: {
      label: z => z.string().optional(),
      title: z => z.string().optional(),
      color: z => z.enum(['primary', 'secondary']).optional(),
      href: z => z.string().optional(),
      hidden: z => z.boolean().optional(),
      disabled: z => z.boolean().optional(),
    },
  },
  *factory(
    params: {
      props: IconLinkVerticalProps | (() => IconLinkVerticalProps);
    },
    { config },
  ) {
    yield entityIconLinkPropsDataRef(() => ({
      ...(typeof params.props === 'function' ? params.props() : params.props),
      ...Object.entries(config).reduce((rest, [key, value]) => {
        // Only include properties that are defined in the config
        // to avoid overriding defaults with undefined values
        if (value !== undefined) {
          return {
            ...rest,
            [key]: value,
            // Removing the "onClick" handler if href is provided prevents the handler
            // from redirecting to a different page
            ...(key === 'href' ? { onClick: undefined } : {}),
          };
        }
        return rest;
      }, {}),
    }));
  },
});
