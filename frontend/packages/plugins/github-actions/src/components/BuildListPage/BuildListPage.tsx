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
  makeStyles,
  Theme,
} from '@material-ui/core';
import { RelativeEntityLink, useEntity } from '@spotify-backstage/core';
import { BuildsClient } from '../../apis/builds';
import { useAsync } from 'react-use';
import BuildStatusIndicator from '../BuildStatusIndicator';

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

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    padding: theme.spacing(2),
  },
  title: {
    padding: theme.spacing(1, 0, 2, 0),
  },
}));

const BuildListPage: FC<{}> = () => {
  const classes = useStyles();
  const { kind, id } = useEntity();
  const status = useAsync(() => client.listBuilds(`entity:${kind}:${id}`));

  let content: JSX.Element;

  if (status.loading) {
    content = <LinearProgress />;
  } else if (status.error) {
    content = (
      <Typography variant="h2" color="error">
        Failed to load builds, {status.error.message}
      </Typography>
    );
  } else {
    content = (
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
                <TableCell>
                  <BuildStatusIndicator status={build.status} />
                </TableCell>
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
    );
  }

  return (
    <div className={classes.root}>
      <Typography variant="h3" className={classes.title}>
        CI/CD Builds
      </Typography>
      {content}
    </div>
  );
};

export default BuildListPage;
