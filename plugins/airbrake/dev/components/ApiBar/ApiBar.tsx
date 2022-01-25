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
import React, { useState } from 'react';
import { Select, SelectItem } from '@backstage/core-components';
import { makeStyles, TextField } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    gap: '1em',
    flexWrap: 'wrap',
  },
});

export const ApiBar = () => {
  const classes = useStyles();
  const apiOptions: SelectItem[] = [
    { label: 'Fake', value: 'fake' },
    { label: 'Real', value: 'real' },
  ];
  const [api, setApi] = useState<string>('fake');
  const [projectId, setProjectId] = useState<number>();
  const [apiKey, setApiKey] = useState<string>('');

  return (
    <div className={classes.root}>
      <Select
        items={apiOptions}
        label="API"
        selected={api}
        onChange={newValue => setApi(newValue as string)}
      />
      {api === 'real' && (
        <>
          <TextField
            label="Project ID"
            value={projectId}
            onChange={e => setProjectId(parseInt(e.target.value, 10))}
          />
          <TextField
            label="API Key"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
          />
        </>
      )}
    </div>
  );
};
