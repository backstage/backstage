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
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { BackstageTheme } from '@backstage/theme';
import { Link } from '../Link';
import { EmptyState } from './EmptyState';
import { CodeSnippet } from '../CodeSnippet';

const COMPONENT_YAML_TEMPLATE = `apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: example
  description: example.com
  annotations:
    ANNOTATION: value
spec:
  type: website
  lifecycle: production
  owner: user:guest`;

const ANNOTATION_REGEXP = /^.*ANNOTATION.*$/m;
const ANNOTATION_YAML = COMPONENT_YAML_TEMPLATE.match(ANNOTATION_REGEXP)![0];
const ANNOTATION_LINE = COMPONENT_YAML_TEMPLATE.split('\n').findIndex(line =>
  ANNOTATION_REGEXP.test(line),
);

type Props = {
  annotation: string | string[];
  readMoreUrl?: string;
};

export type MissingAnnotationEmptyStateClassKey = 'code';

const useStyles = makeStyles<BackstageTheme>(
  theme => ({
    code: {
      borderRadius: 6,
      margin: `${theme.spacing(2)}px 0px`,
      background: theme.palette.type === 'dark' ? '#444' : '#fff',
    },
  }),
  { name: 'BackstageMissingAnnotationEmptyState' },
);

function generateLineNumbers(lineCount: number) {
  return Array.from(Array(lineCount + 1).keys(), i => i + ANNOTATION_LINE);
}

function generateComponentYaml(annotations: string[]) {
  const annotationYaml = annotations
    .map(ann => ANNOTATION_YAML.replace('ANNOTATION', ann))
    .join('\n');

  return COMPONENT_YAML_TEMPLATE.replace(ANNOTATION_YAML, annotationYaml);
}

function generateDescription(annotations: string[]) {
  const isSingular = annotations.length <= 1;
  return (
    <>
      The {isSingular ? 'annotation' : 'annotations'}{' '}
      {annotations
        .map(ann => <code>{ann}</code>)
        .reduce((prev, curr) => (
          <>
            {prev}, {curr}
          </>
        ))}{' '}
      {isSingular ? 'is' : 'are'} missing. You need to add the{' '}
      {isSingular ? 'annotation' : 'annotations'} to your component if you want
      to enable this tool.
    </>
  );
}

export function MissingAnnotationEmptyState(props: Props) {
  const { annotation, readMoreUrl } = props;
  const annotations = Array.isArray(annotation) ? annotation : [annotation];
  const url =
    readMoreUrl ||
    'https://backstage.io/docs/features/software-catalog/well-known-annotations';
  const classes = useStyles();

  return (
    <EmptyState
      missing="field"
      title="Missing Annotation"
      description={generateDescription(annotations)}
      action={
        <>
          <Typography variant="body1">
            Add the annotation to your component YAML as shown in the
            highlighted example below:
          </Typography>
          <div className={classes.code}>
            <CodeSnippet
              text={generateComponentYaml(annotations)}
              language="yaml"
              showLineNumbers
              highlightedNumbers={generateLineNumbers(annotations.length)}
              customStyle={{ background: 'inherit', fontSize: '115%' }}
            />
          </div>
          <Button color="primary" component={Link} to={url}>
            Read more
          </Button>
        </>
      }
    />
  );
}
