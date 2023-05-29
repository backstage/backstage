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

import React, { useEffect, useState } from 'react';
import { identityApiRef, useApi } from '@backstage/core-plugin-api';
import { TextField, FormControl } from '@material-ui/core';
import {
  OwnershipEntityRefPickerProps,
  OwnershipEntityRefPickerSchema,
} from './schema';
import { Autocomplete } from '@material-ui/lab';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { NotFoundError } from '@backstage/errors';

export { OwnershipEntityRefPickerSchema };

export const OwnershipEntityRefPicker = (
  props: OwnershipEntityRefPickerProps,
) => {
  const { uiSchema, required, rawErrors, formData } = props;

  const identityApi = useApi(identityApiRef);
  const catalogApi = useApi(catalogApiRef);
  const [groups, setGroups] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState('');

  useEffect(() => {
    const fetchUserGroups = async () => {
      const identity = await identityApi.getBackstageIdentity();
      const userIdentity = identity.ownershipEntityRefs;

      if (!userIdentity) {
        throw new NotFoundError('No ownership entity refs found');
      }

      const userOwnedGroups = await catalogApi.getEntities({
        filter: {
          kind: ['Group'],
          'relations.hasMember': userIdentity,
        },
      });
      const groupValues = userOwnedGroups.items.map(item => item.metadata.name);
      setGroups(groupValues);
    };

    fetchUserGroups();
  }, [identityApi, catalogApi]);

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 && !formData}
    >
      <Autocomplete
        id="OwnershipEntityRefPicker-dropdown"
        options={groups || []}
        value={selectedGroup || null}
        onChange={(_, value) => setSelectedGroup(value || '')}
        getOptionLabel={group => group}
        renderInput={params => (
          <TextField
            {...params}
            label={uiSchema['ui:options']?.title}
            margin="dense"
            helperText={uiSchema['ui:options']?.description}
            FormHelperTextProps={{ margin: 'dense', style: { marginLeft: 0 } }}
            variant="outlined"
            required={required}
          />
        )}
      />
    </FormControl>
  );
};
