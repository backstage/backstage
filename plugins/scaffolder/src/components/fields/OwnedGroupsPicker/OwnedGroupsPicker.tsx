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

import React from 'react';
import { identityApiRef, useApi } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { EntityPicker } from '../EntityPicker/EntityPicker';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { OwnedGroupsPickerProps } from './schema';
import { TextField } from '@material-ui/core';

export { OwnedGroupsPickerSchema } from './schema';

export const OwnedGroupsPicker = (props: OwnedGroupsPickerProps) => {
  const {
    schema: { title = 'Group', description = 'A group from the catalog' },
    uiSchema,
    required,
  } = props;

  const identityApi = useApi(identityApiRef);
  const { loading, value: identityRefs } = useAsync(async () => {
    const identity = await identityApi.getBackstageIdentity();
    return identity.userEntityRef;
  });

  const catalogFilter = {
    kind: 'group',
    ['relations.hasMember']: identityRefs || [],
  };

  const groupUiSchema = {
    ...uiSchema,
    'ui:options': {
      catalogFilter,
      defaultKind: 'group',
    },
  };

  if (loading) {
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
          />
        )}
        options={[]}
      />
    );
  }

  return (
    <EntityPicker
      {...props}
      schema={{ title, description }}
      uiSchema={groupUiSchema}
      catalogFilter={catalogFilter}
    />
  );
};
