/*
 * Copyright 2020 The Backstage Authors
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
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(() => ({
  root: {
    '& > *': {
      width: '50ch',
      'margin-right': '40ch',
      'margin-bottom': '1ch',
    },
  },
}));

export const InputTextFilter = ({
  searchCategory,
}: {
  searchCategory: any;
}) => {
  const classes = useStyles();

  const [, setSearchCategory] = React.useState('');

  const setSearchCategoryValue = (event: any) => {
    setSearchCategory(event.target.value);
  };

  return (
    <>
      <div>
        <form className={classes.root} noValidate autoComplete="off">
          <TextField
            id="standard-basic"
            label="Search"
            onChange={e => {
              searchCategory(e);
              setSearchCategoryValue(e);
            }}
          />
        </form>
      </div>
    </>
  );
};
