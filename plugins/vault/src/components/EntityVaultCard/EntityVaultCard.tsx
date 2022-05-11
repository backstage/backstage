/*
 * Copyright 2020 The Backstage Authors
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
import { useEntity } from '@backstage/plugin-catalog-react';
import { makeStyles, Typography } from '@material-ui/core';
import { isVaultAvailable } from '../../conditions';
import { CodeSnippet, InfoCard, Button } from '@backstage/core-components';
import { BackstageTheme } from '@backstage/theme';
import { VAULT_SECRET_PATH_ANNOTATION } from '../../constants';
import { EntityVaultTable } from '../EntityVaultTable';

const COMPONENT_YAML = `metadata:
  name: example
  annotations:
    ${VAULT_SECRET_PATH_ANNOTATION}: value`;

const useStyles = makeStyles<BackstageTheme>(
  theme => ({
    code: {
      borderRadius: 6,
      margin: `${theme.spacing(2)}px 0px`,
      background: theme.palette.type === 'dark' ? '#444' : '#fff',
    },
  }),
  { name: 'BackstageMissingVaultAnnotation' },
);

export const EntityVaultCard = () => {
  const { entity } = useEntity();
  const classes = useStyles();

  if (isVaultAvailable(entity)) {
    return <EntityVaultTable entity={entity} />;
  }
  return (
    <InfoCard title="Vault">
      <>
        <Typography variant="body1">
          Add the annotation to your component YAML as shown in the highlighted
          example below:
        </Typography>
        <div className={classes.code}>
          <CodeSnippet
            text={COMPONENT_YAML}
            language="yaml"
            showLineNumbers
            highlightedNumbers={[3, 4]}
            customStyle={{ background: 'inherit', fontSize: '115%' }}
          />
        </div>
        <Button
          color="primary"
          variant="contained"
          style={{ textDecoration: 'none' }}
          to="https://backstage.io/docs/features/software-catalog/well-known-annotations"
        >
          Read more
        </Button>
      </>
    </InfoCard>
  );
};
