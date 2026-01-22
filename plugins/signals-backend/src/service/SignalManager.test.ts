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

import { WebSocket } from 'ws';
import { EventsServiceSubscribeOptions } from '@backstage/plugin-events-node';
import { SignalManager } from './SignalManager';
import { mockServices } from '@backstage/backend-test-utils';

class MockWebSocket {
  closed: boolean = false;
  readyState: number = WebSocket.OPEN;
  callbacks: Map<string | symbol, (this: WebSocket, ...args: any[]) => void> =
    new Map();
  data: any[] = [];

  close(_: number, __: string | Buffer): void {
    this.readyState = WebSocket.CLOSED;
    this.closed = true;
  }

  terminate(): void {
    this.readyState = WebSocket.CLOSED;
    this.closed = true;
  }

  on(
    event: string | symbol,
    listener: (this: WebSocket, ...args: any[]) => void,
  ) {
    this.callbacks.set(event, listener);
    return this;
  }

  // @ts-ignore
  send(data: any, _?: (err?: Error) => void): void {
    this.data.push(data);
  }

  trigger(event: string | symbol, ...args: any[]): void {
    const cb = this.callbacks.get(event);
    if (!cb) {
      throw new Error(`No callback for ${event.toString()}`);
    }
    // @ts-ignore
    cb(...args);
  }
}

