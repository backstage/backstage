/*
 * Copyright 2021 Spotify AB
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

import {
  Grid,
  Box,
  Card,
  Typography,
  Link,
  Divider,
  Button,
  MenuItem,
} from '@material-ui/core';
import { blue, grey, green } from '@material-ui/core/colors';
import DoneIcon from '@material-ui/icons/Done';
import React from 'react';
import { PopOverProvider, MoreActions, MenuActions } from './MoreActions';

// import { ServicesCard } from './ServicesTab';
import { ProvidersTab } from './ProvidersTab';
import { ServicesCard } from './ServicesTab';
import { SourceControlIcon } from './SourceControlIcon';

export const CapabilityCard = ({
  name = 'unknown name eror',
  description,
  isMember = false,
  loading = false,
  repos = [],
  condensed = false,
  status = (
    <>
      <DoneIcon
        fontSize="small"
        style={{ color: green[600], marginRight: 5 }}
      />
      <Typography variant="subtitle2" style={{ color: green[600] }}>
        Available
      </Typography>
    </>
  ),
  updated = '',
  id,
}: any) => {
  return (
    <Grid item>
      <Box mb={2}>
        <Card>
          <Box
            display="flex"
            alignItems="flex-start"
            p={3}
            pt={2}
            pb={2}
            style={
              isMember
                ? { borderLeft: `3px solid ${blue[600]}` }
                : { borderLeft: `3px solid transparent` }
            }
          >
            <Box>
              <Typography variant="h5" color="textPrimary">
                <Link href={`/dfds-capability-management?id=${id}`}>
                  {name}
                </Link>
              </Typography>
              <Typography variant="caption" color="textPrimary">
                {description}
              </Typography>
            </Box>
            <Box flex={1} />
            <Box display="flex" alignItems="center">
              {/* <Tooltip title="source control">
                <IconButton size="small">
                  <SourceControlIcon />
                </IconButton>
              </Tooltip> */}
              <PopOverProvider>
                <MoreActions icon={<SourceControlIcon />}>
                  {repos?.map((repo: string) => (
                    <MenuItem>{repo}</MenuItem>
                  ))}
                </MoreActions>
              </PopOverProvider>
              <PopOverProvider>
                <MoreActions>
                  <MenuActions />
                </MoreActions>
              </PopOverProvider>
              <Divider
                orientation="vertical"
                flexItem
                style={{ marginLeft: 9, marginRight: 18 }}
              />
              {!isMember ? (
                <Button
                  variant="contained"
                  style={
                    loading
                      ? { backgroundColor: grey[100], color: grey[600] }
                      : { backgroundColor: blue[100], color: blue[600] }
                  }
                  disableElevation
                  // onClick={() => setIsMember(true)}
                  size="small"
                  disabled={loading}
                >
                  Join
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="secondary"
                  // onClick={() => setIsMember(false)}
                  size="small"
                >
                  Leave
                </Button>
              )}
            </Box>
          </Box>
          {true && (
            <>
              <Divider />
              <Box p={3} pt={2} pb={2}>
                <Box mb={1}>
                  <ProvidersTab />
                </Box>
                <Box>
                  <ServicesCard services={[1, 2, 3, 4]} />
                </Box>
              </Box>
            </>
          )}
          <Divider />
          <Box p={3} pt={2} pb={2} display="flex" alignItems="center">
            <Typography variant="subtitle2" color="textPrimary">
              Status:
            </Typography>
            <Box display="flex" ml={1}>
              {status}
            </Box>
            <Box ml={1}>
              <Typography variant="caption" color="textPrimary">
                {updated || 'updated 2 hours ago'}
              </Typography>
            </Box>
          </Box>
        </Card>
      </Box>
    </Grid>
  );
};
