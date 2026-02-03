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
import Box from '@material-ui/core/Box';
import { useCallback } from 'react';
import { Direction } from '../../lib/types';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { catalogGraphTranslationRef } from '../../translation';

export type Props = {
  value: Direction;
  onChange: (value: Direction) => void;
};

export const DirectionFilter = ({ value, onChange }: Props) => {
  const { t } = useTranslationRef(catalogGraphTranslationRef);
  const DIRECTION_DISPLAY_NAMES = {
    [Direction.LEFT_RIGHT]: t('catalogGraphPage.directionFilter.leftToRight'),
    [Direction.RIGHT_LEFT]: t('catalogGraphPage.directionFilter.rightToLeft'),
    [Direction.TOP_BOTTOM]: t('catalogGraphPage.directionFilter.topToBottom'),
    [Direction.BOTTOM_TOP]: t('catalogGraphPage.directionFilter.bottomToTop'),
  };
  const handleChange = useCallback(
    (v: SelectedItems) => onChange(v as Direction),
    [onChange],
  );

  return (
    <Box pb={1} pt={1}>
      <Select
        label={t('catalogGraphPage.directionFilter.title')}
        selected={value}
        items={Object.values(Direction).map(v => ({
          label: DIRECTION_DISPLAY_NAMES[v],
          value: v,
        }))}
        onChange={handleChange}
      />
    </Box>
  );
};
