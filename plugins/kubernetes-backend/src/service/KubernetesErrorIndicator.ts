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
import {
  KubernetesFetchError,
  KubernetesErrorTypes,
} from '@backstage/plugin-kubernetes-common';
import { KubernetesRejectionHandler } from '../types/types';
import { HttpError } from '@kubernetes/client-node';

const knownStatusCodeErrors: Record<number, KubernetesErrorTypes> = {
  400: 'BAD_REQUEST',
  401: 'UNAUTHORIZED_ERROR',
  404: 'NOT_FOUND',
  500: 'SYSTEM_ERROR',
};

export class KubernetesErrorIndicator implements KubernetesRejectionHandler {
  private readonly logger: Logger;
  private readonly statusCodeErrorTypes: Record<number, KubernetesErrorTypes>;
  private readonly signature: string = 'KubernetesFetchError';
  constructor(
    logger: Logger,
    statusCodeErrorTypes: Record<
      number,
      KubernetesErrorTypes
    > = knownStatusCodeErrors,
  ) {
    this.logger = logger;
    this.statusCodeErrorTypes = statusCodeErrorTypes;
  }
  public onRejected: (
    reason: any,
    resourcePath?: string,
  ) => Promise<KubernetesFetchError> = (reason, resourcePath) => {
    if (reason.name === 'HttpError' && reason.statusCode) {
      const { body } = reason as HttpError;
      this.logger.warn(
        `statusCode=${
          reason.statusCode
        } for resource ${resourcePath} body=[${JSON.stringify(body)}]`,
      );
      return Promise.resolve({
        errorType:
          this.statusCodeErrorTypes[reason.statusCode] || 'UNKNOWN_ERROR',
        statusCode: reason.statusCode,
      });
    }
    if (this.didIntercept(reason)) {
      return Promise.resolve(this.surface(reason));
    }
    this.mark(reason);
    return Promise.reject(reason);
  };
  private surface(reason: any): KubernetesFetchError {
    switch (reason.code) {
      case 'ENOTFOUND':
        // Nodejs will generally set a hostname attribute on dns errors:
        // https://github.com/nodejs/node/blob/3d1bdc954dadfd64117a251bfcde6f237c30fd68/lib/internal/errors.js#L703
        return { errorType: 'ADDR_NOT_FOUND', hostname: reason.hostname };
      case 'ETIMEDOUT':
        // Nodejs will generally set `address` and `port` attributes on errors
        // raised during `Socket.connect`:
        // https://github.com/nodejs/node/blob/590cf569fefbe5cb2356dac47177ff79a46a9492/lib/net.js#L1036
        return {
          errorType: 'TIMED_OUT',
          address: reason.address,
          port: reason.port,
        };
      default:
        return { errorType: 'UNKNOWN_ERROR', message: reason.message };
    }
  }
  private didIntercept(reason: any): boolean {
    return reason.signature === this.signature;
  }
  private mark(reason: any) {
    reason.signature = this.signature;
  }
}
