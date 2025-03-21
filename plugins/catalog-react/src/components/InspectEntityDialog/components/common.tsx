/*
 * Copyright 2022 The Backstage Authors
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

import { Link } from '@backstage/core-components';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MuiListItemText from '@material-ui/core/ListItemText';
import MuiListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import React from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
  helpIcon: {
    marginLeft: theme.spacing(1),
    color: theme.palette.text.disabled,
  },
  monospace: {
    fontFamily: 'monospace',
  },
}));

export function ListItemText(props: {
  primary: React.ReactNode;
  secondary?: React.ReactNode;
}) {
  const classes = useStyles();
  return (
    <MuiListItemText
      {...props}
      primaryTypographyProps={{ className: classes.monospace }}
      secondaryTypographyProps={{ className: classes.monospace }}
    />
  );
}

export function ListSubheader(props: { children?: React.ReactNode }) {
  const classes = useStyles();
  return (
    <MuiListSubheader className={classes.monospace}>
      {props.children}
    </MuiListSubheader>
  );
}

export function Container(props: {
  title: React.ReactNode;
  helpLink?: string;
  children: React.ReactNode;
}) {
  return (
    <Box mt={2}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {props.title}
            {props.helpLink && <HelpIcon to={props.helpLink} />}
          </Typography>
          {props.children}
        </CardContent>
      </Card>
    </Box>
  );
}

// Extracts a link from a value, if possible
function findLink(value: string): string | undefined {
  if (value.match(/^url:https?:\/\//)) {
    return value.slice('url:'.length);
  }
  if (value.match(/^https?:\/\//)) {
    return value;
  }
  return undefined;
}

export function KeyValueListItem(props: {
  indent?: boolean;
  entry: [string, string];
}) {
  const [key, value] = props.entry;
  const link = findLink(value);

  return (
    <ListItem>
      {props.indent && <ListItemIcon />}
      <ListItemText
        primary={key}
        secondary={link ? <Link to={link}>{value}</Link> : value}
      />
    </ListItem>
  );
}

export function HelpIcon(props: { to: string }) {
  const classes = useStyles();
  return (
    <Link to={props.to} className={classes.helpIcon}>
      <HelpOutlineIcon fontSize="inherit" />
    </Link>
  );
}
