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

import { ApiEntityV1alpha1, Entity } from '@backstage/catalog-model';
import {
  Content,
  errorApiRef,
  Header,
  Page,
  pageTheme,
  PageTheme,
  Progress,
  useApi,
} from '@backstage/core';
// TODO: Circular ref
import { catalogApiRef } from '@backstage/plugin-catalog';
import { Box } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAsync } from 'react-use';
import { ApiDefinitionCard } from '../ApiDefinitionCard/ApiDefinitionCard';

const REDIRECT_DELAY = 1000;
function headerProps(
  kind: string,
  namespace: string | undefined,
  name: string,
  entity: Entity | undefined,
): { headerTitle: string; headerType: string } {
  return {
    headerTitle: `${name}${namespace ? ` in ${namespace}` : ''}`,
    headerType: (() => {
      let t = kind.toLowerCase();
      if (entity && entity.spec && 'type' in entity.spec) {
        t += ' — ';
        t += (entity.spec as { type: string }).type.toLowerCase();
      }
      return t;
    })(),
  };
}

export const getPageTheme = (entity?: Entity): PageTheme => {
  const themeKey = entity?.spec?.type?.toString() ?? 'home';
  return pageTheme[themeKey] ?? pageTheme.home;
};

type EntityPageTitleProps = {
  title: string;
  entity: Entity | undefined;
};

const EntityPageTitle = ({ title }: EntityPageTitleProps) => (
  <Box display="inline-flex" alignItems="center" height="1em">
    {title}
  </Box>
);

export const ApiEntityPage = () => {
  const { optionalNamespaceAndName } = useParams() as {
    optionalNamespaceAndName: string;
  };
  const navigate = useNavigate();
  const [name, namespace] = optionalNamespaceAndName.split(':').reverse();

  const errorApi = useApi(errorApiRef);
  const catalogApi = useApi(catalogApiRef);

  const { value: entity, error, loading } = useAsync(
    () => catalogApi.getEntityByName({ kind: 'API', namespace, name }),
    [catalogApi, namespace, name],
  );

  useEffect(() => {
    if (!error && !loading && !entity) {
      errorApi.post(new Error('Entity not found!'));
      setTimeout(() => {
        navigate('/');
      }, REDIRECT_DELAY);
    }
  }, [errorApi, navigate, error, loading, entity]);

  if (!name) {
    navigate('/api-docs');
    return null;
  }

  const { headerTitle, headerType } = headerProps(
    'API',
    namespace,
    name,
    entity,
  );

  return (
    <Page theme={getPageTheme(entity)}>
      <Header
        title={<EntityPageTitle title={headerTitle} entity={entity} />}
        pageTitleOverride={headerTitle}
        type={headerType}
      />

      {loading && <Progress />}

      {error && (
        <Content>
          <Alert severity="error">{error.toString()}</Alert>
        </Content>
      )}

      {entity && (
        <>
          <Content>
            <ApiDefinitionCard apiEntity={entity as ApiEntityV1alpha1} />
          </Content>
        </>
      )}
    </Page>
  );
};
