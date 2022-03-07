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
import {
  capitalize,
  createStyles,
  InputBase,
  makeStyles,
  MenuItem,
  Select,
  Theme,
} from '@material-ui/core';
import {
  catalogApiRef,
  EntityKindFilter,
  useEntityList,
} from '@backstage/plugin-catalog-react';
import useAsync from 'react-use/lib/useAsync';
import { useApi } from '@backstage/core-plugin-api';

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

/** @public */
export function CatalogKindHeader(props: CatalogKindHeaderProps) {
  const { initialFilter = 'component', allowedKinds } = props;
  const classes = useStyles();
  const catalogApi = useApi(catalogApiRef);
  const { value: allKinds } = useAsync(async () => {
    return await catalogApi
      .getEntityFacets({ facets: ['kind'] })
      .then(response => response.facets.kind?.map(f => f.value).sort() || []);
  });
  const {
    updateFilters,
    queryParameters: { kind: kindParameter },
  } = useEntityList();

  const queryParamKind = useMemo(
    () => [kindParameter].flat()[0]?.toLocaleLowerCase('en-US'),
    [kindParameter],
  );
  const [selectedKind, setSelectedKind] = useState(
    queryParamKind ?? initialFilter,
  );

  useEffect(() => {
    updateFilters({
      kind: selectedKind ? new EntityKindFilter(selectedKind) : undefined,
    });
  }, [selectedKind, updateFilters]);

  // Set selected Kind on query parameter updates; this happens at initial page load and from
  // external updates to the page location.
  useEffect(() => {
    if (queryParamKind) {
      setSelectedKind(queryParamKind);
    }
  }, [queryParamKind]);

  // Before allKinds is loaded, or when a kind is entered manually in the URL, selectedKind may not
  // be present in allKinds. It should still be shown in the dropdown, but may not have the nice
  // enforced casing from the catalog-backend. This makes a key/value record for the Select options,
  // including selectedKind if it's unknown - but allows the selectedKind to get clobbered by the
  // more proper catalog kind if it exists.
  const availableKinds = [capitalize(selectedKind)].concat(
    allKinds?.filter(k =>
      allowedKinds
        ? allowedKinds.some(
            a => a.toLocaleLowerCase('en-US') === k.toLocaleLowerCase('en-US'),
          )
        : true,
    ) ?? [],
  );
  const options = availableKinds.sort().reduce((acc, kind) => {
    acc[kind.toLocaleLowerCase('en-US')] = kind;
    return acc;
  }, {} as Record<string, string>);

  return (
    <Select
      input={<InputBase value={selectedKind} />}
      value={selectedKind}
      onChange={e => setSelectedKind(e.target.value as string)}
      classes={classes}
    >
      {Object.keys(options).map(kind => (
        <MenuItem value={kind} key={kind}>
          {`${options[kind]}s`}
        </MenuItem>
      ))}
    </Select>
  );
}
