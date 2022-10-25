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

import React, { ReactNode, Children, ReactElement, ReactChild } from 'react';
import { useOutlet } from 'react-router-dom';

import { Page } from '@backstage/core-components';
import { CompoundEntityRef } from '@backstage/catalog-model';
import {
  TECHDOCS_ADDONS_WRAPPER_KEY,
  TechDocsReaderPageProvider,
} from '@backstage/plugin-techdocs-react';

import { TechDocsReaderPageRenderFunction } from '../../../types';

import { TechDocsReaderPageContent } from '../TechDocsReaderPageContent';
import { TechDocsReaderPageHeader } from '../TechDocsReaderPageHeader';
import { TechDocsReaderPageSubheader } from '../TechDocsReaderPageSubheader';
import { rootDocsRouteRef } from '../../../routes';
import {
  getComponentData,
  useRouteRefParams,
} from '@backstage/core-plugin-api';

type Extension = ReactChild & {
  type: {
    __backstage_data: {
      map: Map<string, boolean>;
    };
  };
};

/**
 * Props for {@link TechDocsReaderLayout}
 * @public
 */
export type TechDocsReaderLayoutProps = {
  /**
   * Show or hide the header, defaults to true.
   */
  withHeader?: boolean;
  /**
   * Show or hide the content search bar, defaults to true.
   */
  withSearch?: boolean;
};

/**
 * Default TechDocs reader page structure composed with a header and content
 * @public
 */
export const TechDocsReaderLayout = ({
  withSearch,
  withHeader = true,
}: TechDocsReaderLayoutProps) => {
  return (
    <Page themeId="documentation">
      {withHeader && <TechDocsReaderPageHeader />}
      <TechDocsReaderPageSubheader />
      <TechDocsReaderPageContent withSearch={withSearch} />
    </Page>
  );
};

/**
 * @public
 */
export type TechDocsReaderPageProps = {
  entityRef?: CompoundEntityRef;
  children?: TechDocsReaderPageRenderFunction | ReactNode;
};

/**
 * An addon-aware implementation of the TechDocsReaderPage.
 * @public
 */
export const TechDocsReaderPage = (props: TechDocsReaderPageProps) => {
  const { kind, name, namespace } = useRouteRefParams(rootDocsRouteRef);
  const { children, entityRef = { kind, name, namespace } } = props;

  const outlet = useOutlet();

  if (!children) {
    const childrenList = outlet ? Children.toArray(outlet.props.children) : [];

    let page: React.ReactNode;
    childrenList.forEach(child => {
      // console.log({child: JSON.stringify(child)})
      // const { type } = child as Extension;
      // console.log(!type?.__backstage_data?.map?.get(TECHDOCS_ADDONS_WRAPPER_KEY));

      if (getComponentData(child, TECHDOCS_ADDONS_WRAPPER_KEY)) {
        return;
      }

      // react-router 6 stable wraps children in a routing context provider, so check one level deeper
      const nestedChildren = (child as ReactElement)?.props?.children;
      if (nestedChildren) {
        Children.toArray(nestedChildren).forEach(nested => {
          if (!getComponentData(nested, TECHDOCS_ADDONS_WRAPPER_KEY)) {
            page = nested;
          }
        });
        return;
      }
      page = child;
    });

    return (
      <TechDocsReaderPageProvider entityRef={entityRef}>
        {(page as JSX.Element) || <TechDocsReaderLayout />}
      </TechDocsReaderPageProvider>
    );
  }

  return (
    <TechDocsReaderPageProvider entityRef={entityRef}>
      {({ metadata, entityMetadata, onReady }) => (
        <div className="techdocs-reader-page">
          <Page themeId="documentation">
            {children instanceof Function
              ? children({
                  entityRef,
                  techdocsMetadataValue: metadata.value,
                  entityMetadataValue: entityMetadata.value,
                  onReady,
                })
              : children}
          </Page>
        </div>
      )}
    </TechDocsReaderPageProvider>
  );
};
