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
import { RELATION_OWNED_BY } from '@backstage/catalog-model';
import { identityApiRef, useApi } from '@backstage/core-plugin-api';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React from 'react';
import useAsync from 'react-use/lib/useAsync';
import { EntityPicker } from '../EntityPicker/EntityPicker';

import { OwnedEntityPickerProps } from './schema';
import { EntityPickerUiOptions } from '../EntityPicker';

export { OwnedEntityPickerSchema } from './schema';

/**
 * The underlying component that is rendered in the form for the `OwnedEntityPicker`
 * field extension.
 *
 * @public
 */
export const OwnedEntityPicker = (props: OwnedEntityPickerProps) => {
  const {
    schema: { title = 'Entity', description = 'An entity from the catalog' },
    uiSchema,
    required,
  } = props;

  const identityApi = useApi(identityApiRef);
  const { loading, value: identityRefs } = useAsync(async () => {
    const identity = await identityApi.getBackstageIdentity();
    return identity.ownershipEntityRefs;
  }, [identityApi]);

  if (loading)
    return (
      <Autocomplete
        loading={loading}
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
        options={[]}
      />
    );

  const allowedKinds = uiSchema['ui:options']?.allowedKinds;
  const uiOptions: EntityPickerUiOptions = {
    ...uiSchema['ui:options'],
    catalogFilter: {
      ...(allowedKinds ? { kind: allowedKinds } : {}),
      [`relations.${RELATION_OWNED_BY}`]: identityRefs ?? [],
    },
  };
  delete uiOptions.allowedKinds;

  return (
    <EntityPicker
      {...props}
      schema={{ title, description }}
      uiSchema={{
        ...uiSchema,
        'ui:options': uiOptions,
      }}
    />
  );
};
