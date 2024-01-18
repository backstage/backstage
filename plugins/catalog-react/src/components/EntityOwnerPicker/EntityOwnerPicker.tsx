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
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  makeStyles,
  Tooltip,
} from '@material-ui/core';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Autocomplete } from '@material-ui/lab';
import React, { useEffect, useMemo, useState } from 'react';
import { useEntityList } from '../../hooks/useEntityListProvider';
import { EntityOwnerFilter } from '../../filters';
import { useDebouncedEffect } from '@react-hookz/web';
import PersonIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/Group';
import { humanizeEntity, humanizeEntityRef } from '../EntityRefLink/humanize';
import { useFetchEntities } from './useFetchEntities';
import { withStyles } from '@material-ui/core/styles';
import { useEntityPresentation } from '../../apis';

/** @public */
export type CatalogReactEntityOwnerPickerClassKey = 'input';

const useStyles = makeStyles(
  {
    input: {},
    fullWidth: { width: '100%' },
    boxLabel: {
      width: '100%',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
  },
  {
    name: 'CatalogReactEntityOwnerPicker',
  },
);

const FixedWidthFormControlLabel = withStyles(
  _theme => ({
    label: {
      width: '100%',
    },
    root: {
      width: '90%',
    },
  }),
  { name: 'FixedWidthFormControlLabel' },
)(FormControlLabel);

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

/**
 * @public
 */
export type EntityOwnerPickerProps = {
  mode?: 'owners-only' | 'all';
};

function RenderOptionLabel(props: { entity: Entity; isSelected: boolean }) {
  const classes = useStyles();
  const isGroup = props.entity.kind.toLocaleLowerCase('en-US') === 'group';
  const { primaryTitle: title } = useEntityPresentation(props.entity);
  return (
    <Box className={classes.fullWidth}>
      <FixedWidthFormControlLabel
        className={classes.fullWidth}
        control={
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            checked={props.isSelected}
          />
        }
        onClick={event => event.preventDefault()}
        label={
          <Tooltip title={title}>
            <Box display="flex" alignItems="center">
              {isGroup ? (
                <GroupIcon fontSize="small" />
              ) : (
                <PersonIcon fontSize="small" />
              )}
              &nbsp;
              <Box className={classes.boxLabel}>
                <Typography noWrap>{title}</Typography>
              </Box>
            </Box>
          </Tooltip>
        }
      />
    </Box>
  );
}

/** @public */
export const EntityOwnerPicker = (props?: EntityOwnerPickerProps) => {
  const classes = useStyles();
  const { mode = 'owners-only' } = props || {};
  const {
    updateFilters,
    filters,
    queryParameters: { owners: ownersParameter },
  } = useEntityList();

  const [text, setText] = useState('');

  const queryParamOwners = useMemo(
    () => [ownersParameter].flat().filter(Boolean) as string[],
    [ownersParameter],
  );

  const [selectedOwners, setSelectedOwners] = useState(
    queryParamOwners.length ? queryParamOwners : filters.owners?.values ?? [],
  );

  const [{ value, loading }, handleFetch, cache] = useFetchEntities({
    mode,
    initialSelectedOwnersRefs: selectedOwners,
  });
  useDebouncedEffect(() => handleFetch({ text }), [text, handleFetch], 250);

  const availableOwners = value?.items || [];

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
            const entity =
              typeof o === 'string'
                ? cache.getEntity(o) ||
                  parseEntityRef(o, {
                    defaultKind: 'group',
                    defaultNamespace: 'default',
                  })
                : o;
            return humanizeEntity(entity, humanizeEntityRef(entity));
          }}
          onChange={(_: object, owners) => {
            setText('');
            setSelectedOwners(
              owners.map(e => {
                const entityRef =
                  typeof e === 'string' ? e : stringifyEntityRef(e);

                if (typeof e !== 'string') {
                  cache.setEntity(e);
                }
                return entityRef;
              }),
            );
          }}
          filterOptions={x => x}
          renderOption={(entity, { selected }) => {
            return <RenderOptionLabel entity={entity} isSelected={selected} />;
          }}
          size="small"
          popupIcon={<ExpandMoreIcon data-testid="owner-picker-expand" />}
          renderInput={params => (
            <TextField
              {...params}
              className={classes.input}
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

              if (hasReachedEnd && value?.cursor) {
                handleFetch({ items: value.items, cursor: value.cursor });
              }
            },
            'data-testid': 'owner-picker-listbox',
          }}
        />
      </Typography>
    </Box>
  );
};
