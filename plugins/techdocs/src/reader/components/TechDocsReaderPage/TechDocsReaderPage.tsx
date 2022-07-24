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

import React, { Children } from 'react';
import { useOutlet } from 'react-router-dom';

import { Page } from '@backstage/core-components';
import {
  isTechDocsAddonExtension,
  TechDocsReaderPageRendererProps,
} from '@backstage/plugin-techdocs-react';
import { MkDocsReaderPage } from '@backstage/plugin-techdocs-mkdocs-react';

import { TechDocsReaderPageLayout } from '../TechDocsReaderPageLayout';

/**
 * Props for {@link TechDocsReaderPage}.
 * @public
 */
export type TechDocsReaderPageProps = Partial<TechDocsReaderPageRendererProps>;

/**
 * An addon-aware implementation of the TechDocsReaderPage.
 * props - see {@link TechDocsReaderPageProps}.
 * @public
 */
export const TechDocsReaderPage = ({
  entityRef,
  children,
}: TechDocsReaderPageProps) => {
  const outlet = useOutlet();

  if (!children) {
    const childrenList = outlet ? Children.toArray(outlet.props.children) : [];

    const defaultPage = (
      <TechDocsReaderPage entityRef={entityRef}>
        <TechDocsReaderPageLayout />
      </TechDocsReaderPage>
    );

    const page = childrenList.find(child => !isTechDocsAddonExtension(child));

    return (
      <div className="techdocs-reader-page">
        <Page themeId="documentation">{page || defaultPage}</Page>
      </div>
    );
  }

  // mkdocs is the default renderer
  return <MkDocsReaderPage entityRef={entityRef}>{children}</MkDocsReaderPage>;
};
