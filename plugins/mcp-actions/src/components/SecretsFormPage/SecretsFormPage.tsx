/*
 * Copyright 2025 The Backstage Authors
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
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '@backstage/core-plugin-api';
import {
  Header,
  Page,
  Content,
  Progress,
  InfoCard,
} from '@backstage/core-components';
import { TextField, Button, Typography, makeStyles } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import useAsync from 'react-use/esm/useAsync';
import { mcpActionsApiRef } from '../../api/McpActionsClient';
import { JSONSchema7 } from 'json-schema';

const useStyles = makeStyles(theme => ({
  field: {
    marginBottom: theme.spacing(2),
  },
  success: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(4),
  },
  error: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
    padding: theme.spacing(4),
    color: theme.palette.error.main,
  },
  successIcon: {
    fontSize: 64,
    color: theme.palette.success.main,
  },
}));

function getSchemaFields(
  schema: JSONSchema7,
): Array<{ name: string; title: string; description: string }> {
  const properties = schema.properties ?? {};
  return Object.entries(properties).map(([name, prop]) => {
    const field = prop as JSONSchema7;
    return {
      name,
      title: field.title || name,
      description: field.description || '',
    };
  });
}

export function SecretsFormPage() {
  const classes = useStyles();
  const { elicitationId } = useParams() as { elicitationId: string };
  const api = useApi(mcpActionsApiRef);
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  const {
    value: elicitation,
    loading,
    error,
  } = useAsync(() => api.getElicitation(elicitationId), [elicitationId]);

  if (loading) {
    return (
      <Page themeId="tool">
        <Header title="Provide Credentials" />
        <Content>
          <Progress />
        </Content>
      </Page>
    );
  }

  if (error || !elicitation) {
    return (
      <Page themeId="tool">
        <Header title="Provide Credentials" />
        <Content>
          <div className={classes.error}>
            <ErrorOutlineIcon style={{ fontSize: 64 }} />
            <Typography variant="h6">
              This session has expired or is not available.
            </Typography>
            <Typography>Please retry from your MCP client.</Typography>
          </div>
        </Content>
      </Page>
    );
  }

  if (submitted) {
    return (
      <Page themeId="tool">
        <Header title="Credentials Received" />
        <Content>
          <div className={classes.success}>
            <CheckCircleOutlineIcon className={classes.successIcon} />
            <Typography variant="h6">Credentials received</Typography>
            <Typography>
              You can close this window and return to your MCP client.
            </Typography>
          </div>
        </Content>
      </Page>
    );
  }

  const fields = getSchemaFields(elicitation.secretsSchema);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(undefined);
    setSubmitting(true);
    try {
      await api.submitSecrets(elicitationId, elicitation.csrfToken, values);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to submit credentials',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page themeId="tool">
      <Header title="Provide Credentials" />
      <Content>
        <InfoCard
          title={elicitation.action.title}
          subheader={elicitation.action.description}
        >
          <form onSubmit={handleSubmit}>
            {fields.map(field => (
              <TextField
                key={field.name}
                className={classes.field}
                fullWidth
                required
                type="password"
                label={field.title}
                helperText={field.description}
                value={values[field.name] || ''}
                onChange={e =>
                  setValues(prev => ({
                    ...prev,
                    [field.name]: e.target.value,
                  }))
                }
              />
            ))}
            {submitError && (
              <Typography color="error" paragraph>
                {submitError}
              </Typography>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </InfoCard>
      </Content>
    </Page>
  );
}
