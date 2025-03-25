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

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useState } from 'react';
import { assertError } from '@backstage/errors';

interface DeleteEntityConfirmationProps {
  open: boolean;
  onClose: () => any;
  onConfirm: () => any;
}

export function DeleteEntityConfirmationDialog(
  props: DeleteEntityConfirmationProps,
) {
  const { open, onClose, onConfirm } = props;
  const [busy, setBusy] = useState(false);
  const onDelete = async () => {
    setBusy(true);
    try {
      onConfirm();
    } catch (err) {
      assertError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="responsive-dialog-title">
        Are you sure you want to delete this entity?
      </DialogTitle>
      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          disabled={busy}
          onClick={onDelete}
        >
          Delete
        </Button>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
