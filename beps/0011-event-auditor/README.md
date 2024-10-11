---
title: Event Auditor
status: provisional
authors:
  - '@schultzp2020'
owners:
project-areas:
  - core
creation-date: 2024-06-04
---

# BEP: Event Auditor

[**Discussion Issue**](https://github.com/backstage/backstage/issues/23950)

- [BEP: Event Auditor](#bep-event-auditor)
  - [Summary](#summary)
  - [Motivation](#motivation)
    - [Goals](#goals)
    - [Non-Goals](#non-goals)
  - [Proposal](#proposal)
  - [Design Details](#design-details)
    - [Data Model for Audit Events](#data-model-for-audit-events)
      - [Actor Details Interface](#actor-details-interface)
      - [Audit Request/Response Interfaces](#audit-requestresponse-interfaces)
      - [Audit Event Status Interfaces](#audit-event-status-interfaces)
      - [EventAuditor Interface](#eventauditor-interface)
  - [Release Plan](#release-plan)
  - [Dependencies](#dependencies)
  - [Alternatives](#alternatives)

## Summary

This feature introduces a dedicated system for recording critical security-related actions and events within Backstage. By maintaining a distinct audit event stream, organizations benefit from enhanced security, improved regulatory compliance, efficient incident response, and ensured data integrity.

## Motivation

- Strengthen security by tracking user authentication, authorization, data access, and configuration changes.
- Facilitate adherence to regulatory requirements through logging security-sensitive operations.
- Enable efficient forensic analysis and investigation of security incidents.
- Uphold the integrity of critical audit data by implementing robust access controls and tamper-proof measures.

### Goals

- Develop a backend service for the audit event stream to record security-critical events.
- Ensure compliance with regulatory requirements through detailed audit event logging.
  - Refer to [NIST: Audit and Accountability](https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_1/home?element=AU)
  - Refer to [NIST: Non-Repudiation](https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_1/home?element=AU-10)
- Establish a standardized data format for audit events.
  - Refer to [NIST: Content of Audit Records](https://csrc.nist.gov/projects/cprt/catalog#/cprt/framework/version/SP_800_53_5_1_1/home?element=AU-03)
- Provide access to the transport layer for customizable output options.

### Non-Goals

- Implementing mechanisms for event storage, analysis, or visualization.
- Addressing security aspects of event storage and access control beyond initial separation from regular events.

Both of these non-goals can be implemented as separate plugins.

## Proposal

The proposal introduces a crucial change to implement a dedicated audit event stream in Backstage. We recommend creating a new backend service using Winston to establish a distinct channel specifically for audit events. This service would act as a wrapper around Winston, providing methods with strict interfaces to ensure uniformity across audit events throughout the Backstage application. By separating the configuration, we can clearly distinguish between regular application events and critical security events. The event format would include mandatory fields relevant to regulatory compliance and security investigations, such as actor, IP address, timestamp, and event details. This standardized format would streamline the analysis and investigation of security-related events.

Overall, this approach offers several benefits. Separating the configuration allows for the clear distinction of security-critical events, enhancing monitoring and analysis. The standardized data format within the service ensures consistency and facilitates compliance with regulations. Finally, the service methods simplify the process of logging audit events.

## Design Details

### Data Model for Audit Events

To ensure consistency and facilitate regulatory compliance, the proposal suggests creating a shared package that defines a data model for audit events. This model consists of several key components.

#### Actor Details Interface

This interface defines the information related to the actor who triggered the logged event. It includes fields like actor ID, IP address, hostname, and user agent.

```ts
export type ActorDetails = {
  actorId?: string;
  ip?: string;
  hostname?: string;
  userAgent?: string;
};
```

#### Audit Request/Response Interfaces

These interfaces define the structure of request and response data that might be included in the audit event. It's important to note that these interfaces exclude sensitive information like tokens from headers or other irrelevant details to avoid security risks.

```ts
export type AuditRequest = {
  url: string;
  method: string;
};

export type AuditResponse = {
  status: number;
};
```

#### Audit Event Status Interfaces

These interfaces define the possible statuses for an audit event entry. There are three options:

```ts
/**
 * Indicates the event was successful.
 */
export type AuditEventSuccessStatus = { status: 'succeeded' };

/**
 * Indicates the event failed and includes details about the encountered errors.
 */
export type AuditEventFailureStatus<E = ErrorLike> = {
  status: 'failed';
  errors: E[];
};

export type AuditEventStatus =
  | AuditEventSuccessStatus
  | AuditEventFailureStatus
  | undefined;
```

#### EventAuditor Interface

This interface defines the functionalities of an `EventAuditor` class. This class provides methods for:

- Extracting the actor ID from an Express request (if available).
- Creating detailed audit event information based on provided options.
- Logging an audit event with a specific level (info, debug, warn, or error).

```ts
/**
 * Common fields of an audit event.
 *
 * @public
 */
export type AuditEventOptions = AuditEventStatus & {
  eventName: string;
  message: string;
  stage: string;
  level?: 'info' | 'debug' | 'warn' | 'error';
  metadata?: JsonValue;
  response?: AuditResponse;
  request?: Request;
} & ({ actorId: string } | { credentials: BackstageCredentials } | undefined);

export type AuditEvent = {
  actor: ActorDetails;
  eventName: string;
  stage: string;
  isAuditLog: true;
  request?: AuditRequest;
  response?: AuditResponse;
} & AuditLogStatus;

export interface EventAuditor {
  /**
   * Processes an express request and obtains the actorId from it. Returns undefined if actorId is not obtainable.
   *
   * @public
   */
  getActorId(request?: Request): Promise<string | undefined>;

  /**
   * Generates an Audit Event and logs it at the level passed by the user.
   * Supports `info`, `debug`, `warn` or `error` level. Defaults to `info` if no level is passed.
   *
   * Secrets in the metadata field and request body, params and query field should be redacted by the user before passing in the request object
   * @public
   */
  auditEvent(options: AuditEventOptions): Promise<void>;
}
```

## Release Plan

The release plan involves initially creating a shared audit event package. Following this, the audit event will be implemented in core packages and other plugins. The first targets should be high-priority areas, such as the scaffolder and catalog systems. Since adding the audit event will not disrupt existing functionality, the release plan is simplified.

## Dependencies

- `@backstage/types`
- <https://github.com/backstage/backstage/issues/24169>

## Alternatives

N/A
