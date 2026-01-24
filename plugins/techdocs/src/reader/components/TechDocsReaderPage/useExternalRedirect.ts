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

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAsync from 'react-use/esm/useAsync';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import {
  CompoundEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { buildTechDocsURL } from '@backstage/plugin-techdocs-react';
import { TECHDOCS_EXTERNAL_ANNOTATION } from '@backstage/plugin-techdocs-common';
import { rootDocsRouteRef } from '../../../routes';

/**
 * Hook to handle external TechDocs redirects based on entity annotations.
 * Checks if an entity has the `backstage.io/techdocs-entity` annotation and
 * redirects to the external TechDocs URL if present.
 *
 * @param entityRef - The entity reference to check for external redirects
 * @returns Object containing loading state and whether a redirect is in progress
 *
 * @internal
 */
export function useExternalRedirect(entityRef: CompoundEntityRef): {
  loading: boolean;
  shouldShowProgress: boolean;
} {
  const catalogApi = useApi(catalogApiRef);
  const navigate = useNavigate();
  const viewTechdocLink = useRouteRef(rootDocsRouteRef);

  // Create a stable string key for the entity to use as a dependency.
  // This ensures the useAsync hook only re-runs when the entity changes,
  // preventing redundant API calls during sub-page navigation within the same entity's documentation.
  const entityKey = stringifyEntityRef(entityRef);
  // Track which entity we've already checked to avoid redundant checks
  // when navigating between pages within the same entity's documentation.
  const checkedEntityRef = useRef<string | null>(null);
  const shouldCheckForRedirect = checkedEntityRef.current !== entityKey;

  // Check if this entity should redirect to external TechDocs
  const externalRedirectResult = useAsync(async () => {
    try {
      const catalogEntity = await catalogApi.getEntityByRef(entityRef);

      if (
        catalogEntity?.metadata?.annotations?.[TECHDOCS_EXTERNAL_ANNOTATION]
      ) {
        return buildTechDocsURL(catalogEntity, viewTechdocLink);
      }
    } catch (error) {
      // Ignore errors and allow the current entity's TechDocs to load.
      // This handles cases where the catalog API is unavailable or the entity doesn't exist.
    }

    return undefined;
  }, [entityKey, catalogApi]);

  useEffect(() => {
    // Navigate to external TechDocs if a redirect URL is available
    if (!externalRedirectResult.loading && externalRedirectResult.value) {
      navigate(externalRedirectResult.value, { replace: true });
    }

    // Mark entity as checked once we've determined there's no redirect needed.
    // This prevents the entire page from unmounting/remounting (showing Progress spinner)
    // on subsequent sub-page navigation within the same entity.
    if (!externalRedirectResult.loading && !externalRedirectResult.value) {
      checkedEntityRef.current = entityKey;
    }
  }, [
    externalRedirectResult.loading,
    externalRedirectResult.value,
    navigate,
    entityKey,
  ]);

  // Determine if we should show a loading indicator (which replaces the entire page with a Progress spinner).
  // Only show it when: 1) checking a new/unchecked entity, or 2) we have a redirect URL and are navigating.
  const shouldShowProgress =
    (shouldCheckForRedirect && externalRedirectResult.loading) ||
    !!externalRedirectResult.value;

  return {
    loading: externalRedirectResult.loading,
    shouldShowProgress,
  };
}
