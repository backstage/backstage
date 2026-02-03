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

import { ListBox, ListBoxItem, Text } from 'react-aria-components';
import { RiCheckLine } from '@remixicon/react';
import clsx from 'clsx';
import { useStyles } from '../../hooks/useStyles';
import { SelectDefinition } from './definition';
import styles from './Select.module.css';
import type { Option } from './types';

interface SelectListBoxProps {
  options?: Array<Option>;
}

const NoResults = () => {
  const { classNames } = useStyles(SelectDefinition);

  return (
    <div className={clsx(classNames.noResults, styles[classNames.noResults])}>
      No results found.
    </div>
  );
};

export function SelectListBox({ options, ...props }: SelectListBoxProps) {
  const { classNames } = useStyles(SelectDefinition, props);
  return (
    <ListBox
      className={clsx(classNames.list, styles[classNames.list])}
      renderEmptyState={() => <NoResults />}
    >
      {options?.map(option => (
        <ListBoxItem
          key={option.value}
          id={option.value}
          textValue={option.label}
          className={clsx(classNames.item, styles[classNames.item])}
          isDisabled={option.disabled}
        >
          <div
            className={clsx(
              classNames.itemIndicator,
              styles[classNames.itemIndicator],
            )}
          >
            <RiCheckLine />
          </div>
          <Text
            slot="label"
            className={clsx(classNames.itemLabel, styles[classNames.itemLabel])}
          >
            {option.label}
          </Text>
        </ListBoxItem>
      ))}
    </ListBox>
  );
}
