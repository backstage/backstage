/*
 * Copyright 2020 Spotify AB
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

import { OAuthScopes, OAuthScopeLike } from '../../definitions';

/**
 * The BasicOAuthScopes class is an implementation of OAuthScopes that
 * works for any simple comma- or space-separated format of scope.
 */
export class BasicOAuthScopes implements OAuthScopes {
  static from(scopes: OAuthScopeLike, normalizer?: (scope: string) => string) {
    const normalized = BasicOAuthScopes.asStrings(scopes, normalizer);
    return new BasicOAuthScopes(new Set(normalized), normalizer);
  }

  constructor(
    private readonly scopes: Set<string>,
    private readonly normalizer?: (scope: string) => string,
  ) {}

  extend(requestedScopes: OAuthScopeLike): BasicOAuthScopes {
    const newScopes = new Set(this.scopes);
    BasicOAuthScopes.asStrings(requestedScopes, this.normalizer).forEach((s) =>
      newScopes.add(s),
    );
    return new BasicOAuthScopes(newScopes, this.normalizer);
  }

  hasScopes(scopes: OAuthScopeLike): boolean {
    return BasicOAuthScopes.asStrings(scopes, this.normalizer).every((s) =>
      this.scopes.has(s),
    );
  }

  toSet(): Set<string> {
    return this.scopes;
  }

  toString(): string {
    return Array.from(this.scopes).join(' ');
  }

  toJSON() {
    return Array.from(this.scopes);
  }

  static asStrings(
    input: OAuthScopeLike,
    normalizer?: (scope: string) => string,
  ): string[] {
    let scopeArray: string[];
    if (typeof input === 'string') {
      scopeArray = input.split(/[,\s]/).filter(Boolean);
    } else if (Array.isArray(input)) {
      scopeArray = input;
    } else {
      scopeArray = Array.from(input.toSet());
    }
    if (normalizer) {
      scopeArray = scopeArray.map((x) => normalizer(x));
    }
    return scopeArray;
  }
}
