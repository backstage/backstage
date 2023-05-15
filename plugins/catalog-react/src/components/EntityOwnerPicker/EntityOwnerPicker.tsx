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

import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
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
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useEntityList } from '../../hooks/useEntityListProvider';
import { EntityOwnerFilter } from '../../filters';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '../../api';
import useAsync from 'react-use/lib/useAsync';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import { useDebouncedEffect } from '@react-hookz/web';
import PersonIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/Group';
import { humanizeEntity } from '../EntityRefLink/humanize';

/** @public */
export type CatalogReactEntityOwnerPickerClassKey = 'input';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

/** @public */
export const EntityOwnerPicker = () => {
  const {
    updateFilters,
    filters,
    queryParameters: { owners: ownersParameter },
  } = useEntityList();

  const catalogApi = useApi(catalogApiRef);
  const [text, setText] = useState('');

  const [{ value, loading }, handleFetch] = useAsyncFn(
    async (request: { text: string } | { cursor: string; prev: Entity[] }) => {
      const initialRequest = request as { text: string };
      const cursorRequest = request as { cursor: string; prev: Entity[] };
      const limit = 20;

      if (cursorRequest.cursor) {
        const response = await catalogApi.queryEntities({
          cursor: cursorRequest.cursor,
          limit,
        });
        return {
          ...response,
          items: [...cursorRequest.prev, ...response.items],
        };
      }

      return catalogApi.queryEntities({
        fullTextFilter: {
          term: initialRequest.text || '',
          fields: [
            'metadata.name',
            'kind',
            'spec.profile.displayname',
            'metadata.title',
          ],
        },
        filter: { kind: ['User', 'Group'] },
        orderFields: [{ field: 'metadata.name', order: 'asc' }],
        limit,
      });
    },
    [text],
  );

  useDebouncedEffect(() => handleFetch({ text }), [text], 250);

  const availableOwners = value?.items || [];

  const queryParamOwners = useMemo(
    () => [ownersParameter].flat().filter(Boolean) as string[],
    [ownersParameter],
  );

  const [selectedOwners, setSelectedOwners] = useState(
    queryParamOwners.length ? queryParamOwners : filters.owners?.values ?? [],
  );

  const { getEntity, setEntity } = useSelectedOwners(selectedOwners);

  // Set selected owners on query parameter updates; this happens at initial page load and from
  // external updates to the page location.
  useEffect(() => {
    if (queryParamOwners.length) {
      const filter = new EntityOwnerFilter(queryParamOwners);
      setSelectedOwners(filter.values);
    }
  }, [queryParamOwners]);

  useEffect(() => {
    updateFilters({
      owners: selectedOwners.length
        ? new EntityOwnerFilter(selectedOwners)
        : undefined,
    });
  }, [selectedOwners, updateFilters]);

  if (
    ['user', 'group'].includes(
      filters.kind?.value.toLocaleLowerCase('en-US') || '',
    )
  ) {
    return null;
  }

  return (
    <Box pb={1} pt={1}>
      <Typography variant="button" component="label">
        Owner
        <Autocomplete
          multiple
          disableCloseOnSelect
          loading={loading}
          options={availableOwners}
          value={selectedOwners as unknown as Entity[]}
          getOptionSelected={(o, v) => {
            if (typeof v === 'string') {
              return stringifyEntityRef(o) === v;
            }
            return o === v;
          }}
          getOptionLabel={o => {
            const entity = typeof o === 'string' ? getEntity(o) || o : o;

            return typeof entity === 'string'
              ? entity
              : humanizeEntity(entity, entity.metadata.name);
          }}
          onChange={(_: object, owners) => {
            setText('');
            setSelectedOwners(
              owners.map(e => {
                const entityRef =
                  typeof e === 'string' ? e : stringifyEntityRef(e);

                if (typeof e !== 'string') {
                  setEntity(e);
                }

                return entityRef;
              }),
            );
          }}
          filterOptions={x => x}
          renderOption={(entity, { selected }) => {
            const isGroup = entity.kind === 'Group';

            return (
              <FormControlLabel
                control={
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    checked={selected}
                  />
                }
                onClick={event => event.preventDefault()}
                label={
                  <Box display="flex" flexWrap="wrap" alignItems="center">
                    {isGroup ? (
                      <GroupIcon fontSize="small" />
                    ) : (
                      <PersonIcon fontSize="small" />
                    )}
                    &nbsp;
                    {humanizeEntity(entity, entity.metadata.name)}
                  </Box>
                }
              />
            );
          }}
          size="small"
          popupIcon={<ExpandMoreIcon data-testid="owner-picker-expand" />}
          renderInput={params => (
            <TextField
              {...params}
              onChange={e => {
                setText(e.currentTarget.value);
              }}
              variant="outlined"
            />
          )}
          ListboxProps={{
            onScroll: (e: React.MouseEvent) => {
              const element = e.currentTarget;
              const hasReachedEnd =
                Math.abs(
                  element.scrollHeight -
                    element.clientHeight -
                    element.scrollTop,
                ) < 1;

              if (hasReachedEnd && value?.pageInfo.nextCursor) {
                handleFetch({
                  cursor: value.pageInfo.nextCursor,
                  prev: value.items,
                });
              }
            },
            'data-testid': 'owner-picker-listbox',
          }}
        />
      </Typography>
    </Box>
  );
};

/**
 * Hook used for storing the full entity of the specified owners
 * in order to display users and group using the information contained on each entity.
 * When a component is rendered for the first time, it loads the content of the entities
 * specified by `initialSelectedOwnersRefs` and export the `getEntity` and `setEntity`
 * utilities, used to retrieve and modify the owners.
 */
function useSelectedOwners(initialSelectedOwnersRefs: string[]) {
  const allEntities = useRef<Record<string, Entity>>({});
  const catalogApi = useApi(catalogApiRef);

  useAsync(async () => {
    if (initialSelectedOwnersRefs.length === 0) {
      return;
    }
    const initialSelectedEntities = await catalogApi.getEntitiesByRefs({
      entityRefs: initialSelectedOwnersRefs,
    });
    initialSelectedEntities.items.forEach(e => {
      if (e) {
        allEntities.current[stringifyEntityRef(e)] = e;
      }
    });
  }, []);

  return {
    getEntity: (entityRef: string) => allEntities.current[entityRef],
    setEntity: (entity: Entity) => {
      allEntities.current[stringifyEntityRef(entity)] = entity;
    },
  };
}
