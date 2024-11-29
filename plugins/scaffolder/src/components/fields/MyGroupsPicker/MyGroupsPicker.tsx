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

import React, { useEffect } from 'react';
import {
  errorApiRef,
  identityApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { MyGroupsPickerProps, MyGroupsPickerSchema } from './schema';
import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';
import {
  catalogApiRef,
  EntityDisplayName,
  entityPresentationApiRef,
  EntityRefPresentationSnapshot,
} from '@backstage/plugin-catalog-react';
import { NotFoundError } from '@backstage/errors';
import useAsync from 'react-use/esm/useAsync';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { VirtualizedListbox } from '../VirtualizedListbox';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';

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
  } = props;

  const identityApi = useApi(identityApiRef);
  const catalogApi = useApi(catalogApiRef);
  const errorApi = useApi(errorApiRef);
  const entityPresentationApi = useApi(entityPresentationApiRef);

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

  const updateChange = (_: React.ChangeEvent<{}>, value: Entity | null) => {
    onChange(value ? stringifyEntityRef(value) : '');
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
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0}
    >
      <Autocomplete
        disabled={required && groups?.catalogEntities.length === 1}
        id="OwnershipEntityRefPicker-dropdown"
        options={groups?.catalogEntities || []}
        value={selectedEntity}
        loading={loading}
        onChange={updateChange}
        getOptionLabel={option =>
          groups?.entityRefToPresentation.get(stringifyEntityRef(option))
            ?.primaryTitle!
        }
        autoSelect
        renderInput={params => (
          <TextField
            {...params}
            label={title}
            margin="dense"
            helperText={description}
            FormHelperTextProps={{ margin: 'dense', style: { marginLeft: 0 } }}
            variant="outlined"
            required={required}
            InputProps={params.InputProps}
          />
        )}
        renderOption={option => <EntityDisplayName entityRef={option} />}
        filterOptions={createFilterOptions<Entity>({
          stringify: option =>
            groups?.entityRefToPresentation.get(stringifyEntityRef(option))
              ?.primaryTitle!,
        })}
        ListboxComponent={VirtualizedListbox}
      />
    </FormControl>
  );
};
