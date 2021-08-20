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

import React, { useEffect, useState } from 'react';
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
  EntityKindFilter,
  useEntityKinds,
  useEntityListProvider,
} from '@backstage/plugin-catalog-react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      ...theme.typography.h4,
    },
  }),
);

type CatalogKindHeaderProps = {
  initialFilter?: string;
};

export const CatalogKindHeader = ({
  initialFilter = 'component',
}: CatalogKindHeaderProps) => {
  const classes = useStyles();
  const { kinds: allKinds = [] } = useEntityKinds();
  const { updateFilters, queryParameters } = useEntityListProvider();

  const [selectedKind, setSelectedKind] = useState(
    ([queryParameters.kind].flat()[0] ?? initialFilter).toLocaleLowerCase(
      'en-US',
    ),
  );

  useEffect(() => {
    updateFilters({
      kind: selectedKind ? new EntityKindFilter(selectedKind) : undefined,
    });
  }, [selectedKind, updateFilters]);

  // Before allKinds is loaded, or when a kind is entered manually in the URL, selectedKind may not
  // be present in allKinds. It should still be shown in the dropdown, but may not have the nice
  // enforced casing from the catalog-backend. This makes a key/value record for the Select options,
  // including selectedKind if it's unknown - but allows the selectedKind to get clobbered by the
  // more proper catalog kind if it exists.
  const options = [capitalize(selectedKind)]
    .concat(allKinds)
    .sort()
    .reduce((acc, kind) => {
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
};
