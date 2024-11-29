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
import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  label: {
    marginLeft: '0px',
    maxWidth: '2rem',
    '& span': {
      paddingRight: '0px',
    },
  },
});

export const SelectAll = ({
  count,
  totalCount,
  onSelectAll,
}: {
  count: number;
  totalCount: number;
  onSelectAll: () => void;
}) => {
  const classes = useStyles();

  return (
    <FormControlLabel
      label={count > 0 ? `(${count})` : undefined}
      className={classes.label}
      control={
        <Checkbox
          color="primary"
          disabled={!totalCount}
          checked={count > 0}
          indeterminate={count > 0 && totalCount !== count}
          onChange={onSelectAll}
        />
      }
    />
  );
};
