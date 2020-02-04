export type OAuthScopes = {
  extend(scopes: OAuthScopeLike): OAuthScopes;
  hasScopes(scopes: OAuthScopeLike): boolean;
  toSet(): Set<string>;
  toString(): string;
};

export type OAuthScopeLike =
  | string /** Space separated scope strings */
  | string[] /** Array of individual scope strings */
  | OAuthScopes;
