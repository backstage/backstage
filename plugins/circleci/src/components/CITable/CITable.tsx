// Idea for this component to be somehow reusable representation of CI table view
import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Link,
  CircularProgress,
} from '@material-ui/core';
import { Replay as RetryIcon } from '@material-ui/icons';
import {
  StatusFailed,
  StatusOK,
  StatusPending,
  StatusNA,
} from '@backstage/core';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  avatar: {
    height: 32,
    width: 32,
    borderRadius: '50%',
  },
});

export type CITableBuildInfo = {
  id: string;
  buildName: string;
  buildUrl?: string;
  source: {
    branchName: string;
    commit: {
      hash: string;
      url: string;
    };
  };
  status: string;
  tests?: {
    total: number;
    passed: number;
    skipped: number;
    failed: number;
    testUrl: string; //fixme better name
  };
  onRetryClick: () => void;
};

// :retried, :canceled, :infrastructure_fail, :timedout, :not_run, :running, :failed, :queued, :scheduled, :not_running, :no_tests, :fixed, :success
const getStatusComponent = (status: string) => {
  switch (status.toLowerCase()) {
    case 'queued':
    case 'scheduled':
      return <StatusPending />;
    case 'running':
      return <CircularProgress size={12} />;
    case 'failed':
      return <StatusFailed />;
    case 'success':
      return <StatusOK />;
    case 'canceled':
    default:
      return <StatusNA />;
  }
};

export const CITable: FC<{
  builds: CITableBuildInfo[];
}> = ({ builds }) => {
  const classes = useStyles();
  const isTestDataAvailable = builds.some(build => build.tests);
  return (
    <TableContainer>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Build</TableCell>
            <TableCell>Source</TableCell>
            <TableCell align="center">Status</TableCell>
            {isTestDataAvailable && <TableCell>Tests</TableCell>}
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {builds.map(build => (
            <TableRow key={build.id}>
              <TableCell>{build.id}</TableCell>
              <TableCell>
                <Link href={build.buildUrl} target="_blank">
                  {build.buildName}
                </Link>
              </TableCell>
              <TableCell>
                {build.source.branchName}
                <br />
                {build.source.commit.hash}
              </TableCell>
              <TableCell align="center">
                {getStatusComponent(build.status)}
              </TableCell>
              {build.tests && (
                <TableCell>
                  {
                    <>
                      {build.tests.passed}/{build.tests.total} (
                      {build.tests.failed ? build.tests.failed + ', ' : ''}
                      {build.tests.skipped ? build.tests.skipped : ''})
                    </>
                  }
                </TableCell>
              )}
              <TableCell align="center">
                <Button onClick={build.onRetryClick}>
                  <RetryIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
