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

import React, { ReactNode, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import ExtensionIcon from '@material-ui/icons/Extension';
import DescriptionIcon from '@material-ui/icons/Description';

import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { FieldExtensionOptions } from '@backstage/plugin-scaffolder-react';

import { ActionPageContent } from '../../../components/ActionsPage/ActionsPage';
import { scaffolderTranslationRef } from '../../../translation';
import { CustomFieldPlaygroud } from './CustomFieldPlaygroud';

const useStyles = makeStyles(
  theme => ({
    paper: {
      width: '90%',
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.default,
      [theme.breakpoints.up('sm')]: {
        width: '70%',
      },
      [theme.breakpoints.up('md')]: {
        width: '50%',
      },
    },
    appbar: {
      zIndex: 1,
    },
    toolbar: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gridGap: theme.spacing(1),
      padding: theme.spacing(0, 1),
      backgroundColor: theme.palette.background.paper,
    },
    toolbarCustomActions: {
      display: 'grid',
      alignItems: 'center',
      gridAutoFlow: 'Column',
      gridGap: theme.spacing(1),
    },
    toolbarDefaultActions: {
      justifySelf: 'end',
    },
  }),
  { name: 'ScaffolderTemplateEditorToolbar' },
);

export function TemplateEditorToolbar(props: {
  children?: ReactNode;
  fieldExtensions?: FieldExtensionOptions<any, any>[];
}) {
  const { children, fieldExtensions } = props;
  const classes = useStyles();
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const [showFieldsDrawer, setShowFieldsDrawer] = useState(false);
  const [showActionsDrawer, setShowActionsDrawer] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  return (
    <AppBar className={classes.appbar} position="relative">
      <Toolbar className={classes.toolbar}>
        <div className={classes.toolbarCustomActions}>{children}</div>
        <ButtonGroup className={classes.toolbarDefaultActions} variant="text">
          <Tooltip
            title={t('templateEditorToolbar.customFieldExplorerTooltip')}
          >
            <Button onClick={() => setShowFieldsDrawer(true)}>
              <ExtensionIcon />
            </Button>
          </Tooltip>
          <Tooltip
            title={t(
              'templateEditorToolbar.installedActionsDocumentationTooltip',
            )}
          >
            <Button onClick={() => setShowActionsDrawer(true)}>
              <DescriptionIcon />
            </Button>
          </Tooltip>
          <Button onClick={() => setShowPublishModal(true)}>
            {t('templateEditorToolbar.addToCatalogButton')}
          </Button>
        </ButtonGroup>
        <Drawer
          classes={{ paper: classes.paper }}
          anchor="right"
          open={showFieldsDrawer}
          onClose={() => setShowFieldsDrawer(false)}
        >
          <CustomFieldPlaygroud fieldExtensions={fieldExtensions} />
        </Drawer>
        <Drawer
          classes={{ paper: classes.paper }}
          anchor="right"
          open={showActionsDrawer}
          onClose={() => setShowActionsDrawer(false)}
        >
          <ActionPageContent />
        </Drawer>
        <Dialog
          onClose={() => setShowPublishModal(false)}
          open={showPublishModal}
          aria-labelledby="publish-dialog-title"
          aria-describedby="publish-dialog-description"
        >
          <DialogTitle id="publish-dialog-title">
            {t('templateEditorToolbar.addToCatalogDialogTitle')}
          </DialogTitle>
          <DialogContent dividers>
            <DialogContentText id="publish-dialog-slide-description">
              {t(
                'templateEditorToolbar.addToCatalogDialogContent.stepsIntroduction',
              )}
              <ul>
                {t(
                  'templateEditorToolbar.addToCatalogDialogContent.stepsListItems',
                )
                  .split('\n')
                  .map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
              </ul>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              href={t(
                'templateEditorToolbar.addToCatalogDialogActions.documentationUrl',
              )}
              target="_blank"
            >
              {t(
                'templateEditorToolbar.addToCatalogDialogActions.documentationButton',
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
}
