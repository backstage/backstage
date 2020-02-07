import React, { FC } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
  LinearProgress,
  Typography,
  Tooltip,
} from '@material-ui/core';
import { RelativeEntityLink } from '@backstage/core';
import { BuildsClient } from '../../apis/builds';
import { useAsync } from 'react-use';

const client = BuildsClient.create('http://localhost:8080');

const LongText: FC<{ text: string; max: number }> = ({ text, max }) => {
  if (text.length < max) {
    return <span>{text}</span>;
  }
  return (
    <Tooltip title={text}>
      <span>{text.slice(0, max)}...</span>
    </Tooltip>
  );
};

const BuildListPage: FC<{}> = () => {
  const status = useAsync(() => client.listBuilds('entity:spotify:backstage'));

  if (status.loading) {
    return <LinearProgress />;
  }
  if (status.error) {
    return (
      <Typography variant="h6" color="error">
        Failed to load builds, {status.error.message}
      </Typography>
    );
  }

  return (
    <>
      <Typography variant="h4">CI/CD Builds</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="CI/CD builds table">
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Branch</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Commit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {status.value!.map(build => (
              <TableRow key={build.uri}>
                {/* TODO: make this an indicating blobby thing */}
                <TableCell>{build.status}</TableCell>
                <TableCell>
                  <Typography>
                    <LongText text={build.branch} max={30} />
                  </Typography>
                </TableCell>
                <TableCell>
                  <RelativeEntityLink
                    view={`builds/${encodeURIComponent(build.uri)}`}
                  >
                    <Typography color="primary">
                      <LongText text={build.message} max={60} />
                    </Typography>
                  </RelativeEntityLink>
                </TableCell>
                <TableCell>
                  <Tooltip title={build.commitId}>
                    <Typography noWrap>
                      {build.commitId.slice(0, 10)}
                    </Typography>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default BuildListPage;
