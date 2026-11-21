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
import { NumberField } from '@backstage/ui';
import { useCallback } from 'react';
import { catalogGraphTranslationRef } from '../../translation';

export type Props = {
  value: number;
  onChange: (value: number) => void;
};

/**
 * @public
 * @deprecated The filter is styled with CSS modules and no longer reads theme
 * overrides, so this type has no effect and will be removed.
 */
export type MaxDepthFilterClassKey = 'formControl';

export const MaxDepthFilter = ({ value, onChange }: Props) => {
  const { t } = useTranslationRef(catalogGraphTranslationRef);

  // An empty or non-positive input means unlimited depth. The field reports
  // its value when it is committed, on blur or Enter.
  const handleChange = useCallback(
    (newValue: number) => {
      onChange(
        Number.isFinite(newValue) && newValue > 0
          ? newValue
          : Number.POSITIVE_INFINITY,
      );
    },
    [onChange],
  );

  return (
    <NumberField
      label={t('catalogGraphPage.maxDepthFilter.title')}
      placeholder={t('catalogGraphPage.maxDepthFilter.inputPlaceholder')}
      minValue={0}
      value={Number.isFinite(value) ? value : Number.NaN}
      onChange={handleChange}
    />
  );
};
