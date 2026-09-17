---
id: root-lifecycle
title: Root Lifecycle Service
sidebar_label: Root Lifecycle
description: Documentation for the Root Lifecycle service
---

This service is the same as the lifecycle service, but should only be used by the root services. This is also where the implementation for the actual lifecycle hooks are collected and executed, so if you want to override the implementation of how those are processed, you should override this service.

## Configure the service

The following example shows how to override the default implementation of the lifecycle service with something that listens on different process events to the original.

```ts
class MyCustomLifecycleService implements RootLifecycleService {
  constructor(private readonly logger: LoggerService) {}

  #isCalled = false;
  #shutdownTasks: Array<{
    hook: LifecycleServiceShutdownHook;
    options?: LifecycleServiceShutdownOptions;
  }> = [];

  addShutdownHook(
    hook: LifecycleServiceShutdownHook,
    options?: LifecycleServiceShutdownOptions,
  ): void {
    this.#shutdownTasks.push({ hook, options });
  }

  async shutdown(): Promise<void> {
    if (this.#isCalled) {
      return;
    }
    this.#isCalled = true;

    this.logger.info(`Running ${this.#shutdownTasks.length} shutdown tasks...`);
    await Promise.all(
      this.#shutdownTasks.map(async ({ hook, options }) => {
        const logger = options?.logger ?? this.logger;
        try {
          await hook();
          logger.info(`Shutdown hook succeeded`);
        } catch (error) {
          logger.error(`Shutdown hook failed, ${error}`);
        }
      }),
    );
  }
}

const backend = createBackend();

backend.add(
  createServiceFactory({
    service: coreServices.rootLifecycle,
    deps: {
      logger: coreServices.rootLogger,
    },
    async factory({ logger }) {
      return new MyCustomLifecycleService(logger);
    },
  }),
);
```
