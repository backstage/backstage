/*
 * Copyright 2022 The Backstage Authors
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
import {
  CodeSnippet,
  InfoCard,
  Progress,
  WarningPanel,
} from '@backstage/core-components';
import useAsync from 'react-use/lib/useAsync';
import { useEntity } from '@backstage/plugin-catalog-react';
import { ApiEntity } from '@backstage/catalog-model';
import {
  Grid,
  IconButton,
  Link,
  makeStyles,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Alert, AlertTitle } from '@material-ui/lab';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { useApi } from '@backstage/core-plugin-api';
import { linterApiRef } from '../../api';

const useStyles = makeStyles(() => ({
  alertButton: {
    padding: '0',
    marginLeft: '5px',
  },
}));

/**
 * Component for browsing API docs spectral linter on an entity page.
 * @public
 */
export const EntityApiDocsSpectralLinterContent = () => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState<string | false>(false);
  const { entity } = useEntity<ApiEntity>();
  const linterApi = useApi(linterApiRef);

  const { value, loading, error } = useAsync(async () => {
    return linterApi.lint({ entity });
  }, [entity]);

  const handleChange = (alert: string) => () => {
    setExpanded(expanded === alert ? false : alert);
  };

  const getSeverity = (severity: number) => {
    switch (severity) {
      case 0:
        return 'error';
      case 1:
        return 'warning';
      default:
        return 'info';
    }
  };

  const previewContent = (
    text: string,
    startLine: number,
    endLine: number,
    path: string,
  ) => {
    const textArray = text.split('\n');
    textArray.splice(0, startLine);
    textArray.splice(
      endLine === 0 ? endLine + 1 : endLine,
      textArray.length - 1,
    );
    textArray.unshift(`... line ${startLine + 1} in source under path ${path}`);
    textArray.push(`... line ${endLine + 1} in source`);
    return textArray.join('\n');
  };

  return (
    <InfoCard
      title="Spectral Linter"
      subheader={
        value?.rulesetUrl && (
          <Link href={value?.rulesetUrl} target="_blank">
            Rule set used
          </Link>
        )
      }
    >
      {loading && <Progress />}

      {!loading && error && (
        <WarningPanel title="Failed to lint API" message={error?.message} />
      )}

      {!loading &&
        !error &&
        (value?.data?.length ? (
          value.data.map((ruleResult, idx) => (
            <Grid key={idx} container spacing={2}>
              <Grid item xs={12}>
                <Alert
                  severity={getSeverity(ruleResult.severity)}
                  variant="outlined"
                >
                  <AlertTitle>
                    {ruleResult.message} ({ruleResult.code})
                    <IconButton
                      aria-label="expand"
                      onClick={handleChange(`alert${idx}`)}
                      className={classes.alertButton}
                    >
                      {`alert${idx}` === expanded ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  </AlertTitle>
                  {`alert${idx}` === expanded && (
                    <CodeSnippet
                      text={previewContent(
                        entity.spec.definition,
                        ruleResult.linePosition.start,
                        ruleResult.linePosition.end,
                        ruleResult.path?.join(' / ') || 'unknown',
                      )}
                      language="yaml"
                      customStyle={{
                        background: 'transparent',
                        margin: '0',
                        padding: '0.5em 0',
                      }}
                    />
                  )}
                </Alert>
              </Grid>
            </Grid>
          ))
        ) : (
          <Typography>No linting errors found...</Typography>
        ))}
    </InfoCard>
  );
};
