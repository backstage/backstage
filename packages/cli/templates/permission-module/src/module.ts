import { createBackendModule } from '@backstage/backend-plugin-api';
import { policyExtensionPoint } from '@backstage/plugin-permission-node/alpha';
import { CustomPermissionPolicy } from './customPermissionPolicy';

/**
 * A backend module that registers the customer permission policy into the permissions framework
 */
export default createBackendModule({
  pluginId: 'permission',
  moduleId: 'custom-permission-policy',
  register(reg) {
    reg.registerInit({
      deps: { policy: policyExtensionPoint },
      async init({ policy }) {
        policy.setPolicy(new CustomPermissionPolicy());
      },
    });
  },
});
