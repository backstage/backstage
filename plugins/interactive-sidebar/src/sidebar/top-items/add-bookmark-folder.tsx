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

import React, { useState, useCallback } from 'react';

import { makeStyles, TextField, Button } from '@material-ui/core';

import { useBookmarks } from '../hooks/bookmarks';

import { PopOverFabContentProps } from '../components/popover-fab';

const useStyles = makeStyles(() => ({
  modal: { padding: 8 },
  header: {
    textAlign: 'center',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    margin: 16,
    gap: 16,
    maxHeight: 450,
    overflowY: 'auto',
  },
  textField: {
    width: 500,
  },
}));

export function AddBookmarkFolder({ close }: PopOverFabContentProps) {
  const { modal, header, textField, form } = useStyles();

  const { addBookmarkFolder } = useBookmarks();

  const [name, setName] = useState('');

  const onChangeName = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setName(ev.target.value);
    },
    [],
  );

  const onAdd = useCallback(() => {
    addBookmarkFolder(name.trim());
    close();
  }, [name, addBookmarkFolder, close]);

  const canAdd = !!name.trim();

  return (
    <div className={modal}>
      <h2 className={header}>Add bookmark folder</h2>
      <div className={form}>
        <div>
          <TextField
            className={textField}
            label="Name"
            variant="filled"
            required
            onChange={onChangeName}
          />
        </div>
        <div>
          <Button
            variant="contained"
            color="primary"
            disabled={!canAdd}
            onClick={onAdd}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
