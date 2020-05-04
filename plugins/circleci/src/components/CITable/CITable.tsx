// Idea for this component to be somehow reusable representation of CI table view
import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import {
  StatusRunning,
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
      return <StatusRunning />;
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

  return (
    <TableContainer>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Build</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Tests</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {builds.map(build => (
            <TableRow key={build.id}>
              <TableCell>{build.id}</TableCell>
              <TableCell>{build.buildName}</TableCell>
              <TableCell>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div>{build.source.branchName}</div>
                  <div>{build.source.commit.hash}</div>
                </div>
              </TableCell>
              <TableCell>{getStatusComponent(build.status)}</TableCell>
              <TableCell>
                {build.tests && (
                  <>
                    {build.tests.passed}/{build.tests.total} (
                    {build.tests.failed ? build.tests.failed + ', ' : ''}
                    {build.tests.skipped ? build.tests.skipped : ''})
                  </>
                )}
              </TableCell>
              <TableCell>
                <Button onClick={build.onRetryClick}>Retry</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
