---
'@backstage/plugin-kubernetes-backend': minor
---

Plugins that instantiate the `KubernetesProxy` must now provide a parameter of the type `KubernetesProxyOptions` which includes providing a `KubernetesAuthTranslator`. The `KubernetesBuilder` now builds its own `KubernetesAuthTranslatorMap` that it provides to the `KubernetesProxy`. The `DispatchingKubernetesAuthTranslator` expects a `KubernetesTranslatorMap` to be provided as a parameter. The `KubernetesBuilder` now has a method called `setAuthTranslatorMap` which allows integrators to bring their own `KubernetesAuthTranslator's` to the `KubernetesPlugin`.
