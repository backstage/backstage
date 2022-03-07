/*
 * Copyright 2020 The Backstage Authors
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

import React, { FC, ReactNode } from 'react';
import { useOutlet } from 'react-router';

import { Page, Content } from '@backstage/core-components';
import { CompoundEntityRef } from '@backstage/catalog-model';
import { techDocsPage } from '@backstage/plugin-techdocs-mkdocs';

import { TechDocsEntityMetadata, TechDocsMetadata } from '../../../types';
import { TechDocsReaderPageHeader } from '../TechDocsReaderPageHeader';
import { Reader } from '../Reader';
import { TechDocsReaderPageProvider } from './context';

/**
 * Helper function that gives the children of {@link TechDocsReaderPage} access to techdocs and entity metadata
 *
 * @public
 */
export type TechDocsReaderPageRenderFunction = (params: {
  onReady: () => void;
  entityRef: CompoundEntityRef;
  entityMetadataValue?: TechDocsEntityMetadata | undefined;
  techdocsMetadataValue?: TechDocsMetadata | undefined;
}) => JSX.Element;

/**
 * Props for {@link TechDocsReaderPage}
 *
 * @public
 */
export type TechDocsReaderPageProps = {
  children?: TechDocsReaderPageRenderFunction | ReactNode;
};

export const TechDocsReaderPage = ({ children }: TechDocsReaderPageProps) => {
  const outlet = useOutlet();

  if (!children) {
    return outlet || techDocsPage;
  }

  return (
    <Page themeId="documentation">
      <TechDocsReaderPageProvider>{children}</TechDocsReaderPageProvider>
    </Page>
  );
};

/**
 * Render a children in a TechDocs reader page.
 * @public
 */
export const TechDocsReaderPageLayout: FC = ({ children }) => (
  <TechDocsReaderPage>
    {({ onReady, entityRef, entityMetadataValue, techdocsMetadataValue }) => (
      <>
        <TechDocsReaderPageHeader
          entityRef={entityRef}
          entityMetadata={entityMetadataValue}
          techDocsMetadata={techdocsMetadataValue}
        />
        <Content data-testid="techdocs-content">
          <Reader onReady={onReady} entityRef={entityRef}>
            {children}
          </Reader>
        </Content>
      </>
    )}
  </TechDocsReaderPage>
);
