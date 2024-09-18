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

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { ContentHeader, TableColumn } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { CatalogTable, CatalogTableRow } from '@backstage/plugin-catalog';
import {
  EntityKindPicker,
  EntityListProvider,
  EntityOwnerPicker,
  EntityTagPicker,
  EntityTypePicker,
  UserListPicker,
  CatalogFilterLayout,
} from '@backstage/plugin-catalog-react';

import { scaffolderTranslationRef } from '../../translation';
import { WebFileSystemAccess } from '../../lib/filesystem';

const defaultColumns: TableColumn<CatalogTableRow>[] = [
  CatalogTable.columns.createTitleColumn({ hidden: true }),
  CatalogTable.columns.createNameColumn({ defaultKind: 'Template' }),
  CatalogTable.columns.createOwnerColumn(),
  CatalogTable.columns.createSpecTypeColumn(),
  CatalogTable.columns.createMetadataDescriptionColumn(),
  CatalogTable.columns.createTagsColumn(),
];

interface EditorIntroProps {
  style?: JSX.IntrinsicElements['div']['style'];
  onSelect?: (
    option: 'local' | 'form' | 'field-explorer' | 'create-template',
  ) => void;
}

export function TemplateEditorIntro(props: EditorIntroProps) {
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const supportsLoad = WebFileSystemAccess.isSupported();

  return (
    <div style={props.style}>
      <ContentHeader>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              disabled={!supportsLoad}
              onClick={() => props.onSelect?.('local')}
            >
              {t('templateEditorPage.templateEditorIntro.loadLocal.title')}
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              disabled={!supportsLoad}
              onClick={() => props.onSelect?.('create-template')}
            >
              {t('templateEditorPage.templateEditorIntro.createTemplate.title')}
            </Button>
          </Grid>
        </Grid>
      </ContentHeader>
      <EntityListProvider>
        <CatalogFilterLayout>
          <CatalogFilterLayout.Filters>
            <EntityKindPicker initialFilter="Template" hidden />
            <EntityTypePicker />
            <UserListPicker initialFilter="all" />
            <EntityOwnerPicker />
            <EntityTagPicker />
          </CatalogFilterLayout.Filters>
          <CatalogFilterLayout.Content>
            <CatalogTable columns={defaultColumns} />
          </CatalogFilterLayout.Content>
        </CatalogFilterLayout>
      </EntityListProvider>
    </div>
  );
}
