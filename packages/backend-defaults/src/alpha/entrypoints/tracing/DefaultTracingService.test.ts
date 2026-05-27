/*
 * Copyright 2026 The Backstage Authors
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
import {
  SpanKind,
  SpanStatusCode,
  context,
  propagation,
  trace,
} from '@opentelemetry/api';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { DefaultTracingService } from './DefaultTracingService';

type MockSpan = {
  setAttribute: jest.Mock;
  setStatus: jest.Mock;
  recordException: jest.Mock;
  end: jest.Mock;
};

type MockTracer = {
  startActiveSpan: jest.Mock;
};

function createMockTracingPrimitives() {
  const span: MockSpan = {
    setAttribute: jest.fn(),
    setStatus: jest.fn(),
    recordException: jest.fn(),
    end: jest.fn(),
  };
  const tracer: MockTracer = {
    startActiveSpan: jest.fn(async (_name, _options, fn) => fn(span)),
  };
  const getTracer = jest.fn(() => tracer);
  return { span, tracer, getTracer };
}

describe('DefaultTracingService', () => {
  let mocks: ReturnType<typeof createMockTracingPrimitives>;
  let getTracerProviderSpy: jest.SpyInstance;

  beforeEach(() => {
    mocks = createMockTracingPrimitives();
    getTracerProviderSpy = jest
      .spyOn(trace, 'getTracerProvider')
      .mockReturnValue({ getTracer: mocks.getTracer } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function createService(opts?: {
    captureEndUser?: boolean;
    name?: string;
    version?: string;
    schemaUrl?: string;
    pluginId?: string;
  }) {
    return DefaultTracingService.create({
      name: opts?.name ?? 'backstage-plugin-test',
      version: opts?.version,
      schemaUrl: opts?.schemaUrl,
      pluginId: opts?.pluginId ?? 'test',
      captureEndUser: opts?.captureEndUser ?? false,
      httpAuth: mockServices.httpAuth(),
    });
  }

  it('configures the tracer with name, version, and schemaUrl', () => {
    createService({
      name: 'tracer-x',
      version: '1.2.3',
      schemaUrl: 'https://example.com/schema',
    });
    expect(getTracerProviderSpy).toHaveBeenCalled();
    expect(mocks.getTracer).toHaveBeenCalledWith('tracer-x', '1.2.3', {
      schemaUrl: 'https://example.com/schema',
    });
  });

  it('passes name, kind, and caller attributes through to the tracer', async () => {
    const service = createService();
    await service.startActiveSpan(
      'op',
      { kind: 'server', attributes: { foo: 'bar' } },
      async () => undefined,
    );

    expect(mocks.tracer.startActiveSpan).toHaveBeenCalledWith(
      'op',
      expect.objectContaining({
        kind: SpanKind.SERVER,
        attributes: expect.objectContaining({ foo: 'bar' }),
      }),
      expect.any(Function),
    );
  });

  it('auto-attaches backstage.plugin.id matching the calling plugin', async () => {
    const service = createService({ pluginId: 'my-plugin' });
    await service.startActiveSpan('op', async () => undefined);

    const attrs = mocks.tracer.startActiveSpan.mock.calls[0][1].attributes;
    expect(attrs['backstage.plugin.id']).toBe('my-plugin');
  });

  it('lets caller-supplied attributes override backstage.plugin.id at start time', async () => {
    const service = createService({ pluginId: 'my-plugin' });
    await service.startActiveSpan(
      'op',
      { attributes: { 'backstage.plugin.id': 'other-plugin' } },
      async () => undefined,
    );

    const attrs = mocks.tracer.startActiveSpan.mock.calls[0][1].attributes;
    expect(attrs['backstage.plugin.id']).toBe('other-plugin');
  });

  it('omits kind when none is supplied (OTel default applies)', async () => {
    const service = createService();
    await service.startActiveSpan('op', async () => undefined);

    const [, options] = mocks.tracer.startActiveSpan.mock.calls[0];
    expect(options.kind).toBeUndefined();
  });

  it('translates each Backstage span kind into the matching OTel SpanKind', async () => {
    const service = createService();
    const cases: Array<[string, SpanKind]> = [
      ['internal', SpanKind.INTERNAL],
      ['server', SpanKind.SERVER],
      ['client', SpanKind.CLIENT],
      ['producer', SpanKind.PRODUCER],
      ['consumer', SpanKind.CONSUMER],
    ];
    for (const [kind, expected] of cases) {
      mocks.tracer.startActiveSpan.mockClear();
      await service.startActiveSpan(
        'op',
        { kind: kind as any },
        async () => undefined,
      );
      expect(mocks.tracer.startActiveSpan.mock.calls[0][1].kind).toBe(expected);
    }
  });

  it('adds backstage.principal.type but not enduser.id when capture is off', async () => {
    const service = createService({ captureEndUser: false });
    await service.startActiveSpan(
      'op',
      { credentials: mockCredentials.user('user:default/alice') },
      async () => undefined,
    );

    const attrs = mocks.tracer.startActiveSpan.mock.calls[0][1].attributes;
    expect(attrs['backstage.principal.type']).toBe('user');
    expect(attrs).not.toHaveProperty('enduser.id');
  });

  it('adds enduser.id from a user principal when capture is on', async () => {
    const service = createService({ captureEndUser: true });
    await service.startActiveSpan(
      'op',
      { credentials: mockCredentials.user('user:default/alice') },
      async () => undefined,
    );

    const attrs = mocks.tracer.startActiveSpan.mock.calls[0][1].attributes;
    expect(attrs['enduser.id']).toBe('user:default/alice');
  });

  it('adds enduser.id from a service principal subject when capture is on', async () => {
    const service = createService({ captureEndUser: true });
    await service.startActiveSpan(
      'op',
      { credentials: mockCredentials.service('plugin:test') },
      async () => undefined,
    );

    const attrs = mocks.tracer.startActiveSpan.mock.calls[0][1].attributes;
    expect(attrs['enduser.id']).toBe('plugin:test');
    expect(attrs['backstage.principal.type']).toBe('service');
  });

  it('extracts credentials from a request via httpAuth when credentials are not supplied', async () => {
    const httpAuth = mockServices.httpAuth();
    const credSpy = jest.spyOn(httpAuth, 'credentials');
    const service = DefaultTracingService.create({
      name: 'backstage-plugin-test',
      pluginId: 'test',
      captureEndUser: true,
      httpAuth,
    });

    await service.startActiveSpan(
      'op',
      { request: { headers: {} } as any },
      async () => undefined,
    );

    expect(credSpy).toHaveBeenCalledTimes(1);
    const attrs = mocks.tracer.startActiveSpan.mock.calls[0][1].attributes;
    expect(attrs['enduser.id']).toBe('user:default/mock');
  });

  it('prefers credentials over request when both are supplied (no httpAuth call)', async () => {
    const httpAuth = mockServices.httpAuth();
    const credSpy = jest.spyOn(httpAuth, 'credentials');
    const service = DefaultTracingService.create({
      name: 'backstage-plugin-test',
      pluginId: 'test',
      captureEndUser: true,
      httpAuth,
    });

    await service.startActiveSpan(
      'op',
      {
        credentials: mockCredentials.user('user:default/explicit'),
        request: { headers: {} } as any,
      },
      async () => undefined,
    );

    expect(credSpy).not.toHaveBeenCalled();
    const attrs = mocks.tracer.startActiveSpan.mock.calls[0][1].attributes;
    expect(attrs['enduser.id']).toBe('user:default/explicit');
  });

  it('translates Backstage span status codes to OTel SpanStatusCode on the underlying span', async () => {
    const service = createService();
    await service.startActiveSpan('op', async span => {
      span.setStatus({ code: 'ok' });
    });
    expect(mocks.span.setStatus).toHaveBeenCalledWith({
      code: SpanStatusCode.OK,
      message: undefined,
    });

    mocks.span.setStatus.mockClear();
    await service.startActiveSpan('op', async span => {
      span.setStatus({ code: 'error', message: 'boom' });
    });
    expect(mocks.span.setStatus).toHaveBeenCalledWith({
      code: SpanStatusCode.ERROR,
      message: 'boom',
    });
  });

  it('records exceptions, sets error.type, sets ERROR status, and ends the span on throw', async () => {
    const service = createService();
    const boom = new Error('Boom');
    boom.name = 'CustomError';

    await expect(
      service.startActiveSpan('op', async () => {
        throw boom;
      }),
    ).rejects.toThrow('Boom');

    expect(mocks.span.recordException).toHaveBeenCalledWith(boom);
    expect(mocks.span.setAttribute).toHaveBeenCalledWith(
      'error.type',
      'CustomError',
    );
    expect(mocks.span.setStatus).toHaveBeenCalledWith({
      code: SpanStatusCode.ERROR,
      message: 'Boom',
    });
    expect(mocks.span.end).toHaveBeenCalled();
  });

  it('ends the span and returns the value on success', async () => {
    const service = createService();
    const value = await service.startActiveSpan('op', () => 42);
    expect(value).toBe(42);
    expect(mocks.span.end).toHaveBeenCalledTimes(1);
  });

  describe('context', () => {
    describe('active', () => {
      it('returns the OTel active context as an opaque handle', () => {
        const fakeCtx = { __ctx: 'active' };
        jest.spyOn(context, 'active').mockReturnValue(fakeCtx as any);
        const service = createService();
        expect(service.context.active()).toBe(fakeCtx);
      });
    });

    describe('with', () => {
      it('delegates to OTel context.with on the supplied handle and returns the fn result', async () => {
        const fakeCtx = { __ctx: 'extracted' } as any;
        const withSpy = jest
          .spyOn(context, 'with')
          .mockImplementation((_ctx, fn) => (fn as any)());

        const service = createService();
        const result = await service.context.with(fakeCtx, () => 99);

        expect(withSpy).toHaveBeenCalledWith(fakeCtx, expect.any(Function));
        expect(result).toBe(99);
      });

      it('awaits an async fn and returns its resolved value', async () => {
        jest
          .spyOn(context, 'with')
          .mockImplementation((_ctx, fn) => (fn as any)());

        const service = createService();
        const result = await service.context.with(
          {} as any,
          async () => 'async-val',
        );
        expect(result).toBe('async-val');
      });
    });
  });

  describe('propagation', () => {
    describe('extract', () => {
      it('forwards the supplied context and headers to OTel propagation.extract', () => {
        const baseCtx = { __ctx: 'base' } as any;
        const extractedCtx = { __ctx: 'extracted' } as any;
        const extractSpy = jest
          .spyOn(propagation, 'extract')
          .mockReturnValue(extractedCtx);

        const service = createService();
        const headers = { traceparent: '00-abc-def-01' };
        const result = service.propagation.extract(baseCtx, headers);

        expect(extractSpy).toHaveBeenCalledWith(baseCtx, headers);
        expect(result).toBe(extractedCtx);
      });
    });

    describe('getActiveBaggage', () => {
      it('returns a read-only baggage wrapping the active context baggage', () => {
        const mockBaggage = {
          getAllEntries: jest.fn(() => [
            ['gen_ai.conversation.id', { value: 'conv-1' }],
            ['gen_ai.agent.id', { value: 'agent-2' }],
          ]),
          getEntry: jest.fn(),
          setEntry: jest.fn(),
          removeEntry: jest.fn(),
          removeEntries: jest.fn(),
          clear: jest.fn(),
        };
        jest
          .spyOn(propagation, 'getActiveBaggage')
          .mockReturnValue(mockBaggage as any);

        const service = createService();
        const baggage = service.propagation.getActiveBaggage();

        expect(baggage).toBeDefined();
        expect(baggage!.getAllEntries()).toEqual([
          ['gen_ai.conversation.id', { value: 'conv-1' }],
          ['gen_ai.agent.id', { value: 'agent-2' }],
        ]);
      });
    });

    describe('getBaggage', () => {
      it('returns baggage from the supplied context', () => {
        const ctx = { __ctx: 'has-baggage' } as any;
        const mockBaggage = {
          getAllEntries: jest.fn(() => [['k', { value: 'ctx-val' }]]),
          getEntry: jest.fn(),
          setEntry: jest.fn(),
          removeEntry: jest.fn(),
          removeEntries: jest.fn(),
          clear: jest.fn(),
        };
        const getBaggageSpy = jest
          .spyOn(propagation, 'getBaggage')
          .mockReturnValue(mockBaggage as any);

        const service = createService();
        const baggage = service.propagation.getBaggage(ctx);

        expect(getBaggageSpy).toHaveBeenCalledWith(ctx);
        expect(baggage!.getAllEntries()).toEqual([['k', { value: 'ctx-val' }]]);
      });

      it('returns undefined when the context has no baggage', () => {
        jest.spyOn(propagation, 'getBaggage').mockReturnValue(undefined);
        const service = createService();
        expect(service.propagation.getBaggage({} as any)).toBeUndefined();
      });
    });
  });
});
