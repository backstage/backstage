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
import '@testing-library/jest-dom';

global.BroadcastChannel = jest
  .fn()
  .mockImplementation((_channelName: string) => {
    const listeners: ((event: { data: any }) => void)[] = [];

    return {
      addEventListener: (
        type: string,
        listener: (event: { data: any }) => void,
      ) => {
        if (type === 'message') {
          listeners.push(listener);
        }
      },
      removeEventListener: (
        type: string,
        listener: (event: { data: any }) => void,
      ) => {
        if (type === 'message') {
          const index = listeners.indexOf(listener);
          if (index !== -1) {
            listeners.splice(index, 1);
          }
        }
      },
      postMessage: (message: any) => {
        listeners.forEach(listener => {
          listener({ data: message });
        });
      },
    };
  });
