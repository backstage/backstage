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

import { Page, Header, HelpIcon } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/frontend-plugin-api';

import React, { useState } from 'react';
import { scaffolderTranslationRef } from '../../translation';
import Drawer from '@material-ui/core/Drawer';
import { WebFileSystemAccess } from '../../lib/filesystem';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActionArea from '@material-ui/core/CardActionArea';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { TemplateEditor } from '../../next/TemplateEditorPage/TemplateEditor';
import {
  FieldExtensionOptions,
  FormProps,
  LayoutOptions,
} from '@backstage/plugin-scaffolder-react';
import useAsync from 'react-use/esm/useAsync';

const useStyles = makeStyles(theme => ({
  introText: {
    textAlign: 'center',
    marginTop: theme.spacing(2),
  },
  card: {
    position: 'relative',
    maxWidth: 340,
    marginTop: theme.spacing(4),
    margin: theme.spacing(0, 2),
  },
  infoIcon: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
}));

interface EditTemplateProps {
  layouts?: LayoutOptions[];
  formProps?: FormProps;
  customFieldExtensions?: FieldExtensionOptions<any, any>[];
}

export function EditTemplate(props: EditTemplateProps) {
  const classes = useStyles();
  const [showDrawer, setShowDrawer] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const supportsLoad = WebFileSystemAccess.isSupported();

  const {
    value: directory,
    loading,
    error,
  } = useAsync(async () => {
    console.log('requesting directory access');
    const dir = await WebFileSystemAccess.requestDirectoryAccess();
    return dir;
  }, []);

  if (!supportsLoad) {
    return (
      <h1>Template browsing APIs are only available in the Chrome browser</h1>
    );
  }

  const cardLoadLocal = (
    <Card className={classes.card} elevation={4}>
      <CardActionArea disabled={!supportsLoad}>
        <CardContent>
          <Typography
            variant="h4"
            component="h3"
            gutterBottom
            color={supportsLoad ? undefined : 'textSecondary'}
            style={{ display: 'flex', flexFlow: 'row nowrap' }}
          >
            {t('templateEditorPage.templateEditorIntro.loadLocal.title')}
          </Typography>
          <Typography
            variant="body1"
            color={supportsLoad ? undefined : 'textSecondary'}
          >
            {t('templateEditorPage.templateEditorIntro.loadLocal.description')}
          </Typography>
        </CardContent>
      </CardActionArea>
      {!supportsLoad && (
        <div className={classes.infoIcon}>
          <Tooltip
            placement="top"
            title={t(
              'templateEditorPage.templateEditorIntro.loadLocal.unsupportedTooltip',
            )}
          >
            <InfoOutlinedIcon />
          </Tooltip>
        </div>
      )}
    </Card>
  );

  const cardCreateTemplate = (
    <Card className={classes.card} elevation={4}>
      <CardActionArea disabled={!supportsLoad}>
        <CardContent>
          <Typography
            variant="h4"
            component="h3"
            gutterBottom
            color={supportsLoad ? undefined : 'textSecondary'}
            style={{ display: 'flex', flexFlow: 'row nowrap' }}
          >
            {t('templateEditorPage.templateEditorIntro.createTemplate.title')}
          </Typography>
          <Typography
            variant="body1"
            color={supportsLoad ? undefined : 'textSecondary'}
          >
            {t(
              'templateEditorPage.templateEditorIntro.createTemplate.description',
            )}
          </Typography>
        </CardContent>
      </CardActionArea>
      {!supportsLoad && (
        <div className={classes.infoIcon}>
          <Tooltip
            placement="top"
            title={t(
              'templateEditorPage.templateEditorIntro.createTemplate.unsupportedTooltip',
            )}
          >
            <InfoOutlinedIcon />
          </Tooltip>
        </div>
      )}
    </Card>
  );

  return (
    <Page themeId="home">
      <Header
        title="Template Editor"
        type="Scaffolder"
        subtitle={t('templateEditorPage.subtitle')}
      >
        <Button
          onClick={() => setShowDrawer(true)}
          data-testid="support-button"
          aria-label="Support"
        >
          Support
          <HelpIcon />
        </Button>
      </Header>

      <Drawer
        anchor="right"
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
      >
        <h1>HELLO</h1>
      </Drawer>

      {cardCreateTemplate}
      {cardLoadLocal}
      {directory && (
        <TemplateEditor
          directory={directory}
          fieldExtensions={props.customFieldExtensions}
          onClose={() => setShowEditor(false)}
          layouts={props.layouts}
          formProps={props.formProps}
        />
      )}
    </Page>
  );
}
