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
import React, { useState } from 'react';
import {
  Modal,
  Chip,
  TextField,
  Button,
  Theme,
  makeStyles,
  FormControl,
  FormGroup,
} from '@material-ui/core';
import { RunTag } from '../../MLFlowClient';
import { mlFlowClient } from '../../index';

const [top, left] = [50, 50];
const useStyles = makeStyles<Theme>(() => ({
  button: {
    order: -1,
    marginRight: 0,
    marginLeft: '-20px',
  },
  modal: {
    top: `${top}%`,
    left: `${left}%`,
    display: 'flex',
    alignItems: 'center',
    width: '550px',
    height: '250px',
    justifyContent: 'center',
    margin: 'auto',
    border: '1px solid',
    backgroundColor: '#FFFFFF',
  },
}));

type RunTagsProps = {
  runId: string;
  tags: RunTag[];
};

const RunTags = ({ runId, tags }: RunTagsProps) => {
  const [tagState, setTagState] = useState<RunTag[]>(tags);
  const [open, setOpen] = useState<boolean>(false);

  const plusTag = (
    <Chip
      key={-1}
      label="+"
      onClick={() => {
        setOpen(true);
      }}
    />
  );

  function removeTag(tagToRemove: RunTag) {
    mlFlowClient.deleteTag(runId, tagToRemove.key).then(() => {
      setTagState(tagState.filter(t => t !== tagToRemove));
    });
  }

  function handleNewTagSubmit(key: string, value: string) {
    mlFlowClient.setTag(runId, key, value).then(() => {
      setOpen(false);
      setTagState([...tagState, { key: key, value: value }]);
    });
  }

  const tagChips = tagState
    .filter(tag => !tag.key.startsWith('mlflow.'))
    .map((tag, i) => (
      <Chip
        key={i}
        label={`${tag.key} : ${tag.value}`}
        onDelete={() => removeTag(tag)}
      />
    ));

  tagChips.push(plusTag);

  return (
    <>
      {tagChips}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="new tag form"
        aria-describedby="new tag form"
      >
        <NewTagForm handleSubmit={handleNewTagSubmit} />
      </Modal>
    </>
  );
};

export default RunTags;

type NewTagFormProps = {
  handleSubmit: Function;
};

const NewTagForm = ({ handleSubmit }: NewTagFormProps) => {
  const classes = useStyles();
  const [tagKey, setTagKey] = useState<string>('');
  const [tagValue, setTagValue] = useState<string>('');
  return (
    <div className={classes.modal}>
      <form
        onSubmit={ev => {
          ev.preventDefault();
          handleSubmit(tagKey, tagValue);
        }}
      >
        <FormGroup>
          <FormControl>
            <TextField
              variant="outlined"
              label="Tag Key"
              name="tagKey"
              value={tagKey}
              onChange={e => setTagKey(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <TextField
              variant="outlined"
              label="Tag Value"
              name="tagValue"
              value={tagValue}
              onChange={e => setTagValue(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <Button
              type="submit"
              className={classes.button}
              color="primary"
              variant="contained"
            >
              Create Tag
            </Button>
          </FormControl>
        </FormGroup>
      </form>
    </div>
  );
};
