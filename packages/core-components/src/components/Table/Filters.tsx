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

/**
 * Sidebar filter panel for the Table component.
 * Replaces MUI Box/Button/makeStyles with Tailwind utility classes.
 */

import { useEffect, useState } from 'react';

import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Select } from '../Select';
import { SelectProps } from '../Select/Select';
import { coreComponentsTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

export type TableFiltersClassKey = 'root' | 'value' | 'heder' | 'filters';

export type Without<T, K> = Pick<T, Exclude<keyof T, K>>;

export type Filter = {
  type: 'select' | 'multiple-select';
  element: Without<SelectProps, 'onChange'>;
};

export type SelectedFilters = {
  [key: string]: string | string[];
};

type Props = {
  filters: Filter[];
  selectedFilters?: SelectedFilters;
  onChangeFilters: (arg: any) => any;
};

export const Filters = (props: Props) => {
  const { onChangeFilters } = props;
  const { t } = useTranslationRef(coreComponentsTranslationRef);

  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    ...props.selectedFilters,
  });
  const [reset, triggerReset] = useState(false);

  const handleClick = () => {
    setSelectedFilters({});
    triggerReset(el => !el);
  };

  useEffect(() => {
    onChangeFilters(selectedFilters);
  }, [selectedFilters, onChangeFilters]);

  return (
    <div className={cn('h-full w-[315px] flex flex-col mr-6')}>
      <div
        className={cn(
          'flex items-center h-[60px] justify-between border-b border-border',
        )}
      >
        <span className="font-bold text-lg">{t('table.filter.title')}</span>
        <Button variant="link" onClick={handleClick}>
          {t('table.filter.clearAll')}
        </Button>
      </div>
      <div className={cn('flex flex-col space-y-4')}>
        {props.filters?.length &&
          props.filters.map(filter => (
            <Select
              triggerReset={reset}
              key={filter.element.label}
              {...(filter.element as SelectProps)}
              selected={selectedFilters[filter.element.label]}
              onChange={el =>
                setSelectedFilters({
                  ...selectedFilters,
                  [filter.element.label]: el as any,
                })
              }
            />
          ))}
      </div>
    </div>
  );
};
