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

import { TemplateEntityV1alpha1, Entity } from '@backstage/catalog-model';
import {
  configApiRef,
  Content,
  ContentHeader,
  errorApiRef,
  Header,
  Lifecycle,
  Page,
  Progress,
  SupportButton,
  useApi,
  WarningPanel,
} from '@backstage/core';
import { catalogApiRef, isOwnerOf } from '@backstage/plugin-catalog-react';
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Link,
  makeStyles,
  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import useStaleWhileRevalidate from 'swr';
import { EntityFilterGroupsProvider, useFilteredEntities } from '../../filter';
import { TemplateCard, TemplateCardProps } from '../TemplateCard';
import { ResultsFilter } from '../ResultsFilter/ResultsFilter';
import { CatalogFilter } from '../CatalogFilter';
import { ButtonGroup } from '../CatalogFilter/CatalogFilter';
import SettingsIcon from '@material-ui/icons/Settings';
import StarIcon from '@material-ui/icons/Star';
import { useOwnUser } from '../useOwnUser';
import { useStarredEntities } from '../../hooks/useStarredEntities';
import Search from '@material-ui/icons/Search';
import Clear from '@material-ui/icons/Clear';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    display: 'grid',
    gridTemplateAreas: "'filters' 'grid'",
    gridTemplateColumns: '250px 1fr',
    gridColumnGap: theme.spacing(2),
  },
  searchToolbar: {
    paddingLeft: 0,
    paddingRight: 0,
  },
}));

const getTemplateCardProps = (
  template: Entity,
): TemplateCardProps & { key: string } => {
  return {
    key: template.metadata.uid!,
    name: template.metadata.name,
    title: `${(template.metadata.title || template.metadata.name) ?? ''}`,
    // TODO: Validate this prop (I changed TemplateEntityV1alpha1 to Entity interface) Remove 'as any'
    type: (template as any).spec.type ?? '',
    description: template.metadata.description ?? '-',
    tags: (template.metadata?.tags as string[]) ?? [],
  };
};

export const ScaffolderPageContents = () => {
  const styles = useStyles();
  const {
    loading,
    error,
    reload,
    matchingEntities,
    availableTags, // TODO: Change  tags to Categories
    isCatalogEmpty,
  } = useFilteredEntities();
  // TODO: use Selected Sidebar Item
  const [selectedSidebarItem, setSelectedSidebarItem] = useState<string>();

  const catalogApi = useApi(catalogApiRef);
  const errorApi = useApi(errorApiRef);
  const {
    data: templates /* isValidating*/ /* , error */,
  } = useStaleWhileRevalidate('templates/all', async () => {
    const response = await catalogApi.getEntities({
      filter: { kind: 'Template' },
    });
    return response.items as TemplateEntityV1alpha1[];
  });
  useEffect(() => {
    if (!error) return;
    errorApi.post(error);
  }, [error, errorApi]);

  const { value: user } = useOwnUser();

  const configApi = useApi(configApiRef);
  const orgName = configApi.getOptionalString('organization.name') ?? 'Company';

  const { isStarredEntity } = useStarredEntities();

  // TODO: ButtonGroup from CatalogFilter?
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
        name: 'Personal', // TODO: Do we need owner?
        items: [
          {
            id: 'owned',
            label: 'Owned',
            icon: SettingsIcon,
            filterFn: entity => user !== undefined && isOwnerOf(user, entity),
          },
          {
            id: 'starred',
            label: 'Starred',
            icon: StarIcon,
            filterFn: isStarredEntity,
          },
        ],
      },
    ],
    [isStarredEntity, orgName, user],
  );

  const [search, setSearch] = useState('');
  const [filteredTemplates, setFilteredTemplates] = useState([] as Entity[]); // TODO: Should I use Entity?
  useEffect(() => {
    const searchUppercase = search.toUpperCase();
    if (search.length === 0) {
      return setFilteredTemplates(matchingEntities);
    }
    return setFilteredTemplates(
      matchingEntities.filter(template => {
        const { title, tags } = template.metadata;
        return (
          `${title}`.toUpperCase().indexOf(searchUppercase) !== -1 ||
          `${tags}`.toUpperCase().indexOf(searchUppercase) !== -1
        );
      }),
    );
  }, [search, matchingEntities]);

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
            <Toolbar className={styles.searchToolbar}>
              <FormControl>
                <Input
                  id="input-with-icon-adornment"
                  placeholder="Search"
                  autoComplete="off"
                  onChange={event => setSearch(event.target.value)}
                  value={search}
                  startAdornment={
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="clear search"
                        onClick={() => setSearch('')}
                        edge="end"
                        disabled={search.length === 0}
                      >
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Toolbar>

            <CatalogFilter
              buttonGroups={filterGroups} // TODO: filterGroups??
              onChange={({ label }) => setSelectedSidebarItem(label)} // TODO: setSelecteSidebarItem
              initiallySelected="all"
            />
            <ResultsFilter availableTags={availableTags} />
          </div>
          <div>
            {!filteredTemplates && loading && <Progress />}
            {filteredTemplates && !filteredTemplates.length && (
              <Typography variant="body2">
                Shoot! Looks like you don't have any templates. Check out the
                documentation{' '}
                <Link href="https://backstage.io/docs/features/software-templates/adding-templates">
                  here!
                </Link>
              </Typography>
            )}
            {error && (
              <WarningPanel>
                Oops! Something went wrong loading the templates:{' '}
                {error.message}
              </WarningPanel>
            )}
            <Grid container>
              {filteredTemplates &&
                filteredTemplates?.length > 0 &&
                filteredTemplates.map(template => {
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
