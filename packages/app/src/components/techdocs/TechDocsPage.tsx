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

import React from 'react';
import {
  TechDocsEntityPage,
  TechDocsReaderPageLayout,
  TechDocsReaderPageLayoutProps,
} from '@backstage/plugin-techdocs';
import {
  MkDocsReaderPage as TechDocsReaderPage,
  MkDocsReaderPageProps as TechDocsReaderPageProps,
} from '@backstage/plugin-techdocs-mkdocs-react';

type TechDocsPageProps = Partial<Pick<TechDocsReaderPageProps, 'entityRef'>> &
  Omit<TechDocsReaderPageLayoutProps, 'children'>;

const TechDocsPage = ({ entityRef, ...rest }: TechDocsPageProps) => (
  <TechDocsReaderPage entityRef={entityRef}>
    {({ content }) => (
      <TechDocsReaderPageLayout {...rest}>{content}</TechDocsReaderPageLayout>
    )}
  </TechDocsReaderPage>
);

export const techDocsPage = <TechDocsPage />;

const EntityDocsPage = () => (
  <TechDocsEntityPage>
    {({ entityRef }) => (
      <TechDocsPage
        entityRef={entityRef}
        withHeader={false}
        withSearch={false}
      />
    )}
  </TechDocsEntityPage>
);

export const entityDocsPage = <EntityDocsPage />;
