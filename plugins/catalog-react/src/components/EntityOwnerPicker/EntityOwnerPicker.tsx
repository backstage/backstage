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
  Entity,
  parseEntityRef,
  RELATION_OWNED_BY,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  Box,
  Checkbox,
  FormControlLabel,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useMemo, useState } from 'react';
import { useEntityList } from '../../hooks/useEntityListProvider';
import { EntityOwnerFilter } from '../../filters';
import { getEntityRelations } from '../../utils';
import { humanizeEntityRef } from '../EntityRefLink';
import useAsync from 'react-use/lib/useAsync';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '../../api';
import { humanizeEntity } from '../EntityRefLink/humanize';

/** @public */
export type CatalogReactEntityOwnerPickerClassKey = 'input';

const useStyles = makeStyles(
  {
    input: {},
  },
  {
    name: 'CatalogReactEntityOwnerPicker',
  },
);

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

/** @public */
export const EntityOwnerPicker = () => {
  const classes = useStyles();
  const {
    updateFilters,
    backendEntities,
    filters,
    queryParameters: { owners: ownersParameter },
  } = useEntityList();
  const catalogApi = useApi(catalogApiRef);

  const queryParamOwners = useMemo(
    () => [ownersParameter].flat().filter(Boolean) as string[],
    [ownersParameter],
  );

  const [selectedOwners, setSelectedOwners] = useState(
    queryParamOwners.length ? queryParamOwners : filters.owners?.values ?? [],
  );

  // Set selected owners on query parameter updates; this happens at initial page load and from
  // external updates to the page location.
  useEffect(() => {
    if (queryParamOwners.length) {
      setSelectedOwners(queryParamOwners);
    }
  }, [queryParamOwners]);

  const availableOwners = useMemo(
    () =>
      [
        ...new Set(
          backendEntities
            .flatMap((e: Entity) =>
              getEntityRelations(e, RELATION_OWNED_BY).map(o =>
                humanizeEntityRef(o, { defaultKind: 'group' }),
              ),
            )
            .filter(Boolean) as string[],
        ),
      ].sort(),
    [backendEntities],
  );

  const {
    loading,
    error,
    value: ownerEntities,
  } = useAsync(async () => {
    const { items } = await catalogApi.getEntitiesByRefs({
      entityRefs: availableOwners.map(ref =>
        stringifyEntityRef(parseEntityRef(ref, { defaultKind: 'Group' })),
      ),
      fields: [
        'kind',
        'metadata.name',
        'metadata.title',
        'spec.profile.displayName',
      ],
    });
    return availableOwners.map(
      (e, i) =>
        items.at(i) || ({ metadata: { name: e }, kind: 'Group' } as Entity),
    );
  }, [availableOwners]);

  useEffect(() => {
    updateFilters({
      owners:
        selectedOwners.length && availableOwners.length
          ? new EntityOwnerFilter(selectedOwners)
          : undefined,
    });
  }, [selectedOwners, updateFilters, availableOwners]);

  if (!availableOwners.length) return null;
  if (error) throw error;

  return (
    <Box pb={1} pt={1}>
      <Typography variant="button" component="label">
        Owner
        <Autocomplete
          multiple
          disableCloseOnSelect
          loading={loading}
          options={ownerEntities || []}
          value={
            ownerEntities?.filter(e =>
              selectedOwners.some(
                f => f === humanizeEntityRef(e, { defaultKind: 'Group' }),
              ),
            ) ?? []
          }
          onChange={(_: object, value: Entity[]) =>
            setSelectedOwners(value.map(e => e.metadata.name))
          }
          getOptionLabel={option =>
            humanizeEntity(option, { defaultKind: 'Group' })
          }
          renderOption={(option, { selected }) => (
            <FormControlLabel
              control={
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  checked={selected}
                />
              }
              onClick={event => event.preventDefault()}
              label={humanizeEntity(option, { defaultKind: 'Group' })}
            />
          )}
          size="small"
          popupIcon={<ExpandMoreIcon data-testid="owner-picker-expand" />}
          renderInput={params => (
            <TextField
              {...params}
              className={classes.input}
              variant="outlined"
            />
          )}
        />
      </Typography>
    </Box>
  );
};
