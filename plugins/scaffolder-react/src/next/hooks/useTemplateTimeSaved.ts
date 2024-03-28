/*
 * Copyright 2024 The Backstage Authors
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

import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Duration } from 'luxon';
import useAsync from 'react-use/lib/useAsync';

/**
 * Returns the backstage.io/time-saved annotation (as a number of minutes) for
 * a given template entity ref.
 */
export const useTemplateTimeSavedMinutes = (templateRef: string) => {
  const catalogApi = useApi(catalogApiRef);

  const { value: timeSavedMinutes } = useAsync(async () => {
    const entity = await catalogApi.getEntityByRef(templateRef);
    const timeSaved = entity?.metadata.annotations?.['backstage.io/time-saved'];

    // This is not a valid template or the template has no time-saved value.
    if (!entity || !timeSaved) {
      return undefined;
    }

    const durationMs = Duration.fromISO(timeSaved).as('minutes');

    // The time-saved annotation has an invalid value. Ignore.
    if (Number.isNaN(durationMs)) {
      return undefined;
    }

    return durationMs;
  }, [catalogApi, templateRef]);

  return timeSavedMinutes;
};
