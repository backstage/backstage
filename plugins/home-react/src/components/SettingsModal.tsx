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

import { useTranslationRef } from '@backstage/frontend-plugin-api';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { homeReactTranslationRef } from '../translation';

/** @public */
export const SettingsModal = (props: {
  open: boolean;
  close: Function;
  componentName?: string;
  children: JSX.Element;
}) => {
  const { open, close, componentName, children } = props;
  const { t } = useTranslationRef(homeReactTranslationRef);
  return (
    <Dialog open={open} onClose={() => close()}>
      <DialogTitle>
        {componentName
          ? `${t('settingsModal.title')} - ${componentName}`
          : t('settingsModal.title')}
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={() => close()} color="primary" variant="contained">
          {t('settingsModal.closeButtonTitle')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
