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

import { Entity, RELATION_OWNED_BY } from '@backstage/catalog-model';
import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useMemo, useState } from 'react';
import { useEntityListProvider } from '../../hooks/useEntityListProvider';
import { EntityOwnerFilter } from '../../filters';
import { getEntityRelations } from '../../utils';
import { formatEntityRefTitle } from '../EntityRefLink';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const EntityOwnerPicker = () => {
  const { updateFilters, backendEntities, filters, queryParameters } =
    useEntityListProvider();

  const queryParamOwners = [queryParameters.owners]
    .flat()
    .filter(Boolean) as string[];
  const [selectedOwners, setSelectedOwners] = useState(
    queryParamOwners.length ? queryParamOwners : filters.owners?.values ?? [],
  );

  useEffect(() => {
    updateFilters({
      owners: selectedOwners.length
        ? new EntityOwnerFilter(selectedOwners)
        : undefined,
    });
  }, [selectedOwners, updateFilters]);

  const availableOwners = useMemo(
    () =>
      [
        ...new Set(
          backendEntities
            .flatMap((e: Entity) =>
              getEntityRelations(e, RELATION_OWNED_BY).map(o =>
                formatEntityRefTitle(o, { defaultKind: 'group' }),
              ),
            )
            .filter(Boolean) as string[],
        ),
      ].sort(),
    [backendEntities],
  );

  if (!availableOwners.length) return null;

  return (
    <Box pb={1} pt={1}>
      <Typography variant="button">Owner</Typography>
      <Autocomplete<string>
        multiple
        aria-label="Owner"
        options={availableOwners}
        value={selectedOwners}
        onChange={(_: object, value: string[]) => setSelectedOwners(value)}
        renderOption={(option, { selected }) => (
          <FormControlLabel
            control={
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                checked={selected}
              />
            }
            label={option}
          />
        )}
        size="small"
        popupIcon={<ExpandMoreIcon data-testid="owner-picker-expand" />}
        renderInput={params => <TextField {...params} variant="outlined" />}
      />
    </Box>
  );
};
