/*
 * Copyright 2020 Spotify AB
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
import React, { PropsWithChildren } from 'react';
import { Header, Page, Content, SupportButton } from '@backstage/core';
import {
  Box,
  Breadcrumbs,
  Button,
  createStyles,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Link as RouterLink, useParams } from 'react-router-dom';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import PersonIcon from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/Group';

const useStyles = makeStyles(() =>
  createStyles({
    text: {
      textTransform: 'capitalize',
    },
  }),
);

const BreadcrumbsComponent = () => {
  const classes = useStyles();
  const { groupName, memberName } = useParams() as {
    groupName: string;
    memberName: string;
  };
  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      <RouterLink color="inherit" to="/groups">
        Groups
      </RouterLink>
      {memberName && (
        <Typography color="inherit" classes={{ root: classes.text }}>
          <Box display="flex" alignItems="center" component="span">
            <Box mr={1} component="span">
              {memberName.replace(/\./gi, ' ')}
            </Box>
            <PersonIcon fontSize="inherit" />
          </Box>
        </Typography>
      )}
      {groupName && (
        <Typography color="inherit">
          <Box display="flex" alignItems="center" component="span">
            <Box mr={1} component="span">
              {groupName}
            </Box>
            <GroupIcon fontSize="inherit" />
          </Box>
        </Typography>
      )}
    </Breadcrumbs>
  );
};

export const GroupsComponent = ({ children }: PropsWithChildren<{}>) => (
  <Page themeId="home">
    <Header title="Groups" />
    <Content>
      <Box
        width="100"
        display="flex"
        mb={3}
        alignItems="center"
        justifyContent="space-between"
      >
        <BreadcrumbsComponent />
        <Box>
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/register-component"
          >
            Register Existing Group
          </Button>
          <SupportButton>A description of your plugin goes here.</SupportButton>
        </Box>
      </Box>
      <Grid container spacing={3} direction="column">
        {children}
      </Grid>
    </Content>
  </Page>
);
