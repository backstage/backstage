import React, { FC } from 'react';
import { RelativeEntityLink, useEntity } from '@backstage/core';
import { BuildsClient } from '../../apis/builds';
import { useAsync } from 'react-use';
import {
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  LinearProgress,
  makeStyles,
  Theme,
} from '@material-ui/core';
import BuildStatusIndicator from '../BuildStatusIndicator';

const client = BuildsClient.create('http://localhost:8080');

const useStyles = makeStyles<Theme>(theme => ({
  root: {
    // height: 400,
  },
  title: {
    paddingBottom: theme.spacing(1),
  },
}));

const BuildInfoCard: FC<{}> = () => {
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
    const [build] =
      status.value?.filter(({ branch }) => branch === 'master') ?? [];

    content = (
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography noWrap>Message</Typography>
            </TableCell>
            <TableCell>
              <RelativeEntityLink
                view={`builds/${encodeURIComponent(build?.uri || '')}`}
              >
                <Typography color="primary">{build?.message}</Typography>
              </RelativeEntityLink>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography noWrap>Commit ID</Typography>
            </TableCell>
            <TableCell>{build?.commitId}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography noWrap>Status</Typography>
            </TableCell>
            <TableCell>
              <BuildStatusIndicator status={build?.status} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <div className={classes.root}>
      <Typography variant="h2" className={classes.title}>
        Master Build
      </Typography>
      {content}
    </div>
  );
};

export default BuildInfoCard;
