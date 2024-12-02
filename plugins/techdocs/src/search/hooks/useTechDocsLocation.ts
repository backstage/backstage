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
import { useMemo } from 'react';

import { CompoundEntityRef } from '@backstage/catalog-model';
import { useRouteRef } from '@backstage/core-plugin-api';

import { rootCatalogDocsRouteRef, rootDocsRouteRef } from '../../routes';

const trimStartSlash = (path: string) => path.replace(/^\/+/, '');
const trimEndSlash = (path: string) => path.replace(/\/+$/, '');

/**
 * Returns a function that takes a location to a Tech Docs entry, and returns a
 * new location, re-routed to the catalog page tab.
 *
 * @internal
 */
export function useEntityPageTechDocsRedirect(entityRef: CompoundEntityRef) {
  const { kind, name, namespace } = entityRef;

  const routeDocsRoot = useRouteRef(rootDocsRouteRef);
  const routeDocsCatalog = useRouteRef(rootCatalogDocsRouteRef);

  // Re-routes a /docs/:namespace/:kind/:name/* location into
  // /catalog/:namespace/:kind/:name/docs/*, while handling situations where
  // these defaults are changed.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const reRouteLocationToCatalog = useMemo(() => {
    const rootDocsPath = trimEndSlash(routeDocsRoot({ kind, namespace, name }));
    const catalogDocsPath = trimEndSlash(routeDocsCatalog());

    return (url: string): string => {
      if (
        url
          .toLocaleLowerCase('en-US')
          .startsWith(rootDocsPath.toLocaleLowerCase('en-US'))
      ) {
        const suffix = trimStartSlash(url.slice(rootDocsPath.length));
        return suffix.length === 0 || suffix.startsWith('#')
          ? `${catalogDocsPath}${suffix}`
          : `${catalogDocsPath}/${suffix}`;
      }
      return url;
    };
  }, [routeDocsRoot, routeDocsCatalog, kind, name, namespace]);

  return reRouteLocationToCatalog;
}
