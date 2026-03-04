/*
 * Copyright 2023 The Backstage Authors
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

import {
  ShadcnDialog,
  ShadcnDialogContent,
  ShadcnDialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { useEffect } from 'react';
import { IIdleTimer } from 'react-idle-timer';
import { coreComponentsTranslationRef } from '../../translation';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';

export interface StillTherePromptProps {
  idleTimer: IIdleTimer;
  promptTimeoutMillis: number;
  remainingTime: number;
  setRemainingTime: (amount: number) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export const StillTherePrompt = (props: StillTherePromptProps) => {
  const {
    idleTimer,
    setOpen,
    open,
    promptTimeoutMillis,
    remainingTime,
    setRemainingTime,
  } = props;
  const { t } = useTranslationRef(coreComponentsTranslationRef);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(Math.ceil(idleTimer.getRemainingTime()));
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [idleTimer, setRemainingTime]);

  const handleStillHere = () => {
    setOpen(false);
    idleTimer.activate();
  };

  const timeTillPrompt = Math.max(
    remainingTime - promptTimeoutMillis / 1000,
    0,
  );
  const seconds = timeTillPrompt > 1 ? 'seconds' : 'second';

  return (
    <ShadcnDialog open={open}>
      <ShadcnDialogContent data-testid="inactivity-prompt-dialog">
        <DialogHeader>
          <ShadcnDialogTitle>
            {t('autoLogout.stillTherePrompt.title')}
          </ShadcnDialogTitle>
        </DialogHeader>
        <DialogDescription>
          You are about to be disconnected in{' '}
          <b>
            {Math.ceil(remainingTime / 1000)} {seconds}
          </b>
          . Are you still there?
        </DialogDescription>
        <DialogFooter>
          <Button onClick={handleStillHere} variant="secondary" size="sm">
            {t('autoLogout.stillTherePrompt.buttonText')}
          </Button>
        </DialogFooter>
      </ShadcnDialogContent>
    </ShadcnDialog>
  );
};
