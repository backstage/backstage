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
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import {
  Container,
  NavigationButton,
  RightSideButtons,
} from './ExecutionNavigation.styles';
import { useExecutionNavigation } from '../../../../hooks/useExecutionNavigation';
import { useState, useMemo } from 'react';
import { CompleteGoldenPathDialog } from '../CompleteGoldenPathDialog';
import { useGoldenPathTaskContext } from '../../useGoldenPathTaskContext';
import { usePermission } from '@backstage/plugin-permission-react';
import { templateExecutePermission } from '@backstage/plugin-golden-paths-common';

export const ExecutionNavigation = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    isCompleteButtonVisible,
    isNextButtonDisabled,
    isPreviousButtonVisible,
    isGoldenPathCompleted,
    navigateNext,
    navigatePrevious,
    isCurrentStepCompleted,
    isCurrentStepSkipped,
    isCurrentStepMarkedAsDone,
    updateCurrentTemplateStatus,
    oneOfTemplatesHasError,
  } = useExecutionNavigation();

  const {
    value: {
      stepIndex,
      goldenPathTask: {
        id: taskId,
        spec: { steps },
        status,
      },
    },
  } = useGoldenPathTaskContext();

  const { id: templateId } = useMemo(
    () => steps[stepIndex],
    [stepIndex, steps],
  );

  const { allowed: canExecuteTemplate } = usePermission({
    permission: templateExecutePermission,
    resourceRef: taskId,
  });

  const { allowed: canCompleteTask } = usePermission({
    permission: templateExecutePermission,
    resourceRef: taskId,
  });

  const SkipButton = () => (
    <NavigationButton
      disabled={
        isCurrentStepCompleted ||
        isCurrentStepSkipped ||
        isCurrentStepMarkedAsDone ||
        status === 'cancelled'
      }
      onClick={() => updateCurrentTemplateStatus(taskId, templateId, 'skipped')}
    >
      Skip
    </NavigationButton>
  );

  const MarkAsDoneButton = () => (
    <NavigationButton
      disabled={
        isCurrentStepCompleted ||
        isCurrentStepMarkedAsDone ||
        status === 'cancelled'
      }
      onClick={() =>
        updateCurrentTemplateStatus(taskId, templateId, 'marked_as_done')
      }
    >
      Mark as done
    </NavigationButton>
  );

  const CompleteButton = () => (
    <NavigationButton
      onClick={() => setDialogOpen(true)}
      variant="contained"
      disabled={
        isNextButtonDisabled ||
        isGoldenPathCompleted ||
        oneOfTemplatesHasError ||
        status === 'cancelled'
      }
    >
      Complete Golden Path <ArrowForwardIcon />
    </NavigationButton>
  );

  const NextButton = () => (
    <NavigationButton
      variant="contained"
      onClick={navigateNext}
      disabled={isNextButtonDisabled}
    >
      Next template
      <ArrowForwardIcon />
    </NavigationButton>
  );

  return (
    <Container>
      <CompleteGoldenPathDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
      {isPreviousButtonVisible ? (
        <NavigationButton onClick={navigatePrevious}>
          <ArrowBackIcon />
          Previous template
        </NavigationButton>
      ) : (
        <div />
      )}

      {status === 'completed' && isCompleteButtonVisible ? null : (
        <RightSideButtons>
          {canExecuteTemplate && <SkipButton />}
          {canExecuteTemplate && <MarkAsDoneButton />}
          {isCompleteButtonVisible ? (
            canCompleteTask && <CompleteButton />
          ) : (
            <NextButton />
          )}
        </RightSideButtons>
      )}
    </Container>
  );
};
