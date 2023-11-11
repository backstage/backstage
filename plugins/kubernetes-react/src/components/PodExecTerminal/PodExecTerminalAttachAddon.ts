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
import { AttachAddon, IAttachOptions } from 'xterm-addon-attach';

export class PodExecTerminalAttachAddon extends AttachAddon {
  #textEncoder = new TextEncoder();

  constructor(socket: WebSocket, options?: IAttachOptions) {
    super(socket, options);

    const thisAddon = this as any;

    // These methods are private in the original AttachAddon,
    // thus have to override at runtime like this
    thisAddon._sendBinary = (data: string) => {
      if (!thisAddon._checkOpenSocket()) {
        return;
      }

      const buffer = Uint8Array.from([0, ...this.#textEncoder.encode(data)]);

      thisAddon._socket.send(buffer);
    };

    thisAddon._sendData = (data: string) => {
      if (!thisAddon._checkOpenSocket()) {
        return;
      }

      thisAddon._sendBinary(data);
    };
  }
}
