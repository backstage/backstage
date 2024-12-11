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

import { InfoCard } from '@backstage/core-components';
import { configApiRef, useApi } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import React from 'react';

import { catalogImportApiRef } from '../../api';
import { useCatalogFilename } from '../../hooks';
import { catalogImportTranslationRef } from '../../translation';

/**
 * Props for {@link ImportInfoCard}.
 *
 * @public
 */
export interface ImportInfoCardProps {
  exampleLocationUrl?: string;
  exampleRepositoryUrl?: string;
}

/**
 * Shows information about the import process.
 *
 * @public
 */
export const ImportInfoCard = (props: ImportInfoCardProps) => {
  const { t } = useTranslationRef(catalogImportTranslationRef);
  const {
    exampleLocationUrl = 'https://github.com/backstage/backstage/blob/master/catalog-info.yaml',
    exampleRepositoryUrl = 'https://github.com/backstage/backstage',
  } = props;

  const configApi = useApi(configApiRef);
  const appTitle = configApi.getOptionalString('app.title') || 'Backstage';
  const catalogImportApi = useApi(catalogImportApiRef);

  const hasGithubIntegration = configApi.has('integrations.github');

  const catalogFilename = useCatalogFilename();

  return (
    <InfoCard
      title={t('importInfoCard.title')}
      titleTypographyProps={{ component: 'h3' }}
      deepLink={{
        title: t('importInfoCard.deepLinkTitle'),
        link: 'https://backstage.io/docs/features/software-catalog/',
      }}
    >
      <Typography variant="body2" paragraph>
        {t('importInfoCard.linkDescription', { appTitle })}
      </Typography>
      <Typography component="h4" variant="h6">
        {t('importInfoCard.fileLinkTitle')}
      </Typography>
      <Typography variant="subtitle2" color="textSecondary" paragraph>
        {t('importInfoCard.examplePrefix')}
        <code>{exampleLocationUrl}</code>
      </Typography>
      <Typography variant="body2" paragraph>
        {t('importInfoCard.fileLinkDescription', { appTitle })}
      </Typography>
      {hasGithubIntegration && (
        <>
          <Typography component="h4" variant="h6">
            {t('importInfoCard.githubIntegration.title')}
            <Chip
              label={t('importInfoCard.githubIntegration.label')}
              variant="outlined"
              size="small"
              style={{ marginLeft: 8, marginBottom: 0 }}
            />
          </Typography>
          <Typography variant="subtitle2" color="textSecondary" paragraph>
            {t('importInfoCard.examplePrefix')}
            <code>{exampleRepositoryUrl}</code>
          </Typography>
          <Typography variant="body2" paragraph>
            The wizard discovers all <code>{catalogFilename}</code> files in the
            repository, previews the entities, and adds them to the {appTitle}{' '}
            catalog.
          </Typography>
          {catalogImportApi.preparePullRequest && (
            <Typography variant="body2" paragraph>
              If no entities are found, the wizard will prepare a Pull Request
              that adds an example <code>{catalogFilename}</code> and prepares
              the {appTitle} catalog to load all entities as soon as the Pull
              Request is merged.
            </Typography>
          )}
        </>
      )}
    </InfoCard>
  );
};
