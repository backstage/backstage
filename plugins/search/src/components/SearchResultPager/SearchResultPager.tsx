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

import { Button, makeStyles } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import React from 'react';
import { useSearch } from '@backstage/plugin-search-react';

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
 * @deprecated Import from `@backstage/plugin-search-react` instead.
 */
export const SearchResultPager = () => {
  const { fetchNextPage, fetchPreviousPage } = useSearch();
  const classes = useStyles();

  if (!fetchNextPage && !fetchPreviousPage) {
    return <></>;
  }

  return (
    <nav arial-label="pagination navigation" className={classes.root}>
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
