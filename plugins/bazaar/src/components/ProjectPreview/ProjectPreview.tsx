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

import React, { useState } from 'react';
import { Content } from '@backstage/core-components';
import { ProjectCard } from '../ProjectCard/ProjectCard';
import { makeStyles, Grid, TablePagination } from '@material-ui/core';
import { BazaarProject } from '../../types';

type Props = {
  bazaarProjects: BazaarProject[];
  sortingMethod: (arg0: BazaarProject, arg1: BazaarProject) => number;
};

const useStyles = makeStyles({
  content: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  item: {
    minWidth: '20.5rem',
    maxWidth: '20.5rem',
    width: '20%',
  },
});

export const ProjectPreview = ({ bazaarProjects, sortingMethod }: Props) => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  if (!bazaarProjects.length) {
    return (
      <div
        data-testid="empty-bazaar"
        style={{
          height: '10rem',
          textAlign: 'center',
          verticalAlign: 'middle',
          lineHeight: '10rem',
        }}
      >
        Please add projects to the Bazaar.
      </div>
    );
  }

  bazaarProjects.sort(sortingMethod);

  return (
    <Content className={classes.content} noPadding>
      <Grid wrap="wrap" container spacing={3}>
        {bazaarProjects
          .slice((page - 1) * rowsPerPage, rowsPerPage * page)
          .map((bazaarProject: BazaarProject, i: number) => {
            return (
              <Grid key={i} className={classes.item} item xs={3}>
                <ProjectCard bazaarProject={bazaarProject} key={i} />
              </Grid>
            );
          })}
      </Grid>

      <TablePagination
        count={bazaarProjects?.length}
        page={page - 1}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        backIconButtonProps={{ disabled: page === 1 }}
        nextIconButtonProps={{
          disabled: rowsPerPage * page >= bazaarProjects.length,
        }}
        style={{
          marginTop: '1rem',
          marginLeft: 'auto',
          marginRight: '0',
        }}
      />
    </Content>
  );
};
