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
import { useCallback, useMemo, useState } from 'react';
import {
  Select,
  SelectItem,
  Input,
  Label,
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
  cn,
} from '@backstage/core-components';
import { BaseRepoUrlPickerProps } from './types';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';
import { useApi } from '@backstage/core-plugin-api';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import useDebounce from 'react-use/esm/useDebounce';
import { ChevronsUpDown, Check } from 'lucide-react';
import uniq from 'lodash/uniq';
import map from 'lodash/map';

export const GithubRepoPicker = (
  props: BaseRepoUrlPickerProps<{
    allowedOwners?: string[];
    accessToken?: string;
  }>,
) => {
  const {
    allowedOwners = [],
    rawErrors,
    state,
    onChange,
    accessToken,
    isDisabled,
  } = props;
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const ownerItems: SelectItem[] = allowedOwners
    ? allowedOwners.map(i => ({ label: i, value: i }))
    : [{ label: 'Loading...', value: 'loading' }];

  const { host, owner } = state;

  const scaffolderApi = useApi(scaffolderApiRef);

  const [availableRepositoriesWithOwner, setAvailableRepositoriesWithOwner] =
    useState<{ owner: string; name: string }[]>([]);

  // Update available repositories with owner when client is available
  const updateAvailableRepositoriesWithOwner = useCallback(() => {
    if (!scaffolderApi.autocomplete || !accessToken || !host) {
      setAvailableRepositoriesWithOwner([]);
      return;
    }

    scaffolderApi
      .autocomplete({
        token: accessToken,
        resource: 'repositoriesWithOwner',
        provider: 'github',
        context: { host },
      })
      .then(({ results }) => {
        setAvailableRepositoriesWithOwner(
          results.map(r => {
            const [rOwner, rName] = r.id.split('/');
            return { owner: rOwner, name: rName };
          }),
        );
      })
      .catch(() => {
        setAvailableRepositoriesWithOwner([]);
      });
  }, [scaffolderApi, accessToken, host]);

  useDebounce(updateAvailableRepositoriesWithOwner, 500, [
    updateAvailableRepositoriesWithOwner,
  ]);

  // Update available owners when available repositories with owner change
  const availableOwners = useMemo<string[]>(
    () => uniq(map(availableRepositoriesWithOwner, 'owner')),
    [availableRepositoriesWithOwner],
  );

  // Update available repositories when available repositories with owner change or when owner changes
  const updateAvailableRepositories = useCallback(() => {
    const availableRepos = availableRepositoriesWithOwner.flatMap(r =>
      r.owner === owner ? [{ name: r.name }] : [],
    );

    onChange({ availableRepos });
  }, [availableRepositoriesWithOwner, owner, onChange]);

  useDebounce(updateAvailableRepositories, 500, [updateAvailableRepositories]);

  // Determine which owner field variant to render based on available data.
  // Branch 1: allowedOwners provided → Backstage Select dropdown
  // Branch 2: availableOwners populated via API → Popover + Command combobox
  // Branch 3: fallback → plain text Input
  let ownerField: JSX.Element;
  if (allowedOwners?.length) {
    ownerField = (
      <>
        <Select
          native
          label={t('fields.githubRepoPicker.owner.title')}
          onChange={s =>
            onChange({ owner: String(Array.isArray(s) ? s[0] : s) })
          }
          disabled={isDisabled || allowedOwners.length === 1}
          selected={owner}
          items={ownerItems}
        />
        {/* eslint-disable-next-line react/forbid-elements -- migrating from MUI Typography to native elements with Tailwind */}
        <p className="mt-1 text-sm text-muted-foreground">
          {t('fields.githubRepoPicker.owner.description')}
        </p>
      </>
    );
  } else if (availableOwners?.length) {
    ownerField = (
      <div className="space-y-2">
        <Label>{t('fields.githubRepoPicker.owner.inputTitle')}</Label>
        <Popover open={ownerOpen} onOpenChange={setOwnerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={ownerOpen}
              disabled={isDisabled}
              className="w-full justify-between font-normal"
            >
              {owner || t('fields.githubRepoPicker.owner.inputTitle')}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput
                placeholder={t('fields.githubRepoPicker.owner.inputTitle')}
                onValueChange={val => {
                  onChange({ owner: val });
                }}
              />
              <CommandList>
                <CommandEmpty>No owner found.</CommandEmpty>
                <CommandGroup>
                  {(availableOwners || []).map(o => (
                    <CommandItem
                      key={o}
                      value={o}
                      onSelect={currentValue => {
                        onChange({ owner: currentValue });
                        setOwnerOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          owner === o ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {o}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {/* eslint-disable-next-line react/forbid-elements -- migrating from MUI Typography to native elements with Tailwind */}
        <p className="text-sm text-muted-foreground">
          {t('fields.githubRepoPicker.owner.description')}
        </p>
      </div>
    );
  } else {
    ownerField = (
      <div className="space-y-2">
        <Label htmlFor="ownerInput">
          {t('fields.githubRepoPicker.owner.inputTitle')}
        </Label>
        <Input
          id="ownerInput"
          onChange={e => onChange({ owner: e.target.value })}
          disabled={isDisabled}
          value={owner}
        />
        {/* eslint-disable-next-line react/forbid-elements -- migrating from MUI Typography to native elements with Tailwind */}
        <p className="text-sm text-muted-foreground">
          {t('fields.githubRepoPicker.owner.description')}
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          'mt-4 mb-2',
          rawErrors?.length > 0 && !owner && 'text-destructive',
        )}
      >
        {ownerField}
      </div>
    </>
  );
};
