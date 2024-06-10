---
title: Audit Log
status: provisional
authors:
  - '@schultzp2020'
owners:
project-areas:
  - core
creation-date: 2024-06-04
---

# BEP: Audit Log

[**Discussion Issue**](https://github.com/backstage/backstage/issues/23950)

- [BEP: Audit Log](#bep-audit-log)
  - [Summary](#summary)
  - [Motivation](#motivation)
    - [Goals](#goals)
    - [Non-Goals](#non-goals)
  - [Proposal](#proposal)
  - [Design Details](#design-details)
    - [Winston Configuration Changes](#winston-configuration-changes)
    - [Data Model for Audit Logs](#data-model-for-audit-logs)
      - [Actor Details Interface](#actor-details-interface)
      - [Audit Request/Response Interfaces](#audit-requestresponse-interfaces)
      - [Audit Log Status Interfaces](#audit-log-status-interfaces)
      - [AuditLogger Interface](#auditlogger-interface)
  - [Release Plan](#release-plan)
  - [Dependencies](#dependencies)
  - [Alternatives](#alternatives)
    - [Create a Separate Winston Logger Instance](#create-a-separate-winston-logger-instance)

## Summary

This feature introduces a dedicated system for recording critical security-related actions and events within Backstage. By maintaining a distinct audit log stream, organizations benefit from enhanced security, improved regulatory compliance, efficient incident response, and ensured data integrity.

## Motivation

- Strengthen security by tracking user authentication, authorization, data access, and configuration changes.
- Facilitate adherence to regulatory requirements through logging security-sensitive operations.
- Enable efficient forensic analysis and investigation of security incidents.
- Uphold the integrity of critical audit data by implementing robust access controls and tamper-proof measures.

### Goals

- Implement a separate audit log event stream for recording security-critical events.
- Defining a specific data format for audit logs.
- Ensure adherence to regulatory compliance requirements through comprehensive audit logging.

### Non-Goals

- Implementing mechanisms for log storage, analysis, or visualization.
- Addressing security aspects of log storage and access control beyond initial separation from regular logs.

Both of these non-goals can be implemented as separate plugins.

## Proposal

The proposal introduces two key changes to implement a separate audit log event stream in Backstage. First, we recommend modifying Backstage's Winston configuration to create a distinct channel specifically for audit logs. This can be achieved by extending the [existing configuration file](https://github.com/backstage/backstage/blob/master/packages/backend-app-api/src/logging/WinstonLogger.ts). A reference implementation for such a configuration can be found [here](https://github.com/janus-idp/backstage-showcase/blob/main/packages/backend/src/logger/customLogger.ts). Separating the configuration ensures clear distinction between regular application logs and critical security events.

Secondly, the proposal suggests creating a new shared package within the Backstage ecosystem. This package would define a standardized data format for audit logs.  The format would include mandatory fields relevant for regulatory compliance and security investigations, such as actor, IP address, timestamp, and event details. The package would also provide helper functions to simplify logging audit events throughout the Backstage application. A reference implementation for such a package can be found [here](https://github.com/janus-idp/backstage-plugins/tree/main/plugins/audit-log-node). This standardized format would streamline analysis and investigation of security-related events.

Overall, this approach offers several benefits. By separating the configuration, security-critical events are clearly distinguished for improved monitoring and analysis.  The standardized data format within the shared package would ensure consistency and facilitate compliance with regulations.  Finally, the helper functions within the package would simplify the process of logging audit events.

## Design Details

### Winston Configuration Changes

The proposal involves modifying Backstage's logging configuration using the Winston library. This modification creates a separate channel specifically for audit logs.

```ts
/**
 * A default formatting function is defined. This function adds timestamps, error details, and other relevant information to all logs.
 */
const defaultFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
  }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
);

const auditLogFormat = winston.format((info, opts) => {
  const { isAuditLog, ...newInfo } = info;

  if (isAuditLog) {
    /**
     * If the flag `isAuditLog` is present and set to true, the entire message is included in the audit log format.
     */
    return opts.isAuditLog ? info : false;
  }

  /**
   * If the flag `isAuditLog` is absent or set to false, the message is excluded from the audit log but included in the regular application log.
   */
  return !opts.isAuditLog ? newInfo : false;
});

/**
 * Two separate transport configurations are created: one for regular logs and one for audit logs. JSON formatting was chosen for easier parsing by logging tools.
 */
const transports = {
  log: [
    new winston.transports.Console({
      format: winston.format.combine(
        auditLogFormat({ isAuditLog: false }),
        defaultFormat,
        winston.format.json(),
      ),
    }),
  ],
  auditLog: [
    new winston.transports.Console({
      format: winston.format.combine(
        auditLogFormat({ isAuditLog: true }),
        defaultFormat,
        winston.format.json(),
      ),
    }),
  ],
};

const logger = WinstonLogger.create({
  meta: {
    service: 'backstage',
  },
  level: process.env.LOG_LEVEL ?? 'info',
  format: winston.format.combine(defaultFormat, winston.format.json()),
  transports: [...transports.log, ...transports.auditLog],
});
```

### Data Model for Audit Logs

To ensure consistency and facilitate regulatory compliance, the proposal suggests creating a shared package that defines a data model for audit logs. This model consists of several key components.

#### Actor Details Interface

This interface defines the information related to the actor who triggered the logged event. It includes fields like actor ID, IP address, hostname, and user agent.

```ts
export type ActorDetails = {
  actorId: string | null;
  ip?: string;
  hostname?: string;
  userAgent?: string;
};
```

#### Audit Request/Response Interfaces

These interfaces define the structure of request and response data that might be included in the audit log. It's important to note that these interfaces exclude sensitive information like tokens from headers or other irrelevant details to avoid security risks.

```ts
export type AuditRequest = {
  body: any;
  url: string;
  method: string;
  params?: any;
  query?: any;
};

export type AuditResponse = {
  status: number;
  body?: any;
};
```

#### Audit Log Status Interfaces

These interfaces define the possible statuses for an audit log entry. There are three options:

```ts
/**
 * Indicates the event was successful.
 */
export type AuditLogSuccessStatus = { status: 'succeeded' };

/**
 * Indicates the event failed and includes details about the encountered errors.
 */
export type AuditLogFailureStatus = {
  status: 'failed';
  errors: ErrorLike[];
};

/**
 * Indicates the event failed with errors that don't perfectly fit the expected structure.
 */
export type AuditLogUnknownFailureStatus = {
  status: 'failed';
  errors: unknown[];
};

export type AuditLogStatus = AuditLogSuccessStatus | AuditLogFailureStatus;
```

#### AuditLogger Interface

This interface defines the functionalities of an `AuditLogger` class. This class provides methods for:
- Extracting the actor ID from an Express request (if available).
- Creating detailed audit log information based on provided options.
- Logging an audit event with a specific level (info, debug, warn, or error).

```ts
/**
 * Common fields of an audit log. Note: timestamp and pluginId are automatically added at log creation.
 *
 * @public
 */
export type AuditLogDetails = {
  actor: ActorDetails;
  eventName: string;
  stage: string;
  request?: AuditRequest;
  response?: AuditResponse;
  meta: JsonValue;
  isAuditLog: true;
} & AuditLogStatus;

export type AuditLogDetailsOptions = {
  eventName: string;
  stage: string;
  metadata?: JsonValue;
  response?: AuditResponse;
  actorId?: string;
  request?: Request;
} & (AuditLogSuccessStatus | AuditLogUnknownFailureStatus);

export type AuditLogOptions = {
  eventName: string;
  message: string;
  stage: string;
  level?: 'info' | 'debug' | 'warn' | 'error';
  actorId?: string;
  metadata?: JsonValue;
  response?: AuditResponse;
  request?: Request;
} & (AuditLogSuccessStatus | AuditLogUnknownFailureStatus);

export type AuditLoggerOptions = {
  logger: LoggerService;
  authService: AuthService;
  httpAuthService: HttpAuthService;
};

export interface AuditLogger {
  /**
   * Processes an express request and obtains the actorId from it. Returns undefined if actorId is not obtainable.
   *
   * @public
   */
  getActorId(request?: Request): Promise<string | undefined>;

  /**
   * Generates the audit log details to place in the metadata argument of the logger
   *
   * Secrets in the metadata field and request body, params and query field should be redacted by the user before passing in the request object
   * @public
   */
  createAuditLogDetails(
    options: AuditLogDetailsOptions,
  ): Promise<AuditLogDetails>;

  /**
   * Generates an Audit Log and logs it at the level passed by the user.
   * Supports `info`, `debug`, `warn` or `error` level. Defaults to `info` if no level is passed.
   *
   * Secrets in the metadata field and request body, params and query field should be redacted by the user before passing in the request object
   * @public
   */
  auditLog(options: AuditLogOptions): Promise<void>;
}
```

## Release Plan

The release plan involves initially creating a shared audit log package. Following this, the audit log will be implemented in core packages and other plugins. The first targets should be high-priority areas, such as the scaffolder and catalog systems. Since adding the audit log will not disrupt existing functionality, the release plan is simplified.

## Dependencies

- `@backstage/backend-app-api`

## Alternatives

### Create a Separate Winston Logger Instance

We could create a separate instance of the Winston logger. However, this approach would necessitate core packages and plugins to include an additional argument in their constructor.
