/*
 * Copyright 2021 The Backstage Authors
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
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import {
  CustomDialogTitle,
  DialogActions,
  DialogContent,
} from '../CustomDialogTitle';

type Props = {
  open: boolean;
  handleClose: () => void;
  message: (string | JSX.Element)[];
  type: 'delete' | 'unlink';
  handleSubmit: () => void;
};

export const ConfirmationDialog = ({
  open,
  handleClose,
  message,
  type,
  handleSubmit,
}: Props) => {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <CustomDialogTitle id="customized-dialog-title" onClose={handleClose}>
        {type.charAt(0).toLocaleUpperCase('en-US') + type.slice(1)} project
      </CustomDialogTitle>

      <DialogContent dividers>{message}</DialogContent>

      <DialogActions>
        <Button onClick={handleSubmit} color="primary" type="submit">
          {type}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
