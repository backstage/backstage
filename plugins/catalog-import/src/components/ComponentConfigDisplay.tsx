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

import { Entity } from '@backstage/catalog-model';
import {
  errorApiRef,
  RouteRef,
  StructuredMetadataTable,
  useApi,
} from '@backstage/core';
import {
  entityRoute,
  entityRouteParams,
} from '@backstage/plugin-catalog-react';
import {
  Button,
  CircularProgress,
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import { generatePath, resolvePath } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import * as YAML from 'yaml';
import { PartialEntity } from '../util/types';
import { urlType } from '../util/urls';
import { useGithubRepos } from '../util/useGithubRepos';
import { ConfigSpec } from './ImportComponentPage';

const getEntityCatalogPath = ({
  entity,
  catalogRouteRef,
}: {
  entity: PartialEntity;
  catalogRouteRef: RouteRef;
}) => {
  const relativeEntityPathInsideCatalog = generatePath(
    entityRoute.path,
    entityRouteParams(entity as Entity),
  );

  const resolvedAbsolutePath = resolvePath(
    relativeEntityPathInsideCatalog,
    catalogRouteRef.path,
  )?.pathname;

  return resolvedAbsolutePath;
};

type Props = {
  nextStep: (options?: { reset: boolean }) => void;
  configFile: ConfigSpec;
  savePRLink: (PRLink: string) => void;
  catalogRouteRef: RouteRef;
};

const ComponentConfigDisplay = ({
  nextStep,
  configFile,
  savePRLink,
  catalogRouteRef,
}: Props) => {
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const errorApi = useApi(errorApiRef);
  const { submitPrToRepo, addLocation } = useGithubRepos();
  const onNext = useCallback(async () => {
    try {
      setSubmitting(true);
      if (urlType(configFile.location) === 'tree') {
        const result = await submitPrToRepo(configFile);
        savePRLink(result.link);
        setSubmitting(false);
        nextStep();
      } else {
        addLocation(configFile.location);
        setSubmitting(false);
        nextStep();
      }
    } catch (e) {
      setErrorOccurred(true);
      setSubmitting(false);
      errorApi.post(e);
    }
  }, [submitPrToRepo, configFile, nextStep, savePRLink, errorApi, addLocation]);

  return (
    <Grid container direction="column" spacing={1}>
      {urlType(configFile.location) === 'tree' ? (
        <Typography>
          Following config object will be submitted in a pull request to the
          repository{' '}
          <Link
            href={configFile.location}
            target="_blank"
            rel="noopener noreferrer"
          >
            {configFile.location}
          </Link>{' '}
          and added as a new location to the backend
        </Typography>
      ) : (
        <Typography>
          Following config object will be added as a new location to the backend{' '}
          <Link
            href={configFile.location}
            target="_blank"
            rel="noopener noreferrer"
          >
            {configFile.location}
          </Link>
        </Typography>
      )}

      <Grid item>
        {urlType(configFile.location) === 'tree' ? (
          <pre>{YAML.stringify(configFile.config)}</pre>
        ) : (
          <List>
            {configFile.config.map((entity: any, index: number) => {
              const entityPath = getEntityCatalogPath({
                entity,
                catalogRouteRef,
              });
              return (
                <React.Fragment
                  key={`${entity.metadata.namespace}-${entity.metadata.name}`}
                >
                  <ListItem>
                    <StructuredMetadataTable
                      dense
                      metadata={{
                        name: entity.metadata.name,
                        type: entity.spec.type,
                        link: (
                          <Link component={RouterLink} to={entityPath}>
                            {entityPath}
                          </Link>
                        ),
                      }}
                    />
                  </ListItem>
                  {index < configFile.config.length - 1 && (
                    <Divider component="li" />
                  )}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Grid>
      <Grid item container spacing={1}>
        {submitting ? (
          <Grid item>
            <CircularProgress size="2rem" />
          </Grid>
        ) : null}
        <Grid item>
          <Button
            disabled={submitting}
            variant="contained"
            color="primary"
            onClick={onNext}
          >
            Next
          </Button>
          {errorOccurred ? (
            <Button
              style={{ marginLeft: '8px' }}
              variant="outlined"
              color="primary"
              onClick={() => nextStep({ reset: true })}
            >
              Start again
            </Button>
          ) : null}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ComponentConfigDisplay;
