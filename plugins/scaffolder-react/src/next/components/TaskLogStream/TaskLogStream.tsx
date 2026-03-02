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
import { LogViewer } from '@backstage/core-components';

/**
 * The text of the event stream
 *
 * @alpha
 */
export const TaskLogStream = (props: { logs: { [k: string]: string[] } }) => {
  return (
    <div className="w-full h-full relative min-h-[240px]">
      <LogViewer
        text={Object.values(props.logs)
          .map(l => l.join('\n'))
          .filter(Boolean)
          .join('\n')}
      />
    </div>
  );
};
