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

import React from 'react';
import { ListItemIcon, ListItemText, MenuItem } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';

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

export function UnregisterEntity(props: UnregisterEntityProps) {
  const {
    unregisterEntityOptions,
    isUnregisterAllowed,
    onUnregisterEntity,
    onClose,
  } = props;

  const isBoolean =
    typeof unregisterEntityOptions?.disableUnregister === 'boolean';

  const isDisabled =
    (!isUnregisterAllowed ||
      (isBoolean
        ? !!unregisterEntityOptions?.disableUnregister
        : unregisterEntityOptions?.disableUnregister === 'disable')) ??
    false;

  let unregisterButton = <></>;

  if (unregisterEntityOptions?.disableUnregister !== 'hidden') {
    unregisterButton = (
      <MenuItem
        onClick={() => {
          onClose();
          onUnregisterEntity();
        }}
        disabled={isDisabled}
      >
        <ListItemIcon>
          <CancelIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Unregister entity" />
      </MenuItem>
    );
  }

  return <>{unregisterButton}</>;
}
