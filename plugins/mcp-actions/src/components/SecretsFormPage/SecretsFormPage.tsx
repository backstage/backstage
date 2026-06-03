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
import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from '@backstage/core-plugin-api';
import {
  Header,
  Page,
  Content,
  Progress,
  InfoCard,
} from '@backstage/core-components';
import { Typography, makeStyles } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import useAsync from 'react-use/esm/useAsync';
import { mcpActionsApiRef } from '../../api/McpActionsClient';
import { withTheme } from '@rjsf/core';
import { generateBuiTheme } from '@backstage/rjsf-bui-theme';
import validator from '@rjsf/validator-ajv8';
import type { UiSchema } from '@rjsf/utils';
import type { JSONSchema7 } from 'json-schema';

const BuiForm = withTheme(generateBuiTheme());

const useStyles = makeStyles(theme => ({
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

function buildUiSchema(schema: JSONSchema7): UiSchema {
  const uiSchema: UiSchema = {};
  const properties = schema.properties ?? {};
  for (const name of Object.keys(properties)) {
    uiSchema[name] = { 'ui:widget': 'password' };
  }
  return uiSchema;
}

export function SecretsFormPage() {
  const classes = useStyles();
  const { elicitationId } = useParams() as { elicitationId: string };
  const api = useApi(mcpActionsApiRef);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  const {
    value: elicitation,
    loading,
    error,
  } = useAsync(() => api.getElicitation(elicitationId), [elicitationId]);

  const uiSchema = useMemo(
    () => (elicitation ? buildUiSchema(elicitation.secretsSchema) : {}),
    [elicitation],
  );

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

  const handleSubmit = async ({ formData }: { formData?: any }) => {
    if (!formData) return;
    setSubmitError(undefined);
    setSubmitting(true);
    try {
      await api.submitSecrets(elicitationId, elicitation.csrfToken, formData);
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
          <BuiForm
            schema={elicitation.secretsSchema}
            uiSchema={uiSchema}
            validator={validator}
            onSubmit={handleSubmit}
            disabled={submitting}
          >
            {submitError && (
              <Typography color="error" paragraph>
                {submitError}
              </Typography>
            )}
          </BuiForm>
        </InfoCard>
      </Content>
    </Page>
  );
}
