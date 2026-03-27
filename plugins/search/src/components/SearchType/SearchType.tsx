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

/* shadcn/ui primitives from @backstage/core-components */
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@backstage/core-components';
import { Checkbox } from '@backstage/core-components';
import { Badge } from '@backstage/core-components';
import { ShadcnButton as Button } from '@backstage/core-components';
import { Label } from '@backstage/core-components';
import { cn } from '@backstage/core-components';

/* Lucide icons replacing @material-ui/icons */
import { ChevronsUpDown, X } from 'lucide-react';

import { useState } from 'react';
import useEffectOnce from 'react-use/esm/useEffectOnce';
import {
  SearchTypeAccordion,
  SearchTypeAccordionProps,
} from './SearchType.Accordion';
import { SearchTypeTabs, SearchTypeTabsProps } from './SearchType.Tabs';
import { useSearch } from '@backstage/plugin-search-react';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { searchTranslationRef } from '../../translation';

/**
 * Props for {@link SearchType}.
 *
 * @public
 */
export type SearchTypeProps = {
  className?: string;
  name: string;
  values?: string[];
  defaultValue?: string[] | string | null;
};

/**
 * A multi-select search type filter component implemented with a Popover +
 * Checkbox list pattern (standard shadcn/ui approach for multi-select,
 * since Radix Select does not support multi-select natively).
 *
 * Replaces the former MUI Select multiple + Chip renderValue pattern.
 * Selected types are displayed as Badge pills below the trigger with
 * individual remove buttons.
 *
 * @public
 */
const SearchType = (props: SearchTypeProps) => {
  const { className, defaultValue, name, values = [] } = props;
  const { types, setTypes } = useSearch();
  const { t } = useTranslationRef(searchTranslationRef);

  /* Controls popover open/close state */
  const [open, setOpen] = useState(false);

  /* Seed default value on first mount if no types are set */
  useEffectOnce(() => {
    if (!types.length) {
      if (defaultValue && Array.isArray(defaultValue)) {
        setTypes(defaultValue);
      } else if (defaultValue) {
        setTypes([defaultValue]);
      }
    }
  });

  /**
   * Toggle a type value on or off in the selected types list.
   * This replaces the MUI Select onChange handler which received
   * event.target.value as the full new array.
   */
  const handleToggle = (typeValue: string) => {
    const isSelected = types.includes(typeValue);
    const newTypes = isSelected
      ? types.filter(t2 => t2 !== typeValue)
      : [...types, typeValue];
    setTypes(newTypes);
  };

  /**
   * Remove a specific type from the selection via the Badge X button.
   */
  const handleRemove = (typeValue: string) => {
    const newTypes = types.filter(t2 => t2 !== typeValue);
    setTypes(newTypes);
  };

  return (
    <div
      className={cn('w-full space-y-1.5', className)}
      data-testid="search-typefilter-next"
    >
      <Label className="capitalize text-sm">{name}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            aria-expanded={open}
            aria-haspopup="listbox"
            data-testid="search-type-trigger"
            className="w-full justify-between font-normal"
          >
            <span className="truncate">
              {types.length === 0
                ? t('searchType.allResults')
                : `${types.length} selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          {/* Accessible listbox container with option items */}
          <div className="max-h-60 overflow-auto p-1" role="listbox">
            {values.map((type: string) => {
              const isChecked = types.includes(type);
              return (
                <div
                  key={type}
                  role="option"
                  aria-selected={isChecked}
                  tabIndex={0}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer',
                    'hover:bg-accent focus-visible:bg-accent focus-visible:outline-none',
                    isChecked && 'bg-accent/50',
                  )}
                  onClick={() => handleToggle(type)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleToggle(type);
                    }
                  }}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => handleToggle(type)}
                    className="h-4 w-4"
                    tabIndex={-1}
                    aria-hidden
                  />
                  <span>{type}</span>
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      {/* Selected type badges below trigger (replaces MUI Chip renderValue) */}
      {types.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {types.map(value => (
            <Badge key={value} variant="secondary" className="gap-1">
              {value}
              <button
                type="button"
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={e => {
                  e.stopPropagation();
                  handleRemove(value);
                }}
                aria-label={`Remove ${value}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * A control surface for the search query's "types" property, displayed as a
 * single-select collapsible accordion suitable for use in faceted search UIs.
 * @public
 */
SearchType.Accordion = (props: SearchTypeAccordionProps) => {
  return <SearchTypeAccordion {...props} />;
};

/**
 * A control surface for the search query's "types" property, displayed as a
 * tabs suitable for use in faceted search UIs.
 * @public
 */
SearchType.Tabs = (props: SearchTypeTabsProps) => {
  return <SearchTypeTabs {...props} />;
};

export { SearchType };
export type { SearchTypeAccordionProps, SearchTypeTabsProps };
