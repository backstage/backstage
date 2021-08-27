/*
 * Copyright 2021 The Backstage Authors
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
import { RouterOptions } from '../types';
import { WebSocketConnectionManager } from '@backstage/backend-common';

export class NotificationsManager {
  private readonly logger: Logger;
  private readonly websocketConnectionManager: WebSocketConnectionManager;

  constructor(options: RouterOptions) {
    this.logger = options.logger;
    this.websocketConnectionManager = options.websocketConnectionManager;
  }

  sendMessages(totalTimes: number) {
    const messageTemplate = {
      message: 'Backstage Build no ',
      type: 'success',
      timestamp: 1620679610000,
    };

    let times = 0;
    const timer = setInterval(() => {
      if (times === totalTimes) clearInterval(timer);

      const message = Object.assign({}, messageTemplate);
      message.type = ['waiting', 'succcess', 'failure', 'inprogress'][
        Math.floor(Math.random() * 4)
      ];
      message.message += times;
      message.timestamp = Date.now();
      this.websocketConnectionManager.sendMessage('raghu', message);
      times++;
    }, 4000);
  }
}
