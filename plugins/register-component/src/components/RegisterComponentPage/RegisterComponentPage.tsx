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
import { Link as RouterLink } from 'react-router-dom';
import {
  Grid,
  makeStyles,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  ListItem,
  List,
  LinearProgress,
  Divider,
  Link,
} from '@material-ui/core';
import {
  InfoCard,
  Page,
  pageTheme,
  Content,
  ContentHeader,
  SupportButton,
  useApi,
  errorApiRef,
  StructuredMetadataTable,
  Header,
} from '@backstage/core';
import RegisterComponentForm from '../RegisterComponentForm';
import { catalogApiRef } from '@backstage/plugin-catalog';
import {
  entityRoute,
  rootRoute as catalogRootRoute,
} from '@backstage/plugin-catalog';
import { generatePath } from 'react-router';

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

  const errorApi = useApi(errorApiRef);

  const [result, setResult] = useState<{
    data: any;
    error: null | Error;
  }>({
    data: null,
    error: null,
  });

  const handleSubmit = async (formData: Record<string, string>) => {
    setFormState(FormStates.Submitting);
    const { componentLocation: target } = formData;
    try {
      const data = await catalogApi.addLocation('github', target);

      setResult({ error: null, data });
      setFormState(FormStates.Success);
    } catch (e) {
      setResult({ error: e, data: null });
      setFormState(FormStates.Idle);
      errorApi.post(e);
    }
  };

  return (
    <Page theme={pageTheme.tool}>
      <Header title="Register existing component" />
      <Content>
        <Grid container spacing={3} direction="column">
          <Grid item>
            <InfoCard title="Start tracking your component in Backstage">
              {formState === FormStates.Submitting ? (
                <LinearProgress />
              ) : (
                <RegisterComponentForm onSubmit={handleSubmit} />
              )}
            </InfoCard>
          </Grid>
        </Grid>
      </Content>
      <Dialog
        open={formState === FormStates.Success}
        onClose={() => setFormState(FormStates.Idle)}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle>Component registration result</DialogTitle>
        {formState === FormStates.Success && (
          <>
            <DialogContent>
              <DialogContentText>
                Following components have been succefully created:
                <List>
                  {result.data.entities.map((entity: any, index: number) => (
                    <>
                      <ListItem>
                        <StructuredMetadataTable
                          dense
                          metadata={{
                            name: entity.metadata.name,
                            type: entity.spec.type,
                            link: (
                              <Link
                                component={RouterLink}
                                to={generatePath(entityRoute.path, {
                                  name: entity.metadata.name,
                                })}
                              >
                                {generatePath(entityRoute.path, {
                                  name: entity.metadata.name,
                                })}
                              </Link>
                            ),
                          }}
                        />
                      </ListItem>
                      {index < result.data.entities.length - 1 && (
                        <Divider component="li" />
                      )}
                    </>
                  ))}
                </List>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                component={RouterLink}
                to={catalogRootRoute.path}
                color="default"
              >
                To Catalog
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Page>
  );
};

export default RegisterComponentPage;
