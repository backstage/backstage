---
'@backstage/app-context-common': patch
'@backstage/backend-common': patch
'@backstage/backend-tasks': patch
'@backstage/catalog-client': patch
'@backstage/config': patch
'@backstage/plugin-badges-backend': patch
'@backstage/plugin-permission-node': patch
---

Introduce Application Context to Backend modules. This is the first of the changes to add dependency injection to backend modules.

This introduces a wrapper implementation of ApplicationContext around Inversify IoC container framework. The context is a hierarchical structure consisting of a root container and children contexts, which are their own ApplicationContexts. Each instance holds a reference to an Inversify container which is used as the storage for injectable instances. The container in child context is its own isolated container, but it inherits common dependencies from the root context.

The wrapper provides the following possibilities:

- Type safe way to register and retrieve dependencies
- Automatic registration of dependencies based on a predefined structure
- Isolated contexts to handle dependency injection to modules

Additionally, with this change a new ModuleManager class is introduced which accepts a structure of dependency definitions and helps constructing the ApplicationContext for a module, validating that it has all needed dependencies and instantiating the entrypoint to a module with the created context.

Initially the ApplicationContext and its usage is introduced to badges-backend module. Other modified modules within this changeset are exposing dependency definitions that are used either by the badges module or are part of the common root context.
