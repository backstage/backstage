/*
 * Copyright 2025 The Backstage Authors
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
import { CustomErrorBase, isError } from '@backstage/errors';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '@backstage/backend-plugin-api';

export class OidcError extends CustomErrorBase {
  name = 'OidcError';

  readonly error: string;
  readonly errorDescription: string;
  readonly statusCode: number;

  constructor(
    errorCode: string,
    errorDescription: string,
    statusCode: number,
    cause?: Error | unknown,
  ) {
    super(`${errorCode}, ${errorDescription}`, cause);
    this.statusCode = statusCode;
    this.error = errorCode;
    this.errorDescription = errorDescription;
  }

  static fromError(error: unknown): OidcError {
    if (error instanceof OidcError) {
      return error;
    }

    if (!isError(error)) {
      return new OidcError('server_error', 'Unknown error', 500, error);
    }

    const errorMessage = error.message || 'Unknown error';

    switch (error.name) {
      case 'InputError':
        return new OidcError('invalid_request', errorMessage, 400, error);
      case 'AuthenticationError':
        return new OidcError('invalid_client', errorMessage, 401, error);
      case 'NotAllowedError':
        return new OidcError('access_denied', errorMessage, 403, error);
      case 'NotFoundError':
        return new OidcError('invalid_request', errorMessage, 400, error);
      default:
        return new OidcError('server_error', errorMessage, 500, error);
    }
  }

  static middleware(
    logger: LoggerService,
  ): (err: unknown, _req: Request, res: Response, _next: NextFunction) => void {
    return (
      err: unknown,
      _req: Request,
      res: Response,
      _next: NextFunction,
    ): void => {
      const oidcError = OidcError.fromError(err);
      let logLevel: 'error' | 'warn' | 'info';
      if (oidcError.statusCode >= 500) {
        logLevel = 'error';
      } else if (oidcError.statusCode >= 400) {
        logLevel = 'warn';
      } else {
        logLevel = 'info';
      }
      logger[logLevel](
        `OIDC error: ${oidcError.error} - ${oidcError.errorDescription}`,
        oidcError.cause,
      );
      res.status(oidcError.statusCode).json({
        error: oidcError.error,
        error_description: oidcError.errorDescription,
      });
    };
  }
}
