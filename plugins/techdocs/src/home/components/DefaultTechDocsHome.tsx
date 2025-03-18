/*
 * Copyright 2021 The Backstage Authors
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
  Content,
  ContentHeader,
  SupportButton,
} from '@backstage/core-components';
import {
  CatalogFilterLayout,
  EntityListProvider,
  EntityOwnerPicker,
  EntityTagPicker,
  UserListPicker,
} from '@backstage/plugin-catalog-react';
import { TechDocsPageWrapper } from './TechDocsPageWrapper';
import { TechDocsPicker } from './TechDocsPicker';
import { EntityListDocsTable } from './Tables';
import { TechDocsIndexPageProps } from './TechDocsIndexPage';

/**
 * Props for {@link DefaultTechDocsHome}
 *
 * @public
 * @deprecated Please use `TechDocsIndexPageProps` instead.
 */
export type DefaultTechDocsHomeProps = TechDocsIndexPageProps;

/**
 * Component which renders a default documentation landing page.
 *
 * @public
 */
export const DefaultTechDocsHome = (props: TechDocsIndexPageProps) => {
  const {
    initialFilter = 'owned',
    columns,
    actions,
    ownerPickerMode,
    pagination,
    options,
    PageWrapper,
    CustomHeader,
  } = props;
  const Wrapper: React.FC<{
    children: React.ReactNode;
  }> = PageWrapper ? PageWrapper : TechDocsPageWrapper;
  const Header: React.FC =
    CustomHeader ||
    (() => (
      <ContentHeader title="">
        <SupportButton>Discover documentation in your ecosystem.</SupportButton>
      </ContentHeader>
    ));
  return (
    <Wrapper>
      <Content>
        <Header />
        <EntityListProvider pagination={pagination}>
          <CatalogFilterLayout>
            <CatalogFilterLayout.Filters>
              <TechDocsPicker />
              <UserListPicker initialFilter={initialFilter} />
              <EntityOwnerPicker mode={ownerPickerMode} />
              <EntityTagPicker />
            </CatalogFilterLayout.Filters>
            <CatalogFilterLayout.Content>
              <EntityListDocsTable
                actions={actions}
                columns={columns}
                options={options}
              />
            </CatalogFilterLayout.Content>
          </CatalogFilterLayout>
        </EntityListProvider>
      </Content>
    </Wrapper>
  );
};
