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

import React, { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import {
  EmbeddableWorkflow,
  useGetCustomFields,
  WorkflowProps,
} from '@backstage/plugin-scaffolder';
import { Box, Button } from '@material-ui/core';
import type { JsonValue } from '@backstage/types';
import type { FormProps } from '@backstage/plugin-scaffolder-react';

type EmbeddedWorkflowProps = Omit<
  WorkflowProps,
  'customFieldExtensions' | 'onComplete'
> & {
  customExtensionsElement?: React.ReactNode;
  initialFormState?: Record<string, JsonValue>;
  onComplete: (values: Record<string, JsonValue>) => Promise<void>;
  onError(error: Error | undefined): JSX.Element | null;
  FormProps: FormProps
  frontPage: ReactNode;
  finishPage: ReactNode;
} & Partial<Pick<WorkflowProps, 'onComplete'>>;

type Display = 'front' | 'workflow' | 'finish';

type DisplayComponents = Record<Display, JSX.Element>;

type OnCompleteArgs = Parameters<WorkflowProps['onComplete']>[0];

export function EmbeddedScaffolderWorkflow({
  namespace,
  templateName,
  customExtensionsElement = <></>,
  frontPage,
  finishPage,
  onComplete = async (_values: OnCompleteArgs) => void 0,
  onError,
  title,
  description,
  ReviewStateWrapper,
}: EmbeddedWorkflowProps): JSX.Element {
  const [display, setDisplay] = useState<Display>('front');
  const fieldExtensions = useGetCustomFields(customExtensionsElement);

  const startTemplate = useCallback(() => setDisplay('workflow'), []);

  const onWorkFlowComplete = useCallback(
    async (values: OnCompleteArgs) => {
      setDisplay('finish');

      await onComplete(values);
    },
    [onComplete],
  );

  const DisplayElements: DisplayComponents = {
    front: (
      <Box display="flex" alignItems="center" flexDirection="column">
        {frontPage}
        <Button variant="contained" onClick={startTemplate}>
          SETUP
        </Button>
      </Box>
    ),
    workflow: (
      <EmbeddableWorkflow
        title={title}
        description={description}
        namespace={namespace}
        templateName={templateName}
        onComplete={onWorkFlowComplete}
        onError={onError}
        customFieldExtensions={fieldExtensions}
        initialFormState={{
          name: 'prefilled-name',
          description: 'prefilled description',
          owner: 'acme-corp',
          repoUrl: 'github.com?owner=component&repo=component',
        }}
        ReviewStateWrapper={ReviewStateWrapper}
      />
    ),
    finish: (
      <Box display="flex" alignItems="center" flexDirection="column">
        {finishPage}
      </Box>
    ),
  };

  return <>{DisplayElements[display]}</>;
}
