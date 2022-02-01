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

import React, { ChangeEvent, useState } from 'react';
import { Content } from '@backstage/core-components';
import { ProjectCard } from '../ProjectCard/ProjectCard';
import { makeStyles, Grid, TablePagination } from '@material-ui/core';
import { BazaarProject } from '../../types';
import { Entity } from '@backstage/catalog-model';

type Props = {
  bazaarProjects: BazaarProject[];
  fetchBazaarProjects: () => Promise<BazaarProject[]>;
  catalogEntities: Entity[];
};

const useStyles = makeStyles({
  content: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  empty: {
    height: '10rem',
    textAlign: 'center',
    verticalAlign: 'middle',
    lineHeight: '10rem',
  },
  pagination: {
    marginTop: '1rem',
    marginLeft: 'auto',
    marginRight: '0',
  },
});

export const ProjectPreview = ({
  bazaarProjects,
  fetchBazaarProjects,
  catalogEntities,
}: Props) => {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(12);

  const handlePageChange = (_: any, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleRowChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRows(parseInt(event.target.value, 10));
    setPage(1);
  };

  if (!bazaarProjects.length) {
    return (
      <div className={classes.empty}>Please add projects to the Bazaar.</div>
    );
  }

  return (
    <Content className={classes.content} noPadding>
      <Grid wrap="wrap" container spacing={3}>
        {bazaarProjects
          .slice((page - 1) * rows, rows * page)
          .map((bazaarProject: BazaarProject, i: number) => {
            return (
              <Grid key={i} item xs={2}>
                <ProjectCard
                  project={bazaarProject}
                  key={i}
                  fetchBazaarProjects={fetchBazaarProjects}
                  catalogEntities={catalogEntities}
                />
              </Grid>
            );
          })}
      </Grid>

      <TablePagination
        className={classes.pagination}
        rowsPerPageOptions={[12, 24, 48, 96]}
        count={bazaarProjects?.length}
        page={page - 1}
        onPageChange={handlePageChange}
        rowsPerPage={rows}
        onRowsPerPageChange={handleRowChange}
        backIconButtonProps={{ disabled: page === 1 }}
        nextIconButtonProps={{
          disabled: rows * page >= bazaarProjects.length,
        }}
      />
    </Content>
  );
};
