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

import { Button, Dialog, DialogHeader, DialogFooter } from '@backstage/ui';
import { useState } from 'react';

interface DeleteEntityConfirmationProps {
  open: boolean;
  onClose: () => void | Promise<void>;
  onConfirm: () => void | Promise<void>;
}

export function DeleteEntityConfirmationDialog(
  props: DeleteEntityConfirmationProps,
) {
  const { open, onClose, onConfirm } = props;
  const [busy, setBusy] = useState(false);
  const onDelete = async () => {
    setBusy(true);
    try {
      await onConfirm();
    } catch {
      // ignored
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      isOpen={open}
      onOpenChange={isOpen => {
        if (!isOpen && !busy) {
          onClose();
        }
      }}
    >
      <DialogHeader>Are you sure you want to delete this entity?</DialogHeader>
      <DialogFooter>
        <Button
          variant="primary"
          destructive
          isDisabled={busy}
          onPress={onDelete}
        >
          Delete
        </Button>
        <Button variant="secondary" isDisabled={busy} onPress={onClose}>
          Cancel
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
