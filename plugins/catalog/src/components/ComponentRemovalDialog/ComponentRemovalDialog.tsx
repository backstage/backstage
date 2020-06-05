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
import React, { FC } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { Component } from '../../data/component';
import { useAsync } from 'react-use';
import { useApi, Progress } from '@backstage/core';
import { catalogApiRef } from '../../api/types';

type ComponentRemovalDialogProps = {
  onConfirm: () => any;
  onCancel: () => any;
  onClose: () => any;
  component: Component;
};
const ComponentRemovalDialog: FC<ComponentRemovalDialogProps> = ({
  onConfirm,
  onCancel,
  onClose,
  component,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Dialog fullScreen={fullScreen} open onClose={onClose}>
      <DialogTitle id="responsive-dialog-title">
        Are you sure you want to unregister this component?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          This action will unregister {component.name}. To undo, just
          re-register the component in Backstage.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary">
          Unregister
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ComponentRemovalDialog;
