import { OAuthScope } from "@backstage/core";

export type OAuthExtendedApi = {
  GetAccessTokenClientSide(scopes? : OAuthScope) : Promise<string>;
};

