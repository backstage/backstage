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

import { useState } from 'react';
import capitalize from 'lodash/capitalize';
import {
  Progress,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Checkbox,
  cn,
  ShadcnButton as Button,
} from '@backstage/core-components';
import { ChevronDown } from 'lucide-react';
import { useEntityTypeFilter } from '@backstage/plugin-catalog-react';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../translation';

/**
 * The component to select the `type` of `Template` that you will see in the table.
 *
 * @public
 */
export const TemplateTypePicker = () => {
  const alertApi = useApi(alertApiRef);
  const { error, loading, availableTypes, selectedTypes, setSelectedTypes } =
    useEntityTypeFilter();
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const [open, setOpen] = useState(false);

  if (loading) return <Progress />;

  if (!availableTypes) return null;

  if (error) {
    alertApi.post({
      message: `Failed to load entity types`,
      severity: 'error',
    });
    return null;
  }

  /** Toggle a single type in or out of the multi-select filter. */
  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(s => s !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
    setOpen(false);
  };

  return (
    <div className="py-1">
      <label
        htmlFor="categories-picker"
        className="text-sm font-medium uppercase tracking-wide"
      >
        {t('templateTypePicker.title')}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="categories-picker"
            variant="outline"
            size="sm"
            className={cn(
              'w-full justify-between text-left font-normal',
              selectedTypes.length === 0 && 'text-muted-foreground',
            )}
            data-testid="categories-picker-expand"
          >
            <span className="truncate">
              {selectedTypes.length > 0
                ? selectedTypes.map(s => capitalize(s)).join(', ')
                : ''}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search types..." />
            <CommandList>
              <CommandEmpty>No types found.</CommandEmpty>
              <CommandGroup>
                {availableTypes.map(type => {
                  const isSelected = selectedTypes.includes(type);
                  return (
                    <CommandItem
                      key={type}
                      value={type}
                      onSelect={() => toggleType(type)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleType(type)}
                        onClick={e => e.stopPropagation()}
                        className="mr-2"
                        aria-label={capitalize(type)}
                      />
                      <span>{capitalize(type)}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
