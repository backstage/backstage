/*
 * Copyright 2023 The Backstage Authors
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

import { useState, useEffect } from 'react';
import {
  errorApiRef,
  identityApiRef,
  useApi,
} from '@backstage/core-plugin-api';
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
  ShadcnButton as Button,
} from '@backstage/core-components';
import { ChevronsUpDown, Check } from 'lucide-react';
import { MyGroupsPickerProps, MyGroupsPickerSchema } from './schema';
import {
  catalogApiRef,
  EntityDisplayName,
  entityPresentationApiRef,
  EntityRefPresentationSnapshot,
} from '@backstage/plugin-catalog-react';
import { NotFoundError } from '@backstage/errors';
import useAsync from 'react-use/esm/useAsync';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';
import { ScaffolderField } from '@backstage/plugin-scaffolder-react/alpha';

export { MyGroupsPickerSchema };

export const MyGroupsPicker = (props: MyGroupsPickerProps) => {
  const { t } = useTranslationRef(scaffolderTranslationRef);
  const {
    schema: {
      title = t('fields.myGroupsPicker.title'),
      description = t('fields.myGroupsPicker.description'),
    },
    required,
    rawErrors,
    onChange,
    formData,
    uiSchema,
    errors,
  } = props;

  const identityApi = useApi(identityApiRef);
  const catalogApi = useApi(catalogApiRef);
  const errorApi = useApi(errorApiRef);
  const entityPresentationApi = useApi(entityPresentationApiRef);
  const isDisabled = uiSchema?.['ui:disabled'] ?? false;

  const [open, setOpen] = useState(false);

  const { value: groups, loading } = useAsync(async () => {
    const { userEntityRef } = await identityApi.getBackstageIdentity();

    if (!userEntityRef) {
      errorApi.post(new NotFoundError('No user entity ref found'));
      return { catalogEntities: [], entityRefToPresentation: new Map() };
    }

    const { items } = await catalogApi.getEntities({
      filter: {
        kind: 'Group',
        ['relations.hasMember']: [userEntityRef],
      },
    });

    const entityRefToPresentation = new Map<
      string,
      EntityRefPresentationSnapshot
    >(
      await Promise.all(
        items.map(async item => {
          const presentation = await entityPresentationApi.forEntity(item)
            .promise;
          return [stringifyEntityRef(item), presentation] as [
            string,
            EntityRefPresentationSnapshot,
          ];
        }),
      ),
    );

    return { catalogEntities: items, entityRefToPresentation };
  });

  /** Handles item selection from the Command list — toggles off if re-selected */
  const handleSelect = (entityRef: string) => {
    onChange(entityRef === formData ? '' : entityRef);
    setOpen(false);
  };

  const selectedEntity =
    groups?.catalogEntities.find(e => stringifyEntityRef(e) === formData) ||
    null;

  useEffect(() => {
    if (required && groups?.catalogEntities.length === 1 && !selectedEntity) {
      onChange(stringifyEntityRef(groups.catalogEntities[0]));
    }
  }, [groups, onChange, selectedEntity, required]);

  return (
    <ScaffolderField
      rawErrors={rawErrors}
      rawDescription={uiSchema['ui:description'] ?? description}
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
            aria-label={title}
            disabled={
              isDisabled || (required && groups?.catalogEntities.length === 1)
            }
            className={cn(
              'w-full justify-between font-normal',
              !selectedEntity && 'text-muted-foreground',
            )}
          >
            {selectedEntity
              ? groups?.entityRefToPresentation.get(
                  stringifyEntityRef(selectedEntity),
                )?.primaryTitle
              : title}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={`Search ${title?.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>
                {loading ? 'Loading groups…' : 'No groups found.'}
              </CommandEmpty>
              <CommandGroup>
                {(groups?.catalogEntities || []).map(entity => {
                  const ref = stringifyEntityRef(entity);
                  const presentation = groups?.entityRefToPresentation.get(ref);
                  return (
                    <CommandItem
                      key={ref}
                      value={presentation?.primaryTitle ?? ref}
                      onSelect={() => handleSelect(ref)}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          formData === ref ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      <EntityDisplayName entityRef={entity} />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </ScaffolderField>
  );
};
