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

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { CodeSnippet, Link, EmptyState } from '@backstage/core-components';
import { Entity } from '@backstage/catalog-model';
import { useEntity } from '../../hooks';

/** @public */
export type MissingAnnotationEmptyStateClassKey = 'code';

const useStyles = makeStyles(
  theme => ({
    code: {
      borderRadius: 6,
      margin: theme.spacing(2, 0),
      background:
        theme.palette.type === 'dark' ? '#444' : theme.palette.common.white,
    },
  }),
  { name: 'BackstageMissingAnnotationEmptyState' },
);

function generateYamlExample(
  annotations: string[],
  entity?: Entity,
): { yamlText: string; lineNumbers: number[] } {
  const kind = entity?.kind || 'Component';
  const name = entity?.metadata.name || 'example';
  const type = entity?.spec?.type || 'website';
  const owner = entity?.spec?.owner || 'user:default/guest';

  const yamlText = `apiVersion: backstage.io/v1alpha1
kind: ${kind}
metadata:
  name: ${name}
  annotations:${annotations.map(ann => `\n    ${ann}: value`).join('')}
spec:
  type: ${type}
  owner: ${owner}`;

  let line = 6; // Line 6 is the line number that annotations are added to.
  const lineNumbers: number[] = [];
  annotations.forEach(() => {
    lineNumbers.push(line);
    line++;
  });

  return {
    yamlText,
    lineNumbers,
  };
}

function generateDescription(annotations: string[], entityKind = 'Component') {
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
      {isSingular ? 'annotation' : 'annotations'} to your {entityKind} if you
      want to enable this tool.
    </>
  );
}

/**
 * @public
 * Renders an empty state when an annotation is missing from an entity.
 */
export function MissingAnnotationEmptyState(props: {
  annotation: string | string[];
  readMoreUrl?: string;
}) {
  let entity: Entity | undefined;
  try {
    const entityContext = useEntity();
    entity = entityContext.entity;
  } catch (err) {
    // ignore when entity context doesnt exist
  }

  const { annotation, readMoreUrl } = props;
  const annotations = Array.isArray(annotation) ? annotation : [annotation];
  const url =
    readMoreUrl ||
    'https://backstage.io/docs/features/software-catalog/well-known-annotations';
  const classes = useStyles();

  const entityKind = entity?.kind || 'Component';
  const { yamlText, lineNumbers } = generateYamlExample(annotations, entity);
  return (
    <EmptyState
      missing="field"
      title="Missing Annotation"
      description={generateDescription(annotations, entityKind)}
      action={
        <>
          <Typography variant="body1">
            Add the annotation to your {entityKind} YAML as shown in the
            highlighted example below:
          </Typography>
          <Box className={classes.code}>
            <CodeSnippet
              text={yamlText}
              language="yaml"
              showLineNumbers
              highlightedNumbers={lineNumbers}
              customStyle={{ background: 'inherit', fontSize: '115%' }}
            />
          </Box>
          <Button color="primary" component={Link} to={url}>
            Read more
          </Button>
        </>
      }
    />
  );
}
