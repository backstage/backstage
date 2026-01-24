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

import { CodeSnippet } from '../CodeSnippet';
import { Link } from '../Link';
import { EmptyState } from './EmptyState';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { coreComponentsTranslationRef } from '../../translation';

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

function generateLineNumbers(lineCount: number) {
  return Array.from(Array(lineCount + 1).keys(), i => i + ANNOTATION_LINE);
}

function generateComponentYaml(annotations: string[]) {
  const annotationYaml = annotations
    .map(ann => ANNOTATION_YAML.replace('ANNOTATION', ann))
    .join('\n');
  return COMPONENT_YAML_TEMPLATE.replace(ANNOTATION_YAML, annotationYaml);
}

function useGenerateDescription(annotations: string[]) {
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

/**
 * @public
 * @deprecated This component is deprecated, please use {@link @backstage/plugin-catalog-react#MissingAnnotationEmptyState} instead
 */
export function MissingAnnotationEmptyState(props: Props) {
  const { annotation, readMoreUrl } = props;
  const annotations = Array.isArray(annotation) ? annotation : [annotation];
  const url =
    readMoreUrl ||
    'https://backstage.io/docs/features/software-catalog/well-known-annotations';
  const classes = useStyles();
  const { t } = useTranslationRef(coreComponentsTranslationRef);

  return (
    <EmptyState
      missing="field"
      title={t('emptyState.missingAnnotation.title')}
      description={useGenerateDescription(annotations)}
      action={
        <>
          <Typography variant="body1">
            {t('emptyState.missingAnnotation.actionTitle')}
          </Typography>
          <Box className={classes.code}>
            <CodeSnippet
              text={generateComponentYaml(annotations)}
              language="yaml"
              showLineNumbers
              highlightedNumbers={generateLineNumbers(annotations.length)}
              customStyle={{ background: 'inherit', fontSize: '115%' }}
            />
          </Box>
          <Button color="primary" component={Link} to={url}>
            {t('emptyState.missingAnnotation.readMore')}
          </Button>
        </>
      }
    />
  );
}
