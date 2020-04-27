/*
 * Copyright 2020 Spotify AB
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

import React, { FC } from 'react';
import { TextField, MenuItem, makeStyles } from '@material-ui/core';
import { Item } from 'components/SingleValueItem/SingleValueItem';

const useStyles = makeStyles({
  root: {
    '& .MuiTextField-root': {
      width: '25ch',
    },
  },
});

type Props = {
  value: string;
  handler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  items: Item[];
};

const Select: FC<Props> = ({ value, handler, items }) => {
  const classes = useStyles();

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <TextField
        select
        label="Select"
        size="small"
        value={value}
        onChange={handler}
        variant="outlined"
      >
        {items.map((option: any) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </form>
  );
};

export default Select;
