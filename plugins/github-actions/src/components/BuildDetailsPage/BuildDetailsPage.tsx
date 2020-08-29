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

import {
  Button,
  Box,
  LinearProgress,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Theme,
  Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAsync } from 'react-use';
import { Link, useApi, githubAuthApiRef } from '@backstage/core';
import { githubActionsApiRef } from '../../api';
import { BuildSteps } from'../BuildSteps/BuildSteps';
import ArrowBackRoundedIcon from '@material-ui/icons/ArrowBackRounded';
const useStyles = makeStyles<Theme>(theme => ({
  root: {
    maxWidth: 720,
    margin: theme.spacing(2),
  },
  title: {
    padding: theme.spacing(1, 0, 2, 0),
  },
  table: {
    padding: theme.spacing(1),
  },
}));


export const BuildDetailsPage = () => {
  const repo = 'try-ssr';
  const owner = 'CircleCITest3';
  const api = useApi(githubActionsApiRef);
  const auth = useApi(githubAuthApiRef);
  const classes = useStyles();
  const { id } = useParams();
  let jobs: {
    jobName: string,
    jobStart: string,
    jobEnd: string,
    jobStatus: string,
    steps: any[]
  }[] = [];
  const [jobsArray] = useState(jobs);
  
  const jobsStatus = useAsync(async () => {
    const token = await auth.getAccessToken(['repo', 'user']);
    return api
      .listJobsForWorkflowRun({
        token,
        owner,
        repo,
        id: parseInt(id, 10),
      })
      .then(data => {
        data.jobs.map(job => {
          jobs.push({
            jobName: job.name,
            jobStart: job.started_at,
            jobEnd: job.completed_at,
            jobStatus: job.conclusion,
            steps: job.steps
          })
        })
        return data;
      });
  });

  const status = useAsync(async () => {
    const token = await auth.getAccessToken(['repo', 'user']);
    return api
      .getWorkflowRun({
        token,
        owner,
        repo,
        id: parseInt(id, 10),
      })
      .then(data => {
        return data;
      });
  }, [location.search]);

  if (status.loading) {
    return <LinearProgress />;
  } else if (status.error) {
    return (
      <Typography variant="h6" color="error">
        Failed to load build, {status.error.message}
      </Typography>
    );
  }

  const details = status.value;

  return (
    <div className={classes.root}>
      <Typography className={classes.title} variant="h3">
        <Link to="/github-actions">
          <Typography component="span" variant="h1" color="primary">
            <ArrowBackRoundedIcon />
          </Typography>
        </Link>
        Build Details
      </Typography>
      <TableContainer component={Paper} className={classes.table}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography noWrap>Branch</Typography>
              </TableCell>
              <TableCell>{details?.head_branch}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Message</Typography>
              </TableCell>
              <TableCell>{details?.head_commit.message}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Commit ID</Typography>
              </TableCell>
              <TableCell>{details?.head_commit.id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Status</Typography>
              </TableCell>
              <TableCell>{details?.status}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Author</Typography>
              </TableCell>
              <TableCell>{`${details?.head_commit.author.name} (${details?.head_commit.author.email})`}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Links</Typography>
              </TableCell>
              <TableCell>
                {details?.html_url && (
                  <Button>
                    <a href={details.html_url}>GitHub</a>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Typography className={classes.title} variant="h3">
        Build Log
      </Typography>
      <Box>
        {jobsStatus.loading 
        ? <LinearProgress /> 
        : jobsStatus.error  
        ? <Typography variant="h6" color="error">
            Failed to load build, {jobsStatus.error.message}
          </Typography> 
        : jobsArray.map(
          (job) => (
            <BuildSteps runData={job} key={`${job.jobName}-${job.jobStart}`}/>
            ),
          )
        }
      </Box>
    </div>
  );
};
