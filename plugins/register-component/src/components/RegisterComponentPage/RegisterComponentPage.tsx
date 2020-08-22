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

import React, { FC, useState } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import {
  InfoCard,
  Page,
  pageTheme,
  Content,
  useApi,
  errorApiRef,
  Header,
  SupportButton,
  ContentHeader,
} from '@backstage/core';
import RegisterComponentForm from '../RegisterComponentForm';
import { catalogApiRef } from '@backstage/plugin-catalog';
import { useMountedState } from 'react-use';
import { Entity, Location } from '@backstage/catalog-model';
import { RegisterComponentResultDialog } from '../RegisterComponentResultDialog';

const useStyles = makeStyles(theme => ({
  dialogPaper: {
    minHeight: 250,
    minWidth: 600,
  },
  icon: {
    width: 20,
    marginRight: theme.spacing(1),
  },
  contentText: {
    paddingBottom: theme.spacing(2),
  },
}));

const FormStates = {
  Idle: 'idle',
  Success: 'success',
  Submitting: 'submitting',
} as const;

type ValuesOf<T> = T extends Record<any, infer V> ? V : never;
const RegisterComponentPage: FC<{}> = () => {
  const classes = useStyles();
  const catalogApi = useApi(catalogApiRef);
  const [formState, setFormState] = useState<ValuesOf<typeof FormStates>>(
    FormStates.Idle,
  );
  const isMounted = useMountedState();

  const errorApi = useApi(errorApiRef);

  const [result, setResult] = useState<{
    data: {
      entities: Entity[];
      location: Location;
    } | null;
    error: null | Error;
  }>({
    data: null,
    error: null,
  });

  const handleSubmit = async (formData: Record<string, string>) => {
    setFormState(FormStates.Submitting);
    const { componentLocation: target } = formData;
    try {
      var typeMapping = [
        { url: /https:\/\/gitlab\.com\/.*/, type: 'gitlab' },
        { url: /https:\/\/bitbucket\.org\/.*/, type: 'bitbucket/api' },
        { url: /https:\/\/dev\.azure\.com\/.*/, type: 'azure/api' },
        { url: /.*/, type: 'github' },
      ];

      var type = typeMapping.filter(function (item) {
        return new RegExp(item.url).test(target);
      })[0].type;

      const data = await catalogApi.addLocation(type, target);

      if (!isMounted()) return;

      setResult({ error: null, data });
      setFormState(FormStates.Success);
    } catch (e) {
      errorApi.post(e);

      if (!isMounted()) return;

      setResult({ error: e, data: null });
      setFormState(FormStates.Idle);
    }
  };

  return (
    <Page theme={pageTheme.home}>
      <Header title="Register existing component" />
      <Content>
        <ContentHeader title="Start tracking your component in Backstage">
          <SupportButton>
            Start tracking your component in Backstage. TODO: Add more
            information about what this is.
          </SupportButton>
        </ContentHeader>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <InfoCard>
              <RegisterComponentForm
                onSubmit={handleSubmit}
                submitting={formState === FormStates.Submitting}
              />
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
      {formState === FormStates.Success && (
        <RegisterComponentResultDialog
          entities={result.data!.entities}
          onClose={() => setFormState(FormStates.Idle)}
          classes={{ paper: classes.dialogPaper }}
        />
      )}
    </Page>
  );
};

export default RegisterComponentPage;
