/*
 * Copyright 2021 Spotify AB
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

import { useState } from 'react';

import { ResponseStep } from '../types/types';

export function useResponseSteps() {
  const [responseSteps, setResponseSteps] = useState<ResponseStep[]>([]);

  function abortIfError(error?: Error) {
    const RESPONSE_STEP_SKIP = {
      responseStep: {
        message: 'Skipped due to error in previous step',
        icon: 'failure',
      } as ResponseStep,
    };

    if (error) {
      setResponseSteps([...responseSteps, RESPONSE_STEP_SKIP.responseStep]);
      throw error;
    }
  }

  function asyncCatcher(error: Error) {
    const responseStepError: ResponseStep = {
      message: 'Something went wrong ❌',
      secondaryMessage: `Error message: ${error.message}`,
      icon: 'failure',
    };

    setResponseSteps([...responseSteps, responseStepError]);
    throw error;
  }

  return {
    responseSteps,
    setResponseSteps,
    asyncCatcher,
    abortIfError,
  };
}
