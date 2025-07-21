import { coreExtensionData, createFrontendModule } from '@backstage/frontend-plugin-api';
import appPlugin from '@backstage/plugin-app';

export const appModule = createFrontendModule({
  pluginId: 'app',
  extensions: [
    appPlugin.getExtension('app/nav').override({
      factory: () => [
        coreExtensionData.reactElement(
          // todo: sidebar
          <div />
        )
      ]     
    })
  ]
})