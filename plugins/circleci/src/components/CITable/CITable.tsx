// Idea for this component to be somehow reusable representation of CI table view
import React, { FC } from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import { Link, CircularProgress, Button } from '@material-ui/core';
import { Replay as RetryIcon } from '@material-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import {
  StatusFailed,
  StatusOK,
  StatusPending,
  StatusNA,
  Table,
} from '@backstage/core';
import type { TableColumn } from '@backstage/core/src/components/Table';
// const useStyles = makeStyles({
//   table: {
//     minWidth: 650,
//   },
//   avatar: {
//     height: 32,
//     width: 32,
//     borderRadius: '50%',
//   },
// });

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
const getStatusComponent = (status: string | undefined = '') => {
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

// export const CITableBuildRow: FC<{ build: CITableBuildInfo }> = ({ build }) => (
//   <TableRow key={build.id}>
//     <TableCell>{build.id}</TableCell>
//     <TableCell>
//       <Link to={`/circleci/build/${build.id}`}>{build.buildName}</Link>
//     </TableCell>
//     <TableCell>
//       {build.source.branchName}
//       <br />
//       {build.source.commit.hash}
//     </TableCell>
//     <TableCell align="center">{getStatusComponent(build.status)}</TableCell>
//     {build.tests && (
//       <TableCell>
//         {
//           <>
//             {build.tests.passed}/{build.tests.total} (
//             {build.tests.failed ? build.tests.failed + ', ' : ''}
//             {build.tests.skipped ? build.tests.skipped : ''})
//           </>
//         }
//       </TableCell>
//     )}
//     <TableCell align="center">
//       <Button onClick={build.onRetryClick}>
//         <RetryIcon />
//       </Button>
//     </TableCell>
//   </TableRow>
// );

// export const CITableBuildHeadRow:FC<{isTestDataAvailable: boolean}> = ({isTestDataAvailable}) => (
//   <TableRow>
//     <TableCell>ID</TableCell>
//     <TableCell>Build</TableCell>
//     <TableCell>Source</TableCell>
//     <TableCell align="center">Status</TableCell>
//     {isTestDataAvailable && <TableCell>Tests</TableCell>}
//     <TableCell align="center">Actions</TableCell>
//   </TableRow>
// );

const generatedColumns: TableColumn[] = [
  {
    title: 'ID',
    field: 'id',
    type: 'numeric',
  },
  {
    title: 'Build',
    field: 'buildName',
    highlight: true,
    render: (row: Partial<CITableBuildInfo>) => (
      <Link component={RouterLink} to={`/circleci/build/${row.id}`}>
        {row.buildName}
      </Link>
    ),
  },
  {
    title: 'Source',
    render: (row: Partial<CITableBuildInfo>) => (
      <>
        {row.source?.branchName}
        <br />
        {row.source?.commit.hash}
      </>
    ),
  },
  {
    title: 'Status',
    render: (row: Partial<CITableBuildInfo>) => (
      <>
        {getStatusComponent(row.status)} {row.status}
      </>
    ),
  },
  {
    title: 'Actions',
    render: (row: Partial<CITableBuildInfo>) => (
      <Button onClick={row.onRetryClick}>
        <RetryIcon />
      </Button>
    ),
  },
];
export const CITable: FC<{
  builds: CITableBuildInfo[];
}> = React.memo(({ builds = [] }) => {
  // const classes = useStyles();
  // const isTestDataAvailable = builds.some(build => build.tests);
  return (
    <Table
      options={{ paging: false }}
      data={builds}
      columns={generatedColumns}
    />
  );
});
