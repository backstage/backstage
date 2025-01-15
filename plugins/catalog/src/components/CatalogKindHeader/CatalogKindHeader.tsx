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

import React, { useEffect, useState, useMemo } from 'react';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
  EntityKindFilter,
  useEntityList,
} from '@backstage/plugin-catalog-react';
import pluralize from 'pluralize';
import { filterKinds, useAllKinds } from './kindFilterUtils';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      ...theme.typography.h4,
    },
  }),
);

/**
 * Props for {@link CatalogKindHeader}.
 *
 * @public
 */
export interface CatalogKindHeaderProps {
  /**
   * Entity kinds to show in the dropdown; by default all kinds are fetched from the catalog and
   * displayed.
   */
  allowedKinds?: string[];
  /**
   * The initial kind to select; defaults to 'component'. A kind filter entered directly in the
   * query parameter will override this value.
   */
  initialFilter?: string;
}

/**
 * @public
 * @deprecated This component has been deprecated in favour of the EntityKindPicker in the list of filters. If you wish to keep this component long term make sure to raise an issue at github.com/backstage/backstage
 */
export function CatalogKindHeader(props: CatalogKindHeaderProps) {
  const { initialFilter = 'component', allowedKinds } = props;
  const classes = useStyles();
  const { allKinds } = useAllKinds();
  const {
    filters,
    updateFilters,
    queryParameters: { kind: kindParameter },
  } = useEntityList();

  const queryParamKind = useMemo(
    () => [kindParameter].flat()[0],
    [kindParameter],
  );

  const [selectedKind, setSelectedKind] = useState(
    queryParamKind ?? filters.kind?.value ?? initialFilter,
  );

  // Set selected kinds on query parameter updates; this happens at initial page load and from
  // external updates to the page location.
  useEffect(() => {
    if (queryParamKind) {
      setSelectedKind(queryParamKind);
    }
  }, [queryParamKind]);

  // Set selected kind from filters; this happens when the kind filter is
  // updated from another component
  useEffect(() => {
    if (filters.kind?.value) {
      setSelectedKind(filters.kind?.value);
    }
  }, [filters.kind]);

  const selectedKindLabel =
    allKinds.get(selectedKind.toLocaleLowerCase('en-US')) || selectedKind;

  useEffect(() => {
    updateFilters({
      kind: selectedKind
        ? new EntityKindFilter(selectedKind, selectedKindLabel)
        : undefined,
    });
  }, [selectedKind, selectedKindLabel, updateFilters]);

  const options = filterKinds(allKinds, allowedKinds, selectedKind);

  return (
    <Select
      input={<InputBase />}
      value={selectedKind.toLocaleLowerCase('en-US')}
      onChange={e => setSelectedKind(e.target.value as string)}
      classes={classes}
    >
      {[...options.keys()].map(kind => (
        <MenuItem value={kind} key={kind}>
          {`${pluralize(options.get(kind) || kind)}`}
        </MenuItem>
      ))}
    </Select>
  );
}
