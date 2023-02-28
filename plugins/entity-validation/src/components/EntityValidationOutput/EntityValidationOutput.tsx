/*
 * Copyright 2023 The Backstage Authors
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
import { identityApiRef, useApi } from '@backstage/core-plugin-api';
import {
  catalogApiRef,
  humanizeEntityRef,
} from '@backstage/plugin-catalog-react';
import { List, makeStyles, Typography } from '@material-ui/core';
import useAsync from 'react-use/lib/useAsync';
import { InfoCard, Progress } from '@backstage/core-components';
import Alert from '@material-ui/lab/Alert';
import {
  CatalogProcessorResult,
  ValidationOutput,
  ValidationOutputError,
  ValidationOutputOk,
} from '../../types';
import { EntityResult } from './EntityResult';

const useStyles = makeStyles(theme => ({
  validationOk: {
    color: theme.palette.success.main,
  },
  validationNotOk: {
    color: theme.palette.error.main,
  },
}));

function sortResults(items: Array<ValidationOutputOk>) {
  return items.sort((a, b) =>
    humanizeEntityRef(a.entity).localeCompare(humanizeEntityRef(b.entity)),
  );
}

type EntityValidationOutputProps = {
  processorResults?: CatalogProcessorResult[];
  locationUrl: string;
};

export const EntityValidationOutput = ({
  processorResults,
  locationUrl,
}: EntityValidationOutputProps) => {
  const classes = useStyles();
  const catalogApi = useApi(catalogApiRef);
  const identityApi = useApi(identityApiRef);

  const { value = [], loading } = useAsync(async (): Promise<
    ValidationOutput[] | undefined
  > => {
    if (!processorResults) {
      return undefined;
    }

    const location = locationUrl
      ? `url:${locationUrl}`
      : 'url:http://localhost';

    return await Promise.all(
      processorResults.map(async item => {
        if (item.type === 'entity') {
          const { token } = await identityApi.getCredentials();

          const validateResult = await catalogApi.validateEntity(
            item.entity,
            location,
            {
              token,
            },
          );
          return {
            type: 'valid',
            entity: item.entity,
            response: validateResult,
          };
        } else if (item.type === 'error') {
          return {
            type: 'error',
            processingError: `Malformed entity YAML, ${item.error}`,
          };
        }
        return {
          type: 'error',
          processingError: `Internal error, failed to parse entity`,
        };
      }),
    );
  }, [processorResults]);

  if (loading) {
    return <Progress />;
  }

  const errors = value.filter(
    v => v.type === 'error',
  ) as ValidationOutputError[];

  const results = sortResults(
    value.filter(v => v.type === 'valid') as ValidationOutputOk[],
  );
  // If there are any errors, only the first one will be expanded
  const firstErrorIndex = results.findIndex(r => !r.response.valid);

  if (errors.length !== 0) {
    return (
      <>
        {errors.map(err => (
          <Alert severity="error">{err.processingError}</Alert>
        ))}
      </>
    );
  }

  return (
    <InfoCard>
      {results.length === 0 ? (
        <div style={{ padding: '15px' }}>
          <Typography variant="body1">
            No entity definitions found or validated yet
          </Typography>
        </div>
      ) : (
        <>
          <List disablePadding dense>
            {results.map((item, key) => (
              <EntityResult
                key={key}
                item={item}
                isFirstError={key === firstErrorIndex}
              />
            ))}
          </List>
          <div style={{ marginTop: '25px', textAlign: 'center' }}>
            {results.every(r => r.response.valid) ? (
              <Typography variant="body1" className={classes.validationOk}>
                All the entities are valid!
              </Typography>
            ) : (
              <Typography variant="body1" className={classes.validationNotOk}>
                One or more entities have validation errors
              </Typography>
            )}
          </div>
        </>
      )}
    </InfoCard>
  );
};
