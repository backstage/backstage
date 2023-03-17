/*
 * Copyright 2023 The Backstage Authors
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
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { InfoCard } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';

import { ToolkitList } from '../ToolkitList/ToolkitList';
import { CreateToolkit } from '../CreateToolkit';
import { toolkitApiRef } from '../../api';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addTool, toggleModal } from '../../redux/slices/toolkit.slice';
import { RootState } from '../../redux/store';

const useStyles = makeStyles({
  ButtonGroup: {
    display: 'flex',
    justifyContent: 'end',
  },
  Button: {
    margin: '10px',
  },
});

type TCreateToolkit = {
  show: boolean;
};

export const ShowToolkitModal: React.FC<TCreateToolkit> = ({ show }) => {
  const theme = useTheme();
  const classes = useStyles();
  const toolkitApi = useApi(toolkitApiRef);
  const dispatch = useAppDispatch();
  const { toolkits, showModal } = useAppSelector(
    (state: RootState) => state.toolkit,
  );

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [Open, setOpen] = useState(false);
  const [selectedToolkits, setSelectedToolkits]: any = useState([]);

  useEffect(() => {
    setSelectedToolkits([]);
  }, [toolkits]);
  const closeModal = () => {
    setOpen(false);
    setSelectedToolkits([]);
    dispatch(toggleModal(true));
  };

  const onCheck = (id: number) => {
    if (!selectedToolkits.includes(id)) {
      setSelectedToolkits([...selectedToolkits, id]);
    } else {
      setSelectedToolkits(selectedToolkits.filter((item: any) => item !== id));
    }
  };
  const onAddTool = () => {
    dispatch(addTool({ toolkitApi, toolkits: selectedToolkits }));
    closeModal();
  };

  return (
    <>
      {Open ? (
        <CreateToolkit show={showModal} onClose={closeModal} />
      ) : (
        <Dialog
          maxWidth="lg"
          fullWidth={!fullScreen}
          onClose={closeModal}
          aria-labelledby="simple-dialog-title"
          open={show}
        >
          <DialogTitle id="simple-dialog-title">
            Create a new toolkit or select from the list
          </DialogTitle>
          <ButtonGroup
            className={classes.ButtonGroup}
            variant="contained"
            aria-label=" primary button group"
          >
            <Button
              color="primary"
              variant="contained"
              onClick={() => setOpen(true)}
              style={{ margin: '10px' }}
              className={classes.Button}
            >
              Create Own toolkit
            </Button>
            <Button
              disabled={selectedToolkits.length === 0 || !selectedToolkits}
              color="primary"
              onClick={onAddTool}
              variant="contained"
              style={{ margin: '10px' }}
              className={classes.Button}
            >
              Add selected toolkit
            </Button>
          </ButtonGroup>
          <Box
            sx={{
              overflow: 'scroll',
            }}
          >
            <InfoCard>
              <ToolkitList
                checkable
                selectedToolkits={selectedToolkits}
                onCheck={onCheck}
              />
            </InfoCard>
          </Box>
        </Dialog>
      )}
    </>
  );
};
