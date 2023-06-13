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

import React, { useState } from 'react';
import {
  errorApiRef,
  identityApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { TextField, FormControl } from '@material-ui/core';
import {
  OwnershipEntityRefPickerProps,
  OwnershipEntityRefPickerSchema,
} from './schema';
import { Autocomplete } from '@material-ui/lab';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { NotFoundError } from '@backstage/errors';
import useAsync from 'react-use/lib/useAsync';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';

export { OwnershipEntityRefPickerSchema };

export const OwnershipEntityRefPicker = (
  props: OwnershipEntityRefPickerProps,
) => {
  const {
    schema: { title, description },
    required,
    rawErrors,
    onChange,
  } = props;

  const identityApi = useApi(identityApiRef);
  const catalogApi = useApi(catalogApiRef);
  const errorApi = useApi(errorApiRef);
  const [groups, setGroups] = useState<
    {
      label: string;
      ref: string;
    }[]
  >([]);
  const [selectedGroup, setSelectedGroup] = useState<null | {
    label: string;
    ref: string;
  }>(null);

  useAsync(async () => {
    const { ownershipEntityRefs } = await identityApi.getBackstageIdentity();

    if (!ownershipEntityRefs || !ownershipEntityRefs.length) {
      errorApi.post(new NotFoundError('No ownership entity refs found'));
      return;
    }

    const { items } = await catalogApi.getEntitiesByRefs({
      entityRefs: ownershipEntityRefs,
    });

    const groupValues = items
      .filter((e): e is Entity => Boolean(e))
      .map(item => ({
        label: item.metadata.title ?? item.metadata.name,
        ref: stringifyEntityRef(item),
      }));

    setGroups(groupValues);
  });

  const updateChange = (
    _: React.ChangeEvent<{}>,
    value: { label: string; ref: string } | null,
  ) => {
    setSelectedGroup(value);
    onChange(value?.ref ?? '');
  };

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0}
    >
      <Autocomplete
        id="OwnershipEntityRefPicker-dropdown"
        options={groups || []}
        value={selectedGroup}
        onChange={updateChange}
        getOptionLabel={group => group.label}
        renderInput={params => (
          <TextField
            {...params}
            label={title}
            margin="dense"
            helperText={description}
            FormHelperTextProps={{ margin: 'dense', style: { marginLeft: 0 } }}
            variant="outlined"
            required={required}
          />
        )}
      />
    </FormControl>
  );
};
