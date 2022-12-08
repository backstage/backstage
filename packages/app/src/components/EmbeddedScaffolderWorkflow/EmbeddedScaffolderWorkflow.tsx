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
  TemplateContent,
  useGetCustomFields,
} from '@backstage/plugin-scaffolder';
import { Button } from '@material-ui/core';
import type { JsonValue } from '@backstage/types';
import { FormProps } from '@backstage/plugin-scaffolder-react';

interface WorkflowProps {
  frontPage: ReactNode;
  namespace: string;
  templateName: string;
  customExtensionsElement?: React.ReactNode;
  initialFormState?: Record<string, JsonValue>;
  onComplete: (values: Record<string, JsonValue>) => Promise<void>;
  onError(error: Error | undefined): JSX.Element | null;
  FormProps: FormProps
}

export function EmbeddedScaffolderWorkflow({
  namespace,
  templateName,
  customExtensionsElement = <></>,
  frontPage,
  onComplete,
  onError,
}: WorkflowProps): JSX.Element {
  const [showTemplateContent, setShowTemplateContent] = useState(false);
  const fieldExtensions = useGetCustomFields(customExtensionsElement);

  const showContent = !showTemplateContent;

  const startTemplate = useCallback(() => setShowTemplateContent(true), []);

  return (
    <>
      {showContent && (
        <>
          {frontPage}
          <Button variant="contained" onClick={startTemplate}>
            SETUP
          </Button>
        </>
      )}
      {showTemplateContent && (
        <TemplateContent
          namespace={namespace}
          templateName={templateName}
          onComplete={onComplete}
          onError={onError}
          customFieldExtensions={fieldExtensions}
          initialFormState={{
            name: 'prefilled-name',
            description: 'prefilled description',
            owner: 'acme-corp',
            repoUrl: 'github.com?owner=component&repo=component',
          }}
        />
      )}
    </>
  );
}
