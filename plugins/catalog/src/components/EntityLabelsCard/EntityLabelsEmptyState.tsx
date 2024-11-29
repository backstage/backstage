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

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { CodeSnippet } from '@backstage/core-components';
import { catalogTranslationRef } from '../../alpha/translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

const ENTITY_YAML = `metadata:
  name: example
  labels:
    javaVersion: 1.2.3`;

/** @public */
export type EntityLabelsEmptyStateClassKey = 'code';

const useStyles = makeStyles(
  theme => ({
    code: {
      borderRadius: 6,
      margin: theme.spacing(2, 0),
      background:
        theme.palette.type === 'dark' ? '#444' : theme.palette.common.white,
    },
  }),
  { name: 'PluginCatalogEntityLabelsEmptyState' },
);

export function EntityLabelsEmptyState() {
  const classes = useStyles();
  const { t } = useTranslationRef(catalogTranslationRef);

  return (
    <>
      <Typography variant="body1">
        {t('entityLabelsCard.emptyDescription')}
      </Typography>
      <div className={classes.code}>
        <CodeSnippet
          text={ENTITY_YAML}
          language="yaml"
          showLineNumbers
          highlightedNumbers={[3, 4, 5, 6]}
          customStyle={{ background: 'inherit', fontSize: '115%' }}
        />
      </div>
      <Button
        variant="contained"
        color="primary"
        target="_blank"
        href="https://backstage.io/docs/features/software-catalog/descriptor-format#labels-optional"
      >
        {t('entityLabelsCard.readMoreButtonTitle')}
      </Button>
    </>
  );
}
