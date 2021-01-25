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
import React from 'react';
import { useParams } from 'react-router-dom';
import { Content, Link } from '@backstage/core';
import {
  Typography,
  Breadcrumbs,
  Paper,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Link as MaterialLink,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useBuildWithSteps } from '../useBuildWithSteps';
import { useProjectSlugFromEntity } from '../useProjectSlugFromEntity';
import { JenkinsRunStatus } from '../BuildsPage/lib/Status';
import ExternalLinkIcon from '@material-ui/icons/Launch';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 720,
    margin: theme.spacing(2),
  },
  table: {
    padding: theme.spacing(1),
  },
  externalLinkIcon: {
    fontSize: 'inherit',
    verticalAlign: 'bottom',
  },
}));

const BuildWithStepsView = () => {
  const { owner, repo } = useProjectSlugFromEntity();
  const { branch, buildNumber } = useParams();
  const classes = useStyles();
  const buildPath = `${owner}/${repo}/${branch}/${buildNumber}`;
  const [{ value }] = useBuildWithSteps(buildPath);

  return (
    <div className={classes.root}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link to="../../..">Jobs</Link>
        <Typography>Run</Typography>
      </Breadcrumbs>
      <TableContainer component={Paper} className={classes.table}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography noWrap>Branch</Typography>
              </TableCell>
              <TableCell>{value?.source?.branchName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Message</Typography>
              </TableCell>
              <TableCell>{value?.source?.displayName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Commit ID</Typography>
              </TableCell>
              <TableCell>{value?.source?.commit?.hash}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Status</Typography>
              </TableCell>
              <TableCell>
                <JenkinsRunStatus status={value?.status} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Author</Typography>
              </TableCell>
              <TableCell>{value?.source?.author}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Jenkins</Typography>
              </TableCell>
              <TableCell>
                <MaterialLink target="_blank" href={value?.buildUrl}>
                  View on Jenkins{' '}
                  <ExternalLinkIcon className={classes.externalLinkIcon} />
                </MaterialLink>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>GitHub</Typography>
              </TableCell>
              <TableCell>
                <MaterialLink target="_blank" href={value?.source.url}>
                  View on GitHub{' '}
                  <ExternalLinkIcon className={classes.externalLinkIcon} />
                </MaterialLink>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
const Page = () => (
  <Content>
    <BuildWithStepsView />
  </Content>
);

export default Page;
export { BuildWithStepsView as BuildWithSteps };
