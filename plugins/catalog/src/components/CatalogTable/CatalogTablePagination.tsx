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
import { makeStyles, useTheme } from '@material-ui/core/styles';

import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { useEntityList } from '@backstage/plugin-catalog-react';

const useStyles1 = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

export function CatalogTablePagination(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { fetchNext, fetchPrev } = useEntityList();
  const { count, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = event => {
    console.log('handleFirstPageButtonClick');
  };

  const handleBackButtonClick = event => {
    fetchPrev?.();
  };

  const handleNextButtonClick = event => {
    fetchNext?.();
    console.log('handleNextButtonClick');
  };

  const handleLastPageButtonClick = event => {
    console.log('handleLastPageButtonClick');
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleBackButtonClick}
        aria-label="previous page"
        disabled={!fetchPrev}
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        aria-label="next page"
        disabled={!fetchNext}
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
    </div>
  );
}
