/*
 * Copyright 2026 The Backstage Authors
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
import { SecretsContextProvider } from '@backstage/plugin-scaffolder-react';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { taskReadPermission } from '@backstage/plugin-scaffolder-common/alpha';

import { TemplateForm } from './TemplateForm';
import { TemplateProcessing } from './TemplateProcessing';
import { useGoldenPathTaskContext } from '../../useGoldenPathTaskContext';
import { useExecutionNavigation } from '../../../../hooks/useExecutionNavigation';
import { Alert } from '@material-ui/lab';

export const ExecutionContentCard = () => {
  const {
    value: { stepPhase, goldenPathTask },
  } = useGoldenPathTaskContext();
  const { currentStepStatus } = useExecutionNavigation();

  const applyStyles = () => {
    if (!['marked_as_done', 'skipped'].includes(currentStepStatus || '')) {
      return { marginBottom: '16px' };
    }
    return {};
  };
  return (
    <>
      {goldenPathTask.status === 'completed' ? (
        <Alert severity="success" style={{ ...applyStyles(), fontWeight: 700 }}>
          This Golden Path has been completed
        </Alert>
      ) : null}
      {stepPhase === 'form' && (
        <SecretsContextProvider>
          <TemplateForm />
        </SecretsContextProvider>
      )}

      {stepPhase === 'processing' && (
        <RequirePermission
          permission={taskReadPermission}
          resourceRef={goldenPathTask.id}
        >
          <TemplateProcessing />
        </RequirePermission>
      )}
    </>
  );
};
