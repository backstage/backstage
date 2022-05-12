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
import {
  Content,
  ContentHeader,
  Progress,
  ItemCardHeader,
} from '@backstage/core-components';
import { useRouteRef, useApi } from '@backstage/core-plugin-api';
import Alert from '@material-ui/lab/Alert';
import useAsync from 'react-use/lib/useAsync';
import { Link as RouterLink } from 'react-router-dom';
import { rootRouteRef } from '../../routes';
import { codesceneApiRef } from '../../api/api';
import { Project, Analysis } from '../../api/types';
import {
  Grid,
  Card,
  CardActionArea,
  Input,
  makeStyles,
  CardContent,
  Chip,
  CardActions,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  overflowXScroll: {
    overflowX: 'scroll',
  },
}));

function matchFilter(filter?: string): (entry: Project) => boolean {
  const terms = filter
    ?.toLocaleLowerCase('en-US')
    .split(/\s/)
    .map(e => e.trim())
    .filter(Boolean);

  if (!terms?.length) {
    return () => true;
  }

  return entry => {
    const text = `${entry.name} ${entry.description || ''}`.toLocaleLowerCase(
      'en-US',
    );
    return terms.every(term => text.includes(term));
  };
}

function topLanguages(analysis: Analysis, coerceAtMost: number): string[] {
  return analysis.file_summary
    .sort((a, b) => b.code - a.code)
    .map(fileSummary => fileSummary.language)
    .slice(0, coerceAtMost);
}

type ProjectAndAnalysis = {
  project: Project;
  analysis?: Analysis;
};

export const ProjectsComponent = () => {
  const routeRef = useRouteRef(rootRouteRef);
  const codesceneApi = useApi(codesceneApiRef);

  const classes = useStyles();
  const [searchText, setSearchText] = React.useState('');
  const {
    value: projectsWithAnalyses,
    loading,
    error,
  } = useAsync(async (): Promise<Record<number, ProjectAndAnalysis>> => {
    const projects = (await codesceneApi.fetchProjects()).projects;

    const promises = projects.map(project =>
      codesceneApi.fetchLatestAnalysis(project.id),
    );
    // analyses associates project IDs with their latests analysis
    const analyses: Record<number, Analysis> = await Promise.allSettled(
      promises,
    ).then(results => {
      return results
        .filter(result => result.status === 'fulfilled')
        .map(result => result as PromiseFulfilledResult<Analysis>)
        .map(result => result.value)
        .reduce(
          (acc, analysis) => ({ ...acc, [analysis.project_id]: analysis }),
          {},
        );
    });
    return projects.reduce(
      (acc, project) => ({
        ...acc,
        [project.id]: {
          project: project,
          analysis: analyses[project.id],
        },
      }),
      {},
    );
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  } else if (
    !projectsWithAnalyses ||
    Object.keys(projectsWithAnalyses).length === 0
  ) {
    return <Alert severity="error">No projects found!</Alert>;
  }

  const projects = Object.values(projectsWithAnalyses)
    .map(p => p.project)
    .sort((a, b) => a.name.localeCompare(b.name));

  const cards = projects.filter(matchFilter(searchText)).map(project => {
    const analysis = projectsWithAnalyses[project.id].analysis;
    const subtitle = analysis
      ? `Last analysis: ${analysis.readable_analysis_time} · Score: ${analysis.high_level_metrics.current_score} · Active authors: ${analysis.high_level_metrics.active_developers}`
      : undefined;
    const chips = analysis
      ? topLanguages(analysis, 3).map(lang => (
          <Chip label={lang} key={lang} size="small" />
        ))
      : undefined;
    return (
      <Grid key={project.id} item xs={3}>
        <Card>
          <CardActionArea
            style={{
              height: '100%',
              overflow: 'hidden',
              width: '100%',
            }}
            component={RouterLink}
            to={`${routeRef()}/${project.id}`}
          >
            <ItemCardHeader title={project.name} />
            <CardContent>{subtitle}</CardContent>
            <CardActions disableSpacing>{chips}</CardActions>
          </CardActionArea>
        </Card>
      </Grid>
    );
  });

  return (
    <Content className={classes.overflowXScroll}>
      <ContentHeader title="Projects">
        <Input
          id="projects-filter"
          type="search"
          placeholder="Filter"
          onChange={e => setSearchText(e.target.value)}
        />
      </ContentHeader>
      <Grid container>{cards}</Grid>
    </Content>
  );
};
