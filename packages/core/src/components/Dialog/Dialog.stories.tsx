/*
 * Copyright 2021 Spotify AB
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

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import React, { useState } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    leftAlignButtonsDialog: {
      justifyContent: 'flex-start',
      paddingLeft: 24,
    },
    contentBoxExample: {
      height: 200,
      width: 500,
      backgroundColor: '#E1E1E1',
    },
  }),
);

export default {
  title: 'Layout/Dialog',
  component: Dialog,
};

export const Default = () => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <Button color="primary" variant="contained" onClick={openDialog}>
        Open dialog
      </Button>
      <Dialog
        open={open}
        onClose={closeDialog}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">Dialog Box Title</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-content">
            <div className={classes.contentBoxExample} />
          </DialogContentText>
        </DialogContent>
        <DialogActions classes={{ root: classes.leftAlignButtonsDialog }}>
          <Button color="primary" variant="contained" onClick={closeDialog}>
            Primary action
          </Button>
          <Button color="primary" variant="outlined" onClick={closeDialog}>
            Secondary action
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
