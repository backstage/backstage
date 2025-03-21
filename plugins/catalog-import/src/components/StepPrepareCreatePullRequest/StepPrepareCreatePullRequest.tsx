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

import { Entity } from '@backstage/catalog-model';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import { assertError } from '@backstage/errors';
import {
  catalogApiRef,
  humanizeEntityRef,
} from '@backstage/plugin-catalog-react';
import Box from '@material-ui/core/Box';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useEffect, useState } from 'react';
import { UnpackNestedValue, UseFormReturn } from 'react-hook-form';
import useAsync from 'react-use/esm/useAsync';
import YAML from 'yaml';
import { AnalyzeResult, catalogImportApiRef } from '../../api';
import { useCatalogFilename } from '../../hooks';
import { PartialEntity } from '../../types';
import { BackButton, NextButton } from '../Buttons';
import { PrepareResult } from '../useImportState';
import { PreparePullRequestForm } from './PreparePullRequestForm';
import { PreviewCatalogInfoComponent } from './PreviewCatalogInfoComponent';
import { PreviewPullRequestComponent } from './PreviewPullRequestComponent';

const useStyles = makeStyles(theme => ({
  previewCard: {
    marginTop: theme.spacing(1),
  },
  previewCardContent: {
    paddingTop: 0,
  },
}));

type FormData = {
  title: string;
  body: string;
  componentName: string;
  owner: string;
  useCodeowners: boolean;
};

/**
 * Props for {@link StepPrepareCreatePullRequest}.
 *
 * @public
 */
export interface StepPrepareCreatePullRequestProps {
  analyzeResult: Extract<AnalyzeResult, { type: 'repository' }>;
  onPrepare: (
    result: PrepareResult,
    opts?: { notRepeatable?: boolean },
  ) => void;
  onGoBack?: () => void;

  renderFormFields: (
    props: Pick<
      UseFormReturn<FormData>,
      'register' | 'setValue' | 'formState'
    > & {
      values: UnpackNestedValue<FormData>;
      groups: string[];
      groupsLoading: boolean;
    },
  ) => React.ReactNode;
}

export function generateEntities(
  entities: PartialEntity[],
  componentName: string,
  owner?: string,
): Entity[] {
  return entities.map(e => ({
    ...e,
    apiVersion: e.apiVersion!,
    kind: e.kind!,
    metadata: {
      ...e.metadata,
      name: componentName,
    },
    spec: {
      ...e.spec,
      ...(owner ? { owner } : {}),
    },
  }));
}

/**
 * Prepares a pull request.
 *
 * @public
 */
export const StepPrepareCreatePullRequest = (
  props: StepPrepareCreatePullRequestProps,
) => {
  const { analyzeResult, onPrepare, onGoBack, renderFormFields } = props;

  const classes = useStyles();
  const catalogApi = useApi(catalogApiRef);
  const catalogImportApi = useApi(catalogImportApiRef);
  const errorApi = useApi(errorApiRef);

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string>();

  const catalogFilename = useCatalogFilename();

  const {
    loading: prDefaultsLoading,
    value: prDefaults,
    error: prDefaultsError,
  } = useAsync(
    () => catalogImportApi.preparePullRequest!(),
    [catalogImportApi.preparePullRequest],
  );

  useEffect(() => {
    if (prDefaultsError) {
      errorApi.post(prDefaultsError);
    }
  }, [prDefaultsError, errorApi]);

  const { loading: groupsLoading, value: groups } = useAsync(async () => {
    const groupEntities = await catalogApi.getEntities({
      filter: { kind: 'group' },
    });

    return groupEntities.items
      .map(e => humanizeEntityRef(e, { defaultKind: 'group' }))
      .sort();
  });

  const handleResult = useCallback(
    async (data: FormData) => {
      setSubmitted(true);

      try {
        const pr = await catalogImportApi.submitPullRequest({
          repositoryUrl: analyzeResult.url,
          title: data.title,
          body: data.body,
          fileContent: generateEntities(
            analyzeResult.generatedEntities,
            data.componentName,
            data.owner,
          )
            .map(e => YAML.stringify(e))
            .join('---\n'),
        });

        onPrepare(
          {
            type: 'repository',
            url: analyzeResult.url,
            integrationType: analyzeResult.integrationType,
            pullRequest: {
              url: pr.link,
            },
            locations: [
              {
                target: pr.location,
                entities: generateEntities(
                  analyzeResult.generatedEntities,
                  data.componentName,
                  data.owner,
                ).map(e => ({
                  kind: e.kind,
                  namespace: e.metadata.namespace!,
                  name: e.metadata.name,
                })),
              },
            ],
          },
          { notRepeatable: true },
        );
      } catch (e) {
        assertError(e);
        setError(e.message);
        setSubmitted(false);
      }
    },
    [
      analyzeResult.generatedEntities,
      analyzeResult.integrationType,
      analyzeResult.url,
      catalogImportApi,
      onPrepare,
    ],
  );

  return (
    <>
      <Typography>
        You entered a link to a {analyzeResult.integrationType} repository but a{' '}
        <code>{catalogFilename}</code> could not be found. Use this form to open
        a Pull Request that creates one.
      </Typography>

      {!prDefaultsLoading && (
        <PreparePullRequestForm<FormData>
          onSubmit={handleResult}
          defaultValues={{
            title: prDefaults?.title ?? '',
            body: prDefaults?.body ?? '',
            owner:
              (analyzeResult.generatedEntities[0]?.spec?.owner as string) || '',
            componentName:
              analyzeResult.generatedEntities[0]?.metadata?.name || '',
            useCodeowners: false,
          }}
          render={({ values, formState, register, setValue }) => (
            <>
              {renderFormFields({
                values,
                formState,
                register,
                setValue,
                groups: groups ?? [],
                groupsLoading,
              })}

              <Box marginTop={2}>
                <Typography variant="h6">Preview Pull Request</Typography>
              </Box>

              <PreviewPullRequestComponent
                title={values.title}
                description={values.body}
                classes={{
                  card: classes.previewCard,
                  cardContent: classes.previewCardContent,
                }}
              />

              <Box marginTop={2} marginBottom={1}>
                <Typography variant="h6">Preview Entities</Typography>
              </Box>

              <PreviewCatalogInfoComponent
                entities={generateEntities(
                  analyzeResult.generatedEntities,
                  values.componentName,
                  values.owner,
                )}
                repositoryUrl={analyzeResult.url}
                classes={{
                  card: classes.previewCard,
                  cardContent: classes.previewCardContent,
                }}
              />

              {error && <FormHelperText error>{error}</FormHelperText>}

              <Grid container spacing={0}>
                {onGoBack && (
                  <BackButton onClick={onGoBack} disabled={submitted} />
                )}
                <NextButton
                  type="submit"
                  disabled={Boolean(
                    formState.errors.title ||
                      formState.errors.body ||
                      formState.errors.owner,
                  )}
                  loading={submitted}
                >
                  Create PR
                </NextButton>
              </Grid>
            </>
          )}
        />
      )}
    </>
  );
};
