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

import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import ExtensionIcon from '@material-ui/icons/Extension';
import DescriptionIcon from '@material-ui/icons/Description';
import PublishIcon from '@material-ui/icons/Publish';

import { Link } from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import { FieldExtensionOptions } from '@backstage/plugin-scaffolder-react';

import { registerComponentRouteRef } from '../../routes';
import { ActionPageContent } from '../../components/ActionsPage/ActionsPage';
import { CustomFieldPlaygroud } from './CustomFieldPlaygroud';

const useStyles = makeStyles(
  theme => ({
    grid: {
      color: theme.palette.text.secondary,
      width: 'fit-content',
      marginLeft: 'auto',
      backgroundColor: theme.palette.background.paper,
      '& svg': {
        margin: theme.spacing(1),
      },
    },
    paper: {
      width: '40%',
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.default,
    },
  }),
  { name: 'ScaffolderTemplateEditorToolbar' },
);

export function TemplateEditorToolbar(props: {
  customFieldExtensions?: FieldExtensionOptions<any, any>[];
}) {
  const { customFieldExtensions } = props;
  const classes = useStyles();
  const registerComponentLink = useRouteRef(registerComponentRouteRef);

  const [showFieldsDrawer, setShowFieldsDrawer] = useState(false);
  const [showActionsDrawer, setShowActionsDrawer] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  return (
    <>
      <Grid className={classes.grid} container spacing={0} alignItems="center">
        <Tooltip title="Custom Fields Explorer">
          <IconButton size="small" onClick={() => setShowFieldsDrawer(true)}>
            <ExtensionIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Installed Actions Documentation">
          <IconButton size="small" onClick={() => setShowActionsDrawer(true)}>
            <DescriptionIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add to catalog">
          <IconButton size="small" onClick={() => setShowPublishModal(true)}>
            <PublishIcon />
          </IconButton>
        </Tooltip>
      </Grid>
      <Drawer
        classes={{ paper: classes.paper }}
        anchor="right"
        open={showFieldsDrawer}
        onClose={() => setShowFieldsDrawer(false)}
      >
        <CustomFieldPlaygroud extensions={customFieldExtensions} />
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
          Add template to Catalog
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="publish-dialog-slide-description">
            Follow the instructions to add your template to the catalog:
            <ol>
              <li>Make sure you saved the file;</li>
              <li>Push the template to a git repository;</li>
              <li>
                Register the template <code>catalog-info.yaml</code> file
                {registerComponentLink ? (
                  <>
                    {' '}
                    <Link to={registerComponentLink()}>here</Link>
                  </>
                ) : null}
                .
              </li>
            </ol>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
}
