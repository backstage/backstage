/*
 * Copyright 2021 The Backstage Authors
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
import { useContent } from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import {
  SearchBar,
  SearchContextProvider,
  SearchResult,
  SearchResultPager,
} from '@backstage/plugin-search-react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  useTheme,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CloseIcon from '@material-ui/icons/Close';
import React, { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { rootRouteRef } from '../../plugin';

/**
 * @public
 */
export interface SearchModalChildrenProps {
  /**
   * A function that should be invoked when navigating away from the modal.
   */
  toggleModal: () => void;
}

/**
 * @public
 */
export interface SearchModalProps {
  /**
   * If true, it renders the modal.
   */
  open?: boolean;
  /**
   * This is supposed to be used together with the open prop.
   * If `hidden` is true, it hides the modal.
   * If `open` is false, the value of `hidden` has no effect on the modal.
   * Use `open` for controlling whether the modal should be rendered or not.
   */
  hidden?: boolean;
  /**
   * a function invoked when a search item is pressed or when the dialog
   * should be closed.
   */
  toggleModal: () => void;
  /**
   * A function that returns custom content to render in the search modal in
   * place of the default.
   */
  children?: (props: SearchModalChildrenProps) => JSX.Element;
}

const useStyles = makeStyles(theme => ({
  dialogTitle: {
    gap: theme.spacing(1),
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: '1fr auto',
    '&> button': {
      marginTop: theme.spacing(1),
    },
  },
  input: {
    flex: 1,
  },
  button: {
    '&:hover': {
      background: 'none',
    },
  },
  // Reduces default height of the modal, keeping a gap of 128px between the top and bottom of the page.
  paperFullWidth: { height: 'calc(100% - 128px)' },
  dialogActionsContainer: { padding: theme.spacing(1, 3) },
  viewResultsLink: { verticalAlign: '0.5em' },
}));

export const Modal = ({ toggleModal }: SearchModalChildrenProps) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { transitions } = useTheme();
  const { focusContent } = useContent();

  const searchRootRoute = useRouteRef(rootRouteRef)();
  const searchBarRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    searchBarRef?.current?.focus();
  });

  const handleSearchResultClick = useCallback(() => {
    setTimeout(focusContent, transitions.duration.leavingScreen);
  }, [focusContent, transitions]);

  // This handler is called when "enter" is pressed
  const handleSearchBarSubmit = useCallback(() => {
    // Using ref to get the current field value without waiting for a query debounce
    const query = searchBarRef.current?.value ?? '';
    navigate(`${searchRootRoute}?query=${query}`);
    handleSearchResultClick();
  }, [navigate, handleSearchResultClick, searchRootRoute]);

  return (
    <>
      <DialogTitle>
        <Box className={classes.dialogTitle}>
          <SearchBar
            className={classes.input}
            inputProps={{ ref: searchBarRef }}
            onSubmit={handleSearchBarSubmit}
          />

          <IconButton aria-label="close" onClick={toggleModal}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          direction="row-reverse"
          justifyContent="flex-start"
          alignItems="center"
        >
          <Grid item>
            <Button
              className={classes.button}
              color="primary"
              endIcon={<ArrowForwardIcon />}
              onClick={handleSearchResultClick}
              disableRipple
            >
              View Full Results
            </Button>
          </Grid>
        </Grid>
        <Divider />
        <SearchResult
          onClick={handleSearchResultClick}
          onKeyDown={handleSearchResultClick}
        />
      </DialogContent>
      <DialogActions className={classes.dialogActionsContainer}>
        <Grid container direction="row">
          <Grid item xs={12}>
            <SearchResultPager />
          </Grid>
        </Grid>
      </DialogActions>
    </>
  );
};

/**
 * @public
 */
export const SearchModal = (props: SearchModalProps) => {
  const { open = true, hidden, toggleModal, children } = props;

  const classes = useStyles();

  return (
    <Dialog
      classes={{
        paperFullWidth: classes.paperFullWidth,
      }}
      onClose={toggleModal}
      aria-labelledby="search-modal-title"
      fullWidth
      maxWidth="lg"
      open={open}
      hidden={hidden}
    >
      {open && (
        <SearchContextProvider inheritParentContextIfAvailable>
          {(children && children({ toggleModal })) ?? (
            <Modal toggleModal={toggleModal} />
          )}
        </SearchContextProvider>
      )}
    </Dialog>
  );
};
