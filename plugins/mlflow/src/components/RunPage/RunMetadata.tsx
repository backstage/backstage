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
  makeStyles,
  Button,
  FormControl,
  FormGroup,
  // Modal,
  TextField,
  Theme,
} from '@material-ui/core';
import { Run, RunTag } from '../../MLFlowClient';
import { mlFlowClient } from '../../index';
import { InfoCard, Link, StructuredMetadataTable } from '@backstage/core';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles<Theme>(() => ({
  submitButton: {
    order: -1,
    marginRight: 0,
    marginLeft: '-20px',
  },
}));

type RunMetadataProps = {
  run: Run;
};

function getNoteText(tags: RunTag[]): string {
  const theKey = tags.find(tag => tag.key === 'mlflow.note.content');
  return theKey ? theKey.value : '';
}

const RunMetadata = ({ run }: RunMetadataProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [noteText, setNoteText] = useState<string>(getNoteText(run.data.tags));
  const [experimentName, setExperimentName] = useState<string>();

  // Turn the experiment_id into a name
  mlFlowClient
    .getExperiment(run.info.experiment_id)
    .then(exp => setExperimentName(exp.name))
    .catch(_ => setExperimentName(`ID: ${run.info.experiment_id}`));

  const noteElement: JSX.Element = (
    <div>
      {noteText}
      <Button onClick={() => setOpen(!open)}>
        <EditIcon fontSize="small" />
      </Button>
    </div>
  );

  const handleNoteSubmit = (textToUpdate: string) => {
    mlFlowClient
      .setTag(run.info.run_id, 'mlflow.note.content', textToUpdate)
      .then(() => {
        setNoteText(textToUpdate);
        setOpen(false);
      });
  };

  const source = run.data.tags.find(tag => tag.key === 'mlflow.source.name');
  const environment = run.data.tags.find(
    tag => tag.key === 'mlflow.source.type',
  );

  const metadataInfo = {
    experimentName: experimentName,
    status: run.info.status,
    submittedBy: run.info.user_id,
    startTime: new Date(parseInt(run.info.start_time, 10)).toLocaleString(),
    endTime: new Date(parseInt(run.info.end_time, 10)).toLocaleString(),
    source: source ? source.value : '',
    executionEnvironment: environment ? environment.value : '',
    runNotes: noteElement,
  };

  return (
    <InfoCard title="Run Details">
      <StructuredMetadataTable metadata={metadataInfo} />
      {open && (
        <NewNoteForm
          initialNoteText={noteText}
          handleSubmit={handleNoteSubmit}
          handleCancel={() => setOpen(false)}
        />
      )}
    </InfoCard>
  );
};
export default RunMetadata;

type NewTagFormProps = {
  initialNoteText?: string;
  handleSubmit: Function;
  handleCancel: Function;
};

const NewNoteForm = ({
  initialNoteText,
  handleSubmit,
  handleCancel,
}: NewTagFormProps) => {
  const classes = useStyles();
  const [noteText, setNoteText] = useState<string>(initialNoteText || '');
  return (
    <form
      onSubmit={ev => {
        ev.preventDefault();
        handleSubmit(noteText);
      }}
    >
      <FormGroup>
        <FormControl>
          <TextField
            variant="outlined"
            multiline
            rows={4}
            label="Note"
            name="noteText"
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <Button
            type="submit"
            className={classes.submitButton}
            color="primary"
            variant="contained"
          >
            Set Note
          </Button>
        </FormControl>
        <FormControl>
          <Button
            className={classes.submitButton}
            color="primary"
            variant="contained"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </FormControl>
      </FormGroup>
    </form>
  );
};
