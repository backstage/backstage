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
import React from 'react';
import { usePlatformScript } from '../../hooks/usePlatformScript';
import { Inspector } from 'react-inspector';

export function EvalResult({ yaml }: { yaml: string }) {
  const result = usePlatformScript(yaml || 'false');

  if (result.loading) {
    return <>Loading...</>;
  } else if (result.error) {
    return <>{result.error.message}</>;
  } else if (result.value) {
    if (result.value.type === 'external') {
      if (React.isValidElement(result.value.value)) {
        return result.value.value;
      }
      return <Inspector table={false} data={result.value.value} />;
    }
    return <Inspector table={false} data={result.value} />;
  }

  return <></>;
}
