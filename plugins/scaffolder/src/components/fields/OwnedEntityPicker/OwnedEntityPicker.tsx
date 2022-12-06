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
import { GetEntitiesResponse } from '@backstage/catalog-client';
import { RELATION_OWNED_BY } from '@backstage/catalog-model';
import { identityApiRef, useApi } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  humanizeEntityRef,
} from '@backstage/plugin-catalog-react';
import { TextField } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useMemo } from 'react';
import useAsync from 'react-use/lib/useAsync';

import { OwnedEntityPickerProps } from './schema';

export { OwnedEntityPickerSchema } from './schema';

/**
 * The underlying component that is rendered in the form for the `OwnedEntityPicker`
 * field extension.
 *
 * @public
 */
export const OwnedEntityPicker = (props: OwnedEntityPickerProps) => {
  const {
    onChange,
    schema: { title = 'Entity', description = 'An entity from the catalog' },
    required,
    uiSchema,
    rawErrors,
    formData,
    idSchema,
  } = props;

  const allowedKinds = uiSchema['ui:options']?.allowedKinds;
  const defaultKind = uiSchema['ui:options']?.defaultKind;
  const defaultNamespace = uiSchema['ui:options']?.defaultNamespace;
  const allowArbitraryValues =
    uiSchema['ui:options']?.allowArbitraryValues ?? true;
  const { ownedEntities, loading } = useOwnedEntities(allowedKinds);

  const entityRefs = ownedEntities?.items
    .map(e => humanizeEntityRef(e, { defaultKind, defaultNamespace }))
    .filter(n => n);

  const onSelect = (_: any, value: string | null) => {
    onChange(value || '');
  };

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 && !formData}
    >
      <Autocomplete
        id={idSchema?.$id}
        value={(formData as string) || ''}
        loading={loading}
        onChange={onSelect}
        options={entityRefs || []}
        autoSelect
        freeSolo={allowArbitraryValues}
        renderInput={params => (
          <TextField
            {...params}
            label={title}
            margin="normal"
            helperText={description}
            variant="outlined"
            required={required}
            InputProps={params.InputProps}
          />
        )}
      />
    </FormControl>
  );
};

/**
 * Takes the relevant parts of the Backstage identity, and translates them into
 * a list of entities which are owned by the user. Takes an optional parameter
 * to filter the entities based on allowedKinds
 *
 *
 * @param allowedKinds - Array of allowed kinds to filter the entities
 */
function useOwnedEntities(allowedKinds?: string[]): {
  loading: boolean;
  ownedEntities: GetEntitiesResponse | undefined;
} {
  const identityApi = useApi(identityApiRef);
  const catalogApi = useApi(catalogApiRef);

  const { loading, value: refs } = useAsync(async () => {
    const identity = await identityApi.getBackstageIdentity();
    const identityRefs = identity.ownershipEntityRefs;
    const catalogs = await catalogApi.getEntities(
      allowedKinds
        ? {
            filter: {
              kind: allowedKinds,
              [`relations.${RELATION_OWNED_BY}`]: identityRefs || [],
            },
          }
        : {
            filter: {
              [`relations.${RELATION_OWNED_BY}`]: identityRefs || [],
            },
          },
    );
    return catalogs;
  }, []);

  const ownedEntities = useMemo(() => {
    return refs;
  }, [refs]);

  return useMemo(() => ({ loading, ownedEntities }), [loading, ownedEntities]);
}
