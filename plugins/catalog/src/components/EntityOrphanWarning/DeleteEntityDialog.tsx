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

import { Entity } from '@backstage/catalog-model';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { useState } from 'react';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import { assertError } from '@backstage/errors';
import { catalogTranslationRef } from '../../alpha/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { Button, Dialog, DialogFooter, DialogHeader } from '@backstage/ui';

interface DeleteEntityDialogProps {
  open: boolean;
  onClose: () => any;
  onConfirm: () => any;
  entity: Entity;
}

export function DeleteEntityDialog(props: DeleteEntityDialogProps) {
  const { open, onClose, onConfirm, entity } = props;
  const [busy, setBusy] = useState(false);
  const catalogApi = useApi(catalogApiRef);
  const alertApi = useApi(alertApiRef);
  const { t } = useTranslationRef(catalogTranslationRef);

  const onDelete = async () => {
    setBusy(true);
    try {
      const uid = entity.metadata.uid;
      await catalogApi.removeEntityByUid(uid!);
      onConfirm();
    } catch (err) {
      assertError(err);
      alertApi.post({ message: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog isOpen={open} onOpenChange={isOpen => !isOpen && onClose()}>
      <DialogHeader>{t('deleteEntity.dialogTitle')}</DialogHeader>
      <DialogFooter>
        <Button variant="secondary" onPress={onClose}>
          {t('deleteEntity.cancelButtonTitle')}
        </Button>
        <Button variant="primary" destructive loading={busy} onPress={onDelete}>
          {t('deleteEntity.deleteButtonTitle')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
