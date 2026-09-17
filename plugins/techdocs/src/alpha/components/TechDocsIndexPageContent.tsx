/*
 * Copyright 2026 The Backstage Authors
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

import { Container } from '@backstage/ui';
import {
  CatalogFilterLayout,
  EntityListProvider,
  EntityOwnerPicker,
  EntityTagPicker,
  UserListPicker,
} from '@backstage/plugin-catalog-react';
import { TechDocsPicker } from '../../home/components/TechDocsPicker';
import { EntityListDocsTable } from '../../home/components/Tables';
import type { TechDocsIndexPageProps } from '../../home/components/TechDocsIndexPage';

export const TechDocsIndexPageContent = (props: TechDocsIndexPageProps) => {
  const {
    initialFilter = 'owned',
    columns,
    actions,
    ownerPickerMode,
    pagination,
    options,
  } = props;

  return (
    <Container mt="6">
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
    </Container>
  );
};
