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
import useAsync from 'react-use/lib/useAsync';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '../../api';
import { humanizeEntity, humanizeEntityRef } from '../EntityRefLink/humanize';

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
  const errorApi = useApi(errorApiRef);

  const queryParamOwners = useMemo(
    () => [ownersParameter].flat().filter(Boolean) as string[],
    [ownersParameter],
  );

  const {
    loading,
    error,
    value: ownerEntities,
  } = useAsync(async () => {
    const availableOwners = [
      ...new Set(
        backendEntities
          .flatMap((e: Entity) =>
            getEntityRelations(e, RELATION_OWNED_BY).map(o =>
              stringifyEntityRef(o),
            ),
          )
          .filter(Boolean) as string[],
      ),
    ];
    const { items } = await catalogApi.getEntitiesByRefs({
      entityRefs: availableOwners,
      fields: [
        'kind',
        'metadata.name',
        'metadata.title',
        'metadata.namespace',
        'spec.profile.displayName',
      ],
    });
    return (
      availableOwners
        .map(
          (e, i) =>
            items[i] || ({ metadata: { name: e }, kind: 'Group' } as Entity),
        )
        // Keep the previous sorting logic.
        .sort((a, b) => {
          const nameA = humanizeEntity(a).toLocaleUpperCase('en-US'); // ignore upper and lowercase
          const nameB = humanizeEntity(b).toLocaleUpperCase('en-US'); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        })
    );
  }, [backendEntities]);

  useEffect(() => {
    if (error) {
      errorApi.post(
        {
          ...error,
          message: `EntityOwnerPicker failed to initialize: ${error.message}`,
        },
        {},
      );
    }
  }, [error, errorApi]);

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

  useEffect(() => {
    if (!loading && ownerEntities) {
      updateFilters({
        owners:
          selectedOwners.length && ownerEntities.length
            ? new EntityOwnerFilter(selectedOwners)
            : undefined,
      });
    }
  }, [selectedOwners, updateFilters, ownerEntities, loading]);

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
            setSelectedOwners(
              value.map(e => humanizeEntityRef(e, { defaultKind: 'Group' })),
            )
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
              error={!!error}
              className={classes.input}
              variant="outlined"
            />
          )}
        />
      </Typography>
    </Box>
  );
};
