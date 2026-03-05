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
import {
  cn,
  Checkbox,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  ShadcnButton as Button,
} from '@backstage/core-components';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { useEntityTypeFilter } from '@backstage/plugin-catalog-react';
import { ChevronDown } from 'lucide-react';
import capitalize from 'lodash/capitalize';

import { scaffolderReactTranslationRef } from '../../../translation';

/** @alpha */
export type ScaffolderReactTemplateCategoryPickerClassKey = 'root' | 'label';

/**
 * The Category Picker that is rendered on the left side for picking
 * categories and filtering the template list.
 *
 * Renders a combobox trigger (shadcn/ui Button) that opens a Popover
 * containing a searchable, keyboard-navigable Command list with
 * multi-select checkboxes for each available template category.
 *
 * @alpha
 */
export const TemplateCategoryPicker = () => {
  const { t } = useTranslationRef(scaffolderReactTranslationRef);
  const alertApi = useApi(alertApiRef);
  const { error, loading, availableTypes, selectedTypes, setSelectedTypes } =
    useEntityTypeFilter();
  const [open, setOpen] = useState(false);

  /*
   * Local state tracks selections when the hook does not provide
   * selectedTypes (uncontrolled mode). This mirrors the previous
   * MUI Autocomplete behaviour where internal state accumulated
   * selections independently of the external value prop.
   */
  const [localSelected, setLocalSelected] = useState<string[]>([]);
  const effectiveSelected = selectedTypes ?? localSelected;

  if (loading) return <Progress />;

  if (error) {
    alertApi.post({
      message: `Failed to load entity types with error: ${error}`,
      severity: 'error',
    });
    return null;
  }

  if (!availableTypes) return null;

  /** Toggle a single category in or out of the selection set. */
  const handleToggle = (type: string) => {
    const current = effectiveSelected;
    let next: string[];
    if (current.includes(type)) {
      next = current.filter(item => item !== type);
    } else {
      next = [...current, type];
    }
    setLocalSelected(next);
    setSelectedTypes(next);
  };

  return (
    <div className={cn('pb-1 pt-1')}>
      <label
        className={cn(
          'text-sm font-medium uppercase tracking-wider text-muted-foreground',
        )}
        htmlFor="categories-picker"
      >
        {t('templateCategoryPicker.title')}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="categories-picker"
            variant="outline"
            size="sm"
            aria-label="Open"
            className={cn(
              'mt-1 w-full justify-between text-sm font-normal',
              !effectiveSelected.length && 'text-muted-foreground',
            )}
          >
            {effectiveSelected.length
              ? effectiveSelected.map(item => capitalize(item)).join(', ')
              : 'Select categories...'}
            <ChevronDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              <CommandEmpty>No categories found.</CommandEmpty>
              <CommandGroup>
                {availableTypes.map(type => {
                  const isSelected = effectiveSelected.includes(type);
                  return (
                    <CommandItem
                      key={type}
                      value={type}
                      onSelect={() => handleToggle(type)}
                    >
                      <Checkbox
                        checked={isSelected}
                        className="mr-2"
                        aria-label={capitalize(type)}
                      />
                      {capitalize(type)}
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
