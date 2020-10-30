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
import Close from '@material-ui/icons/Close';
import LazyLog from 'react-lazylog/build/LazyLog';

type Props = {
  log: string[];
  open?: boolean;
  onClose(): void;
};

export const LogModal: React.FC<Props> = ({ log, open = false, onClose }) => (
  <Dialog open={open} onClose={onClose} fullScreen>
    <DialogTitle id="responsive-dialog-title">
      Logs
      <IconButton onClick={onClose}>
        <Close />
      </IconButton>
    </DialogTitle>
    <DialogContent>
      <div style={{ height: '100%', width: '100%' }}>
        <LazyLog text={log.join('\n')} extraLines={1} follow />
      </div>
    </DialogContent>
  </Dialog>
);

export default LogModal;
