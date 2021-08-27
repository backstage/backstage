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
import WebSocket from 'ws';
import qs from 'qs';
import http from 'http';
import { WebSocketConnectionManager } from './WebSocketConnectionManager';

export const websockets = async (
  expressServer: http.Server,
  websocketConnectionManager: WebSocketConnectionManager,
) => {
  const websocketServer = new WebSocket.Server({
    noServer: true,
    path: '/websockets',
  });

  expressServer.on('upgrade', (request, socket, head) => {
    websocketServer.handleUpgrade(request, socket, head, websocket => {
      websocketServer.emit('connection', websocket, request);
    });
  });

  websocketServer.on(
    'connection',
    function connection(websocketConnection: any, connectionRequest: any) {
      const [_path, params] = connectionRequest?.url?.split('?');
      const connectionParams = qs.parse(params);

      // NOTE: connectParams are not used here but good to understand how to get
      // to them if you need to pass data with the connection to identify it (e.g., a userId).
      console.log('$$$$$$$$$$$$$$$$');
      console.log(connectionParams);
      console.log('$$$$$$$$$$$$$$$$');

      if (connectionParams.userId) {
        websocketConnectionManager.addUserWebSocketConnection(
          connectionParams.userId.toString(),
          websocketConnection,
        );
      }

      // websocketConnection.send("push" + Date.now());
      // setInterval(() => {
      //   websocketConnection.send("push" + Date.now());
      // }, 2000);

      // pass the message to different connectors based on path?
      // NotificationsWsConnector(websocketConnection, connectionParams);

      // websocketConnection.on("message", (message: WebSocket.Data) => {
      //   const parsedMessage = JSON.parse(message.toString());
      //   console.log(parsedMessage);
      //   websocketConnection.send(JSON.stringify({ message: `There be gold in them thar hills. ${connectionParams.userId}` }));
      //   // setInterval(() => {
      //   //   websocketConnection.send("push" + Date.now());
      //   // }, 2000);
      // });
    },
  );

  return websocketServer;
};
