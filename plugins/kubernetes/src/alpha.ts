import { convertLegacyRouteRefs } from "@backstage/core-compat-api";
import { createPlugin } from "@backstage/frontend-plugin-api";
import { kubernetesPage } from "./plugin";

export default createPlugin({
  id: "kubernetes",
  extensions: [kubernetesPage],
  routes: convertLegacyRouteRefs({}),
  externalRoutes: convertLegacyRouteRefs({}),
});

