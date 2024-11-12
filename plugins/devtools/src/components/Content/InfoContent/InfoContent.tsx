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
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Alert from '@mui/material/Alert';
import React from 'react';
import { useInfo } from '../../../hooks';
import { InfoDependenciesTable } from './InfoDependenciesTable';
import DescriptionIcon from '@mui/icons-material/Description';
import MemoryIcon from '@mui/icons-material/Memory';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import { BackstageLogoIcon } from './BackstageLogoIcon';
import FileCopyIcon from '@mui/icons-material/FileCopy';
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
