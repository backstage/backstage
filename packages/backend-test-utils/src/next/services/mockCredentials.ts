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

import {
  BackstageCredentials,
  BackstageNonePrincipal,
  BackstagePrincipalAccessRestrictions,
  BackstageServicePrincipal,
  BackstageUserPrincipal,
} from '@backstage/backend-plugin-api';

export const DEFAULT_MOCK_USER_ENTITY_REF = 'user:default/mock';
export const DEFAULT_MOCK_SERVICE_SUBJECT = 'external:test-service';

export const MOCK_AUTH_COOKIE = 'backstage-auth';

export const MOCK_NONE_TOKEN = 'mock-none-token';

export const MOCK_USER_TOKEN = 'mock-user-token';
export const MOCK_USER_TOKEN_PREFIX = 'mock-user-token:';
export const MOCK_INVALID_USER_TOKEN = 'mock-invalid-user-token';

export const MOCK_USER_LIMITED_TOKEN_PREFIX = 'mock-limited-user-token:';
export const MOCK_INVALID_USER_LIMITED_TOKEN =
  'mock-invalid-limited-user-token';

export const MOCK_SERVICE_TOKEN = 'mock-service-token';
export const MOCK_SERVICE_TOKEN_PREFIX = 'mock-service-token:';
export const MOCK_INVALID_SERVICE_TOKEN = 'mock-invalid-service-token';

function validateUserEntityRef(ref: string) {
  if (!ref.match(/^.+:.+\/.+$/)) {
    throw new TypeError(
      `Invalid user entity reference '${ref}', expected <kind>:<namespace>/<name>`,
    );
  }
}

/**
 * The payload that can be encoded into a mock user token.
 * @internal
 */
export type UserTokenPayload = {
  sub?: string;
};

/**
 * The payload that can be encoded into a mock service token.
 * @internal
 */
export type ServiceTokenPayload = {
  sub?: string; // service subject
  obo?: string; // user entity reference
  target?: string; // target plugin id
};

/**
 * @public
 */
export namespace mockCredentials {
  /**
   * Creates a mocked credentials object for a unauthenticated principal.
   */
  export function none(): BackstageCredentials<BackstageNonePrincipal> {
    return {
      $$type: '@backstage/BackstageCredentials',
      principal: { type: 'none' },
    };
  }

  /**
   * Utilities related to none credentials.
   */
  export namespace none {
    /**
     * Returns an authorization header that translates to unauthenticated
     * credentials.
     *
     * This is useful when one wants to explicitly test unauthenticated requests
     * while still using the default behavior of the mock HttpAuthService where
     * it defaults to user credentials.
     */
    export function header(): string {
      // NOTE: there is no .token() version of this because only the
      //       HttpAuthService should know about and consume this token
      return `Bearer ${MOCK_NONE_TOKEN}`;
    }
  }

  /**
   * Creates a mocked credentials object for a user principal.
   *
   * The default user entity reference is 'user:default/mock'.
   */
  export function user(
    userEntityRef: string = DEFAULT_MOCK_USER_ENTITY_REF,
  ): BackstageCredentials<BackstageUserPrincipal> {
    validateUserEntityRef(userEntityRef);
    return {
      $$type: '@backstage/BackstageCredentials',
      principal: { type: 'user', userEntityRef },
    };
  }

  /**
   * Utilities related to user credentials.
   */
  export namespace user {
    /**
     * Creates a mocked user token. If a payload is provided it will be encoded
     * into the token and forwarded to the credentials object when authenticated
     * by the mock auth service.
     */
    export function token(userEntityRef?: string): string {
      if (userEntityRef) {
        validateUserEntityRef(userEntityRef);
        return `${MOCK_USER_TOKEN_PREFIX}${JSON.stringify({
          sub: userEntityRef,
        } satisfies UserTokenPayload)}`;
      }
      return MOCK_USER_TOKEN;
    }

    /**
     * Returns an authorization header with a mocked user token. If a payload is
     * provided it will be encoded into the token and forwarded to the
     * credentials object when authenticated by the mock auth service.
     */
    export function header(userEntityRef?: string): string {
      return `Bearer ${token(userEntityRef)}`;
    }

