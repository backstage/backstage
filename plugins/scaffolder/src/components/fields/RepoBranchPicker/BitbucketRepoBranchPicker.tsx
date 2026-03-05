/*
 * Copyright 2024 The Backstage Authors
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
import { BaseRepoBranchPickerProps } from './types';

/**
 * The underlying component that is rendered in the form for the `BitbucketRepoBranchPicker`
 * field extension.
 *
 * @public
 *
 */
export const BitbucketRepoBranchPicker = ({
  onChange,
  state,
  rawErrors,
  accessToken,
  isDisabled,
  required,
}: BaseRepoBranchPickerProps<{
  accessToken?: string;
}>) => {
  const { host, workspace, repository, branch } = state;

  const [availableBranches, setAvailableBranches] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const scaffolderApi = useApi(scaffolderApiRef);

  const updateAvailableBranches = useCallback(() => {
    if (
      !scaffolderApi.autocomplete ||
      !workspace ||
      !repository ||
      !accessToken ||
      host !== 'bitbucket.org'
    ) {
      setAvailableBranches([]);
      return;
    }

    scaffolderApi
      .autocomplete({
        token: accessToken,
        resource: 'branches',
        context: { workspace, repository },
        provider: 'bitbucket-cloud',
      })
      .then(({ results }) => {
        setAvailableBranches(results.map(r => r.id));
      })
      .catch(() => {
        setAvailableBranches([]);
      });
  }, [host, workspace, repository, accessToken, scaffolderApi]);

  useDebounce(updateAvailableBranches, 500, [updateAvailableBranches]);

  return (
    <div className="mt-4 space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={isDisabled}
            className={cn(
              'w-full justify-between font-normal',
              !branch && 'text-muted-foreground',
              rawErrors?.length > 0 && !branch && 'border-destructive',
            )}
          >
            {branch || 'Select branch...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search or type branch..." />
            <CommandList>
              <CommandEmpty>No branches found.</CommandEmpty>
              <CommandGroup>
                {availableBranches.map(b => (
                  <CommandItem
                    key={b}
                    value={b}
                    onSelect={currentValue => {
                      onChange({ branch: currentValue });
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        branch === b ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {b}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {/* Allow free-form input for freeSolo behavior */}
      <Input
        placeholder="Or type a branch name..."
        value={branch}
        onChange={e => onChange({ branch: e.target.value })}
        disabled={isDisabled}
        required={required}
        className={cn(rawErrors?.length > 0 && !branch && 'border-destructive')}
      />
      <p
        className={cn(
          'text-sm',
          rawErrors?.length > 0 && !branch
            ? 'text-destructive'
            : 'text-muted-foreground',
        )}
      >
        The branch of the repository
      </p>
    </div>
  );
};
