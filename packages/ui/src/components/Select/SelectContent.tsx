/*
 * Copyright 2025 The Backstage Authors
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

import {
  Input,
  SearchField,
  Autocomplete,
  Button,
} from 'react-aria-components';
import { useFilter } from 'react-aria';
import { RiCloseCircleLine } from '@remixicon/react';
import clsx from 'clsx';
import { useStyles } from '../../hooks/useStyles';
import { SelectDefinition } from './definition';
import { SelectListBox } from './SelectListBox';
import styles from './Select.module.css';
import type { Option } from './types';

interface SelectContentProps {
  searchable?: boolean;
  searchPlaceholder?: string;
  options?: Array<Option>;
}

export function SelectContent({
  searchable,
  searchPlaceholder = 'Search...',
  options,
}: SelectContentProps) {
  const { contains } = useFilter({ sensitivity: 'base' });
  const { classNames } = useStyles(SelectDefinition);

  if (!searchable) {
    return <SelectListBox options={options} />;
  }

  return (
    <Autocomplete filter={contains}>
      <SearchField
        autoFocus
        className={clsx(
          classNames.searchWrapper,
          styles[classNames.searchWrapper],
        )}
        aria-label={searchPlaceholder}
      >
        <Input
          placeholder={searchPlaceholder}
          className={clsx(classNames.search, styles[classNames.search])}
        />
        <Button
          className={clsx(
            classNames.searchClear,
            styles[classNames.searchClear],
          )}
        >
          <RiCloseCircleLine />
        </Button>
      </SearchField>
      <SelectListBox options={options} />
    </Autocomplete>
  );
}
