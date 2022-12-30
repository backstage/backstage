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

import { PopOverFabContentProps } from '../components/popover-fab';
import { useBookmarks } from '../hooks/bookmarks';

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

export function AddBookmark({
  folderIndex,
  close,
}: PopOverFabContentProps<{ folderIndex?: number }>) {
  const { modal, header, textField, form } = useStyles();

  const { addExternalBookmark } = useBookmarks();

  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  const onChangeUrl = useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(ev.target.value);
  }, []);
  const onChangeTitle = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(ev.target.value);
    },
    [],
  );
  const onAdd = useCallback(() => {
    addExternalBookmark(new URL(url.trim()).href, title.trim(), folderIndex);
    close();
  }, [url, title, folderIndex, addExternalBookmark, close]);

  const urlValid = isValidUrl(url.trim());
  const canAdd = urlValid && title.trim();

  return (
    <div className={modal}>
      <h2 className={header}>Add external bookmark</h2>
      <div className={form}>
        <div>
          <TextField
            className={textField}
            label="URL"
            variant="filled"
            required
            onChange={onChangeUrl}
          />
        </div>
        <div>
          <TextField
            className={textField}
            label="Title"
            variant="filled"
            required
            onChange={onChangeTitle}
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

function isValidUrl(url: string) {
  try {
    const _url = new URL(url);
    return !!_url;
  } catch (err) {
    return false;
  }
}
