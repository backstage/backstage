import { OAuthScopes, OAuthScopeLike } from './types';

export class BasicOAuthScopes implements OAuthScopes {
  static from(scopes: OAuthScopeLike, normalizer: (scope: string) => string = x => x) {
    const normalized = BasicOAuthScopes.asStrings(scopes, normalizer);
    return new BasicOAuthScopes(new Set(normalized), normalizer);
  }

  constructor(private readonly scopes: Set<string>, private readonly normalizer: (scope: string) => string) {}

  extend(requestedScopes: OAuthScopeLike): OAuthScopes {
    const newScopes = new Set(this.scopes);
    BasicOAuthScopes.asStrings(requestedScopes, this.normalizer).forEach(s => newScopes.add(s));
    return new BasicOAuthScopes(newScopes, this.normalizer);
  }

  hasScopes(scopes: OAuthScopeLike): boolean {
    return BasicOAuthScopes.asStrings(scopes, this.normalizer).every(s => this.scopes.has(s));
  }

  toSet(): Set<string> {
    return this.scopes;
  }

  toString(): string {
    return Array.from(this.scopes).join(' ');
  }

  static asStrings(input: OAuthScopeLike, normalizer: (scope: string) => string): string[] {
    if (typeof input === 'string') {
      return input
        .split(' ')
        .filter(Boolean)
        .map(s => normalizer(s));
    } else if (Array.isArray(input)) {
      return input.map(s => normalizer(s));
    } else {
      return Array.from(input.toSet()).map(s => normalizer(s));
    }
  }
}
