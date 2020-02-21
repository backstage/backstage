import React, { FC } from 'react';
import { BuildsClient } from '../../apis/builds';
import { useAsync } from 'react-use';
import { useRouteMatch } from 'react-router-dom';
import {
  LinearProgress,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Link,
  makeStyles,
  ButtonGroup,
  Button,
  Theme,
} from '@material-ui/core';
import { RelativeEntityLink } from '@spotify-backstage/core';
import BuildStatusIndicator from '../BuildStatusIndicator';

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

type Props = {};

const client = BuildsClient.create('http://localhost:8080');

const BuildDetailsPage: FC<Props> = () => {
  const classes = useStyles();
  const match = useRouteMatch<{ buildUri: string }>();
  const buildUri = decodeURIComponent(match.params.buildUri);
  const status = useAsync(() => client.getBuild(buildUri), [buildUri]);

  if (status.loading) {
    return <LinearProgress />;
  }
  if (status.error) {
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
        <RelativeEntityLink view="/builds">
          <Typography component={'span'} variant="h3" color="primary">
            &lt;{' '}
          </Typography>
        </RelativeEntityLink>
        Build Details
      </Typography>
      <TableContainer component={Paper} className={classes.table}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography noWrap>Branch</Typography>
              </TableCell>
              <TableCell>{details?.build.branch}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Message</Typography>
              </TableCell>
              <TableCell>{details?.build.message}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Commit ID</Typography>
              </TableCell>
              <TableCell>{details?.build.commitId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Status</Typography>
              </TableCell>
              <TableCell>
                <BuildStatusIndicator status={details?.build.status} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Author</Typography>
              </TableCell>
              <TableCell>{details?.author}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography noWrap>Links</Typography>
              </TableCell>
              <TableCell>
                <ButtonGroup
                  variant="text"
                  color="primary"
                  aria-label="text primary button group"
                >
                  <Button>
                    <Link href={details?.overviewUrl}>GitHub</Link>
                  </Button>
                  <Button>
                    <Link href={details?.logUrl}>Logs</Link>
                  </Button>
                </ButtonGroup>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BuildDetailsPage;
