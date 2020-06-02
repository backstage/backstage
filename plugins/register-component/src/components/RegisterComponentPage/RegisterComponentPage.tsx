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
  ListItemText,
  List,
  LinearProgress,
  ListItemIcon,
} from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import {
  InfoCard,
  Page,
  pageTheme,
  Content,
  ContentHeader,
  SupportButton,
  useApi,
  alertApiRef,
  errorApiRef,
} from '@backstage/core';
import RegisterComponentForm from '../RegisterComponentForm';
import { catalogApiRef } from '@backstage/plugin-catalog';

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
  Error: 'error',
  Submitting: 'submitting',
} as const;

type ValuesOf<T> = T extends Record<any, infer V> ? V : never;
const RegisterComponentPage: FC<{}> = () => {
  const classes = useStyles();
  const catalogApi = useApi(catalogApiRef);
  const [formState, setFormState] = useState<ValuesOf<typeof FormStates>>(
    FormStates.Idle,
  );

  const alertApi = useApi(alertApiRef);
  const errorApi = useApi(errorApiRef);

  const [result, setResult] = useState<{
    data: any;
    error: null | Error;
    loading: boolean;
  }>({
    data: null,
    error: null,
    loading: false,
  });

  const handleSubmit = async (formData: Record<string, string>) => {
    setFormState(FormStates.Submitting);
    const { componentLocation: target } = formData;
    try {
      const data = await catalogApi.addLocation('github', target);

      alertApi.post({
        message: 'Successfully added the location',
        severity: 'success',
      });
      setResult({ error: null, loading: false, data });
      setFormState(FormStates.Success);
    } catch (e) {
      setFormState(FormStates.Error);
      errorApi.post(e);
    }
  };

  return (
    <Page theme={pageTheme.tool}>
      <Content>
        <ContentHeader title="Register existing component">
          <SupportButton>Documentation</SupportButton>
        </ContentHeader>
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
        open={
          formState === FormStates.Error || formState === FormStates.Success
        }
        onClose={() => setFormState(FormStates.Idle)}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle>Component registration result</DialogTitle>
        {result.data ? (
          <>
            <DialogContent>
              <DialogContentText>
                Following components have been succefully created:
                <List>
                  {result.data.entities.map((entity: any) => (
                    <ListItem button>
                      <ListItemIcon>
                        <LinkIcon />
                      </ListItemIcon>
                      <RouterLink to={`/catalog/${entity.metadata.name}`}>
                        <ListItemText primary={entity.metadata.name} />
                      </RouterLink>
                    </ListItem>
                  ))}
                </List>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button component={RouterLink} to="/" color="default">
                To Catalog
              </Button>
            </DialogActions>
          </>
        ) : (
          <DialogContent>
            <DialogContentText className={classes.contentText}>
              Your component is being created. Please wait.
            </DialogContentText>
          </DialogContent>
        )}
      </Dialog>
    </Page>
  );
};

export default RegisterComponentPage;
