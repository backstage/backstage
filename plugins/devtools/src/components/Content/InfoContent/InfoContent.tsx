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

import { Progress } from '@backstage/core-components';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import { useInfo } from '../../../hooks';
import { InfoDependenciesTable } from './InfoDependenciesTable';
import DescriptionIcon from '@material-ui/icons/Description';
import MemoryIcon from '@material-ui/icons/Memory';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import { BackstageLogoIcon } from './BackstageLogoIcon';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { DevToolsInfo } from '@backstage/plugin-devtools-common';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paperStyle: {
      display: 'flex',
      marginBottom: theme.spacing(2),
    },
    flexContainer: {
      display: 'flex',
      flexDirection: 'row',
      padding: 0,
    },
    copyButton: {
      float: 'left',
      margin: theme.spacing(2),
    },
  }),
);

const copyToClipboard = ({ about }: { about: DevToolsInfo | undefined }) => {
  if (about) {
    let formatted = `OS: ${about.operatingSystem}\nResources: ${about.resourceUtilization}\nnode: ${about.nodeJsVersion}\nbackstage: ${about.backstageVersion}\nDependencies:\n`;
    const deps = about.dependencies;
    for (const key in deps) {
      if (Object.prototype.hasOwnProperty.call(deps, key)) {
        formatted = `${formatted}    ${deps[key].name}: ${deps[key].versions}\n`;
      }
    }
    window.navigator.clipboard.writeText(formatted);
  }
};

/** @public */
export const InfoContent = () => {
  const classes = useStyles();
  const { about, loading, error } = useInfo();

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }
  return (
    <Box>
      <Paper className={classes.paperStyle}>
        <List className={classes.flexContainer}>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <DeveloperBoardIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Operating System"
              secondary={about?.operatingSystem}
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <MemoryIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Resource utilization"
              secondary={about?.resourceUtilization}
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <DescriptionIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="NodeJS Version"
              secondary={about?.nodeJsVersion}
            />
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <BackstageLogoIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Backstage Version"
              secondary={about?.backstageVersion}
            />
          </ListItem>
        </List>
        <Divider orientation="vertical" variant="middle" flexItem />
        <Button
          onClick={() => {
            copyToClipboard({ about });
          }}
          className={classes.copyButton}
          startIcon={<FileCopyIcon />}
        >
          Copy Info to Clipboard
        </Button>
      </Paper>
      <InfoDependenciesTable infoDependencies={about?.dependencies} />
    </Box>
  );
};
