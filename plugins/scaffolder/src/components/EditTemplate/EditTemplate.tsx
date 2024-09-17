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
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';

import {
  Page,
  Header,
  HelpIcon,
  Content,
  ContentHeader,
  Link,
} from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import {
  FieldExtensionOptions,
  FormProps,
  LayoutOptions,
} from '@backstage/plugin-scaffolder-react';

import {
  createExampleTemplate,
  TemplateDirectoryAccess,
  WebFileSystemAccess,
} from '../../lib/filesystem';
import { scaffolderTranslationRef } from '../../translation';
import { ListTaskPageContent } from '../ListTasksPage/ListTasksPage';
import { TemplateEditor } from '../../next/TemplateEditorPage/TemplateEditor';
import { actionsRouteRef } from '../../routes';

const useStyles = makeStyles(
  theme => ({
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
          <ButtonGroup
            variant="contained"
            color="primary"
            aria-label="Load or create a template"
          >
            <Button disabled={!supportsLoad} onClick={handleLoadDirectory}>
              {t('templateEditorPage.templateEditorIntro.loadLocal.title')}
            </Button>
            <Button disabled={!supportsLoad} onClick={handleCreateTemplate}>
              {t('templateEditorPage.templateEditorIntro.createTemplate.title')}
            </Button>
          </ButtonGroup>
          <Button
            onClick={() => setShowDrawer(true)}
            data-testid="support-button"
            aria-label="Support"
          >
            Support
            <HelpIcon />
          </Button>
        </ContentHeader>
        <ListTaskPageContent />
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
      </Content>
    </Page>
  );
}
