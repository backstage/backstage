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

import { TemplateEntityV1alpha1 } from '@backstage/catalog-model';
import {
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
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Button, Grid, Link, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import useStaleWhileRevalidate from 'swr';
import { TemplateCard, TemplateCardProps } from '../TemplateCard';

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

export const ScaffolderPage = () => {
  const catalogApi = useApi(catalogApiRef);
  const errorApi = useApi(errorApiRef);

  const { data: templates, isValidating, error } = useStaleWhileRevalidate(
    'templates/all',
    async () => {
      const response = await catalogApi.getEntities({
        filter: { kind: 'Template' },
      });
      return response.items as TemplateEntityV1alpha1[];
    },
  );

  useEffect(() => {
    if (!error) return;
    errorApi.post(error);
  }, [error, errorApi]);

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
        {!templates && isValidating && <Progress />}
        {templates && !templates.length && (
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
            Oops! Something went wrong loading the templates: {error.message}
          </WarningPanel>
        )}
        <Grid container>
          {templates &&
            templates?.length > 0 &&
            templates.map(template => {
              return (
                <Grid key={template.metadata.uid} item xs={12} sm={6} md={3}>
                  <TemplateCard {...getTemplateCardProps(template)} />
                </Grid>
              );
            })}
        </Grid>
      </Content>
    </Page>
  );
};
