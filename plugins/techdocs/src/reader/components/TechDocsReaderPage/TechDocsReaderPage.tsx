/*
 * Copyright 2022 The Backstage Authors
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

import { Children, ReactElement, ReactNode, useMemo } from 'react';
import { useOutlet } from 'react-router-dom';
import { Progress } from '@backstage/core-components';
import { CompoundEntityRef } from '@backstage/catalog-model';
import {
  TECHDOCS_ADDONS_KEY,
  TECHDOCS_ADDONS_WRAPPER_KEY,
  TechDocsReaderPageProvider,
} from '@backstage/plugin-techdocs-react';
import { LegacyTechDocsAddonsFallbackProvider } from '@backstage/plugin-techdocs-react/alpha';
import { TechDocsReaderPageRenderFunction } from '../../../types';
import { TechDocsReaderLayout as BuiTechDocsReaderLayout } from '../../../alpha/components/TechDocsReaderLayout';
import { rootDocsRouteRef } from '../../../routes';
import {
  getComponentData,
  useRouteRefParams,
} from '@backstage/core-plugin-api';
import { CookieAuthRefreshProvider } from '@backstage/plugin-auth-react';
import { useExternalRedirect } from './useExternalRedirect';

/**
 * Props for {@link TechDocsReaderLayout}
 * @public
 */
export type TechDocsReaderLayoutProps = {
  /** Show or hide the reader header, defaults to true. */
  withHeader?: boolean;
  /** Show or hide the documentation search, defaults to true. */
  withSearch?: boolean;
};

/**
 * Default TechDocs reader page structure composed with a header and content
 * @public
 */
export const TechDocsReaderLayout = (props: TechDocsReaderLayoutProps) => (
  <BuiTechDocsReaderLayout {...props} />
);

/**
 * @public
 */
export type TechDocsReaderPageProps = {
  entityRef?: CompoundEntityRef;
  children?: TechDocsReaderPageRenderFunction | ReactNode;
};

/**
 * An addon-aware implementation of the TechDocsReaderPage.
 *
 * @public
 */
export const TechDocsReaderPage = (props: TechDocsReaderPageProps) => {
  const { kind, name, namespace } = useRouteRefParams(rootDocsRouteRef);
  const { children, entityRef = { kind, name, namespace } } = props;

  const outlet = useOutlet();

  const memoizedEntityRef = useMemo(
    () => ({
      kind: entityRef.kind,
      name: entityRef.name,
      namespace: entityRef.namespace,
    }),
    [entityRef.kind, entityRef.name, entityRef.namespace],
  );

  // Check for external TechDocs redirects and handle navigation
  const { shouldShowProgress } = useExternalRedirect(memoizedEntityRef);

  const page: ReactNode = useMemo(() => {
    if (children) {
      return null;
    }

    const childrenList = outlet ? Children.toArray(outlet.props.children) : [];

    const grandChildren = childrenList.flatMap<ReactElement>(
      child => (child as ReactElement)?.props?.children ?? [],
    );

    return grandChildren.find(
      grandChild =>
        !getComponentData(grandChild, TECHDOCS_ADDONS_WRAPPER_KEY) &&
        !getComponentData(grandChild, TECHDOCS_ADDONS_KEY),
    );
  }, [children, outlet]);

  // Show full-page loading spinner when checking for external redirects or about to redirect.
  // This replaces the entire page content (header, sidebar, and documentation).
  if (shouldShowProgress) {
    return <Progress />;
  }

  if (!children) {
    return (
      <CookieAuthRefreshProvider pluginId="techdocs">
        <LegacyTechDocsAddonsFallbackProvider>
          <TechDocsReaderPageProvider entityRef={memoizedEntityRef}>
            {(page as JSX.Element) || <TechDocsReaderLayout />}
          </TechDocsReaderPageProvider>
        </LegacyTechDocsAddonsFallbackProvider>
      </CookieAuthRefreshProvider>
    );
  }

  return (
    <CookieAuthRefreshProvider pluginId="techdocs">
      <LegacyTechDocsAddonsFallbackProvider>
        <TechDocsReaderPageProvider entityRef={memoizedEntityRef}>
          {({ metadata, entityMetadata, onReady }) => (
            <>
              {children instanceof Function
                ? children({
                    entityRef: memoizedEntityRef,
                    techdocsMetadataValue: metadata.value,
                    entityMetadataValue: entityMetadata.value,
                    onReady,
                  })
                : children}
            </>
          )}
        </TechDocsReaderPageProvider>
      </LegacyTechDocsAddonsFallbackProvider>
    </CookieAuthRefreshProvider>
  );
};
