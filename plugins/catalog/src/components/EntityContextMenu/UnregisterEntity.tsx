/*
 * Copyright 2020 The Backstage Authors
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

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import { catalogTranslationRef } from '../../alpha/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { forwardRef } from 'react';

type VisibleType = 'visible' | 'hidden' | 'disable';

export type UnregisterEntityOptions = {
  disableUnregister: boolean | VisibleType;
};

interface UnregisterEntityProps {
  unregisterEntityOptions?: UnregisterEntityOptions;
  isUnregisterAllowed: boolean;
  onUnregisterEntity: () => void;
  onClose: () => void;
}

export const UnregisterEntity = forwardRef<
  HTMLLIElement,
  UnregisterEntityProps
>((props, ref) => {
  const {
    unregisterEntityOptions,
    isUnregisterAllowed,
    onUnregisterEntity,
    onClose,
  } = props;
  const { t } = useTranslationRef(catalogTranslationRef);

  const isBoolean =
    typeof unregisterEntityOptions?.disableUnregister === 'boolean';

  const isDisabled =
    (!isUnregisterAllowed ||
      (isBoolean
        ? !!unregisterEntityOptions?.disableUnregister
        : unregisterEntityOptions?.disableUnregister === 'disable')) ??
    false;

  if (unregisterEntityOptions?.disableUnregister !== 'hidden') {
    return (
      <MenuItem
        ref={ref}
        onClick={() => {
          onClose();
          onUnregisterEntity();
        }}
        disabled={isDisabled}
        {...props}
      >
        <ListItemIcon>
          <CancelIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={t('entityContextMenu.unregisterMenuTitle')} />
      </MenuItem>
    );
  }

  return undefined;
});
