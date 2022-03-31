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

import React, { ReactNode } from 'react';
import { useParams } from 'react-router-dom';

import { Page } from '@backstage/core-components';
import { CompoundEntityRef } from '@backstage/catalog-model';

import { TechDocsReaderPageRenderFunction } from '../../../types';

import { TechDocsReaderPageContent } from '../TechDocsReaderPageContent';
import { TechDocsReaderPageHeader } from '../TechDocsReaderPageHeader';
import { TechDocsReaderPageSubheader } from '../TechDocsReaderPageSubheader';

import { TechDocsReaderPageProvider } from './context';

export type TechDocsReaderLayoutProps = {
  hideHeader?: boolean;
  withSearch?: boolean;
};

export const TechDocsReaderLayout = ({
  hideHeader = false,
  withSearch,
}: TechDocsReaderLayoutProps) => (
  <>
    {!hideHeader && <TechDocsReaderPageHeader />}
    <TechDocsReaderPageSubheader />
    <TechDocsReaderPageContent withSearch={withSearch} />
  </>
);

/**
 * @public
 */
export type TechDocsReaderPageProps = {
  entityName?: CompoundEntityRef;
  children?: TechDocsReaderPageRenderFunction | ReactNode;
};

/**
 * An addon-aware implementation of the TechDocsReaderPage.
 * @public
 */
export const TechDocsReaderPage = ({
  entityName: defaultEntityName,
  children = <TechDocsReaderLayout />,
}: TechDocsReaderPageProps) => {
  const { kind, name, namespace } = useParams();

  const entityName = defaultEntityName || { kind, name, namespace };

  return (
    <TechDocsReaderPageProvider entityName={entityName}>
      {({ metadata, entityMetadata }) => (
        <Page themeId="documentation">
          {children instanceof Function
            ? children({
                entityRef: entityName,
                techdocsMetadataValue: metadata.value,
                entityMetadataValue: entityMetadata.value,
              })
            : children}
        </Page>
      )}
    </TechDocsReaderPageProvider>
  );
};
