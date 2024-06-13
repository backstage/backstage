/*
 * Copyright 2020 The Backstage Authors
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

import * as React from 'react';

export const AbortedIcon = ({
  className,
  dataTestId,
}: {
  className: string;
  dataTestId: string;
}): React.ReactElement => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -960 960 960"
      className={className}
      data-testid={dataTestId}
    >
      <path d="M140-440q-25 0-42.5-17.5T80-500q0-25 17.5-42.5T140-560h240q25 0 42.5 17.5T440-500q0 25-17.5 42.5T380-440H140Zm440 0q-25 0-42.5-17.5T520-500q0-25 17.5-42.5T580-560h240q25 0 42.5 17.5T880-500q0 25-17.5 42.5T820-440H580Z" />
    </svg>
  );
};
