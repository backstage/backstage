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
import useAsync from 'react-use/esm/useAsync';
import useEffectOnce from 'react-use/esm/useEffectOnce';
import { GetEntityFacetsRequest } from '@backstage/catalog-client';
import { makeValidator } from '@backstage/catalog-model';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';

/* shadcn/ui primitives from @backstage/core-components */
import {
  cn,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  Badge,
  ShadcnButton as Button,
} from '@backstage/core-components';

/* Lucide icons replacing @material-ui/icons */
import { X, ChevronsUpDown, Check } from 'lucide-react';

import { EntityTagsPickerProps } from './schema';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';
import { ScaffolderField } from '@backstage/plugin-scaffolder-react/alpha';

export { EntityTagsPickerSchema } from './schema';

/**
 * The underlying component that is rendered in the form for the `EntityTagsPicker`
 * field extension.
 *
 * @public
 */
export const EntityTagsPicker = (props: EntityTagsPickerProps) => {
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const {
    formData,
    onChange,
    schema: {
      title = t('fields.entityTagsPicker.title'),
      description = t('fields.entityTagsPicker.description'),
    },
    uiSchema,
    rawErrors,
    required,
    errors,
  } = props;
  const catalogApi = useApi(catalogApiRef);
  const [tagOptions, setTagOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState(false);
  const [open, setOpen] = useState(false);
  const tagValidator = makeValidator().isValidTag;
  const kinds = uiSchema['ui:options']?.kinds;
  const showCounts = uiSchema['ui:options']?.showCounts;
  const helperText = uiSchema['ui:options']?.helperText;
  const isDisabled = uiSchema?.['ui:disabled'] ?? false;

  const { loading, value: existingTags } = useAsync(async () => {
    const facet = 'metadata.tags';
    const tagsRequest: GetEntityFacetsRequest = { facets: [facet] };
    if (kinds) {
      tagsRequest.filter = { kind: kinds };
    }

    const { facets } = await catalogApi.getEntityFacets(tagsRequest);

    const tagFacets = Object.fromEntries(
      facets[facet].map(({ value, count }) => [value, count]),
    );

    setTagOptions(
      Object.keys(tagFacets).sort((a, b) =>
        showCounts ? tagFacets[b] - tagFacets[a] : a.localeCompare(b),
      ),
    );

    return tagFacets;
  });

  /** Toggle an existing tag option on or off from the dropdown list */
  const handleSelectTag = (tag: string) => {
    const currentTags = formData || [];
    if (currentTags.includes(tag)) {
      onChange(currentTags.filter((item: string) => item !== tag));
    } else {
      onChange([...currentTags, tag]);
    }
  };

  /** Add a custom (freeSolo) tag typed by the user, applying validation and normalization */
  const handleAddCustomTag = (value: string) => {
    const newTag = value.toLocaleLowerCase('en-US').trim();
    if (!newTag) return;

    const currentTags = formData || [];
    const hasError = !tagValidator(newTag);
    const addDuplicate = currentTags.indexOf(newTag) !== -1;

    setInputError(hasError);
    setInputValue(!hasError ? '' : inputValue);

    if (!hasError && !addDuplicate) {
      onChange([...currentTags, newTag]);
    }
  };

  /** Remove a selected tag via the dismiss button on its Badge */
  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = formData || [];
    onChange(currentTags.filter((item: string) => item !== tagToRemove));
  };

  // Initialize field to always return an array
  useEffectOnce(() => onChange(formData || []));

  return (
    <ScaffolderField
      rawErrors={rawErrors}
      rawDescription={helperText ?? uiSchema['ui:description'] ?? description}
      required={required}
      disabled={isDisabled}
      errors={errors}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={isDisabled}
            className={cn(
              'w-full justify-between min-h-[2.5rem] h-auto',
              !formData?.length && 'text-muted-foreground',
            )}
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {formData?.length ? (
                formData.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                    {/* eslint-disable-next-line react/forbid-elements -- native button required inside Badge for shadcn/ui combobox pattern */}
                    <button
                      type="button"
                      className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          handleRemoveTag(tag);
                        }
                      }}
                      onMouseDown={e => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))
              ) : (
                // eslint-disable-next-line react/forbid-elements -- plain span for combobox placeholder text per shadcn/ui migration
                <span>{title}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter>
            <CommandInput
              placeholder={`Search ${title?.toLowerCase() ?? 'tags'}...`}
              value={inputValue}
              onValueChange={setInputValue}
              onKeyDown={e => {
                if (e.key === 'Enter' && inputValue) {
                  e.preventDefault();
                  handleAddCustomTag(inputValue);
                }
              }}
            />
            <CommandList>
              <CommandEmpty>
                {inputValue ? (
                  // eslint-disable-next-line react/forbid-elements -- native button for freeSolo add action per shadcn/ui migration
                  <button
                    type="button"
                    className="w-full text-left px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm"
                    onClick={() => handleAddCustomTag(inputValue)}
                  >
                    Add &quot;{inputValue}&quot;
                  </button>
                ) : (
                  'No tags found.'
                )}
              </CommandEmpty>
              <CommandGroup>
                {loading && <CommandItem disabled>Loading tags...</CommandItem>}
                {tagOptions.map(option => {
                  const isSelected = (formData || []).includes(option);
                  return (
                    <CommandItem
                      key={option}
                      value={option}
                      onSelect={() => handleSelectTag(option)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          isSelected ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {showCounts
                        ? `${option} (${existingTags?.[option]})`
                        : option}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {inputError && (
        // eslint-disable-next-line react/forbid-elements -- native p for error message per shadcn/ui migration
        <p className="text-sm text-destructive mt-1">Invalid tag format</p>
      )}
    </ScaffolderField>
  );
};
