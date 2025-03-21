/*
 * Copyright 2023 The Backstage Authors
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

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Settings';
import { withTheme } from '@rjsf/core';
import { Theme as MuiTheme } from '@rjsf/material-ui';
import validator from '@rjsf/validator-ajv8';
import React from 'react';

import { Widget } from './types';

const Form = withTheme(MuiTheme);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconGrid: {
      height: '100%',
      '& *': {
        padding: 0,
      },
    },
    settingsOverlay: {
      position: 'absolute',
      backgroundColor: 'rgba(40, 40, 40, 0.93)',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      padding: theme.spacing(2),
      color: 'white',
    },
  }),
);
interface WidgetSettingsOverlayProps {
  id: string;
  widget: Widget;
  handleRemove: (id: string) => void;
  handleSettingsSave: (id: string, settings: Record<string, any>) => void;
  settings?: Record<string, any>;
  deletable?: boolean;
}

export const WidgetSettingsOverlay = (props: WidgetSettingsOverlayProps) => {
  const { id, widget, settings, handleRemove, handleSettingsSave, deletable } =
    props;
  const [settingsDialogOpen, setSettingsDialogOpen] = React.useState(false);
  const styles = useStyles();

  const onClose = () => setSettingsDialogOpen(false);

  return (
    <div className={styles.settingsOverlay}>
      {widget.settingsSchema && (
        <Dialog
          open={settingsDialogOpen}
          className="widgetSettingsDialog"
          onClose={onClose}
        >
          <DialogContent>
            <Form
              validator={validator}
              showErrorList={false}
              schema={widget.settingsSchema}
              uiSchema={widget.uiSchema}
              noHtml5Validate
              formData={settings}
              formContext={{ settings }}
              onSubmit={({ formData, errors }) => {
                if (errors.length === 0) {
                  handleSettingsSave(id, formData);
                  setSettingsDialogOpen(false);
                }
              }}
              experimental_defaultFormStateBehavior={{
                allOf: 'populateDefaults',
              }}
            >
              <DialogActions>
                <Button color="primary" variant="contained" type="submit">
                  Submit
                </Button>
                <Button color="secondary" onClick={onClose}>
                  Cancel
                </Button>
              </DialogActions>
            </Form>
          </DialogContent>
        </Dialog>
      )}
      <Grid
        container
        className={styles.iconGrid}
        alignItems="center"
        justifyContent="center"
      >
        {widget.settingsSchema && (
          <Grid item className="overlayGridItem">
            <Tooltip title="Edit settings">
              <IconButton
                color="primary"
                onClick={() => setSettingsDialogOpen(true)}
              >
                <SettingsIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </Grid>
        )}
        {deletable !== false && (
          <Grid item className="overlayGridItem">
            <Tooltip title="Delete widget">
              <IconButton color="secondary" onClick={() => handleRemove(id)}>
                <DeleteIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </Grid>
        )}
      </Grid>
    </div>
  );
};
