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
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useTheme,
  useMediaQuery,
} from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';

export const CreateCapability = () => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <>
      <Button
        variant="contained"
        style={{ backgroundColor: blue[100], color: blue[600] }}
        disableElevation
        startIcon={<AddIcon />}
        onClick={() => setOpen(p => !p)}
      >
        Create capability
      </Button>
      <Dialog fullScreen={matches} open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Capability</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column">
            <TextField label="name" variant="outlined" size="small" />
            <TextField label="description" variant="outlined" size="small" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(false)}
          >
            save
          </Button>
          <Button variant="outlined" onClick={() => setOpen(false)}>
            cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
