/*
 * Copyright 2024 The Backstage Authors
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

import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { catalogReactTranslationRef } from '@backstage/plugin-catalog-react/alpha';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useIsMounted } from '@react-hookz/web';
import React, { useEffect, useMemo, useState } from 'react';
import { EntityOwnerFilter } from '../../filters';
import { useEntityList } from '../../hooks';
import { EntityDisplayName } from '../EntityDisplayName';
import { Owner } from './hooks/types';
import { useAllCandidates } from './hooks/useAllCandidates';
import { useMyGroupsCandidates } from './hooks/useMyGroupsCandidates';
import orderBy from 'lodash/orderBy';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import List from '@material-ui/core/List';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';

const useStyles = makeStyles(
  theme => ({
    root: {},
    label: {},
    input: {},
    endIcon: { marginLeft: 'auto', marginRight: 0 },
    outlined: { padding: theme.spacing(0.75, 0.75) },
    chipRoot: { marginBottom: 0 },
  }),
  { name: 'EntityOwnerPicker2' },
);

function useCandidates(
  open: boolean,
  mode: 'my-groups' | 'all',
): { loading: boolean; candidates: Owner[] } {
  const loadMyGroups = open && mode === 'my-groups';
  const myGroupsResult = useMyGroupsCandidates(loadMyGroups);

  const loadAll = open && mode === 'all';
  const allResult = useAllCandidates(loadAll);

  if (loadMyGroups) {
    return myGroupsResult;
  } else if (loadAll) {
    return allResult;
  }

  return { loading: false, candidates: [] };
}

function useOwnerSelection(candidates: Owner[]) {
  const mounted = useIsMounted();

  const {
    updateFilters,
    filters,
    queryParameters: { owners: ownersParameter },
  } = useEntityList();

  const [selected, setSelected] = useState<string[]>([]);

  const queryParamOwners = useMemo(
    () => [ownersParameter].flat().filter(Boolean) as string[],
    [ownersParameter],
  );

  // Set selected owners on query parameter updates; this happens at initial page load and from
  // external updates to the page location.
  useEffect(() => {
    if (queryParamOwners.length) {
      const filter = new EntityOwnerFilter(queryParamOwners);
      setSelected(filter.values);
    }
  }, [queryParamOwners]);

  useEffect(() => {
    updateFilters({
      owners: selected.length
        ? new EntityOwnerFilter(selected.map(o => o))
        : undefined,
    });
  }, [selected, updateFilters]);

  return { selected, setSelected };
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const EntityOwnerPicker2 = () => {
  const classes = useStyles();
  const { t } = useTranslationRef(catalogReactTranslationRef);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'my-groups' | 'all'>('all');
  const { loading, candidates } = useCandidates(open, mode);
  const { selected, setSelected } = useOwnerSelection(candidates);

  return (
    <Box className={classes.root} pb={1} pt={1}>
      <Typography className={classes.label} variant="button" component="label">
        {t('entityOwnerPicker.title')}
        <Autocomplete
          multiple
          limitTags={2}
          disableCloseOnSelect
          size="small"
          id="entity-owner"
          className={classes.root}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          onChange={(_, values) => setSelected(values.map(v => v.entityRef))}
          options={candidates}
          // value={selected}
          loading={loading}
          groupBy={option => option.group?.label ?? ''}
          filterOptions={(items, state) =>
            filterAndSortCandidates(items, state.inputValue)
          }
          getOptionLabel={o => o.label}
          renderOption={(option, { selected: optionIsSelected }) => (
            <React.Fragment>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={optionIsSelected}
              />
              <EntityDisplayName entityRef={option.entityRef} />
            </React.Fragment>
          )}
          getOptionSelected={(a, b) => a.entityRef === b.entityRef}
          renderTags={(value: Owner[], getTagProps) =>
            value.map((option: Owner, index: number) => (
              <Chip
                size="small"
                label={<EntityDisplayName entityRef={option.entityRef} />}
                {...getTagProps({ index })}
              />
            ))
          }
          ListboxComponent={React.forwardRef((props, ref) => {
            const { children, ...other } = props;
            return (
              <div {...other} ref={ref as any}>
                <Tabs
                  value={mode}
                  onChange={(_, value) => setMode(value)}
                  indicatorColor="secondary"
                  textColor="secondary"
                  aria-label="Owner selection mode"
                >
                  <Tab value="my-groups" label="My Groups" />
                  <Tab value="all" label="All" />
                </Tabs>
                <List>{children}</List>
              </div>
            );
          })}
          renderInput={params => (
            <TextField
              {...params}
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          )}
        />
        <Button
          variant="outlined"
          fullWidth
          disableRipple
          classes={{ endIcon: classes.endIcon, outlined: classes.outlined }}
          endIcon={
            <IconButton size="small">
              <ArrowDropDown />
            </IconButton>
          }
        >
          <Chip
            size="small"
            classes={{ root: classes.chipRoot }}
            label={<EntityDisplayName entityRef="user:default/guest" />}
            onDelete={() => {}}
          />
        </Button>
      </Typography>
    </Box>
  );
};

function filterAndSortCandidates(candidates: Owner[], filterValue: string) {
  const filter = filterValue.trim().toLocaleLowerCase('en-US');
  const filtered = filter
    ? candidates.filter(c =>
        c.filterString.toLocaleLowerCase('en-US').includes(filter),
      )
    : candidates;
  return orderBy(filtered, item => `${item.group?.order ?? 9} ${item.label}`);
}