    export function invalidToken(): string {
      return MOCK_INVALID_USER_TOKEN;
    }

    export function invalidHeader(): string {
      return `Bearer ${invalidToken()}`;
    }
  }

  /**
   * Creates a mocked credentials object for a user principal with limited
   * access.
   *
   * The default user entity reference is 'user:default/mock'.
   */
  export function limitedUser(
    userEntityRef: string = DEFAULT_MOCK_USER_ENTITY_REF,
  ): BackstageCredentials<BackstageUserPrincipal> {
    return user(userEntityRef);
  }

  /**
   * Utilities related to limited user credentials.
   */
  export namespace limitedUser {
    /**
     * Creates a mocked limited user token. If a payload is provided it will be
     * encoded into the token and forwarded to the credentials object when
     * authenticated by the mock auth service.
     */
    export function token(
      userEntityRef: string = DEFAULT_MOCK_USER_ENTITY_REF,
    ): string {
      validateUserEntityRef(userEntityRef);
      return `${MOCK_USER_LIMITED_TOKEN_PREFIX}${JSON.stringify({
        sub: userEntityRef,
      } satisfies UserTokenPayload)}`;
    }

    /**
     * Returns an authorization header with a mocked limited user token. If a
     * payload is provided it will be encoded into the token and forwarded to
     * the credentials object when authenticated by the mock auth service.
     */
    export function cookie(userEntityRef?: string): string {
      return `${MOCK_AUTH_COOKIE}=${token(userEntityRef)}`;
    }

    export function invalidToken(): string {
      return MOCK_INVALID_USER_LIMITED_TOKEN;
    }

    export function invalidCookie(): string {
      return `${MOCK_AUTH_COOKIE}=${invalidToken()}`;
    }
  }

  /**
   * Creates a mocked credentials object for a service principal.
   *
   * The default subject is 'external:test-service', and no access restrictions.
   */
  export function service(
    subject: string = DEFAULT_MOCK_SERVICE_SUBJECT,
    accessRestrictions?: BackstagePrincipalAccessRestrictions,
  ): BackstageCredentials<BackstageServicePrincipal> {
    return {
      $$type: '@backstage/BackstageCredentials',
      principal: {
        type: 'service',
        subject,
        ...(accessRestrictions ? { accessRestrictions } : {}),
      },
    };
  }

  /**
   * Utilities related to service credentials.
   */
  export namespace service {
    /**
     * Options for the creation of mock service tokens.
     */
    export type TokenOptions = {
      onBehalfOf: BackstageCredentials;
      targetPluginId: string;
    };

    /**
     * Creates a mocked service token. The provided options will be encoded into
     * the token and forwarded to the credentials object when authenticated by
     * the mock auth service.
     */
    export function token(options?: TokenOptions): string {
      if (options) {
        const { targetPluginId, onBehalfOf } = options; // for fixed ordering

        const oboPrincipal = onBehalfOf?.principal as
          | BackstageServicePrincipal
          | BackstageUserPrincipal
          | BackstageNonePrincipal;
        const obo =
          oboPrincipal.type === 'user' ? oboPrincipal.userEntityRef : undefined;
        const subject =
          oboPrincipal.type === 'service' ? oboPrincipal.subject : undefined;

        return `${MOCK_SERVICE_TOKEN_PREFIX}${JSON.stringify({
          sub: subject,
          obo,
          target: targetPluginId,
        } satisfies ServiceTokenPayload)}`;
      }
      return MOCK_SERVICE_TOKEN;
    }

    /**
     * Returns an authorization header with a mocked service token. The provided
     * options will be encoded into the token and forwarded to the credentials
     * object when authenticated by the mock auth service.
     */
    export function header(options?: TokenOptions): string {
      return `Bearer ${token(options)}`;
    }

    export function invalidToken(): string {
      return MOCK_INVALID_SERVICE_TOKEN;
    }

    export function invalidHeader(): string {
      return `Bearer ${invalidToken()}`;
    }
  }
}
