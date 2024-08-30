---
id: auditor
title: Auditor Service
sidebar_label: Auditor
description: Documentation for the Auditor service
---

## Overview

This document describes the Auditor Service, a software service designed to record and report on security-relevant events within an application. This service utilizes the `winston` library for logging and provides a flexible way to capture and format audit events.

## Key Features

- Provides a standardized way to capture security events.
- Allows categorization of events by severity level.
- Supports detailed metadata for each event.
- Offers success/failure reporting for events.
- Integrates with authentication and plugin services for enhanced context.
- Uses `winston` for flexible log formatting and transport.
- Provides a service factory for easy integration with Backstage plugins.
- Supports configurable log transports (console, file).

## How it Works

The Auditor Service defines a core class, `Auditor`, which implements the `AuditorService` interface. This class uses `winston` to log audit events with varying levels of severity and associated metadata. It also integrates with authentication and plugin services to capture actor details and plugin context.

The `auditorServiceFactory` creates an `Auditor` instance for the root context and provides a factory function for creating child loggers for individual plugins. This allows each plugin to have its own logger with inherited and additional metadata.

## Usage Guidance

The Auditor Service is designed for recording security-relevant events that require special attention or are subject to compliance regulations. These events often involve actions like:

- User authentication and authorization
- Data access and modification
- System configuration changes
- Security policy enforcement

For general application logging that is not security-critical, you should use the standard `LoggerService` provided by Backstage. This helps to keep your audit logs focused and relevant.

## Using the Service

The Auditor Service can be accessed via dependency injection in your Backstage plugin. Here's an example of how to access the service and create an audit event within an Express route handler:

```typescript
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { auditor } = options;

  const router = Router();
  router.use(express.json());

  router.post('/my-endpoint', async (req, res) => {
    const auditorEvent = await auditor.createEvent({
      eventId: 'my-endpoint-call',
      request: req,
      meta: {
        // ... metadata about the request
      },
    });

    try {
      // ... process the request

      await auditorEvent.success();
      res.status(200).send('Success!');
    } catch (error) {
      await auditorEvent.fail({ error });
      res.status(500).send('Error!');
    }
  });

  return router;
}
```

In this example, an audit event is created for each request to `/my-endpoint`. The `success` or `fail` methods are called based on the outcome of processing the request.

## Naming Conventions

When defining `eventId` for your audit events, follow these guidelines:

- Use kebab-case (e.g., `user-login`, `file-download`).
- Avoid redundant prefixes related to the plugin ID, as that context is already provided.
- Choose names that clearly describe the event being audited.

## Configuring the service

The Auditor Service can be configured using the `backend.auditor` section in your `app-config.yaml` file.

### Console Logging

Console logging allows you to see audit events directly in your terminal output. This is useful for development and debugging purposes. To enable console logging, set the `enabled` flag to `true` within the `console` section:

```yaml
backend:
  auditor:
    console:
      enabled: true
```

By default, console logging is enabled. You can disable it by setting the `enabled` flag to `false`.

## Advanced Usage

### Customizing the Auditor Service Factory

The `auditorServiceFactoryWithOptions` function allows you to create an auditor service factory with custom transports and formats. This is useful if you need to integrate with a different logging system or modify the default logging behavior.

Here's an example of how to create a custom auditor service factory:

```typescript
import { auditorServiceFactoryWithOptions } from '@backstage/backend-defaults/auditor';
import winston from 'winston';

const myAuditorServiceFactory = auditorServiceFactoryWithOptions({
  transports: () => {
    return [new winston.transports.File({ filename: 'my-audit.log' })];
  },
  format: () => {
    return winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    );
  },
});
```

This example creates a factory that logs to a file named `my-audit.log` and uses a JSON format for the log messages. You can then use this factory in your plugin to create an auditor service with the desired configuration.
