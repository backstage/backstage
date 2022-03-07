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

import React, { ChangeEvent, ReactNode } from 'react';
import { FormControl, MenuItem, Select, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  select: {
    fontSize: 'xx-large',
    fontWeight: 'bold',
    width: '16rem',
  },
});

type Props = {
  sortMethodNbr: number;
  handleSortMethodChange:
    | ((
        event: ChangeEvent<{ name?: string | undefined; value: unknown }>,
        child: ReactNode,
      ) => void)
    | undefined;
};

export const SortMethodSelector = ({
  sortMethodNbr,
  handleSortMethodChange,
}: Props) => {
  const classes = useStyles();
  return (
    <FormControl fullWidth>
      <Select
        className={classes.select}
        disableUnderline
        value={sortMethodNbr}
        onChange={handleSortMethodChange}
      >
        <MenuItem value={0}>Latest updated</MenuItem>
        <MenuItem value={1}>A-Z</MenuItem>
        <MenuItem value={2}>Most members</MenuItem>
      </Select>
    </FormControl>
  );
};
