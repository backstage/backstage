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

import { Logger } from 'winston';
import { getVoidLogger } from '@backstage/backend-common';
import { HttpError } from '@kubernetes/client-node';
import { KubernetesErrorIndicator } from './KubernetesErrorIndicator';
import { IncomingMessage } from 'http';

describe('KubernetesErrorIndicator', () => {
  const logger: Logger = getVoidLogger();

  describe('onRejected', () => {
    describe('with a Kubernetes HttpError', () => {
      it('resolves', () => {
        const httpError = new HttpError(
          undefined as unknown as IncomingMessage,
          undefined,
          400,
        );

        const result = new KubernetesErrorIndicator(logger, {
          400: 'BAD_REQUEST',
        }).onRejected(httpError);

        return expect(result).resolves.toStrictEqual({
          errorType: 'BAD_REQUEST',
          statusCode: 400,
        });
      });
      it('resolves unknown status code', () => {
        const httpError = new HttpError(
          undefined as unknown as IncomingMessage,
          undefined,
          900,
        );

        const result = new KubernetesErrorIndicator(logger, {}).onRejected(
          httpError,
        );

        return expect(result).resolves.toStrictEqual({
          errorType: 'UNKNOWN_ERROR',
          statusCode: 900,
        });
      });
      it('logs a warning', async () => {
        const warn = jest.spyOn(logger, 'warn');

        await new KubernetesErrorIndicator(logger, {}).onRejected(
          new HttpError(
            undefined as unknown as IncomingMessage,
            { kind: 'Status', code: 777 },
            777,
          ),
          '/some/path',
        );

        expect(warn).toHaveBeenCalledWith(
          'statusCode=777 for resource /some/path body=[{"kind":"Status","code":777}]',
        );
      });
    });

    it('rejects non-http errors', () => {
      const nonHttpError = new Error();

      const result = new KubernetesErrorIndicator(logger).onRejected(
        nonHttpError,
      );

      return expect(result).rejects.toBe(nonHttpError);
    });
  });
  describe('when the rejection reason was previously intercepted', () => {
    it('resolves as UNKNOWN_ERROR', () => {
      const sut = new KubernetesErrorIndicator(logger);

      const result = sut
        .onRejected({ code: 'ERRORCODE', message: 'something failed' })
        .catch(sut.onRejected);

      return expect(result).resolves.toStrictEqual({
        errorType: 'UNKNOWN_ERROR',
        message: 'something failed',
      });
    });
  });
  it('resolves ENOTFOUND as ADDR_NOT_FOUND with hostname', () => {
    const notFoundReason = {
      code: 'ENOTFOUND',
      hostname: 'foo.bar.baz',
    };
    const sut = new KubernetesErrorIndicator(logger);

    const result = sut.onRejected(notFoundReason).catch(sut.onRejected);

    return expect(result).resolves.toStrictEqual({
      errorType: 'ADDR_NOT_FOUND',
      hostname: 'foo.bar.baz',
    });
  });
  it('resolves ETIMEDOUT as TIMED_OUT with address and port', () => {
    const timedOutReason = {
      code: 'ETIMEDOUT',
      address: 'timeout.com',
      port: 1234,
    };
    const sut = new KubernetesErrorIndicator(logger);

    const result = sut.onRejected(timedOutReason).catch(sut.onRejected);

    return expect(result).resolves.toStrictEqual({
      errorType: 'TIMED_OUT',
      address: 'timeout.com',
      port: 1234,
    });
  });
  it('rejects unintercepted reasons', () => {
    const reason = { code: 'ERRORCODE', message: 'something failed' };

    const result = new KubernetesErrorIndicator(logger).onRejected(reason);

    return expect(result).rejects.toBe(reason);
  });
});
