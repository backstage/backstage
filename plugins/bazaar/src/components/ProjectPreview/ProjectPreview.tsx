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
import { makeStyles, Grid } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { BazaarProject } from '../../util/types';

type Props = {
  bazaarProjects: BazaarProject[];
  sortingMethod: (arg0: BazaarProject, arg1: BazaarProject) => number;
  bazaarMembers: Map<string, number>;
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

export const ProjectPreview = ({
  bazaarProjects,
  sortingMethod,
  bazaarMembers,
}: Props) => {
  const classes = useStyles();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const pageCount = Math.ceil(bazaarProjects.length / pageSize);

  const handlePageClick = (_: any, pageIndex: number) => {
    setCurrentPage(pageIndex);
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
          .slice(pageSize * (currentPage - 1), pageSize * currentPage)
          .map((bazaarProject: BazaarProject) => {
            const entityRef = bazaarProject.entityRef;

            return (
              <Grid key={entityRef || ''} className={classes.item} item xs={3}>
                <ProjectCard
                  bazaarProject={bazaarProject}
                  key={Math.random()}
                  memberCount={bazaarMembers.get(entityRef) || 0}
                />
              </Grid>
            );
          })}
      </Grid>
      <Pagination
        showFirstButton
        showLastButton
        siblingCount={2}
        style={{
          marginTop: '1rem',
          marginLeft: 'auto',
          marginRight: '0',
        }}
        count={pageCount}
        page={currentPage}
        onChange={handlePageClick}
      />
    </Content>
  );
};
