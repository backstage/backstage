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
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { homeTranslationRef } from '../../translation';

interface CancelConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const CancelConfirmDialog = ({
  open,
  onClose,
  onConfirm,
}: CancelConfirmDialogProps) => {
  const { t } = useTranslationRef(homeTranslationRef);
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('cancelConfirmDialog.dialogHeaderTitle')}?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('cancelConfirmDialog.dialogContentText')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t('cancelConfirmDialog.cancelButtonTitle')}
        </Button>
        <Button onClick={onConfirm} color="secondary" variant="contained">
          {t('cancelConfirmDialog.discardButtonTitle')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
