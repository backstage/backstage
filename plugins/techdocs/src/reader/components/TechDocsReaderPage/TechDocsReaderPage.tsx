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

import React, { ReactNode, Children } from 'react';
import { useOutlet, useParams } from 'react-router-dom';

import { Page } from '@backstage/core-components';
import { getComponentData } from '@backstage/core-plugin-api';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { TECHDOCS_ADDONS_WRAPPER_KEY } from '@backstage/techdocs-addons';

import { TechDocsReaderPageRenderFunction } from '../../../types';

import { TechDocsReaderPageContent } from '../TechDocsReaderPageContent';
import { TechDocsReaderPageHeader } from '../TechDocsReaderPageHeader';
import { TechDocsReaderPageSubheader } from '../TechDocsReaderPageSubheader';

import { TechDocsReaderPageProvider } from './context';

/**
 * @public
 */
export type TechDocsReaderPageProps = {
  withHeader?: boolean;
  withSearch?: boolean;
  entityRef?: CompoundEntityRef;
  children?: TechDocsReaderPageRenderFunction | ReactNode;
};

/**
 * An addon-aware implementation of the TechDocsReaderPage.
 * @public
 */
export const TechDocsReaderPage = ({
  withHeader = true,
  withSearch = true,
  entityRef,
  children,
}: TechDocsReaderPageProps) => {
  const { kind, name, namespace } = useParams();

  const outlet = useOutlet();
  const entityName = entityRef ?? { kind, name, namespace };

  // children is only going to be defined if no "element" prop is provided to the route
  if (!children) {
    // the children of the outlet will always just be one component
    // therefore we need to support either custom reader page OR addons (using our default reader page) and not both
    const outletChildrenList = Children.toArray(outlet?.props.children);

    const hasAddons = outletChildrenList.find(node => {
      return getComponentData(node, TECHDOCS_ADDONS_WRAPPER_KEY);
    });

    return hasAddons || !outletChildrenList.length ? (
      <TechDocsReaderPageProvider entityName={entityName}>
        <Page themeId="documentation">
          {withHeader && <TechDocsReaderPageHeader />}
          <TechDocsReaderPageSubheader />
          <TechDocsReaderPageContent withSearch={withSearch} />
        </Page>
      </TechDocsReaderPageProvider>
    ) : (
      (outlet?.props.children as JSX.Element)
    );
  }

  return (
    <TechDocsReaderPageProvider entityName={entityName}>
      {({ metadata, entityMetadata, onReady }) => (
        <Page themeId="documentation">
          {children instanceof Function
            ? children({
                entityRef: entityName,
                techdocsMetadataValue: metadata.value,
                entityMetadataValue: entityMetadata.value,
                onReady,
              })
            : children}
        </Page>
      )}
    </TechDocsReaderPageProvider>
  );
};
