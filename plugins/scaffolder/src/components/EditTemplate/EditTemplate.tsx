/*
 * Copyright 2024 The Backstage Authors
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

import React, { useCallback, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {
  Page,
  Header,
  HelpIcon,
  Content,
  ContentHeader,
  TableColumn,
  Link,
} from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import {
  FieldExtensionOptions,
  FormProps,
  LayoutOptions,
} from '@backstage/plugin-scaffolder-react';
import { CatalogTable, CatalogTableRow } from '@backstage/plugin-catalog';
import {
  EntityKindPicker,
  EntityLifecyclePicker,
  EntityListProvider,
  EntityOwnerPicker,
  EntityTagPicker,
  EntityTypePicker,
  UserListPicker,
  CatalogFilterLayout,
} from '@backstage/plugin-catalog-react';

import { actionsRouteRef } from '../../routes';
import { scaffolderTranslationRef } from '../../translation';
import {
  createExampleTemplate,
  TemplateDirectoryAccess,
  WebFileSystemAccess,
} from '../../lib/filesystem';
import { TemplateEditor } from '../../next/TemplateEditorPage/TemplateEditor';

const defaultColumns: TableColumn<CatalogTableRow>[] = [
  CatalogTable.columns.createTitleColumn({ hidden: true }),
  CatalogTable.columns.createNameColumn({ defaultKind: 'Template' }),
  CatalogTable.columns.createOwnerColumn(),
  CatalogTable.columns.createSpecTypeColumn(),
  CatalogTable.columns.createMetadataDescriptionColumn(),
  CatalogTable.columns.createTagsColumn(),
];

const useStyles = makeStyles(
  theme => ({
    contentHeader: {
      display: 'grid',
      gridAutoFlow: 'column',
      gridGap: theme.spacing(2),
      justifyContent: 'end',
    },
    drawerPaper: {
      width: 400,
      padding: theme.spacing(3),
    },
  }),
  { name: 'ScaffolderEditTemplate' },
);

type Selection =
  | {
      type: 'load-directory';
      directory: TemplateDirectoryAccess;
    }
  | {
      type: 'create-template';
      directory: TemplateDirectoryAccess;
    };

interface EditTemplateProps {
  layouts?: LayoutOptions[];
  formProps?: FormProps;
  customFieldExtensions?: FieldExtensionOptions<any, any>[];
}

export function EditTemplate(props: EditTemplateProps) {
  const classes = useStyles();
  const actionsLink = useRouteRef(actionsRouteRef);
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const [selection, setSelection] = useState<Selection>();
  const [showDrawer, setShowDrawer] = useState(false);

  const handleLoadDirectory = useCallback(() => {
    WebFileSystemAccess.requestDirectoryAccess()
      .then(directory =>
        setSelection({
          type: 'load-directory',
          directory,
        }),
      )
      .catch(() => {});
  }, []);

  const handleCreateTemplate = useCallback(() => {
    WebFileSystemAccess.requestDirectoryAccess().then(directory =>
      createExampleTemplate(directory)
        .then(() => {
          // TODO: Fix this race. It is what it is.
          setTimeout(() => {
            setSelection({
              type: 'create-template',
              directory,
            });
          }, 1);
        })
        .catch(() => {}),
    );
  }, []);

  const supportsLoad = WebFileSystemAccess.isSupported();

  if (selection) {
    return (
      <Page themeId="home">
        <Header
          title="Manage Templates"
          type="Create Components"
          subtitle={t('templateEditorPage.subtitle')}
        />
        <Content>
          <TemplateEditor
            directory={selection.directory}
            layouts={props.layouts}
            formProps={props.formProps}
            fieldExtensions={props.customFieldExtensions}
            customFieldExtensions={props.customFieldExtensions}
            onClose={() => setSelection(undefined)}
          />
        </Content>
      </Page>
    );
  }
  return (
    <Page themeId="home">
      <Header
        title="Manage Templates"
        type="Create Components"
        subtitle={t('templateEditorPage.subtitle')}
      />
      <Content>
        <ContentHeader>
          <Grid container spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                disabled={!supportsLoad}
                onClick={handleLoadDirectory}
              >
                {t('templateEditorPage.templateEditorIntro.loadLocal.title')}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                disabled={!supportsLoad}
                onClick={handleCreateTemplate}
              >
                {t(
                  'templateEditorPage.templateEditorIntro.createTemplate.title',
                )}
              </Button>
            </Grid>
          </Grid>
          <Button
            onClick={() => setShowDrawer(true)}
            data-testid="support-button"
            aria-label="Support"
          >
            Support
            <HelpIcon />
          </Button>
          <Drawer
            classes={{ paper: classes.drawerPaper }}
            anchor="right"
            open={showDrawer}
            onClose={() => setShowDrawer(false)}
          >
            <h1>Support</h1>
            <Typography gutterBottom>
              For seeing a complete list of installed actions, please visit this{' '}
              <Link to={actionsLink()}>page</Link>.
            </Typography>
          </Drawer>
        </ContentHeader>
        <EntityListProvider>
          <CatalogFilterLayout>
            <CatalogFilterLayout.Filters>
              <EntityKindPicker initialFilter="Template" hidden />
              <EntityTypePicker />
              <UserListPicker initialFilter="all" />
              <EntityOwnerPicker />
              <EntityLifecyclePicker />
              <EntityTagPicker />
            </CatalogFilterLayout.Filters>
            <CatalogFilterLayout.Content>
              <CatalogTable columns={defaultColumns} />
            </CatalogFilterLayout.Content>
          </CatalogFilterLayout>
        </EntityListProvider>
      </Content>
    </Page>
  );
}
