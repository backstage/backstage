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
import { EntityOwnerFilter } from '../../filters';
import { getEntityRelations } from '../../utils';
import useAsync from 'react-use/lib/useAsync';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '../../api';
import { humanizeEntity, humanizeEntityRef } from '../EntityRefLink/humanize';
import { useEntityFilter, useEntities } from '../../hooks';
import useDeepCompareEffect from 'react-use/lib/useDeepCompareEffect';

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
  const { backendEntities } = useEntities();
  const {
    updateFilters,
    filters,
    queryParameters: { owners: ownersParameter },
  } = useEntityFilter();

  const catalogApi = useApi(catalogApiRef);
  const errorApi = useApi(errorApiRef);

  const queryParamOwners = useMemo(
    () => [ownersParameter].flat().filter(Boolean) as string[],
    [ownersParameter],
  );

  const [selectedOwners, setSelectedOwners] = useState(
    queryParamOwners.length
      ? new EntityOwnerFilter(queryParamOwners).values
      : filters.owners?.values ?? [],
  );

  const {
    loading,
    error,
    value: ownerEntities,
  } = useAsync(async () => {
    const ownerEntityRefs = [
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
    const { items: ownerEntitiesOrNull } = await catalogApi.getEntitiesByRefs({
      entityRefs: ownerEntityRefs,
      fields: [
        'kind',
        'metadata.name',
        'metadata.title',
        'metadata.namespace',
        'spec.profile.displayName',
      ],
    });
    const owners = ownerEntitiesOrNull.map((entity, index) => {
      if (entity) {
        return {
          label: humanizeEntity(entity, { defaultKind: 'Group' }),
          entityRef: stringifyEntityRef(entity),
        };
      }
      return {
        label: humanizeEntityRef(parseEntityRef(ownerEntityRefs[index]), {
          defaultKind: 'group',
        }),
        entityRef: ownerEntityRefs[index],
      };
    });

    return owners.sort((a, b) =>
      a.label.localeCompare(b.label, 'en-US', {
        ignorePunctuation: true,
        caseFirst: 'upper',
      }),
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

  // Set selected owners on query parameter updates; this happens at initial page load and from
  // external updates to the page location.
  useEffect(() => {
    if (queryParamOwners.length) {
      const filter = new EntityOwnerFilter(queryParamOwners);
      setSelectedOwners(filter.values);
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

  useDeepCompareEffect(() => {
    if (!loading && ownerEntities) {
      updateFilters({
        owners:
          selectedOwners.length && availableOwners.length
            ? new EntityOwnerFilter(selectedOwners)
            : undefined,
      });
    }
  }, [selectedOwners, updateFilters, availableOwners, loading]);

  if (!loading && !ownerEntities?.length) return null;

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
              selectedOwners.some((f: string) => f === e.entityRef),
            ) ?? []
          }
          onChange={(_: object, value: { entityRef: string }[]) =>
            setSelectedOwners(value.map(e => e.entityRef))
          }
          getOptionLabel={option => option.label}
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
              label={option.label}
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
