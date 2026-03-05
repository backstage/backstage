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
import {
  Select,
  SelectItem,
  cn,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  ShadcnButton as Button,
} from '@backstage/core-components';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { useEffect, useState } from 'react';
import { ChevronsUpDown, Check } from 'lucide-react';
import { scaffolderTranslationRef } from '../../../translation';
import { AvailableRepositories } from './types';

export const RepoUrlPickerRepoName = (props: {
  repoName?: string;
  allowedRepos?: string[];
  onChange: (chosenRepo: AvailableRepositories) => void;
  rawErrors: string[];
  availableRepos?: AvailableRepositories[];
  isDisabled?: boolean;
}) => {
  const {
    repoName,
    allowedRepos,
    onChange,
    rawErrors,
    availableRepos,
    isDisabled,
  } = props;
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // If there is no repoName chosen currently
    if (!repoName) {
      // Set the first of the allowedRepos option if that available
      if (allowedRepos?.length) {
        onChange({ name: allowedRepos[0] });
      }
    }
  }, [allowedRepos, repoName, onChange]);

  const repoItems: SelectItem[] = allowedRepos
    ? allowedRepos.map(i => ({ label: i, value: i }))
    : [{ label: 'Loading...', value: 'loading' }];

  return (
    <>
      <div
        className={cn(
          'mt-4 mb-2',
          rawErrors?.length > 0 && !repoName && 'text-destructive',
        )}
      >
        {allowedRepos?.length ? (
          <Select
            native
            label={t('fields.repoUrlPicker.repository.title')}
            onChange={selected =>
              onChange({
                name: String(Array.isArray(selected) ? selected[0] : selected),
              })
            }
            disabled={isDisabled || allowedRepos.length === 1}
            selected={repoName}
            items={repoItems}
          />
        ) : (
          <>
            {/* Free-text input for repo name entry (preserves freeSolo behavior) */}
            <Input
              placeholder={t('fields.repoUrlPicker.repository.inputTitle')}
              value={repoName || ''}
              onChange={e => onChange({ name: e.target.value })}
              disabled={isDisabled}
              required
              className="mb-1"
            />
            {/* Suggestion dropdown for available repos */}
            {availableRepos && availableRepos.length > 0 && (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={isDisabled}
                  >
                    {repoName ||
                      t('fields.repoUrlPicker.repository.inputTitle')}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder={t(
                        'fields.repoUrlPicker.repository.inputTitle',
                      )}
                    />
                    <CommandList>
                      <CommandEmpty>No repository found.</CommandEmpty>
                      <CommandGroup>
                        {availableRepos.map(r => (
                          <CommandItem
                            key={r.name}
                            value={r.name}
                            onSelect={currentValue => {
                              const selectedRepo = availableRepos.find(
                                repo => repo.name === currentValue,
                              );
                              onChange(
                                selectedRepo || {
                                  name: currentValue || '',
                                },
                              );
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                repoName === r.name
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                            {r.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          </>
        )}
        <p className="mt-1 text-sm text-muted-foreground">
          {t('fields.repoUrlPicker.repository.description')}
        </p>
      </div>
    </>
  );
};
