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

import React, { FC, useState } from 'react';
import {
  Grid,
  Button,
  TextField,
  LinearProgress,
  Typography,
  Dialog,
  DialogTitle,
} from '@material-ui/core';

import {
  InfoCard,
  Content,
  ContentHeader,
  SimpleStepper,
  SimpleStepperStep,
  StructuredMetadataTable,
  useApi,
  googleAuthApiRef,
} from '@backstage/core';

import { GCPApiRef } from '../../api';
import { useAsync } from 'react-use';

export const NewProjectPage: FC<{}> = () => {
  const [projectName, setProjectName] = useState('');
  const [projectId, setProjectId] = useState('');
  interface SimpleDialogProps {
    open: boolean;
    onClose: () => void;
  }

  function SimpleDialog(props: SimpleDialogProps) {
    const { onClose, open } = props;

    const handleClose = () => {
      onClose();
    };

    return (
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <ResponseFromMiddleman
          projectName={projectName}
          projectId={projectId}
        />
      </Dialog>
    );
  }

  const [done, setDone] = useState(false);

  const metadata = {
    ProjectName: projectName,
    ProjectId: projectId,
  };

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const createNewProject = () => {
    setOpen(true);
  };

  return (
    <Content>
      <ContentHeader title="Create new GCP Project" />
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <InfoCard>
            <SimpleStepper>
              <SimpleStepperStep title="Project Name">
                <TextField
                  variant="outlined"
                  name="projectName"
                  label="Project Name"
                  helperText="The name of the new project."
                  inputProps={{ 'aria-label': 'Project Name' }}
                  onChange={e => setProjectName(e.target.value)}
                  value={projectName}
                  fullWidth
                />
              </SimpleStepperStep>
              <SimpleStepperStep title="Project ID">
                <TextField
                  variant="outlined"
                  name="projectId"
                  label="projectId"
                  onChange={e => setProjectId(e.target.value)}
                  value={projectId}
                  fullWidth
                />
              </SimpleStepperStep>
              <SimpleStepperStep title="Commit" end>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setDone(true)}
                >
                  Finish
                </Button>
              </SimpleStepperStep>
            </SimpleStepper>
          </InfoCard>
        </Grid>
        {done === true ? (
          <Grid item xs={12} md={8}>
            <InfoCard title="Project Info:">
              <StructuredMetadataTable metadata={metadata} />
              <br />
              <br />
              <br />
              <Button
                variant="contained"
                color="primary"
                onClick={createNewProject}
              >
                Confirm
              </Button>
              <SimpleDialog open={open} onClose={handleClose} />
            </InfoCard>
          </Grid>
        ) : (
          <br />
        )}
      </Grid>
    </Content>
  );
};

export const ResponseFromMiddleman: FC<{
  projectName: string;
  projectId: string;
}> = ({ projectName, projectId }) => {
  const api = useApi(GCPApiRef);
  const googleAuthApi = useApi(googleAuthApiRef);
  const profile = googleAuthApi.getProfile();
  const { loading, error, value } = useAsync(async () => {
    const result = api.createProject(projectName, projectId, profile);
    return await result;
  });

  if (loading) {
    return (
      <DialogTitle id="simple-dialog-title" title="Middleman">
        Waiting for middleman to respond...
        <LinearProgress />
      </DialogTitle>
    );
  }

  if (error) {
    return (
      <Typography variant="h2" color="error">
        Failed to talk to middleman, with err: {error.message}{' '}
      </Typography>
    );
  }

  return (
    <InfoCard title="Pull request created">
      <DialogTitle id="simple-dialog-title" title="Pull Request">
        <a
          target="_blank"
          href={value}
          className="MuiTypography-root MuiLink-root MuiLink-underlineHover MuiTypography-colorPrimary"
        >
          {value}
        </a>
        <br />
        <br />
      </DialogTitle>
      <Button variant="contained" color="primary" href="/gcp-projects">
        Close
      </Button>
    </InfoCard>
  );
};
