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
import React, { useState } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import DescriptionIcon from '@material-ui/icons/Description';

import { UnprocessedEntity } from './../types';
import { CodeSnippet } from '@backstage/core-components';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    entity: {
      overflow: 'scroll',
      width: '100%',
    },
    codeBox: {
      border: '1px solid black',
      padding: '1em',
    },
  }),
);

export const EntityDialog = ({ entity }: { entity: UnprocessedEntity }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const dialogContent = () => {
    return (
      <CodeSnippet
        language="json"
        showLineNumbers
        text={JSON.stringify(entity, null, 4)}
      />
    );
  };

  return (
    <>
      <IconButton color="primary" onClick={openDialog}>
        <DescriptionIcon />
      </IconButton>
      <Dialog fullWidth open={open} onClose={closeDialog}>
        <DialogTitle id="dialog-title">
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={closeDialog}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>{dialogContent()}</DialogContent>
      </Dialog>
    </>
  );
};
