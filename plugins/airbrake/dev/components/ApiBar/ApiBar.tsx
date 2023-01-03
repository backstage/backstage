/*
 * Copyright 2022 The Backstage Authors
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
import { makeStyles, TextField } from '@material-ui/core';
import { Context } from '../ContextProvider';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    gap: '1em',
    flexWrap: 'wrap',
  },
  label: {
    color: '#fff !important',
  },
  outline: {
    color: '#fff !important',
    borderColor: '#fff !important',
  },
});

export const ApiBar = () => {
  const classes = useStyles();

  return (
    <Context.Consumer>
      {value => (
        <div className={classes.root}>
          <TextField
            label="Project ID"
            variant="outlined"
            defaultValue={value.projectId}
            InputLabelProps={{ classes: { root: classes.label } }}
            InputProps={{ classes: { notchedOutline: classes.outline } }}
            onChange={e =>
              value.setProjectId?.(parseInt(e.target.value, 10) || undefined)
            }
          />
        </div>
      )}
    </Context.Consumer>
  );
};
