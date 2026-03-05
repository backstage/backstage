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

import { useApi } from '@backstage/core-plugin-api';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import {
  ShadcnButton as Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Input,
  cn,
} from '@backstage/core-components';
import { ChevronsUpDown, Check } from 'lucide-react';
import { useCallback, useState } from 'react';
import useDebounce from 'react-use/esm/useDebounce';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

import { BaseRepoOwnerPickerProps } from './types';
import { scaffolderTranslationRef } from '../../../translation';

/**
 * The underlying component that is rendered in the form for the `GitHubRepoOwnerPicker`
 * field extension.
 *
 * @public
 *
 */
export const GitHubRepoOwnerPicker = ({
  onChange,
  state,
  rawErrors,
  accessToken,
  isDisabled,
  required,
  schema,
  excludedOwners = [],
}: BaseRepoOwnerPickerProps<{
  accessToken?: string;
  excludedOwners?: string[];
}>) => {
  const { host, owner } = state;

  const [availableOwners, setAvailableOwners] = useState<string[]>([]);

  const scaffolderApi = useApi(scaffolderApiRef);
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const updateAvailableOwners = useCallback(() => {
    if (!scaffolderApi.autocomplete || !accessToken || !host) {
      setAvailableOwners([]);
      return;
    }

    scaffolderApi
      .autocomplete({
        token: accessToken,
        resource: 'owners',
        context: { host },
        provider: 'github',
      })
      .then(({ results }) => {
        const owners = results
          .map(r => r.id)
          .filter(id => !excludedOwners.includes(id));

        setAvailableOwners(owners);
      })
      .catch(() => {
        setAvailableOwners([]);
      });
  }, [host, accessToken, scaffolderApi, excludedOwners]);

  useDebounce(updateAvailableOwners, 500, [updateAvailableOwners]);

  return (
    <div className="space-y-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            disabled={isDisabled}
            className={cn(
              'w-full justify-between',
              !owner && 'text-muted-foreground',
            )}
          >
            {owner || (schema?.title ?? t('fields.repoOwnerPicker.title'))}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder={schema?.title ?? t('fields.repoOwnerPicker.title')}
            />
            <CommandList>
              <CommandEmpty>No owner found.</CommandEmpty>
              <CommandGroup>
                {availableOwners.map(availableOwner => (
                  <CommandItem
                    key={availableOwner}
                    value={availableOwner}
                    onSelect={currentValue => {
                      onChange({ owner: currentValue });
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        owner === availableOwner ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {availableOwner}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {/* Free text input for manual owner entry (preserves freeSolo behavior) */}
      <Input
        id="ownerInput"
        placeholder={schema?.title ?? t('fields.repoOwnerPicker.title')}
        value={owner ?? ''}
        onChange={e => onChange({ owner: e.target.value })}
        disabled={isDisabled}
        required={required}
        className={cn(rawErrors?.length > 0 && !owner && 'border-destructive')}
      />
      <p
        className={cn(
          'text-sm',
          rawErrors?.length > 0 && !owner
            ? 'text-destructive'
            : 'text-muted-foreground',
        )}
      >
        {schema?.description ?? t('fields.repoOwnerPicker.description')}
      </p>
    </div>
  );
};
