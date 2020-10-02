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

import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { EmptyState } from './EmptyState';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { useEntity } from '@backstage/plugin-catalog';
import { CodeSnippet } from '../CodeSnippet';

type ActionButtonProps = {
  type: string;
  target: string;
};

const ActionButton = ({ type, target }: ActionButtonProps) =>
  type === 'github' ? (
    <Button
      variant="contained"
      color="primary"
      href={target.replace('blob', 'edit')}
      startIcon={<PostAddIcon />}
    >
      Edit component definition
    </Button>
  ) : (
    <Button
      variant="contained"
      color="primary"
      href="https://backstage.io/docs/features/software-catalog/well-known-annotations"
    >
      Read more
    </Button>
  );

const COMPONENT_YAML = `# Example
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: backstage
  description: backstage.io
  annotations:
    ANNOTATION: value
spec:
  type: website
  lifecycle: production
  owner: guest
`;

type Props = {
  annotation: string;
};

export const MissingAnnotationEmptyState = ({ annotation }: Props) => {
  const { entity } = useEntity();
  const [type, target] =
    entity?.metadata?.annotations?.['backstage.io/managed-by-location'].split(
      /:(.+)/,
    ) || [];

  return (
    <EmptyState
      missing="field"
      title="Missing Annotation"
      description={`The "${annotation}" annotation is missing on "${entity?.metadata?.name}". You need to add the annotation to your component if you want to enable this tool for it.`}
      action={
        <>
          <Typography variant="body1">
            Add the annotation to your component YAML as per the highlighted
            example below:
          </Typography>
          <CodeSnippet
            text={COMPONENT_YAML.replace('ANNOTATION', annotation)}
            language="yaml"
            showLineNumbers
            highlightedNumbers={[7, 8]}
          />
          <ActionButton type={type} target={target} />
        </>
      }
    />
  );
};
