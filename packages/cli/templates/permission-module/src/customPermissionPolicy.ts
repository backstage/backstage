import {
  PolicyDecision,
  AuthorizeResult,
} from '@backstage/plugin-permission-common';
import { PermissionPolicy } from '@backstage/plugin-permission-node';

export class CustomPermissionPolicy implements PermissionPolicy {
  async handle(): Promise<PolicyDecision> {
      // This acts as an allow all policy
      // See https://backstage.io/docs/permissions/writing-a-policy for how to write your own custom policy
    return { result: AuthorizeResult.ALLOW };
  }
}
