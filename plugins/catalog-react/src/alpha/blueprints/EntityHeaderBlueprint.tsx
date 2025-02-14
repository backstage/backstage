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

import { ReactNode } from 'react';
import {
  createExtensionBlueprint,
  coreExtensionData,
  createExtensionDataRef,
  ExtensionBoundary,
} from '@backstage/frontend-plugin-api';
import {
  entityFilterExpressionDataRef,
  entityFilterFunctionDataRef,
} from './extensionData';

const entityHeaderTitleActionsDataRef = createExtensionDataRef<
  ReactNode | { actions: ReactNode[] }
>().with({ id: 'entity-header.titleActions' });

const entityHeaderSubtitleDataRef = createExtensionDataRef<ReactNode>().with({
  id: 'entity-header.subtitle',
});

/** @alpha */
export const EntityHeaderBlueprint = createExtensionBlueprint({
  kind: 'entity-header',
  attachTo: { id: 'page:catalog/entity', input: 'headers' },
  output: [
    entityFilterFunctionDataRef.optional(),
    entityFilterExpressionDataRef.optional(),
    coreExtensionData.reactElement.optional(),
    entityHeaderTitleActionsDataRef.optional(),
    entityHeaderSubtitleDataRef.optional(),
  ],
  dataRefs: {
    filterFunction: entityFilterFunctionDataRef,
    filterExpression: entityFilterExpressionDataRef,
    element: coreExtensionData.reactElement,
    title: entityHeaderTitleActionsDataRef,
    subtitle: entityHeaderSubtitleDataRef,
  },
  config: {
    schema: {
      filter: z => z.string().optional(),
    },
  },
  *factory(
    params:
      | {
          defaultFilter?:
            | typeof entityFilterFunctionDataRef.T
            | typeof entityFilterExpressionDataRef.T;
          loader: () => Promise<JSX.Element>;
        }
      | {
          defaultFilter?:
            | typeof entityFilterFunctionDataRef.T
            | typeof entityFilterExpressionDataRef.T;
          title?: ReactNode | { actions: ReactNode[] };
          subtitle?: ReactNode;
        },
    { config, node },
  ) {
    const { defaultFilter } = params;

    if (config.filter) {
      yield entityFilterExpressionDataRef(config.filter);
    } else if (typeof defaultFilter === 'string') {
      yield entityFilterExpressionDataRef(defaultFilter);
    } else if (typeof defaultFilter === 'function') {
      yield entityFilterFunctionDataRef(defaultFilter);
    }

    if ('loader' in params) {
      yield coreExtensionData.reactElement(
        ExtensionBoundary.lazy(node, params.loader),
      );
    }

    if ('title' in params && params.title) {
      yield entityHeaderTitleActionsDataRef(params.title);
    }

    if ('subtitle' in params && params.subtitle) {
      yield entityHeaderSubtitleDataRef(params.subtitle);
    }
  },
});
