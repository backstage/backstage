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

import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import { toError } from '@backstage/errors';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import {
  catalogApiRef,
  entityPresentationApiRef,
} from '@backstage/plugin-catalog-react';
import Box from '@material-ui/core/Box';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { NestedValue, UseFormReturn } from 'react-hook-form';
import useAsync from 'react-use/esm/useAsync';
import YAML from 'yaml';

import { AnalyzeResult, catalogImportApiRef } from '../../api';
import { useCatalogFilename } from '../../hooks';
import { catalogImportTranslationRef } from '../../translation';
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
 * Helper for unpacking NestedValue into the underlying type.
 *
 * @public
 * @deprecated This is a copy of the type from react-hook-form, and will be removed in a future release
 */
export type UnpackNestedValue<T> = T extends NestedValue<infer U>
  ? U
  : T extends Date | FileList | File | Blob
  ? T
  : T extends object
  ? {
      [K in keyof T]: UnpackNestedValue<T[K]>;
    }
  : T;

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
  ) => ReactNode;
}

/**
 * Resolves the owner value entered/selected in the form back to an entity
 * ref, when it matches one of the known groups. Falls back to the raw
 * value for free-form entries that don't match a known group (the
 * autocomplete field allows arbitrary text).
 */
function resolveOwnerEntityRef(
  owner: string | undefined,
  groupRefsByTitle: Map<string, string>,
): string | undefined {
  if (!owner) {
    return owner;
  }
  return groupRefsByTitle.get(owner) ?? owner;
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

  const { t } = useTranslationRef(catalogImportTranslationRef);
  const classes = useStyles();
  const catalogApi = useApi(catalogApiRef);
  const entityPresentationApi = useApi(entityPresentationApiRef);
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

  // Maps the human-readable group title shown in the owner autocomplete
  // back to the entity ref that must actually be written to the
  // catalog-info.yaml `spec.owner` field. Titles (e.g. "My Team") are not
  // valid entity refs (e.g. "group:default/my-team"), so this mapping is
  // required whenever the presentation title differs from the ref.
  const [groupRefsByTitle, setGroupRefsByTitle] = useState<Map<string, string>>(
    new Map(),
  );

  const { loading: groupsLoading, value: groups } = useAsync(async () => {
    const groupEntities = await catalogApi.getEntities({
      filter: { kind: 'group' },
    });

    const presentations = await Promise.all(
      groupEntities.items.map(async e => ({
        entityRef: stringifyEntityRef(e),
        presentation: await entityPresentationApi.forEntity(e, {
          defaultKind: 'group',
        }).promise,
      })),
    );

    setGroupRefsByTitle(
      new Map(
        presentations.map(p => [p.presentation.primaryTitle, p.entityRef]),
      ),
    );

    return presentations.map(p => p.presentation.primaryTitle).sort();
  });

  const handleResult = useCallback(
    async (data: FormData) => {
      setSubmitted(true);

      const owner = resolveOwnerEntityRef(data.owner, groupRefsByTitle);

      try {
        const pr = await catalogImportApi.submitPullRequest({
          repositoryUrl: analyzeResult.url,
          title: data.title,
          body: data.body,
          fileContent: generateEntities(
            analyzeResult.generatedEntities,
            data.componentName,
            owner,
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
                  owner,
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
        setError(toError(e).message);
        setSubmitted(false);
      }
    },
    [
      analyzeResult.generatedEntities,
      analyzeResult.integrationType,
      analyzeResult.url,
      catalogImportApi,
      onPrepare,
      groupRefsByTitle,
    ],
  );

  return (
    <>
      <Typography>
        {t('stepPrepareCreatePullRequest.description', {
          integrationType: analyzeResult.integrationType,
          catalogFilename: <code>{catalogFilename}</code>,
        })}
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
                <Typography variant="h6">
                  {t('stepPrepareCreatePullRequest.previewPr.title')}
                </Typography>
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
                <Typography variant="h6">
                  {t('stepPrepareCreatePullRequest.previewCatalogInfo.title')}
                </Typography>
              </Box>

              <PreviewCatalogInfoComponent
                entities={generateEntities(
                  analyzeResult.generatedEntities,
                  values.componentName,
                  resolveOwnerEntityRef(values.owner, groupRefsByTitle),
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
                  {t('stepPrepareCreatePullRequest.nextButtonText')}
                </NextButton>
              </Grid>
            </>
          )}
        />
      )}
    </>
  );
};
