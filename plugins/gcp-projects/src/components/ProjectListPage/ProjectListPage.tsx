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

//  NEEDS WORK

import { Link, useApi, googleAuthApiRef, InfoCard } from '@backstage/core';
import {
  LinearProgress,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Tooltip,
  Typography,
  Button,
} from '@material-ui/core';
import React from 'react';
import { useAsync } from 'react-use';
import { GCPApiRef, Project } from '../../api';

const LongText = ({ text, max }: { text: string; max: number }) => {
  if (text.length < max) {
    return <span>{text}</span>;
  }
  return (
    <Tooltip title={text}>
      <span>{text.slice(0, max)}...</span>
    </Tooltip>
  );
};

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  title: {
    padding: theme.spacing(1, 0, 2, 0),
  },
}));

const PageContents = () => {
  const api = useApi(GCPApiRef);
  const googleApi = useApi(googleAuthApiRef);

  const { loading, error, value } = useAsync(async () => {
    const token = await googleApi.getAccessToken(
      'https://www.googleapis.com/auth/cloud-platform.read-only',
    );

    const projects = api.listProjects({ token });
    return projects;
  });

  if (loading) {
    return <LinearProgress />;
  }

  if (error) {
    return (
      <Typography variant="h2" color="error">
        Failed to load projects, {error.message}{' '}
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="GCP Projects table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Project Number</TableCell>
            <TableCell>Project ID</TableCell>
            <TableCell>State</TableCell>
            <TableCell>Creation Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {value?.map((project: Project) => (
            <TableRow key={project.projectId}>
              <TableCell>
                <Typography>
                  <LongText text={project.name} max={30} />
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>
                  <LongText text={project?.projectNumber || 'Error'} max={30} />
                </Typography>
              </TableCell>
              <TableCell>
                <Link
                  to={`project?projectId=${encodeURIComponent(
                    project.projectId,
                  )}`}
                >
                  <Typography color="primary">
                    <LongText text={project.projectId} max={60} />
                  </Typography>
                </Link>
              </TableCell>
              <TableCell>
                <Typography>
                  <LongText
                    text={project?.lifecycleState || 'Error'}
                    max={30}
                  />
                </Typography>
              </TableCell>
              <TableCell>
                <Typography>
                  <LongText text={project?.createTime || 'Error'} max={30} />
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const ProjectListPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h3" className={classes.title}>
        GCP Projects
      </Typography>
      <InfoCard>
        <Button variant="contained" color="primary" href="/gcp-projects/new">
          Create new GCP Project
        </Button>
      </InfoCard>

      <PageContents />
    </div>
  );
};
