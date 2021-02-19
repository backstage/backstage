/*
 * Copyright 2020 Spotify AB
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

import React, { useEffect, useMemo, useState } from 'react';
import { EntityMeta, TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import {
  configApiRef,
  Content,
  ContentHeader,
  Header,
  Lifecycle,
  Page,
  Progress,
  SupportButton,
  useApi,
  WarningPanel,
} from '@backstage/core';
import { Button, Grid, Link, makeStyles, Typography } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { EntityFilterGroupsProvider, useFilteredEntities } from '../../filter';
import { TemplateCard, TemplateCardProps } from '../TemplateCard';
import { ResultsFilter } from '../ResultsFilter/ResultsFilter';
import { ScaffolderFilter } from '../ScaffolderFilter';
import { ButtonGroup } from '../ScaffolderFilter/ScaffolderFilter';
import StarIcon from '@material-ui/icons/Star';
import { useStarredEntities } from '../../hooks/useStarredEntities';
import SearchToolbar from '../SearchToolbar/SearchToolbar';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    display: 'grid',
    gridTemplateAreas: "'filters' 'grid'",
    gridTemplateColumns: '250px 1fr',
    gridColumnGap: theme.spacing(2),
  },
}));

const getTemplateCardProps = (
  template: TemplateEntityV1alpha1,
): TemplateCardProps & { key: string } => {
  return {
    key: template.metadata.uid!,
    name: template.metadata.name,
    title: `${(template.metadata.title || template.metadata.name) ?? ''}`,
    type: template.spec.type ?? '',
    description: template.metadata.description ?? '-',
    tags: (template.metadata?.tags as string[]) ?? [],
  };
};

export const ScaffolderPageContents = () => {
  const styles = useStyles();
  const {
    loading,
    error,
    filteredEntities,
    availableCategories,
  } = useFilteredEntities();
  const configApi = useApi(configApiRef);
  const orgName = configApi.getOptionalString('organization.name') ?? 'Company';
  const { isStarredEntity } = useStarredEntities();
  const filterGroups = useMemo<ButtonGroup[]>(
    () => [
      {
        name: orgName,
        items: [
          {
            id: 'all',
            label: 'All',
            filterFn: () => true,
          },
        ],
      },
      {
        name: 'Personal',
        items: [
          {
            id: 'starred',
            label: 'Starred',
            icon: StarIcon,
            filterFn: isStarredEntity,
          },
        ],
      },
    ],
    [isStarredEntity, orgName],
  );
  const [search, setSearch] = useState('');
  const [matchingEntities, setMatchingEntities] = useState(
    [] as TemplateEntityV1alpha1[],
  );

  const matchesQuery = (metadata: EntityMeta, query: string) =>
    `${metadata.title}`.toUpperCase().indexOf(query) !== -1 ||
    metadata.tags?.join('').toUpperCase().indexOf(query) !== -1;

  useEffect(() => {
    if (search.length === 0) {
      return setMatchingEntities(filteredEntities);
    }
    return setMatchingEntities(
      filteredEntities.filter(template =>
        matchesQuery(template.metadata, search.toUpperCase()),
      ),
    );
  }, [search, filteredEntities]);

  return (
    <Page themeId="home">
      <Header
        pageTitleOverride="Create a New Component"
        title={
          <>
            Create a New Component <Lifecycle alpha shorthand />
          </>
        }
        subtitle="Create new software components using standard templates"
      />
      <Content>
        <ContentHeader title="Available Templates">
          <Button
            variant="contained"
            color="primary"
            component={RouterLink}
            to="/catalog-import"
          >
            Register Existing Component
          </Button>
          <SupportButton>
            Create new software components using standard templates. Different
            templates create different kinds of components (services, websites,
            documentation, ...).
          </SupportButton>
        </ContentHeader>

        <div className={styles.contentWrapper}>
          <div>
            <SearchToolbar search={search} setSearch={setSearch} />
            <ScaffolderFilter
              buttonGroups={filterGroups}
              initiallySelected="all"
            />
            <ResultsFilter availableCategories={availableCategories} />
          </div>
          <div>
            {!matchingEntities && loading && <Progress />}
            {matchingEntities && !matchingEntities.length && (
              <Typography variant="body2">
                Shoot! Looks like you don't have any templates. Check out the
                documentation{' '}
                <Link href="https://backstage.io/docs/features/software-templates/adding-templates">
                  here!
                </Link>
              </Typography>
            )}
            {error && (
              <WarningPanel title="Oops! Something went wrong loading the templates">
                {error.message}
              </WarningPanel>
            )}
            <Grid container>
              {matchingEntities &&
                matchingEntities?.length > 0 &&
                matchingEntities.map(template => {
                  return (
                    <Grid
                      key={template.metadata.uid}
                      item
                      xs={12}
                      sm={6}
                      md={3}
                    >
                      <TemplateCard {...getTemplateCardProps(template)} />
                    </Grid>
                  );
                })}
            </Grid>
          </div>
        </div>
      </Content>
    </Page>
  );
};

export const ScaffolderPage = () => (
  <EntityFilterGroupsProvider>
    <ScaffolderPageContents />
  </EntityFilterGroupsProvider>
);
