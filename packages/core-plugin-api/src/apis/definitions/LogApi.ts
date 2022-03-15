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

import { ApiRef, createApiRef } from '../system';
import { useApi } from '../hooks';
import { LogLevel } from './LogStoreApi';

/**
 * A wrapper for the fetch API, that has additional behaviors such as the
 * ability to automatically inject auth information where necessary.
 *
 * @public
 */
export type LogApi = {
  [Level in LogLevel]: (...args: any) => void;
};

/**
 * The {@link ApiRef} of {@link LogApi}.
 *
 * @public
 */
export const logApiRef: ApiRef<LogApi> = createApiRef({
  id: 'core.log',
});

/**
 * Utility wrapper around `useApi(logApiRef)` which decorates logging with the
 * current plugin stack metadata.
 */
export function useLog() {
  return useApi(logApiRef);
}
