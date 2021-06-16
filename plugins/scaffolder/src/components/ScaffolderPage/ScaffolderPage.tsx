/*
 * Copyright 2020 The Backstage Authors
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

import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import {
  Content,
  ContentHeader,
  Header,
  ItemCardGrid,
  Lifecycle,
  Page,
  Progress,
  SupportButton,
  WarningPanel,
} from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import {
  EntityKindPicker,
  EntityListProvider,
  EntitySearchBar,
  EntityTypePicker,
  useEntityListProvider,
  UserListPicker,
} from '@backstage/plugin-catalog-react';
import { Button, Link, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { registerComponentRouteRef } from '../../routes';
import { TemplateCard } from '../TemplateCard';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    display: 'grid',
    gridTemplateAreas: "'filters' 'grid'",
    gridTemplateColumns: '250px 1fr',
    gridColumnGap: theme.spacing(2),
  },
}));

export const ScaffolderPageContents = () => {
  const styles = useStyles();
  const { loading, error, entities } = useEntityListProvider();

  const registerComponentLink = useRouteRef(registerComponentRouteRef);

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
          {registerComponentLink && (
            <Button
              component={RouterLink}
              variant="contained"
              color="primary"
              to={registerComponentLink()}
            >
              Register Existing Component
            </Button>
          )}
          <SupportButton>
            Create new software components using standard templates. Different
            templates create different kinds of components (services, websites,
            documentation, ...).
          </SupportButton>
        </ContentHeader>

        <div className={styles.contentWrapper}>
          <div>
            <EntitySearchBar />
            <EntityKindPicker initialFilter="template" hidden />
            <UserListPicker
              initialFilter="all"
              availableFilters={['all', 'starred']}
            />
            {/* TODO(mtlewis) replace with custom checkbox list? maybe multiselect */}
            {/* TODO(mtlewis) delete removed components since they're no longer used  */}
            <EntityTypePicker />
            {/* TODO(mtlewis) consider adding tag picker?  */}
          </div>
          <div>
            {/* TODO(mtlewis) figure out flash of error state when entities are loading */}
            {/* TODO(mtlewis) move loading, error handling etc. inside card list */}
            {loading && <Progress />}

            {error && (
              <WarningPanel title="Oops! Something went wrong loading the templates">
                {error.message}
              </WarningPanel>
            )}

            {!error && !loading && entities && !entities.length && (
              <Typography variant="body2">
                No templates found that match your filter. Learn more about{' '}
                <Link href="https://backstage.io/docs/features/software-templates/adding-templates">
                  adding templates
                </Link>
                .
              </Typography>
            )}

            <ItemCardGrid>
              {entities &&
                entities?.length > 0 &&
                entities.map((template, i) => (
                  <TemplateCard
                    key={i}
                    template={template as TemplateEntityV1alpha1}
                    deprecated={template.apiVersion === 'backstage.io/v1alpha1'}
                  />
                ))}
            </ItemCardGrid>
          </div>
        </div>
      </Content>
    </Page>
  );
};

export const ScaffolderPage = () => (
  <EntityListProvider>
    <ScaffolderPageContents />
  </EntityListProvider>
);
