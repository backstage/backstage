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
import { Select, SelectedItems } from '@backstage/core-components';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import Box from '@material-ui/core/Box';
import React, { useCallback } from 'react';
import { catalogGraphTranslationRef } from '../../translation';

type Curve = 'curveStepBefore' | 'curveMonotoneX';

export type Props = {
  value: Curve;
  onChange: (value: 'curveStepBefore' | 'curveMonotoneX') => void;
};

const curves: Array<Curve> = ['curveMonotoneX', 'curveStepBefore'];

export const CurveFilter = ({ value, onChange }: Props) => {
  const handleChange = useCallback(
    (v: SelectedItems) => onChange(v as Curve),
    [onChange],
  );
  const { t } = useTranslationRef(catalogGraphTranslationRef);

  const CURVE_DISPLAY_NAMES: Record<Curve, string> = {
    curveMonotoneX: t('curveFilter.displayName.curveMonotoneX'),
    curveStepBefore: t('curveFilter.displayName.curveStepBefore'),
  };

  return (
    <Box pb={1} pt={1}>
      <Select
        label={t('curveFilter.selectLabel')}
        selected={value}
        items={curves.map(v => ({
          label: CURVE_DISPLAY_NAMES[v],
          value: v,
        }))}
        onChange={handleChange}
      />
    </Box>
  );
};
