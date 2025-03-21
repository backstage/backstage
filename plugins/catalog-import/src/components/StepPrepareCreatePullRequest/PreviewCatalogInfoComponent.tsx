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
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import React from 'react';
import YAML from 'yaml';
import { CodeSnippet } from '@backstage/core-components';
import { trimEnd } from 'lodash';
import { useCatalogFilename } from '../../hooks';

/**
 * Props for {@link PreviewCatalogInfoComponent}.
 *
 * @public
 */
export interface PreviewCatalogInfoComponentProps {
  repositoryUrl: string;
  entities: Entity[];
  classes?: { card?: string; cardContent?: string };
}

/**
 * Previews information about an entity to create.
 *
 * @public
 */
export const PreviewCatalogInfoComponent = (
  props: PreviewCatalogInfoComponentProps,
) => {
  const { repositoryUrl, entities, classes } = props;
  const catalogFilename = useCatalogFilename();

  return (
    <Card variant="outlined" className={classes?.card}>
      <CardHeader
        title={
          <code>{`${trimEnd(repositoryUrl, '/')}/${catalogFilename}`}</code>
        }
      />

      <CardContent className={classes?.cardContent}>
        <CodeSnippet
          text={entities
            .map(e => YAML.stringify(e))
            .join('---\n')
            .trim()}
          language="yaml"
        />
      </CardContent>
    </Card>
  );
};
