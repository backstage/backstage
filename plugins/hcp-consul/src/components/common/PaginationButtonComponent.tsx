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
import React from 'react';
import { Grid } from '@material-ui/core';

import Button from '@material-ui/core/Button';

type PaginationButtonProps = {
  prevToken: string;
  nextToken: string;
  onPrevClick: React.MouseEventHandler<HTMLButtonElement>;
  onNextClick: React.MouseEventHandler<HTMLButtonElement>;
};

export const PaginationButtonComponent = ({
  prevToken,
  nextToken,
  onPrevClick,
  onNextClick,
}: PaginationButtonProps) => {
  return (
    <Grid container spacing={0} justifyContent="flex-end">
      <Grid item xs={1}>
        <Button
          variant="contained"
          color="primary"
          disabled={prevToken === ''}
          onClick={onPrevClick}
        >
          Prev
        </Button>
      </Grid>
      <Grid item xs={1}>
        <Button
          variant="contained"
          color="primary"
          disabled={nextToken === ''}
          onClick={onNextClick}
        >
          Next
        </Button>
      </Grid>
    </Grid>
  );
};
