/*
 * Copyright 2020 Spotify AB
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
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Close from '@material-ui/icons/Close';
import LazyLog from 'react-lazylog/build/LazyLog';

type Props = {
  log: string[];
  open?: boolean;
  onClose(): void;
};

const useStyles = makeStyles(theme => ({
  header: {
    width: '100%',
    padding: theme.spacing(1, 4),
  },
  closeIcon: {
    float: 'right',
    padding: theme.spacing(0.5, 0),
  },
  logs: {
    boxShadow: '-3px -1px 7px 0px rgba(50, 50, 50, 0.59)',
    height: '100%',
    width: '100%',
  },
}));

export const LogModal = ({ log, open = false, onClose }: Props) => {
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle id="responsive-dialog-title" className={classes.header}>
        Logs
        <IconButton onClick={onClose} className={classes.closeIcon}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div className={classes.logs}>
          <LazyLog text={log.join('\n')} extraLines={1} follow />
        </div>
      </DialogContent>
    </Dialog>
  );
};
