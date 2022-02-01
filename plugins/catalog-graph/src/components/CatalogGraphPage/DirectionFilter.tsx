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
import { Select } from '@backstage/core-components';
import { Box } from '@material-ui/core';
import React, { useCallback } from 'react';
import { Direction } from '../EntityRelationsGraph';

const DIRECTION_DISPLAY_NAMES = {
  [Direction.LEFT_RIGHT]: 'Left to right',
  [Direction.RIGHT_LEFT]: 'Right to left',
  [Direction.TOP_BOTTOM]: 'Top to bottom',
  [Direction.BOTTOM_TOP]: 'Bottom to top',
};

export type Props = {
  value: Direction;
  onChange: (value: Direction) => void;
};

export const DirectionFilter = ({ value, onChange }: Props) => {
  const handleChange = useCallback(v => onChange(v as Direction), [onChange]);

  return (
    <Box pb={1} pt={1}>
      <Select
        label="Direction"
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
