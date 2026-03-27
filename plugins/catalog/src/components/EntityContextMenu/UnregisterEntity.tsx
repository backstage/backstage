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

import { DropdownMenuItem } from '@backstage/core-components';
import { XCircle } from 'lucide-react';
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

// TODO: When Backstage supports only React 19+, remove the forwardRef
export const UnregisterEntity = forwardRef<
  HTMLDivElement,
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

  /* Forward remaining props (data-testid, className, etc.) for backward
     compatibility — the original MUI MenuItem spread all extra props. */
  const {
    unregisterEntityOptions: _ueo,
    isUnregisterAllowed: _ira,
    onUnregisterEntity: _oue,
    onClose: _oc,
    ...restProps
  } = props;

  if (unregisterEntityOptions?.disableUnregister !== 'hidden') {
    return (
      <DropdownMenuItem
        ref={ref}
        onClick={() => {
          onClose();
          onUnregisterEntity();
        }}
        disabled={isDisabled}
        {...restProps}
      >
        <XCircle className="h-4 w-4" />
        <span>{t('entityContextMenu.unregisterMenuTitle')}</span>
      </DropdownMenuItem>
    );
  }

  return null;
});
