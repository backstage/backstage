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

import React from 'react';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import { useSearch } from '../../context';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    margin: theme.spacing(2, 0),
  },
}));

/**
 * @public
 */
export const SearchResultPager = () => {
  const { fetchNextPage, fetchPreviousPage } = useSearch();
  const classes = useStyles();

  if (!fetchNextPage && !fetchPreviousPage) {
    return <></>;
  }

  return (
    <nav aria-label="pagination navigation" className={classes.root}>
      <Button
        aria-label="previous page"
        disabled={!fetchPreviousPage}
        onClick={fetchPreviousPage}
        startIcon={<ArrowBackIosIcon />}
      >
        Previous
      </Button>

      <Button
        aria-label="next page"
        disabled={!fetchNextPage}
        onClick={fetchNextPage}
        endIcon={<ArrowForwardIosIcon />}
      >
        Next
      </Button>
    </nav>
  );
};