describe('SignalManager', () => {
  let onEvent: Function;

  const mockEvents = {
    publish: async () => {},
    subscribe: async (subscriber: EventsServiceSubscribeOptions) => {
      onEvent = subscriber.onEvent;
    },
  };

  const shutdownHooks: Function[] = [];
  const mockLifecycle = mockServices.lifecycle.mock({
    addShutdownHook: (hook: Function) => shutdownHooks.push(hook),
  });

  const manager = SignalManager.create({
    events: mockEvents,
    logger: mockServices.logger.mock(),
    config: mockServices.rootConfig(),
    lifecycle: mockLifecycle,
  });

  it('should close all connections when server is closed', () => {
    const ws = new MockWebSocket();
    manager.addConnection(ws as unknown as WebSocket);
    shutdownHooks.forEach(hook => hook());
    expect(ws.closed).toBeTruthy();
  });

  it('should close connection on error', () => {
    const ws = new MockWebSocket();
    manager.addConnection(ws as unknown as WebSocket);

    ws.trigger('error', new Error('error'));
    expect(ws.closed).toBeTruthy();
  });

  it('should allow subscribing and unsubscribing to events', async () => {
    const ws = new MockWebSocket();
    manager.addConnection(ws as unknown as WebSocket);

    ws.trigger(
      'message',
      JSON.stringify({ action: 'subscribe', channel: 'test' }),
      false,
    );

    await onEvent({
      topic: 'signals',
      eventPayload: {
        recipients: { type: 'broadcast' },
        channel: 'test',
        message: { msg: 'test' },
      },
    });

    expect(ws.data.length).toEqual(1);
    expect(ws.data[0]).toEqual(
      JSON.stringify({ channel: 'test', message: { msg: 'test' } }),
    );

    ws.trigger(
      'message',
      JSON.stringify({ action: 'unsubscribe', channel: 'test' }),
      false,
    );

    await onEvent({
      topic: 'signals',
      eventPayload: {
        recipients: { type: 'broadcast' },
        channel: 'test',
        message: { msg: 'test' },
      },
    });

    expect(ws.data.length).toEqual(1);
  });

  it('should only send to users from identity', async () => {
    // Connection without identity
    const ws1 = new MockWebSocket();
    manager.addConnection(ws1 as unknown as WebSocket);

    // Connection with identity and subscription
    const ws2 = new MockWebSocket();
    manager.addConnection(ws2 as unknown as WebSocket, {
      ownershipEntityRefs: ['user:default/john.doe'],
      userEntityRef: 'user:default/john.doe',
    });

    // Connection without subscription
    const ws3 = new MockWebSocket();
    manager.addConnection(ws3 as unknown as WebSocket, {
      ownershipEntityRefs: ['user:default/john.doe'],
      userEntityRef: 'user:default/john.doe',
    });

    ws1.trigger(
      'message',
      JSON.stringify({ action: 'subscribe', channel: 'test' }),
      false,
    );

    ws2.trigger(
      'message',
      JSON.stringify({ action: 'subscribe', channel: 'test' }),
      false,
    );

    await onEvent({
      topic: 'signals',
      eventPayload: {
        recipients: { type: 'user', entityRef: 'user:default/john.doe' },
        channel: 'test',
        message: { msg: 'test' },
      },
    });

    expect(ws1.data.length).toEqual(0);
    expect(ws3.data.length).toEqual(0);
    expect(ws2.data.length).toEqual(1);
    expect(ws2.data[0]).toEqual(
      JSON.stringify({ channel: 'test', message: { msg: 'test' } }),
    );
  });

  describe('channel connection count and event subscriptions', () => {
    it('should not subscribe to events again when second connection subscribes to same channel', () => {
      const subscribeCallCount = jest.fn();
      const mockEventsWithSpy = {
        publish: async () => {},
        subscribe: async (subscriber: EventsServiceSubscribeOptions) => {
          subscribeCallCount();
          onEvent = subscriber.onEvent;
        },
      };

      const testManager = SignalManager.create({
        events: mockEventsWithSpy,
        logger: mockServices.logger.mock(),
        config: mockServices.rootConfig(),
        lifecycle: mockLifecycle,
      });

      const ws1 = new MockWebSocket();
      const ws2 = new MockWebSocket();
      testManager.addConnection(ws1 as unknown as WebSocket);
      testManager.addConnection(ws2 as unknown as WebSocket);

      ws1.trigger(
        'message',
        JSON.stringify({ action: 'subscribe', channel: 'channel1' }),
        false,
      );

      expect(subscribeCallCount).toHaveBeenCalledTimes(1);

      ws2.trigger(
        'message',
        JSON.stringify({ action: 'subscribe', channel: 'channel1' }),
        false,
      );

      expect(subscribeCallCount).toHaveBeenCalledTimes(1);
    });

    it('should maintain separate connection counts for different channels', () => {
      const subscribeCallCount = jest.fn();
      const subscribedChannels: string[] = [];
      const mockEventsWithSpy = {
        publish: async () => {},
        subscribe: async (subscriber: EventsServiceSubscribeOptions) => {
          subscribeCallCount();
          subscribedChannels.push(...subscriber.topics);
          onEvent = subscriber.onEvent;
        },
      };

      const testManager = SignalManager.create({
        events: mockEventsWithSpy,
        logger: mockServices.logger.mock(),
        config: mockServices.rootConfig(),
        lifecycle: mockLifecycle,
      });

      const ws1 = new MockWebSocket();
      const ws2 = new MockWebSocket();
      testManager.addConnection(ws1 as unknown as WebSocket);
      testManager.addConnection(ws2 as unknown as WebSocket);

      ws1.trigger(
        'message',
        JSON.stringify({ action: 'subscribe', channel: 'channel1' }),
        false,
      );
      ws2.trigger(
        'message',
        JSON.stringify({ action: 'subscribe', channel: 'channel2' }),
        false,
      );

      expect(subscribeCallCount).toHaveBeenCalledTimes(2);
      expect(subscribedChannels).toContain('signals:channel1');
      expect(subscribedChannels).toContain('signals:channel2');
    });

    it('should properly clean up subscriptions when connection is terminated', async () => {
      const ws1 = new MockWebSocket();
      const ws2 = new MockWebSocket();

      manager.addConnection(ws1 as unknown as WebSocket);
      manager.addConnection(ws2 as unknown as WebSocket);

      // Both subscribe to same channel
      ws1.trigger(
        'message',
        JSON.stringify({ action: 'subscribe', channel: 'cleanup-test' }),
        false,
      );
      ws2.trigger(
        'message',
        JSON.stringify({ action: 'subscribe', channel: 'cleanup-test' }),
        false,
      );

      await onEvent({
        topic: 'signals',
        eventPayload: {
          recipients: { type: 'broadcast' },
          channel: 'cleanup-test',
          message: { msg: 'before-close' },
        },
      });

      expect(ws1.data.length).toEqual(1);
      expect(ws2.data.length).toEqual(1);

      ws1.trigger('close', 1000, Buffer.from('normal closure'));

      await onEvent({
        topic: 'signals',
        eventPayload: {
          recipients: { type: 'broadcast' },
          channel: 'cleanup-test',
          message: { msg: 'after-close' },
        },
      });

      expect(ws1.data.length).toEqual(1);
      expect(ws2.data.length).toEqual(2);
    });

    it('should not resubscribe to events after count reaches zero and increases again', () => {
      const subscribeCallCount = jest.fn();
      const mockEventsWithSpy = {
        publish: async () => {},
        subscribe: async (subscriber: EventsServiceSubscribeOptions) => {
          subscribeCallCount();
          onEvent = subscriber.onEvent;
        },
      };

      const testManager = SignalManager.create({
        events: mockEventsWithSpy,
        logger: mockServices.logger.mock(),
        config: mockServices.rootConfig(),
        lifecycle: mockLifecycle,
      });

      const ws1 = new MockWebSocket();
      testManager.addConnection(ws1 as unknown as WebSocket);

      ws1.trigger(
        'message',
        JSON.stringify({ action: 'subscribe', channel: 'resubscribe-test' }),
        false,
      );

      expect(subscribeCallCount).toHaveBeenCalledTimes(1);

      ws1.trigger(
        'message',
        JSON.stringify({ action: 'unsubscribe', channel: 'resubscribe-test' }),
        false,
      );

      ws1.trigger(
        'message',
        JSON.stringify({ action: 'subscribe', channel: 'resubscribe-test' }),
        false,
      );

      expect(subscribeCallCount).toHaveBeenCalledTimes(1);
    });
  });
});
