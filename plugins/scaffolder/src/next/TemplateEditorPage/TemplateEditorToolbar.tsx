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
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import ExtensionIcon from '@material-ui/icons/Extension';
import DescriptionIcon from '@material-ui/icons/Description';

import { Link } from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import { FieldExtensionOptions } from '@backstage/plugin-scaffolder-react';

import { registerComponentRouteRef } from '../../routes';
import { ActionPageContent } from '../../components/ActionsPage/ActionsPage';
import { CustomFieldPlaygroud } from './CustomFieldPlaygroud';

const useStyles = makeStyles(
  theme => ({
    paper: {
      width: '40%',
      padding: theme.spacing(2),
      backgroundColor: theme.palette.background.default,
    },
    appbar: {
      zIndex: 'unset',
    },
    toolbar: {
      zIndex: 'auto',
      display: 'grid',
      justifyContent: 'flex-end',
      gridTemplateColumns: '1fr auto auto auto',
      padding: theme.spacing(0, 1.5),
      backgroundColor: theme.palette.background.paper,
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
    <AppBar className={classes.appbar} position="relative">
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6" color="textSecondary">
          Template Editor
        </Typography>
        <ButtonGroup variant="outlined" color="primary">
          <Tooltip title="Custom Fields Explorer">
            <Button size="small" onClick={() => setShowFieldsDrawer(true)}>
              <ExtensionIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Installed Actions Documentation">
            <Button size="small" onClick={() => setShowActionsDrawer(true)}>
              <DescriptionIcon />
            </Button>
          </Tooltip>
          <Button onClick={() => setShowPublishModal(true)}>Publish</Button>
        </ButtonGroup>
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
          <DialogContent dividers>
            <DialogContentText id="publish-dialog-slide-description">
              Follow the instructions below to add templates as software catalog
              components:
              <ol>
                <li>Save the template files in a local git directory</li>
                <li>
                  Commit and push the template files to its remote repository
                </li>
                <li>
                  Register each template as a component in the software catalog
                  by entering the template remote <em>catalog-info.yaml</em>{' '}
                  file url in the{' '}
                  {registerComponentLink ? (
                    <Link to={registerComponentLink()}>
                      registering existing component
                    </Link>
                  ) : (
                    'registering existing component'
                  )}{' '}
                  page
                </li>
                <li>
                  As soon as the newly registered components are processed, they
                  appear in the templates list page, it may take a few minutes
                </li>
              </ol>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={() => setShowPublishModal(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
}
