/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export interface paths {
  '/v1/actions': {
    /** List all actions for an organisation. */
    get: operations['Actions V1#List'];
  };
  '/v1/actions/{id}': {
    /** Get a single incident action. */
    get: operations['Actions V1#Show'];
  };
  '/v1/custom_field_options': {
    /** Show custom field options for a custom field */
    get: operations['Custom Field Options V1#List'];
    /** Create a custom field option. If the sort key is not supplied, it'll default to 1000, so the option appears near the end of the list. */
    post: operations['Custom Field Options V1#Create'];
  };
  '/v1/custom_field_options/{id}': {
    /** Get a single custom field option */
    get: operations['Custom Field Options V1#Show'];
    /** Update a custom field option */
    put: operations['Custom Field Options V1#Update'];
    /** Delete a custom field option */
    delete: operations['Custom Field Options V1#Delete'];
  };
  '/v1/custom_fields': {
    /** List all custom fields for an organisation. */
    get: operations['Custom Fields V1#List'];
    /** Create a new custom field */
    post: operations['Custom Fields V1#Create'];
  };
  '/v1/custom_fields/{id}': {
    /** Get a single custom field. */
    get: operations['Custom Fields V1#Show'];
    /** Update the details of a custom field */
    put: operations['Custom Fields V1#Update'];
    /** Delete a custom field */
    delete: operations['Custom Fields V1#Delete'];
  };
  '/v1/identity': {
    /** Test if your API key is valid, and which roles it has. */
    get: operations['Utilities V1#Identity'];
  };
  '/v1/incident_attachments': {
    /** List all incident attachements for a given external resource or incident. You must provide either a specific incident ID or a specific external resource type and external ID. */
    get: operations['Incident Attachments V1#List'];
    /** Attaches an external resource to an incident */
    post: operations['Incident Attachments V1#Create'];
  };
  '/v1/incident_attachments/{id}': {
    /** Unattaches an external resouce from an incident */
    delete: operations['Incident Attachments V1#Delete'];
  };
  '/v1/incident_roles': {
    /** List all incident roles for an organisation. */
    get: operations['Incident Roles V1#List'];
    /** Create a new incident role */
    post: operations['Incident Roles V1#Create'];
  };
  '/v1/incident_roles/{id}': {
    /** Get a single incident role. */
    get: operations['Incident Roles V1#Show'];
    /** Update an existing incident role */
    put: operations['Incident Roles V1#Update'];
    /** Removes an existing role */
    delete: operations['Incident Roles V1#Delete'];
  };
  '/v1/incident_statuses': {
    /** List all incident statuses for an organisation. */
    get: operations['IncidentStatuses V1#List'];
    /** Create a new incident status */
    post: operations['IncidentStatuses V1#Create'];
  };
  '/v1/incident_statuses/{id}': {
    /** Get a single incident status. */
    get: operations['IncidentStatuses V1#Show'];
    /** Update an existing incident status */
    put: operations['IncidentStatuses V1#Update'];
    /** Delete an incident status */
    delete: operations['IncidentStatuses V1#Delete'];
  };
  '/v1/incident_types': {
    /** List all incident types for an organisation. */
    get: operations['Incident Types V1#List'];
  };
  '/v1/incident_types/{id}': {
    /** Get a single incident type. */
    get: operations['Incident Types V1#Show'];
  };
  '/v1/incidents': {
    /** List all incidents for an organisation. */
    get: operations['Incidents V1#List'];
    /** Create a new incident. */
    post: operations['Incidents V1#Create'];
  };
  '/v1/incidents/{id}': {
    /** Get a single incident. */
    get: operations['Incidents V1#Show'];
  };
  '/v1/openapi.json': {
    /** Get the OpenAPI (v2) definition. */
    get: operations['Utilities V1#OpenAPI'];
  };
  '/v1/severities': {
    /** List all incident severities for an organisation. */
    get: operations['Severities V1#List'];
    /** Create a new severity */
    post: operations['Severities V1#Create'];
  };
  '/v1/severities/{id}': {
    /** Get a single incident severity. */
    get: operations['Severities V1#Show'];
    /** Update an existing severity */
    put: operations['Severities V1#Update'];
    /** Delete a severity */
    delete: operations['Severities V1#Delete'];
  };
  '/v2/catalog_entries': {
    /** List entries for a catalog type. */
    get: operations['Catalog V2#ListEntries'];
    /** Create an entry for a type in the catalog. */
    post: operations['Catalog V2#CreateEntry'];
  };
  '/v2/catalog_entries/{id}': {
    /** Show a single catalog entry. */
    get: operations['Catalog V2#ShowEntry'];
    /** Updates an existing catalog entry. */
    put: operations['Catalog V2#UpdateEntry'];
    /** Archives a catalog entry. */
    delete: operations['Catalog V2#DestroyEntry'];
  };
  '/v2/catalog_resources': {
    /** List available engine resources for the catalog */
    get: operations['Catalog V2#ListResources'];
  };
  '/v2/catalog_types': {
    /** List all catalog types for an organisation, including those synced from external resources. */
    get: operations['Catalog V2#ListTypes'];
    /** Create a catalog type. */
    post: operations['Catalog V2#CreateType'];
  };
  '/v2/catalog_types/{id}': {
    /** Show a single catalog type. */
    get: operations['Catalog V2#ShowType'];
    /** Updates an existing catalog type. */
    put: operations['Catalog V2#UpdateType'];
    /** Archives a catalog type and associated entries. */
    delete: operations['Catalog V2#DestroyType'];
  };
  '/v2/catalog_types/{id}/actions/update_schema': {
    /** Update an existing catalog types schema, adding or removing attributes. */
    post: operations['Catalog V2#UpdateTypeSchema'];
  };
  '/v2/incident_timestamps': {
    /** List all incident timestamps for an organisation. */
    get: operations['Incident Timestamps V2#List'];
  };
  '/v2/incident_timestamps/{id}': {
    /** Get a single incident timestamp. */
    get: operations['Incident Timestamps V2#Show'];
  };
  '/v2/incident_updates': {
    /** List all incident updates for an organisation, or for a specific incident. */
    get: operations['Incident Updates V2#List'];
  };
  '/v2/incidents': {
    /**
     * List all incidents for an organisation.
     *
     * This endpoint supports a number of filters, which can help find incidents matching certain
     * criteria.
     *
     * Filters are provided as query parameters, but due to the dynamic nature of what you can
     * query by (different accounts have different custom fields, statuses, etc) they are more
     * complex than most.
     *
     * To help, here are some exemplar curl requests with a human description of what they search
     * for.
     *
     * Note that:
     * - Filters may be used together, and the result will be incidents that match all filters.
     * - IDs are normally in UUID format, but have been replaced with shorter strings to improve
     * readability.
     * - All query parameters must be URI encoded.
     *
     * ### By status
     *
     * With status of id=ABC, find all incidents that are set to that status:
     *
     * 		curl --get 'https://api.incident.io/v2/incidents' \
     * 			--data 'status[one_of]=ABC'
     *
     * Or all incidents that are not set to status with id=ABC:
     *
     * 		curl --get 'https://api.incident.io/v2/incidents' \
     * 			--data 'status[not_in]=ABC'
     *
     * ### By severity
     *
     * With severity of id=ABC, find all incidents that are set to that severity:
     *
     * 		curl --get 'https://api.incident.io/v2/incidents' \
     * 			--data 'severity[one_of]=ABC'
     *
     * Or all incidents where severity rank is greater-than-or-equal-to the rank of severity
     * id=ABC:
     *
     * 		curl --get 'https://api.incident.io/v2/incidents' \
     * 			--data 'severity[gte]=ABC'
     *
     * Or all incidents where severity rank is less-than-or-equal-to the rank of severity id=ABC:
     *
     * 		curl --get 'https://api.incident.io/v2/incidents' \
     * 			--data 'severity[lte]=ABC'
     *
     * ### By incident type
     *
     * With incident type of id=ABC, find all incidents that are of that type:
     *
     * 		curl --get 'https://api.incident.io/v2/incidents' \
     * 			--data 'incident_type[one_of]=ABC'
     *
     * Or all incidents not of that type:
     *
     * 		curl --get 'https://api.incident.io/v2/incidents' \
     * 			--data 'incident_type[not_in]=ABC'
     *
     * ### By incident role
     *
     * Roles and custom fields have another nested layer in the query parameter, to account for
     * operations against any of the roles or custom fields created in the account.
     *
     * With incident role id=ABC, find all incidents where that role is unset:
     *
     * 		curl --get 'https://api.incident.io/v2/incidents' \
     * 			--data 'incident_role[ABC][is_blank]=true'
     *
     * Or where the role has been set:
     *
     * 		curl --get 'https://api.incident.io/v2/incidents' \
     * 			--data 'incident_role[ABC][is_blank]=false'
     *
     * ### By option custom fields
     *
     * With an option custom field id=ABC, all incidents that have field ABC set to the custom
     * field option of id=XYZ:
     *
     * 		curl \
     * 			--get 'https://api.incident.io/v2/incidents' \
     * 			--data 'custom_field[ABC][one_of]=XYZ'
     *
     * Or all incidents that do not have custom field id=ABC set to option id=XYZ:
     *
     * 		curl \
     * 			--get 'https://api.incident.io/v2/incidents' \
     * 			--data 'custom_field[ABC][not_in]=XYZ'
     */
    get: operations['Incidents V2#List'];
    /**
     * Create a new incident.
     *
     * Note that if the incident mode is set to "retrospective" then the new incident
     * will not be announced in Slack.
     */
    post: operations['Incidents V2#Create'];
  };
  '/v2/incidents/{id}': {
    /** Get a single incident. */
    get: operations['Incidents V2#Show'];
  };
  '/v2/incidents/{id}/actions/edit': {
    /**
     * Edit an existing incident.
     *
     * This endpoint allows you to edit the properties of an existing incident: e.g. set the severity or update custom fields.
     *
     * When using this endpoint, only fields that are provided will be edited (omitted fields
     * will be ignored).
     */
    post: operations['Incidents V2#Edit'];
  };
  '/x-audit-logs/announcement_rule.created.1': {
    /** This entry is created whenever a announcement rule is created */
    get: operations['Audit logs#AnnouncementRuleCreatedV1'];
  };
  '/x-audit-logs/announcement_rule.deleted.1': {
    /** This entry is created whenever a announcement rule is deleted */
    get: operations['Audit logs#AnnouncementRuleDeletedV1'];
  };
  '/x-audit-logs/announcement_rule.updated.1': {
    /** This entry is created whenever a announcement rule is updated */
    get: operations['Audit logs#AnnouncementRuleUpdatedV1'];
  };
  '/x-audit-logs/api_key.created.1': {
    /** This entry is created whenever a api key is created */
    get: operations['Audit logs#ApiKeyCreatedV1'];
  };
  '/x-audit-logs/api_key.deleted.1': {
    /** This entry is created whenever a api key is deleted */
    get: operations['Audit logs#ApiKeyDeletedV1'];
  };
  '/x-audit-logs/custom_field.created.1': {
    /** This entry is created whenever a custom field is created */
    get: operations['Audit logs#CustomFieldCreatedV1'];
  };
  '/x-audit-logs/custom_field.deleted.1': {
    /** This entry is created whenever a custom field is deleted */
    get: operations['Audit logs#CustomFieldDeletedV1'];
  };
  '/x-audit-logs/custom_field.updated.1': {
    /** This entry is created whenever a custom field is updated */
    get: operations['Audit logs#CustomFieldUpdatedV1'];
  };
  '/x-audit-logs/follow_up_priority.created.1': {
    /** This entry is created whenever a follow up priority is created */
    get: operations['Audit logs#FollowUpPriorityCreatedV1'];
  };
  '/x-audit-logs/follow_up_priority.deleted.1': {
    /** This entry is created whenever a follow up priority is deleted */
    get: operations['Audit logs#FollowUpPriorityDeletedV1'];
  };
  '/x-audit-logs/follow_up_priority.updated.1': {
    /** This entry is created whenever a follow up priority is updated */
    get: operations['Audit logs#FollowUpPriorityUpdatedV1'];
  };
  '/x-audit-logs/incident_duration_metric.created.1': {
    /** This entry is created whenever a incident duration metric is created */
    get: operations['Audit logs#IncidentDurationMetricCreatedV1'];
  };
  '/x-audit-logs/incident_duration_metric.deleted.1': {
    /** This entry is created whenever a incident duration metric is deleted */
    get: operations['Audit logs#IncidentDurationMetricDeletedV1'];
  };
  '/x-audit-logs/incident_duration_metric.updated.1': {
    /** This entry is created whenever a incident duration metric is updated */
    get: operations['Audit logs#IncidentDurationMetricUpdatedV1'];
  };
  '/x-audit-logs/incident_role.created.1': {
    /** This entry is created whenever a incident role is created */
    get: operations['Audit logs#IncidentRoleCreatedV1'];
  };
  '/x-audit-logs/incident_role.deleted.1': {
    /** This entry is created whenever a incident role is deleted */
    get: operations['Audit logs#IncidentRoleDeletedV1'];
  };
  '/x-audit-logs/incident_role.updated.1': {
    /** This entry is created whenever a incident role is updated */
    get: operations['Audit logs#IncidentRoleUpdatedV1'];
  };
  '/x-audit-logs/incident_status.created.1': {
    /** This entry is created whenever a incident status is created */
    get: operations['Audit logs#IncidentStatusCreatedV1'];
  };
  '/x-audit-logs/incident_status.deleted.1': {
    /** This entry is created whenever a incident status is deleted */
    get: operations['Audit logs#IncidentStatusDeletedV1'];
  };
  '/x-audit-logs/incident_status.updated.1': {
    /** This entry is created whenever a incident status is updated */
    get: operations['Audit logs#IncidentStatusUpdatedV1'];
  };
  '/x-audit-logs/incident_timestamp.created.1': {
    /** This entry is created whenever a incident timestamp is created */
    get: operations['Audit logs#IncidentTimestampCreatedV1'];
  };
  '/x-audit-logs/incident_timestamp.deleted.1': {
    /** This entry is created whenever a incident timestamp is deleted */
    get: operations['Audit logs#IncidentTimestampDeletedV1'];
  };
  '/x-audit-logs/incident_timestamp.updated.1': {
    /** This entry is created whenever a incident timestamp is updated */
    get: operations['Audit logs#IncidentTimestampUpdatedV1'];
  };
  '/x-audit-logs/incident_type.created.1': {
    /** This entry is created whenever a incident type is created */
    get: operations['Audit logs#IncidentTypeCreatedV1'];
  };
  '/x-audit-logs/incident_type.deleted.1': {
    /** This entry is created whenever a incident type is deleted */
    get: operations['Audit logs#IncidentTypeDeletedV1'];
  };
  '/x-audit-logs/incident_type.updated.1': {
    /** This entry is created whenever a incident type is updated */
    get: operations['Audit logs#IncidentTypeUpdatedV1'];
  };
  '/x-audit-logs/integration.installed.1': {
    /** This entry is created whenever an integration is installed */
    get: operations['Audit logs#IntegrationInstalledV1'];
  };
  '/x-audit-logs/integration.uninstalled.1': {
    /** This entry is created whenever an integration is uninstalled */
    get: operations['Audit logs#IntegrationUninstalledV1'];
  };
  '/x-audit-logs/policy.created.1': {
    /** This entry is created whenever a policy is created */
    get: operations['Audit logs#PolicyCreatedV1'];
  };
  '/x-audit-logs/policy.deleted.1': {
    /** This entry is created whenever a policy is deleted */
    get: operations['Audit logs#PolicyDeletedV1'];
  };
  '/x-audit-logs/policy.updated.1': {
    /** This entry is created whenever a policy is updated */
    get: operations['Audit logs#PolicyUpdatedV1'];
  };
  '/x-audit-logs/private_incident.access_attempted.1': {
    /** This entry is created whenever someone attempts to access a private incident. */
    get: operations['Audit logs#PrivateIncidentAccessAttemptedV1'];
  };
  '/x-audit-logs/private_incident.access_requested.1': {
    /** This entry is created whenever someone requests access to a private incident. */
    get: operations['Audit logs#PrivateIncidentAccessRequestedV1'];
  };
  '/x-audit-logs/private_incident_membership.granted.1': {
    /** This entry is created whenever someone is granted access to a private incident. If they have the 'manage private incidents' permission, then it'll appear that the system has given them access to the incident. */
    get: operations['Audit logs#PrivateIncidentMembershipGrantedV1'];
  };
  '/x-audit-logs/private_incident_membership.revoked.1': {
    /** This entry is created whenever someone's access to a private incident is revoked. */
    get: operations['Audit logs#PrivateIncidentMembershipRevokedV1'];
  };
  '/x-audit-logs/rbac_role.created.1': {
    /** This entry is created whenever a rbac role is created */
    get: operations['Audit logs#RbacRoleCreatedV1'];
  };
  '/x-audit-logs/rbac_role.deleted.1': {
    /** This entry is created whenever a rbac role is deleted */
    get: operations['Audit logs#RbacRoleDeletedV1'];
  };
  '/x-audit-logs/rbac_role.updated.1': {
    /** This entry is created whenever a rbac role is updated */
    get: operations['Audit logs#RbacRoleUpdatedV1'];
  };
  '/x-audit-logs/scim_group.role_mappings_updated.1': {
    /** This entry is created whenever a SCIM group is mapped to a new RBAC role */
    get: operations['Audit logs#ScimGroupRoleMappingsUpdatedV1'];
  };
  '/x-audit-logs/severity.created.1': {
    /** This entry is created whenever a severity is created */
    get: operations['Audit logs#SeverityCreatedV1'];
  };
  '/x-audit-logs/severity.deleted.1': {
    /** This entry is created whenever a severity is deleted */
    get: operations['Audit logs#SeverityDeletedV1'];
  };
  '/x-audit-logs/severity.updated.1': {
    /** This entry is created whenever a severity is updated */
    get: operations['Audit logs#SeverityUpdatedV1'];
  };
  '/x-audit-logs/status_page.created.1': {
    /** This entry is created whenever a status page is created */
    get: operations['Audit logs#StatusPageCreatedV1'];
  };
  '/x-audit-logs/status_page.deleted.1': {
    /** This entry is created whenever a status page is deleted */
    get: operations['Audit logs#StatusPageDeletedV1'];
  };
  '/x-audit-logs/status_page.updated.1': {
    /** This entry is created whenever a status page has its configuration updated */
    get: operations['Audit logs#StatusPageUpdatedV1'];
  };
  '/x-audit-logs/status_page_template.created.1': {
    /** This entry is created whenever a status page template is created */
    get: operations['Audit logs#StatusPageTemplateCreatedV1'];
  };
  '/x-audit-logs/status_page_template.deleted.1': {
    /** This entry is created whenever a status page template is deleted */
    get: operations['Audit logs#StatusPageTemplateDeletedV1'];
  };
  '/x-audit-logs/status_page_template.updated.1': {
    /** This entry is created whenever a status page template is updated */
    get: operations['Audit logs#StatusPageTemplateUpdatedV1'];
  };
  '/x-audit-logs/user.created.1': {
    /** This entry is created whenever a user is created */
    get: operations['Audit logs#UserCreatedV1'];
  };
  '/x-audit-logs/user.deactivated.1': {
    /** This entry is created whenever a user is deactivated */
    get: operations['Audit logs#UserDeactivatedV1'];
  };
  '/x-audit-logs/user.reinstated.1': {
    /** This entry is created when a user is reinstated after being deactivated */
    get: operations['Audit logs#UserReinstatedV1'];
  };
  '/x-audit-logs/user.role_memberships_updated.1': {
    /** This entry is created whenever a user's role memberships are changed. */
    get: operations['Audit logs#UserRoleMembershipsUpdatedV1'];
  };
  '/x-audit-logs/user.updated.1': {
    /** This entry is created whenever a user is updated */
    get: operations['Audit logs#UserUpdatedV1'];
  };
  '/x-audit-logs/workflow.created.1': {
    /** This entry is created whenever a workflow is created */
    get: operations['Audit logs#WorkflowCreatedV1'];
  };
  '/x-audit-logs/workflow.deleted.1': {
    /** This entry is created whenever a workflow is deleted */
    get: operations['Audit logs#WorkflowDeletedV1'];
  };
  '/x-audit-logs/workflow.updated.1': {
    /** This entry is created whenever a workflow is updated */
    get: operations['Audit logs#WorkflowUpdatedV1'];
  };
  '/x-webhooks/__all__': {
    /** Enables us to generate a type for all webhook types, so we can use a single serializer. */
    get: operations['Webhooks#All'];
  };
  '/x-webhooks/private_incident.follow_up_created_v1': {
    /** This webhook is emitted whenever a follow-up for a private incident is created. */
    get: operations['Webhooks#PrivateIncidentFollowUpCreatedV1'];
  };
  '/x-webhooks/private_incident.follow_up_updated_v1': {
    /** This webhook is emitted whenever a follow-up for a private incident is updated. */
    get: operations['Webhooks#PrivateIncidentFollowUpUpdatedV1'];
  };
  '/x-webhooks/private_incident.incident_created_v2': {
    /** This webhook is emitted whenever a new private incident is created. */
    get: operations['Webhooks#PrivateIncidentIncidentCreatedV2'];
  };
  '/x-webhooks/private_incident.incident_updated_v2': {
    /** This webhook is emitted whenever a private incident is updated. */
    get: operations['Webhooks#PrivateIncidentIncidentUpdatedV2'];
  };
  '/x-webhooks/public_incident.follow_up_created_v1': {
    /** This webhook is emitted whenever a follow-up is created. */
    get: operations['Webhooks#PublicIncidentFollowUpCreatedV1'];
  };
  '/x-webhooks/public_incident.follow_up_updated_v1': {
    /** This webhook is emitted whenever a follow-up is updated. */
    get: operations['Webhooks#PublicIncidentFollowUpUpdatedV1'];
  };
  '/x-webhooks/public_incident.incident_created_v2': {
    /** This webhook is emitted whenever a new incident is created. */
    get: operations['Webhooks#PublicIncidentIncidentCreatedV2'];
  };
  '/x-webhooks/public_incident.incident_updated_v2': {
    /** This webhook is emitted whenever an incident is updated. */
    get: operations['Webhooks#PublicIncidentIncidentUpdatedV2'];
  };
}

export interface definitions {
  /**
   * APIKeyV1ResponseBody
   * @example {
   *   "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "name": "My test API key"
   * }
   */
  APIKeyV1ResponseBody: {
    /**
     * @description Unique identifier for this API key
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    id: string;
    /**
     * @description The name of the API key, for the user's reference
     * @example My test API key
     */
    name: string;
  } & {
    roles: unknown;
    created_by: unknown;
  };
  /**
   * APIKeyV2ResponseBody
   * @example {
   *   "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "name": "My test API key"
   * }
   */
  APIKeyV2ResponseBody: {
    /**
     * @description Unique identifier for this API key
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    id: string;
    /**
     * @description The name of the API key, for the user's reference
     * @example My test API key
     */
    name: string;
  } & {
    roles: unknown;
    created_by: unknown;
  };
  /**
   * ActionV1ResponseBody
   * @example {
   *   "assignee": {
   *     "email": "lisa@incident.io",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "name": "Lisa Karlin Curtis",
   *     "role": "viewer",
   *     "slack_user_id": "U02AYNF2XJM"
   *   },
   *   "completed_at": "2021-08-17T13:28:57.801578Z",
   *   "created_at": "2021-08-17T13:28:57.801578Z",
   *   "description": "Call the fire brigade",
   *   "external_issue_reference": {
   *     "issue_name": "INC-123",
   *     "issue_permalink": "https://linear.app/incident-io/issue/INC-1609/find-copywriter-to-write-up",
   *     "provider": "asana"
   *   },
   *   "follow_up": true,
   *   "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "incident_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "status": "outstanding",
   *   "updated_at": "2021-08-17T13:28:57.801578Z"
   * }
   */
  ActionV1ResponseBody: {
    assignee?: definitions['UserV1ResponseBody'];
    /**
     * Format: date-time
     * @description When the action was completed
     * @example 2021-08-17T13:28:57.801578Z
     */
    completed_at?: string;
    /**
     * Format: date-time
     * @description When the action was created
     * @example 2021-08-17T13:28:57.801578Z
     */
    created_at: string;
    /**
     * @description Description of the action
     * @example Call the fire brigade
     */
    description?: string;
    external_issue_reference?: definitions['ExternalIssueReferenceV1ResponseBody'];
    /**
     * @description Whether an action is marked as follow-up
     * @example true
     */
    follow_up: boolean;
    /**
     * @description Unique identifier for the action
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    id: string;
    /**
     * @description Unique identifier of the incident the action belongs to
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    incident_id: string;
    /**
     * @description Status of the action
     * @example outstanding
     * @enum {string}
     */
    status: 'outstanding' | 'completed' | 'deleted' | 'not_doing';
    /**
     * Format: date-time
     * @description When the action was last updated
     * @example 2021-08-17T13:28:57.801578Z
     */
    updated_at: string;
  };
  /**
   * ActionsV1ListResponseBody
   * @example {
   *   "actions": [
   *     {
   *       "assignee": {
   *         "email": "lisa@incident.io",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "Lisa Karlin Curtis",
   *         "role": "viewer",
   *         "slack_user_id": "U02AYNF2XJM"
   *       },
   *       "completed_at": "2021-08-17T13:28:57.801578Z",
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Call the fire brigade",
   *       "external_issue_reference": {
   *         "issue_name": "INC-123",
   *         "issue_permalink": "https://linear.app/incident-io/issue/INC-1609/find-copywriter-to-write-up",
   *         "provider": "asana"
   *       },
   *       "follow_up": true,
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "incident_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "status": "outstanding",
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     }
   *   ]
   * }
   */
  ActionsV1ListResponseBody: {
    /**
     * @example [
     *   {
     *     "assignee": {
     *       "email": "lisa@incident.io",
     *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *       "name": "Lisa Karlin Curtis",
     *       "role": "viewer",
     *       "slack_user_id": "U02AYNF2XJM"
     *     },
     *     "completed_at": "2021-08-17T13:28:57.801578Z",
     *     "created_at": "2021-08-17T13:28:57.801578Z",
     *     "description": "Call the fire brigade",
     *     "external_issue_reference": {
     *       "issue_name": "INC-123",
     *       "issue_permalink": "https://linear.app/incident-io/issue/INC-1609/find-copywriter-to-write-up",
     *       "provider": "asana"
     *     },
     *     "follow_up": true,
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "incident_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "status": "outstanding",
     *     "updated_at": "2021-08-17T13:28:57.801578Z"
     *   }
     * ]
     */
    actions: definitions['ActionV1ResponseBody'][];
  };
  /**
   * ActionsV1ShowResponseBody
   * @example {
   *   "action": {
   *     "assignee": {
   *       "email": "lisa@incident.io",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Lisa Karlin Curtis",
   *       "role": "viewer",
   *       "slack_user_id": "U02AYNF2XJM"
   *     },
   *     "completed_at": "2021-08-17T13:28:57.801578Z",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Call the fire brigade",
   *     "external_issue_reference": {
   *       "issue_name": "INC-123",
   *       "issue_permalink": "https://linear.app/incident-io/issue/INC-1609/find-copywriter-to-write-up",
   *       "provider": "asana"
   *     },
   *     "follow_up": true,
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "incident_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "status": "outstanding",
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  ActionsV1ShowResponseBody: {
    action: definitions['ActionV1ResponseBody'];
  };
  /**
   * ActorV1ResponseBody
   * @example {
   *   "api_key": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "name": "My test API key"
   *   },
   *   "user": {
   *     "email": "lisa@incident.io",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "name": "Lisa Karlin Curtis",
   *     "role": "viewer",
   *     "slack_user_id": "U02AYNF2XJM"
   *   }
   * }
   */
  ActorV1ResponseBody: {
    api_key?: definitions['APIKeyV1ResponseBody'];
    user?: definitions['UserV1ResponseBody'];
  };
  /**
   * ActorV2ResponseBody
   * @example {
   *   "api_key": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "name": "My test API key"
   *   },
   *   "user": {
   *     "email": "lisa@incident.io",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "name": "Lisa Karlin Curtis",
   *     "role": "viewer",
   *     "slack_user_id": "U02AYNF2XJM"
   *   }
   * }
   */
  ActorV2ResponseBody: {
    api_key?: definitions['APIKeyV2ResponseBody'];
    user?: definitions['UserV2ResponseBody'];
  };
  /**
   * AuditLogActorMetadataV2ResponseBody
   * @example {
   *   "api_key_roles": "abc123",
   *   "external_resource_external_id": "q1234",
   *   "external_resource_type": "pager_duty_incident",
   *   "user_base_role_slug": "admin",
   *   "user_custom_role_slugs": "engineering,security"
   * }
   */
  AuditLogActorMetadataV2ResponseBody: {
    /**
     * @description The roles that the API key has, separated by commas (if it's an API key actor)
     * @example abc123
     */
    api_key_roles?: string;
    /**
     * @description The ID of the external resource in the 3rd party system (if it's an external resource actor)
     * @example q1234
     */
    external_resource_external_id?: string;
    /**
     * @description The type of the external resource (if it's an external resource actor)
     * @example pager_duty_incident
     */
    external_resource_type?: string;
    /**
     * @description The base role slug of the user (if it's a user actor)
     * @example admin
     */
    user_base_role_slug?: string;
    /**
     * @description The custom role slugs of the user, separated by commas (if it's a user actor)
     * @example engineering,security
     */
    user_custom_role_slugs?: string;
  };
  /**
   * AuditLogActorV2ResponseBody
   * @example {
   *   "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "metadata": {
   *     "user_base_role_slug": "admin",
   *     "user_custom_role_slugs": "engineering,security"
   *   },
   *   "name": "John Doe",
   *   "type": "user"
   * }
   */
  AuditLogActorV2ResponseBody: {
    /**
     * @description The ID of the actor
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    id: string;
    metadata?: definitions['AuditLogActorMetadataV2ResponseBody'];
    /**
     * @description The name of the actor
     * @example John Doe
     */
    name?: string;
    /**
     * @description The type of actor
     * @example user
     * @enum {string}
     */
    type: 'user' | 'system' | 'api_key' | 'workflow' | 'external_resource';
  };
  /**
   * AuditLogEntryContextV2ResponseBody
   * @example {
   *   "location": "1.2.3.4",
   *   "user_agent": "Chrome/91.0.4472.114"
   * }
   */
  AuditLogEntryContextV2ResponseBody: {
    /**
     * @description The location of the actor that performed this action
     * @example 1.2.3.4
     */
    location: string;
    /**
     * @description The user agent of the actor that performed this action
     * @example Chrome/91.0.4472.114
     */
    user_agent?: string;
  };
  /**
   * AuditLogPrivateIncidentAccessAttemptedMetadataV2ResponseBody
   * @example {
   *   "outcome": "granted"
   * }
   */
  AuditLogPrivateIncidentAccessAttemptedMetadataV2ResponseBody: {
    /**
     * @description Whether or not the user was able to access the private incident
     * @example granted
     * @enum {string}
     */
    outcome?: 'granted' | 'denied';
  };
  /**
   * AuditLogTargetV2ResponseBody
   * @example {
   *   "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "name": "John Doe",
   *   "type": "user"
   * }
   */
  AuditLogTargetV2ResponseBody: {
    /**
     * @description The ID of the target
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    id: string;
    /**
     * @description The name of the target
     * @example John Doe
     */
    name?: string;
    /**
     * @description The type of target
     * @example user
     * @enum {string}
     */
    type:
      | 'announcement_rule'
      | 'api_key'
      | 'custom_field'
      | 'follow_up_priority'
      | 'incident'
      | 'incident_duration_metric'
      | 'incident_role'
      | 'incident_status'
      | 'incident_timestamp'
      | 'incident_type'
      | 'integration'
      | 'policy'
      | 'private_incident_membership'
      | 'rbac_role'
      | 'scim_group'
      | 'severity'
      | 'status_page'
      | 'status_page_template'
      | 'user'
      | 'workflow';
  };
  /**
   * AuditLogUserRoleMembershipChangedMetadataV2ResponseBody
   * @example {
   *   "after_base_role_slug": "owner",
   *   "after_custom_role_slugs": "engineering,data",
   *   "before_base_role_slug": "admin",
   *   "before_custom_role_slugs": "engineering,security"
   * }
   */
  AuditLogUserRoleMembershipChangedMetadataV2ResponseBody: {
    /**
     * @description The base role slug of the user after their role memberships changed
     * @example owner
     */
    after_base_role_slug: string;
    /**
     * @description The custom role slugs of the user after their role memberships changed, separated by commas
     * @example engineering,data
     */
    after_custom_role_slugs: string;
    /**
     * @description The base role slug of the user before their role memberships changed
     * @example admin
     */
    before_base_role_slug: string;
    /**
     * @description The custom role slugs of the user before their role memberships changed, separated by commas
     * @example engineering,security
     */
    before_custom_role_slugs: string;
  };
  /**
   * AuditLogUserSCIMGroupMappingChangedMetadataV2ResponseBody
   * @example {
   *   "after_base_role_slug": "owner",
   *   "after_custom_role_slugs": "engineering,data",
   *   "before_base_role_slug": "admin",
   *   "before_custom_role_slugs": "engineering,security"
   * }
   */
  AuditLogUserSCIMGroupMappingChangedMetadataV2ResponseBody: {
    /**
     * @description The base role slug of this SCIM group after the mapping was changed (if any)
     * @example owner
     */
    after_base_role_slug?: string;
    /**
     * @description The custom role slugs of this SCIM group after the mapping was changed (if any), separated by commas
     * @example engineering,data
     */
    after_custom_role_slugs?: string;
    /**
     * @description The base role slug assigned to this SCIM group before the mapping was changed (if any)
     * @example admin
     */
    before_base_role_slug?: string;
    /**
     * @description The custom role slugs of this SCIM group before the mapping was changed (if any), separated by commas
     * @example engineering,security
     */
    before_custom_role_slugs?: string;
  };
  /**
   * AuditLogsAPIKeyCreatedV1ResponseBody
   * @example {
   *   "action": "api_key.created",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Development API Key",
   *       "type": "api_key"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsAPIKeyCreatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example api_key.created
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Development API Key",
     *     "type": "api_key"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsAPIKeyDeletedV1ResponseBody
   * @example {
   *   "action": "api_key.deleted",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Development API Key",
   *       "type": "api_key"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsAPIKeyDeletedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example api_key.deleted
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Development API Key",
     *     "type": "api_key"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsAnnouncementRuleCreatedV1ResponseBody
   * @example {
   *   "action": "announcement_rule.created",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "#engineering",
   *       "type": "announcement_rule"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsAnnouncementRuleCreatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example announcement_rule.created
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "#engineering",
     *     "type": "announcement_rule"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsAnnouncementRuleDeletedV1ResponseBody
   * @example {
   *   "action": "announcement_rule.deleted",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "#engineering",
   *       "type": "announcement_rule"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsAnnouncementRuleDeletedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example announcement_rule.deleted
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "#engineering",
     *     "type": "announcement_rule"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsAnnouncementRuleUpdatedV1ResponseBody
   * @example {
   *   "action": "announcement_rule.updated",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "#engineering",
   *       "type": "announcement_rule"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsAnnouncementRuleUpdatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example announcement_rule.updated
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "#engineering",
     *     "type": "announcement_rule"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsCustomFieldCreatedV1ResponseBody
   * @example {
   *   "action": "custom_field.created",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Affected teams",
   *       "type": "custom_field"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsCustomFieldCreatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example custom_field.created
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Affected teams",
     *     "type": "custom_field"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsCustomFieldDeletedV1ResponseBody
   * @example {
   *   "action": "custom_field.deleted",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Affected teams",
   *       "type": "custom_field"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsCustomFieldDeletedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example custom_field.deleted
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Affected teams",
     *     "type": "custom_field"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsCustomFieldUpdatedV1ResponseBody
   * @example {
   *   "action": "custom_field.updated",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Affected teams",
   *       "type": "custom_field"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsCustomFieldUpdatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example custom_field.updated
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Affected teams",
     *     "type": "custom_field"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsFollowUpPriorityCreatedV1ResponseBody
   * @example {
   *   "action": "follow_up_priority.created",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Low",
   *       "type": "follow_up_priority"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsFollowUpPriorityCreatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example follow_up_priority.created
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Low",
     *     "type": "follow_up_priority"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsFollowUpPriorityDeletedV1ResponseBody
   * @example {
   *   "action": "follow_up_priority.deleted",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Low",
   *       "type": "follow_up_priority"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsFollowUpPriorityDeletedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example follow_up_priority.deleted
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Low",
     *     "type": "follow_up_priority"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsFollowUpPriorityUpdatedV1ResponseBody
   * @example {
   *   "action": "follow_up_priority.updated",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Low",
   *       "type": "follow_up_priority"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsFollowUpPriorityUpdatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example follow_up_priority.updated
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Low",
     *     "type": "follow_up_priority"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsIncidentDurationMetricCreatedV1ResponseBody
   * @example {
   *   "action": "incident_duration_metric.created",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Time to resolve",
   *       "type": "incident_duration_metric"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsIncidentDurationMetricCreatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example incident_duration_metric.created
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Time to resolve",
     *     "type": "incident_duration_metric"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsIncidentDurationMetricDeletedV1ResponseBody
   * @example {
   *   "action": "incident_duration_metric.deleted",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Time to resolve",
   *       "type": "incident_duration_metric"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsIncidentDurationMetricDeletedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example incident_duration_metric.deleted
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Time to resolve",
     *     "type": "incident_duration_metric"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsIncidentDurationMetricUpdatedV1ResponseBody
   * @example {
   *   "action": "incident_duration_metric.updated",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Time to resolve",
   *       "type": "incident_duration_metric"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsIncidentDurationMetricUpdatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example incident_duration_metric.updated
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Time to resolve",
     *     "type": "incident_duration_metric"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsIncidentRoleCreatedV1ResponseBody
   * @example {
   *   "action": "incident_role.created",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Communications Lead",
   *       "type": "incident_role"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsIncidentRoleCreatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example incident_role.created
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Communications Lead",
     *     "type": "incident_role"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsIncidentRoleDeletedV1ResponseBody
   * @example {
   *   "action": "incident_role.deleted",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Communications Lead",
   *       "type": "incident_role"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsIncidentRoleDeletedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example incident_role.deleted
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Communications Lead",
     *     "type": "incident_role"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsIncidentRoleUpdatedV1ResponseBody
   * @example {
   *   "action": "incident_role.updated",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Communications Lead",
   *       "type": "incident_role"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsIncidentRoleUpdatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example incident_role.updated
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Communications Lead",
     *     "type": "incident_role"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsIncidentStatusCreatedV1ResponseBody
   * @example {
   *   "action": "incident_status.created",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Investigating",
   *       "type": "incident_status"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsIncidentStatusCreatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example incident_status.created
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Investigating",
     *     "type": "incident_status"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsIncidentStatusDeletedV1ResponseBody
   * @example {
   *   "action": "incident_status.deleted",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Investigating",
   *       "type": "incident_status"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsIncidentStatusDeletedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example incident_status.deleted
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Investigating",
     *     "type": "incident_status"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsIncidentStatusUpdatedV1ResponseBody
   * @example {
   *   "action": "incident_status.updated",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Investigating",
   *       "type": "incident_status"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsIncidentStatusUpdatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example incident_status.updated
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Investigating",
     *     "type": "incident_status"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsIncidentTimestampCreatedV1ResponseBody
   * @example {
   *   "action": "incident_timestamp.created",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Fixed at",
   *       "type": "incident_timestamp"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsIncidentTimestampCreatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example incident_timestamp.created
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Fixed at",
     *     "type": "incident_timestamp"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsIncidentTimestampDeletedV1ResponseBody
   * @example {
   *   "action": "incident_timestamp.deleted",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Fixed at",
   *       "type": "incident_timestamp"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsIncidentTimestampDeletedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example incident_timestamp.deleted
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Fixed at",
     *     "type": "incident_timestamp"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsIncidentTimestampUpdatedV1ResponseBody
   * @example {
   *   "action": "incident_timestamp.updated",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Fixed at",
   *       "type": "incident_timestamp"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsIncidentTimestampUpdatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example incident_timestamp.updated
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Fixed at",
     *     "type": "incident_timestamp"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsIncidentTypeCreatedV1ResponseBody
   * @example {
   *   "action": "incident_type.created",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Security",
   *       "type": "incident_type"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsIncidentTypeCreatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example incident_type.created
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Security",
     *     "type": "incident_type"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsIncidentTypeDeletedV1ResponseBody
   * @example {
   *   "action": "incident_type.deleted",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Security",
   *       "type": "incident_type"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsIncidentTypeDeletedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example incident_type.deleted
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Security",
     *     "type": "incident_type"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsIncidentTypeUpdatedV1ResponseBody
   * @example {
   *   "action": "incident_type.updated",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Security",
   *       "type": "incident_type"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsIncidentTypeUpdatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example incident_type.updated
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Security",
     *     "type": "incident_type"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsIntegrationInstalledV1ResponseBody
   * @example {
   *   "action": "integration.installed",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "github",
   *       "name": "Github",
   *       "type": "integration"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsIntegrationInstalledV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example integration.installed
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "github",
     *     "name": "Github",
     *     "type": "integration"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsIntegrationUninstalledV1ResponseBody
   * @example {
   *   "action": "integration.uninstalled",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "github",
   *       "name": "Github",
   *       "type": "integration"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsIntegrationUninstalledV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example integration.uninstalled
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "github",
     *     "name": "Github",
     *     "type": "integration"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsPolicyCreatedV1ResponseBody
   * @example {
   *   "action": "policy.created",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Follow-ups must be closed within 3 weeks",
   *       "type": "policy"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsPolicyCreatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example policy.created
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Follow-ups must be closed within 3 weeks",
     *     "type": "policy"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsPolicyDeletedV1ResponseBody
   * @example {
   *   "action": "policy.deleted",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Follow-ups must be closed within 3 weeks",
   *       "type": "policy"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsPolicyDeletedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example policy.deleted
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Follow-ups must be closed within 3 weeks",
     *     "type": "policy"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsPolicyUpdatedV1ResponseBody
   * @example {
   *   "action": "policy.updated",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Follow-ups must be closed within 3 weeks",
   *       "type": "policy"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsPolicyUpdatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example policy.updated
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Follow-ups must be closed within 3 weeks",
     *     "type": "policy"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsPrivateIncidentAccessAttemptedV1ResponseBody
   * @example {
   *   "action": "private_incident.access_attempted",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "metadata": {
   *     "outcome": "granted"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "#INC-123 The website is slow",
   *       "type": "incident"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsPrivateIncidentAccessAttemptedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example private_incident.access_attempted
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    metadata: definitions['AuditLogPrivateIncidentAccessAttemptedMetadataV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "#INC-123 The website is slow",
     *     "type": "incident"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsPrivateIncidentAccessRequestedV1ResponseBody
   * @example {
   *   "action": "private_incident.access_requested",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "#INC-123 The website is slow",
   *       "type": "incident"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsPrivateIncidentAccessRequestedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example private_incident.access_requested
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "#INC-123 The website is slow",
     *     "type": "incident"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsPrivateIncidentMembershipGrantedV1ResponseBody
   * @example {
   *   "action": "private_incident_membership.granted",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Bob the builder",
   *       "type": "user"
   *     },
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "#INC-123 The website is slow",
   *       "type": "incident"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsPrivateIncidentMembershipGrantedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example private_incident_membership.granted
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Bob the builder",
     *     "type": "user"
     *   },
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "#INC-123 The website is slow",
     *     "type": "incident"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsPrivateIncidentMembershipRevokedV1ResponseBody
   * @example {
   *   "action": "private_incident_membership.revoked",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Bob the builder",
   *       "type": "user"
   *     },
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "#INC-123 The website is slow",
   *       "type": "incident"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsPrivateIncidentMembershipRevokedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example private_incident_membership.revoked
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Bob the builder",
     *     "type": "user"
     *   },
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "#INC-123 The website is slow",
     *     "type": "incident"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsRbacRoleCreatedV1ResponseBody
   * @example {
   *   "action": "rbac_role.created",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Engineering",
   *       "type": "rbac_role"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsRbacRoleCreatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example rbac_role.created
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Engineering",
     *     "type": "rbac_role"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsRbacRoleDeletedV1ResponseBody
   * @example {
   *   "action": "rbac_role.deleted",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Engineering",
   *       "type": "rbac_role"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsRbacRoleDeletedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example rbac_role.deleted
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Engineering",
     *     "type": "rbac_role"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsRbacRoleUpdatedV1ResponseBody
   * @example {
   *   "action": "rbac_role.updated",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Engineering",
   *       "type": "rbac_role"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsRbacRoleUpdatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example rbac_role.updated
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Engineering",
     *     "type": "rbac_role"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsScimGroupRoleMappingsUpdatedV1ResponseBody
   * @example {
   *   "action": "scim_group.role_mappings_updated",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "metadata": {
   *     "after_base_role_slug": "owner",
   *     "after_custom_role_slugs": "engineering,data",
   *     "before_base_role_slug": "admin",
   *     "before_custom_role_slugs": "engineering,security"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Security",
   *       "type": "scim_group"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsScimGroupRoleMappingsUpdatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example scim_group.role_mappings_updated
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    metadata: definitions['AuditLogUserSCIMGroupMappingChangedMetadataV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Security",
     *     "type": "scim_group"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsSeverityCreatedV1ResponseBody
   * @example {
   *   "action": "severity.created",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Minor",
   *       "type": "severity"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsSeverityCreatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example severity.created
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Minor",
     *     "type": "severity"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsSeverityDeletedV1ResponseBody
   * @example {
   *   "action": "severity.deleted",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Minor",
   *       "type": "severity"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsSeverityDeletedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example severity.deleted
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Minor",
     *     "type": "severity"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsSeverityUpdatedV1ResponseBody
   * @example {
   *   "action": "severity.updated",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Minor",
   *       "type": "severity"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsSeverityUpdatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example severity.updated
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Minor",
     *     "type": "severity"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsStatusPageCreatedV1ResponseBody
   * @example {
   *   "action": "status_page.created",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Public Page",
   *       "type": "status_page"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsStatusPageCreatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example status_page.created
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Public Page",
     *     "type": "status_page"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsStatusPageDeletedV1ResponseBody
   * @example {
   *   "action": "status_page.deleted",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Public Page",
   *       "type": "status_page"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsStatusPageDeletedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example status_page.deleted
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Public Page",
     *     "type": "status_page"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsStatusPageTemplateCreatedV1ResponseBody
   * @example {
   *   "action": "status_page_template.created",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Investigating",
   *       "type": "status_page_template"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsStatusPageTemplateCreatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example status_page_template.created
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Investigating",
     *     "type": "status_page_template"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsStatusPageTemplateDeletedV1ResponseBody
   * @example {
   *   "action": "status_page_template.deleted",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Investigating",
   *       "type": "status_page_template"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsStatusPageTemplateDeletedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example status_page_template.deleted
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Investigating",
     *     "type": "status_page_template"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsStatusPageTemplateUpdatedV1ResponseBody
   * @example {
   *   "action": "status_page_template.updated",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Investigating",
   *       "type": "status_page_template"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsStatusPageTemplateUpdatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example status_page_template.updated
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Investigating",
     *     "type": "status_page_template"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsStatusPageUpdatedV1ResponseBody
   * @example {
   *   "action": "status_page.updated",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Public Page",
   *       "type": "status_page"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsStatusPageUpdatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example status_page.updated
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Public Page",
     *     "type": "status_page"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsUserCreatedV1ResponseBody
   * @example {
   *   "action": "user.created",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Bob the builder",
   *       "type": "user"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsUserCreatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example user.created
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Bob the builder",
     *     "type": "user"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsUserDeactivatedV1ResponseBody
   * @example {
   *   "action": "user.deactivated",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Bob the builder",
   *       "type": "user"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsUserDeactivatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example user.deactivated
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Bob the builder",
     *     "type": "user"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsUserReinstatedV1ResponseBody
   * @example {
   *   "action": "user.reinstated",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Bob the builder",
   *       "type": "user"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsUserReinstatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example user.reinstated
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Bob the builder",
     *     "type": "user"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsUserRoleMembershipsUpdatedV1ResponseBody
   * @example {
   *   "action": "user.role_memberships_updated",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "metadata": {
   *     "after_base_role_slug": "owner",
   *     "after_custom_role_slugs": "engineering,data",
   *     "before_base_role_slug": "admin",
   *     "before_custom_role_slugs": "engineering,security"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Bob the builder",
   *       "type": "user"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsUserRoleMembershipsUpdatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example user.role_memberships_updated
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    metadata: definitions['AuditLogUserRoleMembershipChangedMetadataV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Bob the builder",
     *     "type": "user"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsUserUpdatedV1ResponseBody
   * @example {
   *   "action": "user.updated",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Bob the builder",
   *       "type": "user"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsUserUpdatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example user.updated
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Bob the builder",
     *     "type": "user"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsWorkflowCreatedV1ResponseBody
   * @example {
   *   "action": "workflow.created",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Nudge to write a postmortem",
   *       "type": "workflow"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsWorkflowCreatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example workflow.created
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Nudge to write a postmortem",
     *     "type": "workflow"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsWorkflowDeletedV1ResponseBody
   * @example {
   *   "action": "workflow.deleted",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Nudge to write a postmortem",
   *       "type": "workflow"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsWorkflowDeletedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example workflow.deleted
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Nudge to write a postmortem",
     *     "type": "workflow"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * AuditLogsWorkflowUpdatedV1ResponseBody
   * @example {
   *   "action": "workflow.updated",
   *   "actor": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "metadata": {
   *       "user_base_role_slug": "admin",
   *       "user_custom_role_slugs": "engineering,security"
   *     },
   *     "name": "John Doe",
   *     "type": "user"
   *   },
   *   "context": {
   *     "location": "1.2.3.4",
   *     "user_agent": "Chrome/91.0.4472.114"
   *   },
   *   "occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "targets": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Nudge to write a postmortem",
   *       "type": "workflow"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  AuditLogsWorkflowUpdatedV1ResponseBody: {
    /**
     * @description The type of log entry that this is
     * @example workflow.updated
     */
    action: string;
    actor: definitions['AuditLogActorV2ResponseBody'];
    context: definitions['AuditLogEntryContextV2ResponseBody'];
    /**
     * Format: date-time
     * @description When the entry occurred
     * @example 2021-08-17T13:28:57.801578Z
     */
    occurred_at: string;
    /**
     * @description The custom field that was created
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Nudge to write a postmortem",
     *     "type": "workflow"
     *   }
     * ]
     */
    targets: definitions['AuditLogTargetV2ResponseBody'][];
    /**
     * Format: int64
     * @description Which version the event is
     * @example 1
     */
    version: number;
  };
  /**
   * CatalogAttributeBindingPayloadV2RequestBody
   * @example {
   *   "array_value": [
   *     {
   *       "literal": "SEV123"
   *     }
   *   ],
   *   "value": {
   *     "literal": "SEV123"
   *   }
   * }
   */
  CatalogAttributeBindingPayloadV2RequestBody: {
    /**
     * @description If set, this is the array value of the attribute
     * @example [
     *   {
     *     "literal": "SEV123"
     *   }
     * ]
     */
    array_value?: definitions['CatalogAttributeValuePayloadV2RequestBody'][];
    value?: definitions['CatalogAttributeValuePayloadV2RequestBody'];
  };
  /**
   * CatalogAttributeBindingV2ResponseBody
   * @example {
   *   "array_value": [
   *     {
   *       "catalog_entry": {
   *         "catalog_entry_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "catalog_entry_name": "Primary escalation",
   *         "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0"
   *       },
   *       "image_url": "https://avatars.slack-edge.com/2021-08-09/2372763167857_6f65d94928b0a0ac590b_192.jpg",
   *       "is_image_slack_icon": false,
   *       "label": "Lawrence Jones",
   *       "literal": "SEV123",
   *       "sort_key": "000020"
   *     }
   *   ],
   *   "value": {
   *     "catalog_entry": {
   *       "catalog_entry_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "catalog_entry_name": "Primary escalation",
   *       "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0"
   *     },
   *     "image_url": "https://avatars.slack-edge.com/2021-08-09/2372763167857_6f65d94928b0a0ac590b_192.jpg",
   *     "is_image_slack_icon": false,
   *     "label": "Lawrence Jones",
   *     "literal": "SEV123",
   *     "sort_key": "000020"
   *   }
   * }
   */
  CatalogAttributeBindingV2ResponseBody: {
    /**
     * @description If array_value is set, this helps render the values
     * @example [
     *   {
     *     "catalog_entry": {
     *       "catalog_entry_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *       "catalog_entry_name": "Primary escalation",
     *       "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0"
     *     },
     *     "image_url": "https://avatars.slack-edge.com/2021-08-09/2372763167857_6f65d94928b0a0ac590b_192.jpg",
     *     "is_image_slack_icon": false,
     *     "label": "Lawrence Jones",
     *     "literal": "SEV123",
     *     "sort_key": "000020"
     *   }
     * ]
     */
    array_value?: definitions['CatalogAttributeValueV2ResponseBody'][];
    value?: definitions['CatalogAttributeValueV2ResponseBody'];
  };
  /**
   * CatalogAttributeValuePayloadV2RequestBody
   * @example {
   *   "literal": "SEV123"
   * }
   */
  CatalogAttributeValuePayloadV2RequestBody: {
    /**
     * @description The literal value of this attribute
     * @example SEV123
     */
    literal?: string;
  };
  /**
   * CatalogAttributeValueV2ResponseBody
   * @example {
   *   "catalog_entry": {
   *     "catalog_entry_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "catalog_entry_name": "Primary escalation",
   *     "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0"
   *   },
   *   "image_url": "https://avatars.slack-edge.com/2021-08-09/2372763167857_6f65d94928b0a0ac590b_192.jpg",
   *   "is_image_slack_icon": false,
   *   "label": "Lawrence Jones",
   *   "literal": "SEV123",
   *   "sort_key": "000020"
   * }
   */
  CatalogAttributeValueV2ResponseBody: {
    catalog_entry?: definitions['CatalogEntryReferenceV2ResponseBody'];
    /**
     * @description If appropriate, URL to an image that can be displayed alongside the option
     * @example https://avatars.slack-edge.com/2021-08-09/2372763167857_6f65d94928b0a0ac590b_192.jpg
     */
    image_url?: string;
    /**
     * @description If true, the image_url is a Slack icon and should be displayed as such
     * @example false
     */
    is_image_slack_icon?: boolean;
    /**
     * @description Human readable label to be displayed for user to select
     * @example Lawrence Jones
     */
    label: string;
    /**
     * @description If set, this is the literal value of the step parameter
     * @example SEV123
     */
    literal?: string;
    /**
     * @description Gives an indication of how to sort the options when displayed to the user
     * @example 000020
     */
    sort_key: string;
  };
  /**
   * CatalogEntryReferenceV2ResponseBody
   * @example {
   *   "catalog_entry_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "catalog_entry_name": "Primary escalation",
   *   "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0"
   * }
   */
  CatalogEntryReferenceV2ResponseBody: {
    /**
     * @description ID of this catalog entry
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    catalog_entry_id: string;
    /**
     * @description The name of this entry
     * @example Primary escalation
     */
    catalog_entry_name: string;
    /**
     * @description ID of this catalog type
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    catalog_type_id: string;
  };
  /**
   * CatalogEntryV2ResponseBody
   * @example {
   *   "aliases": [
   *     "lawrence@incident.io",
   *     "lawrence"
   *   ],
   *   "attribute_values": {
   *     "abc123": {
   *       "array_value": [
   *         {
   *           "catalog_entry": {
   *             "catalog_entry_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *             "catalog_entry_name": "Primary escalation",
   *             "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0"
   *           },
   *           "image_url": "https://avatars.slack-edge.com/2021-08-09/2372763167857_6f65d94928b0a0ac590b_192.jpg",
   *           "is_image_slack_icon": false,
   *           "label": "Lawrence Jones",
   *           "literal": "SEV123",
   *           "sort_key": "000020"
   *         }
   *       ],
   *       "value": {
   *         "catalog_entry": {
   *           "catalog_entry_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "catalog_entry_name": "Primary escalation",
   *           "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0"
   *         },
   *         "image_url": "https://avatars.slack-edge.com/2021-08-09/2372763167857_6f65d94928b0a0ac590b_192.jpg",
   *         "is_image_slack_icon": false,
   *         "label": "Lawrence Jones",
   *         "literal": "SEV123",
   *         "sort_key": "000020"
   *       }
   *     }
   *   },
   *   "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "created_at": "2021-08-17T13:28:57.801578Z",
   *   "external_id": "761722cd-d1d7-477b-ac7e-90f9e079dc33",
   *   "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "name": "Primary On-call",
   *   "rank": 3,
   *   "updated_at": "2021-08-17T13:28:57.801578Z"
   * }
   */
  CatalogEntryV2ResponseBody: {
    /**
     * @description Optional aliases that can be used to reference this entry
     * @example [
     *   "lawrence@incident.io",
     *   "lawrence"
     * ]
     */
    aliases: string[];
    /**
     * @description Values of this entry
     * @example {
     *   "abc123": {
     *     "array_value": [
     *       {
     *         "catalog_entry": {
     *           "catalog_entry_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *           "catalog_entry_name": "Primary escalation",
     *           "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0"
     *         },
     *         "image_url": "https://avatars.slack-edge.com/2021-08-09/2372763167857_6f65d94928b0a0ac590b_192.jpg",
     *         "is_image_slack_icon": false,
     *         "label": "Lawrence Jones",
     *         "literal": "SEV123",
     *         "sort_key": "000020"
     *       }
     *     ],
     *     "value": {
     *       "catalog_entry": {
     *         "catalog_entry_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *         "catalog_entry_name": "Primary escalation",
     *         "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0"
     *       },
     *       "image_url": "https://avatars.slack-edge.com/2021-08-09/2372763167857_6f65d94928b0a0ac590b_192.jpg",
     *       "is_image_slack_icon": false,
     *       "label": "Lawrence Jones",
     *       "literal": "SEV123",
     *       "sort_key": "000020"
     *     }
     *   }
     * }
     */
    attribute_values: {
      [key: string]: definitions['CatalogAttributeBindingV2ResponseBody'];
    };
    /**
     * @description ID of this catalog type
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    catalog_type_id: string;
    /**
     * Format: date-time
     * @description When this entry was created
     * @example 2021-08-17T13:28:57.801578Z
     */
    created_at: string;
    /**
     * @description An optional alternative ID for this entry, which is ensured to be unique for the type
     * @example 761722cd-d1d7-477b-ac7e-90f9e079dc33
     */
    external_id?: string;
    /**
     * @description ID of this resource
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    id: string;
    /**
     * @description Name is the human readable name of this entry
     * @example Primary On-call
     */
    name: string;
    /**
     * Format: int32
     * @description When catalog type is ranked, this is used to help order things
     * @example 3
     */
    rank: number;
    /**
     * Format: date-time
     * @description When this entry was last updated
     * @example 2021-08-17T13:28:57.801578Z
     */
    updated_at: string;
  };
  /**
   * CatalogResourceV2ResponseBody
   * @example {
   *   "category": "custom",
   *   "description": "Boolean true or false value",
   *   "label": "GitHub Repository",
   *   "type": "CatalogEntry[\"01GVGYJSD39FRKVDWACK9NDS4E\"]",
   *   "value_docstring": "Either the GraphQL node ID of the repository or a string of <owner>/<repo>, e.g. incident-io/website"
   * }
   */
  CatalogResourceV2ResponseBody: {
    /**
     * @description Which category of resource
     * @example custom
     * @enum {string}
     */
    category: 'primitive' | 'custom' | 'external';
    /**
     * @description Human readable description for this resource
     * @example Boolean true or false value
     */
    description: string;
    /**
     * @description Label for this catalog resource type
     * @example GitHub Repository
     */
    label: string;
    /**
     * @description Catalog type name for this resource
     * @example CatalogEntry["01GVGYJSD39FRKVDWACK9NDS4E"]
     */
    type: string;
    /**
     * @description Documentation for the literal string value of this resource
     * @example Either the GraphQL node ID of the repository or a string of <owner>/<repo>, e.g. incident-io/website
     */
    value_docstring: string;
  } & {
    config: unknown;
  };
  /**
   * CatalogTypeAttributePayloadV2RequestBody
   * @example {
   *   "array": false,
   *   "id": "01GW2G3V0S59R238FAHPDS1R66",
   *   "name": "tier",
   *   "type": "Custom[\"Service\"]"
   * }
   */
  CatalogTypeAttributePayloadV2RequestBody: {
    /**
     * @description Whether this attribute is an array
     * @example false
     */
    array: boolean;
    /**
     * @description The ID of this attribute
     * @example 01GW2G3V0S59R238FAHPDS1R66
     */
    id?: string;
    /**
     * @description Unique name of this attribute
     * @example tier
     */
    name: string;
    /**
     * @description Catalog type name for this attribute
     * @example Custom["Service"]
     */
    type: string;
  };
  /**
   * CatalogTypeAttributeV2ResponseBody
   * @example {
   *   "array": false,
   *   "id": "01GW2G3V0S59R238FAHPDS1R66",
   *   "name": "tier",
   *   "type": "Custom[\"Service\"]"
   * }
   */
  CatalogTypeAttributeV2ResponseBody: {
    /**
     * @description Whether this attribute is an array
     * @example false
     */
    array: boolean;
    /**
     * @description The ID of this attribute
     * @example 01GW2G3V0S59R238FAHPDS1R66
     */
    id: string;
    /**
     * @description Unique name of this attribute
     * @example tier
     */
    name: string;
    /**
     * @description Catalog type name for this attribute
     * @example Custom["Service"]
     */
    type: string;
  };
  /**
   * CatalogTypeSchemaV2ResponseBody
   * @example {
   *   "attributes": [
   *     {
   *       "array": false,
   *       "id": "01GW2G3V0S59R238FAHPDS1R66",
   *       "name": "tier",
   *       "type": "Custom[\"Service\"]"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  CatalogTypeSchemaV2ResponseBody: {
    /**
     * @description Attributes of this catalog type
     * @example [
     *   {
     *     "array": false,
     *     "id": "01GW2G3V0S59R238FAHPDS1R66",
     *     "name": "tier",
     *     "type": "Custom[\"Service\"]"
     *   }
     * ]
     */
    attributes: definitions['CatalogTypeAttributeV2ResponseBody'][];
    /**
     * Format: int64
     * @description The version number of this schema
     * @example 1
     */
    version: number;
  };
  /**
   * CatalogTypeV2ResponseBody
   * @example {
   *   "annotations": {
   *     "incident.io/catalog-importer/id": "id-of-config"
   *   },
   *   "color": "slate",
   *   "created_at": "2021-08-17T13:28:57.801578Z",
   *   "description": "Represents Kubernetes clusters that we run inside of GKE.",
   *   "estimated_count": 7,
   *   "external_type": "PagerDutyService",
   *   "icon": "bolt",
   *   "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "is_editable": false,
   *   "name": "Kubernetes Cluster",
   *   "ranked": true,
   *   "required_integrations": [
   *     "pager_duty"
   *   ],
   *   "schema": {
   *     "attributes": [
   *       {
   *         "array": false,
   *         "id": "01GW2G3V0S59R238FAHPDS1R66",
   *         "name": "tier",
   *         "type": "Custom[\"Service\"]"
   *       }
   *     ],
   *     "version": 1
   *   },
   *   "semantic_type": "custom",
   *   "type_name": "Custom[\"BackstageGroup\"]",
   *   "updated_at": "2021-08-17T13:28:57.801578Z"
   * }
   */
  CatalogTypeV2ResponseBody: {
    /**
     * @description Annotations that can track metadata about this type
     * @example {
     *   "incident.io/catalog-importer/id": "id-of-config"
     * }
     */
    annotations: { [key: string]: string };
    /**
     * @description Sets the display color of this type in the dashboard
     * @example slate
     * @enum {string}
     */
    color: 'slate' | 'red' | 'yellow' | 'green' | 'blue' | 'violet';
    /**
     * Format: date-time
     * @description When this type was created
     * @example 2021-08-17T13:28:57.801578Z
     */
    created_at: string;
    /**
     * @description Human readble description of this type
     * @example Represents Kubernetes clusters that we run inside of GKE.
     */
    description: string;
    /**
     * Format: int64
     * @description If populated, gives an estimated count of entries for this type
     * @example 7
     */
    estimated_count?: number;
    /**
     * @description The external resource this type is synced from, if any
     * @example PagerDutyService
     */
    external_type?: string;
    /**
     * @description Sets the display icon of this type in the dashboard
     * @example bolt
     * @enum {string}
     */
    icon:
      | 'bolt'
      | 'box'
      | 'briefcase'
      | 'browser'
      | 'bulb'
      | 'clock'
      | 'cog'
      | 'database'
      | 'doc'
      | 'email'
      | 'server'
      | 'severity'
      | 'star'
      | 'tag'
      | 'user'
      | 'users';
    /**
     * @description ID of this resource
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    id: string;
    /**
     * @description Catalog types that are synced with external resources can't be edited
     * @example false
     */
    is_editable: boolean;
    /**
     * @description Name is the human readable name of this type
     * @example Kubernetes Cluster
     */
    name: string;
    /**
     * @description If this type should be ranked
     * @example true
     */
    ranked: boolean;
    /**
     * @description If populated, the integrations required for this type
     * @example [
     *   "pager_duty"
     * ]
     */
    required_integrations?: string[];
    schema: definitions['CatalogTypeSchemaV2ResponseBody'];
    /**
     * @description Semantic type of this resource
     * @example custom
     */
    semantic_type: string;
    /**
     * @description The type name of this catalog type, to be used when defining attributes. This is immutable once a CatalogType has been created. For non-externally sync types, it must follow the pattern Custom["SomeName "]
     * @example Custom["BackstageGroup"]
     */
    type_name: string;
    /**
     * Format: date-time
     * @description When this type was last updated
     * @example 2021-08-17T13:28:57.801578Z
     */
    updated_at: string;
  };
  /**
   * CatalogV2CreateEntryRequestBody
   * @example {
   *   "aliases": [
   *     "lawrence@incident.io",
   *     "lawrence"
   *   ],
   *   "attribute_values": {
   *     "abc123": {
   *       "array_value": [
   *         {
   *           "literal": "SEV123"
   *         }
   *       ],
   *       "value": {
   *         "literal": "SEV123"
   *       }
   *     }
   *   },
   *   "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "external_id": "761722cd-d1d7-477b-ac7e-90f9e079dc33",
   *   "name": "Primary On-call",
   *   "rank": 3
   * }
   */
  CatalogV2CreateEntryRequestBody: {
    /**
     * @description Optional aliases that can be used to reference this entry
     * @example [
     *   "lawrence@incident.io",
     *   "lawrence"
     * ]
     */
    aliases?: string[];
    /**
     * @description Values of this entry
     * @example {
     *   "abc123": {
     *     "array_value": [
     *       {
     *         "literal": "SEV123"
     *       }
     *     ],
     *     "value": {
     *       "literal": "SEV123"
     *     }
     *   }
     * }
     */
    attribute_values: {
      [key: string]: definitions['CatalogAttributeBindingPayloadV2RequestBody'];
    };
    /**
     * @description ID of this catalog type
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    catalog_type_id: string;
    /**
     * @description An optional alternative ID for this entry, which is ensured to be unique for the type
     * @example 761722cd-d1d7-477b-ac7e-90f9e079dc33
     */
    external_id?: string;
    /**
     * @description Name is the human readable name of this entry
     * @example Primary On-call
     */
    name: string;
    /**
     * Format: int32
     * @description When catalog type is ranked, this is used to help order things
     * @example 3
     */
    rank?: number;
  };
  /**
   * CatalogV2CreateEntryResponseBody
   * @example {
   *   "catalog_entry": {
   *     "aliases": [
   *       "lawrence@incident.io",
   *       "lawrence"
   *     ],
   *     "attribute_values": {
   *       "abc123": {
   *         "array_value": [
   *           {
   *             "catalog_entry": {
   *               "catalog_entry_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "catalog_entry_name": "Primary escalation",
   *               "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0"
   *             },
   *             "image_url": "https://avatars.slack-edge.com/2021-08-09/2372763167857_6f65d94928b0a0ac590b_192.jpg",
   *             "is_image_slack_icon": false,
   *             "label": "Lawrence Jones",
   *             "literal": "SEV123",
   *             "sort_key": "000020"
   *           }
   *         ],
   *         "value": {
   *           "catalog_entry": {
   *             "catalog_entry_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *             "catalog_entry_name": "Primary escalation",
   *             "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0"
   *           },
   *           "image_url": "https://avatars.slack-edge.com/2021-08-09/2372763167857_6f65d94928b0a0ac590b_192.jpg",
   *           "is_image_slack_icon": false,
   *           "label": "Lawrence Jones",
   *           "literal": "SEV123",
   *           "sort_key": "000020"
   *         }
   *       }
   *     },
   *     "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "external_id": "761722cd-d1d7-477b-ac7e-90f9e079dc33",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "name": "Primary On-call",
   *     "rank": 3,
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  CatalogV2CreateEntryResponseBody: {
    catalog_entry: definitions['CatalogEntryV2ResponseBody'];
  };
  /**
   * CatalogV2CreateTypeRequestBody
   * @example {
   *   "annotations": {
   *     "incident.io/catalog-importer/id": "id-of-config"
   *   },
   *   "color": "slate",
   *   "description": "Represents Kubernetes clusters that we run inside of GKE.",
   *   "icon": "bolt",
   *   "name": "Kubernetes Cluster",
   *   "ranked": true,
   *   "semantic_type": "custom",
   *   "type_name": "Custom[\"BackstageGroup\"]"
   * }
   */
  CatalogV2CreateTypeRequestBody: {
    /**
     * @description Annotations that can track metadata about this type
     * @example {
     *   "incident.io/catalog-importer/id": "id-of-config"
     * }
     */
    annotations?: { [key: string]: string };
    /**
     * @description Sets the display color of this type in the dashboard
     * @example slate
     * @enum {string}
     */
    color?: 'slate' | 'red' | 'yellow' | 'green' | 'blue' | 'violet';
    /**
     * @description Human readble description of this type
     * @example Represents Kubernetes clusters that we run inside of GKE.
     */
    description: string;
    /**
     * @description Sets the display icon of this type in the dashboard
     * @example bolt
     * @enum {string}
     */
    icon?:
      | 'bolt'
      | 'box'
      | 'briefcase'
      | 'browser'
      | 'bulb'
      | 'clock'
      | 'cog'
      | 'database'
      | 'doc'
      | 'email'
      | 'server'
      | 'severity'
      | 'star'
      | 'tag'
      | 'user'
      | 'users';
    /**
     * @description Name is the human readable name of this type
     * @example Kubernetes Cluster
     */
    name: string;
    /**
     * @description If this type should be ranked
     * @example true
     */
    ranked?: boolean;
    /**
     * @description Semantic type of this resource
     * @example custom
     */
    semantic_type?: string;
    /**
     * @description The type name of this catalog type, to be used when defining attributes. This is immutable once a CatalogType has been created. For non-externally sync types, it must follow the pattern Custom["SomeName "]
     * @example Custom["BackstageGroup"]
     */
    type_name?: string;
  };
  /**
   * CatalogV2CreateTypeResponseBody
   * @example {
   *   "catalog_type": {
   *     "annotations": {
   *       "incident.io/catalog-importer/id": "id-of-config"
   *     },
   *     "color": "slate",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Represents Kubernetes clusters that we run inside of GKE.",
   *     "estimated_count": 7,
   *     "external_type": "PagerDutyService",
   *     "icon": "bolt",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "is_editable": false,
   *     "name": "Kubernetes Cluster",
   *     "ranked": true,
   *     "required_integrations": [
   *       "pager_duty"
   *     ],
   *     "schema": {
   *       "attributes": [
   *         {
   *           "array": false,
   *           "id": "01GW2G3V0S59R238FAHPDS1R66",
   *           "name": "tier",
   *           "type": "Custom[\"Service\"]"
   *         }
   *       ],
   *       "version": 1
   *     },
   *     "semantic_type": "custom",
   *     "type_name": "Custom[\"BackstageGroup\"]",
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  CatalogV2CreateTypeResponseBody: {
    catalog_type: definitions['CatalogTypeV2ResponseBody'];
  };
  /**
   * CatalogV2ListEntriesResponseBody
   * @example {
   *   "catalog_entries": [
   *     {
   *       "aliases": [
   *         "lawrence@incident.io",
   *         "lawrence"
   *       ],
   *       "attribute_values": {
   *         "abc123": {
   *           "array_value": [
   *             {
   *               "catalog_entry": {
   *                 "catalog_entry_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *                 "catalog_entry_name": "Primary escalation",
   *                 "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0"
   *               },
   *               "image_url": "https://avatars.slack-edge.com/2021-08-09/2372763167857_6f65d94928b0a0ac590b_192.jpg",
   *               "is_image_slack_icon": false,
   *               "label": "Lawrence Jones",
   *               "literal": "SEV123",
   *               "sort_key": "000020"
   *             }
   *           ],
   *           "value": {
   *             "catalog_entry": {
   *               "catalog_entry_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "catalog_entry_name": "Primary escalation",
   *               "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0"
   *             },
   *             "image_url": "https://avatars.slack-edge.com/2021-08-09/2372763167857_6f65d94928b0a0ac590b_192.jpg",
   *             "is_image_slack_icon": false,
   *             "label": "Lawrence Jones",
   *             "literal": "SEV123",
   *             "sort_key": "000020"
   *           }
   *         }
   *       },
   *       "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "external_id": "761722cd-d1d7-477b-ac7e-90f9e079dc33",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Primary On-call",
   *       "rank": 3,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     }
   *   ],
   *   "catalog_type": {
   *     "annotations": {
   *       "incident.io/catalog-importer/id": "id-of-config"
   *     },
   *     "color": "slate",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Represents Kubernetes clusters that we run inside of GKE.",
   *     "estimated_count": 7,
   *     "external_type": "PagerDutyService",
   *     "icon": "bolt",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "is_editable": false,
   *     "name": "Kubernetes Cluster",
   *     "ranked": true,
   *     "required_integrations": [
   *       "pager_duty"
   *     ],
   *     "schema": {
   *       "attributes": [
   *         {
   *           "array": false,
   *           "id": "01GW2G3V0S59R238FAHPDS1R66",
   *           "name": "tier",
   *           "type": "Custom[\"Service\"]"
   *         }
   *       ],
   *       "version": 1
   *     },
   *     "semantic_type": "custom",
   *     "type_name": "Custom[\"BackstageGroup\"]",
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   },
   *   "pagination_meta": {
   *     "after": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "page_size": 25
   *   }
   * }
   */
  CatalogV2ListEntriesResponseBody: {
    /**
     * @example [
     *   {
     *     "aliases": [
     *       "lawrence@incident.io",
     *       "lawrence"
     *     ],
     *     "attribute_values": {
     *       "abc123": {
     *         "array_value": [
     *           {
     *             "catalog_entry": {
     *               "catalog_entry_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *               "catalog_entry_name": "Primary escalation",
     *               "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0"
     *             },
     *             "image_url": "https://avatars.slack-edge.com/2021-08-09/2372763167857_6f65d94928b0a0ac590b_192.jpg",
     *             "is_image_slack_icon": false,
     *             "label": "Lawrence Jones",
     *             "literal": "SEV123",
     *             "sort_key": "000020"
     *           }
     *         ],
     *         "value": {
     *           "catalog_entry": {
     *             "catalog_entry_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *             "catalog_entry_name": "Primary escalation",
     *             "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0"
     *           },
     *           "image_url": "https://avatars.slack-edge.com/2021-08-09/2372763167857_6f65d94928b0a0ac590b_192.jpg",
     *           "is_image_slack_icon": false,
     *           "label": "Lawrence Jones",
     *           "literal": "SEV123",
     *           "sort_key": "000020"
     *         }
     *       }
     *     },
     *     "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "created_at": "2021-08-17T13:28:57.801578Z",
     *     "external_id": "761722cd-d1d7-477b-ac7e-90f9e079dc33",
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Primary On-call",
     *     "rank": 3,
     *     "updated_at": "2021-08-17T13:28:57.801578Z"
     *   }
     * ]
     */
    catalog_entries: definitions['CatalogEntryV2ResponseBody'][];
    catalog_type: definitions['CatalogTypeV2ResponseBody'];
    pagination_meta: definitions['PaginationMetaResultResponseBody'];
  };
  /**
   * CatalogV2ListResourcesResponseBody
   * @example {
   *   "resources": [
   *     {
   *       "category": "custom",
   *       "description": "Boolean true or false value",
   *       "label": "GitHub Repository",
   *       "type": "CatalogEntry[\"01GVGYJSD39FRKVDWACK9NDS4E\"]",
   *       "value_docstring": "Either the GraphQL node ID of the repository or a string of <owner>/<repo>, e.g. incident-io/website"
   *     }
   *   ]
   * }
   */
  CatalogV2ListResourcesResponseBody: {
    /**
     * @example [
     *   {
     *     "category": "custom",
     *     "description": "Boolean true or false value",
     *     "label": "GitHub Repository",
     *     "type": "CatalogEntry[\"01GVGYJSD39FRKVDWACK9NDS4E\"]",
     *     "value_docstring": "Either the GraphQL node ID of the repository or a string of <owner>/<repo>, e.g. incident-io/website"
     *   }
     * ]
     */
    resources: definitions['CatalogResourceV2ResponseBody'][];
  };
  /**
   * CatalogV2ListTypesResponseBody
   * @example {
   *   "catalog_types": [
   *     {
   *       "annotations": {
   *         "incident.io/catalog-importer/id": "id-of-config"
   *       },
   *       "color": "slate",
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Represents Kubernetes clusters that we run inside of GKE.",
   *       "estimated_count": 7,
   *       "external_type": "PagerDutyService",
   *       "icon": "bolt",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "is_editable": false,
   *       "name": "Kubernetes Cluster",
   *       "ranked": true,
   *       "required_integrations": [
   *         "pager_duty"
   *       ],
   *       "schema": {
   *         "attributes": [
   *           {
   *             "array": false,
   *             "id": "01GW2G3V0S59R238FAHPDS1R66",
   *             "name": "tier",
   *             "type": "Custom[\"Service\"]"
   *           }
   *         ],
   *         "version": 1
   *       },
   *       "semantic_type": "custom",
   *       "type_name": "Custom[\"BackstageGroup\"]",
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     }
   *   ]
   * }
   */
  CatalogV2ListTypesResponseBody: {
    /**
     * @example [
     *   {
     *     "annotations": {
     *       "incident.io/catalog-importer/id": "id-of-config"
     *     },
     *     "color": "slate",
     *     "created_at": "2021-08-17T13:28:57.801578Z",
     *     "description": "Represents Kubernetes clusters that we run inside of GKE.",
     *     "estimated_count": 7,
     *     "external_type": "PagerDutyService",
     *     "icon": "bolt",
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "is_editable": false,
     *     "name": "Kubernetes Cluster",
     *     "ranked": true,
     *     "required_integrations": [
     *       "pager_duty"
     *     ],
     *     "schema": {
     *       "attributes": [
     *         {
     *           "array": false,
     *           "id": "01GW2G3V0S59R238FAHPDS1R66",
     *           "name": "tier",
     *           "type": "Custom[\"Service\"]"
     *         }
     *       ],
     *       "version": 1
     *     },
     *     "semantic_type": "custom",
     *     "type_name": "Custom[\"BackstageGroup\"]",
     *     "updated_at": "2021-08-17T13:28:57.801578Z"
     *   }
     * ]
     */
    catalog_types: definitions['CatalogTypeV2ResponseBody'][];
  };
  /**
   * CatalogV2ShowEntryResponseBody
   * @example {
   *   "catalog_entry": {
   *     "aliases": [
   *       "lawrence@incident.io",
   *       "lawrence"
   *     ],
   *     "attribute_values": {
   *       "abc123": {
   *         "array_value": [
   *           {
   *             "catalog_entry": {
   *               "catalog_entry_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "catalog_entry_name": "Primary escalation",
   *               "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0"
   *             },
   *             "image_url": "https://avatars.slack-edge.com/2021-08-09/2372763167857_6f65d94928b0a0ac590b_192.jpg",
   *             "is_image_slack_icon": false,
   *             "label": "Lawrence Jones",
   *             "literal": "SEV123",
   *             "sort_key": "000020"
   *           }
   *         ],
   *         "value": {
   *           "catalog_entry": {
   *             "catalog_entry_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *             "catalog_entry_name": "Primary escalation",
   *             "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0"
   *           },
   *           "image_url": "https://avatars.slack-edge.com/2021-08-09/2372763167857_6f65d94928b0a0ac590b_192.jpg",
   *           "is_image_slack_icon": false,
   *           "label": "Lawrence Jones",
   *           "literal": "SEV123",
   *           "sort_key": "000020"
   *         }
   *       }
   *     },
   *     "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "external_id": "761722cd-d1d7-477b-ac7e-90f9e079dc33",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "name": "Primary On-call",
   *     "rank": 3,
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   },
   *   "catalog_type": {
   *     "annotations": {
   *       "incident.io/catalog-importer/id": "id-of-config"
   *     },
   *     "color": "slate",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Represents Kubernetes clusters that we run inside of GKE.",
   *     "estimated_count": 7,
   *     "external_type": "PagerDutyService",
   *     "icon": "bolt",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "is_editable": false,
   *     "name": "Kubernetes Cluster",
   *     "ranked": true,
   *     "required_integrations": [
   *       "pager_duty"
   *     ],
   *     "schema": {
   *       "attributes": [
   *         {
   *           "array": false,
   *           "id": "01GW2G3V0S59R238FAHPDS1R66",
   *           "name": "tier",
   *           "type": "Custom[\"Service\"]"
   *         }
   *       ],
   *       "version": 1
   *     },
   *     "semantic_type": "custom",
   *     "type_name": "Custom[\"BackstageGroup\"]",
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  CatalogV2ShowEntryResponseBody: {
    catalog_entry: definitions['CatalogEntryV2ResponseBody'];
    catalog_type: definitions['CatalogTypeV2ResponseBody'];
  };
  /**
   * CatalogV2ShowTypeResponseBody
   * @example {
   *   "catalog_type": {
   *     "annotations": {
   *       "incident.io/catalog-importer/id": "id-of-config"
   *     },
   *     "color": "slate",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Represents Kubernetes clusters that we run inside of GKE.",
   *     "estimated_count": 7,
   *     "external_type": "PagerDutyService",
   *     "icon": "bolt",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "is_editable": false,
   *     "name": "Kubernetes Cluster",
   *     "ranked": true,
   *     "required_integrations": [
   *       "pager_duty"
   *     ],
   *     "schema": {
   *       "attributes": [
   *         {
   *           "array": false,
   *           "id": "01GW2G3V0S59R238FAHPDS1R66",
   *           "name": "tier",
   *           "type": "Custom[\"Service\"]"
   *         }
   *       ],
   *       "version": 1
   *     },
   *     "semantic_type": "custom",
   *     "type_name": "Custom[\"BackstageGroup\"]",
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  CatalogV2ShowTypeResponseBody: {
    catalog_type: definitions['CatalogTypeV2ResponseBody'];
  };
  /**
   * CatalogV2UpdateEntryRequestBody
   * @example {
   *   "aliases": [
   *     "lawrence@incident.io",
   *     "lawrence"
   *   ],
   *   "attribute_values": {
   *     "abc123": {
   *       "array_value": [
   *         {
   *           "literal": "SEV123"
   *         }
   *       ],
   *       "value": {
   *         "literal": "SEV123"
   *       }
   *     }
   *   },
   *   "external_id": "761722cd-d1d7-477b-ac7e-90f9e079dc33",
   *   "name": "Primary On-call",
   *   "rank": 3
   * }
   */
  CatalogV2UpdateEntryRequestBody: {
    /**
     * @description Optional aliases that can be used to reference this entry
     * @example [
     *   "lawrence@incident.io",
     *   "lawrence"
     * ]
     */
    aliases?: string[];
    /**
     * @description Values of this entry
     * @example {
     *   "abc123": {
     *     "array_value": [
     *       {
     *         "literal": "SEV123"
     *       }
     *     ],
     *     "value": {
     *       "literal": "SEV123"
     *     }
     *   }
     * }
     */
    attribute_values: {
      [key: string]: definitions['CatalogAttributeBindingPayloadV2RequestBody'];
    };
    /**
     * @description An optional alternative ID for this entry, which is ensured to be unique for the type
     * @example 761722cd-d1d7-477b-ac7e-90f9e079dc33
     */
    external_id?: string;
    /**
     * @description Name is the human readable name of this entry
     * @example Primary On-call
     */
    name: string;
    /**
     * Format: int32
     * @description When catalog type is ranked, this is used to help order things
     * @example 3
     */
    rank?: number;
  };
  /**
   * CatalogV2UpdateEntryResponseBody
   * @example {
   *   "catalog_entry": {
   *     "aliases": [
   *       "lawrence@incident.io",
   *       "lawrence"
   *     ],
   *     "attribute_values": {
   *       "abc123": {
   *         "array_value": [
   *           {
   *             "catalog_entry": {
   *               "catalog_entry_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "catalog_entry_name": "Primary escalation",
   *               "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0"
   *             },
   *             "image_url": "https://avatars.slack-edge.com/2021-08-09/2372763167857_6f65d94928b0a0ac590b_192.jpg",
   *             "is_image_slack_icon": false,
   *             "label": "Lawrence Jones",
   *             "literal": "SEV123",
   *             "sort_key": "000020"
   *           }
   *         ],
   *         "value": {
   *           "catalog_entry": {
   *             "catalog_entry_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *             "catalog_entry_name": "Primary escalation",
   *             "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0"
   *           },
   *           "image_url": "https://avatars.slack-edge.com/2021-08-09/2372763167857_6f65d94928b0a0ac590b_192.jpg",
   *           "is_image_slack_icon": false,
   *           "label": "Lawrence Jones",
   *           "literal": "SEV123",
   *           "sort_key": "000020"
   *         }
   *       }
   *     },
   *     "catalog_type_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "external_id": "761722cd-d1d7-477b-ac7e-90f9e079dc33",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "name": "Primary On-call",
   *     "rank": 3,
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   },
   *   "catalog_type": {
   *     "annotations": {
   *       "incident.io/catalog-importer/id": "id-of-config"
   *     },
   *     "color": "slate",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Represents Kubernetes clusters that we run inside of GKE.",
   *     "estimated_count": 7,
   *     "external_type": "PagerDutyService",
   *     "icon": "bolt",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "is_editable": false,
   *     "name": "Kubernetes Cluster",
   *     "ranked": true,
   *     "required_integrations": [
   *       "pager_duty"
   *     ],
   *     "schema": {
   *       "attributes": [
   *         {
   *           "array": false,
   *           "id": "01GW2G3V0S59R238FAHPDS1R66",
   *           "name": "tier",
   *           "type": "Custom[\"Service\"]"
   *         }
   *       ],
   *       "version": 1
   *     },
   *     "semantic_type": "custom",
   *     "type_name": "Custom[\"BackstageGroup\"]",
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  CatalogV2UpdateEntryResponseBody: {
    catalog_entry: definitions['CatalogEntryV2ResponseBody'];
    catalog_type: definitions['CatalogTypeV2ResponseBody'];
  };
  /**
   * CatalogV2UpdateTypeRequestBody
   * @example {
   *   "annotations": {
   *     "incident.io/catalog-importer/id": "id-of-config"
   *   },
   *   "color": "slate",
   *   "description": "Represents Kubernetes clusters that we run inside of GKE.",
   *   "icon": "bolt",
   *   "name": "Kubernetes Cluster",
   *   "ranked": true,
   *   "semantic_type": "custom"
   * }
   */
  CatalogV2UpdateTypeRequestBody: {
    /**
     * @description Annotations that can track metadata about this type
     * @example {
     *   "incident.io/catalog-importer/id": "id-of-config"
     * }
     */
    annotations?: { [key: string]: string };
    /**
     * @description Sets the display color of this type in the dashboard
     * @example slate
     * @enum {string}
     */
    color?: 'slate' | 'red' | 'yellow' | 'green' | 'blue' | 'violet';
    /**
     * @description Human readble description of this type
     * @example Represents Kubernetes clusters that we run inside of GKE.
     */
    description: string;
    /**
     * @description Sets the display icon of this type in the dashboard
     * @example bolt
     * @enum {string}
     */
    icon?:
      | 'bolt'
      | 'box'
      | 'briefcase'
      | 'browser'
      | 'bulb'
      | 'clock'
      | 'cog'
      | 'database'
      | 'doc'
      | 'email'
      | 'server'
      | 'severity'
      | 'star'
      | 'tag'
      | 'user'
      | 'users';
    /**
     * @description Name is the human readable name of this type
     * @example Kubernetes Cluster
     */
    name: string;
    /**
     * @description If this type should be ranked
     * @example true
     */
    ranked?: boolean;
    /**
     * @description Semantic type of this resource
     * @example custom
     */
    semantic_type?: string;
  };
  /**
   * CatalogV2UpdateTypeResponseBody
   * @example {
   *   "catalog_type": {
   *     "annotations": {
   *       "incident.io/catalog-importer/id": "id-of-config"
   *     },
   *     "color": "slate",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Represents Kubernetes clusters that we run inside of GKE.",
   *     "estimated_count": 7,
   *     "external_type": "PagerDutyService",
   *     "icon": "bolt",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "is_editable": false,
   *     "name": "Kubernetes Cluster",
   *     "ranked": true,
   *     "required_integrations": [
   *       "pager_duty"
   *     ],
   *     "schema": {
   *       "attributes": [
   *         {
   *           "array": false,
   *           "id": "01GW2G3V0S59R238FAHPDS1R66",
   *           "name": "tier",
   *           "type": "Custom[\"Service\"]"
   *         }
   *       ],
   *       "version": 1
   *     },
   *     "semantic_type": "custom",
   *     "type_name": "Custom[\"BackstageGroup\"]",
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  CatalogV2UpdateTypeResponseBody: {
    catalog_type: definitions['CatalogTypeV2ResponseBody'];
  };
  /**
   * CatalogV2UpdateTypeSchemaRequestBody
   * @example {
   *   "attributes": [
   *     {
   *       "array": false,
   *       "id": "01GW2G3V0S59R238FAHPDS1R66",
   *       "name": "tier",
   *       "type": "Custom[\"Service\"]"
   *     }
   *   ],
   *   "version": 1
   * }
   */
  CatalogV2UpdateTypeSchemaRequestBody: {
    /**
     * @example [
     *   {
     *     "array": false,
     *     "id": "01GW2G3V0S59R238FAHPDS1R66",
     *     "name": "tier",
     *     "type": "Custom[\"Service\"]"
     *   }
     * ]
     */
    attributes: definitions['CatalogTypeAttributePayloadV2RequestBody'][];
    /**
     * Format: int64
     * @example 1
     */
    version: number;
  } & {
    name: unknown;
    description: unknown;
    type_name: unknown;
    semantic_type: unknown;
    ranked: unknown;
    schema: unknown;
    icon: unknown;
    color: unknown;
    is_editable: unknown;
    annotations: unknown;
    created_at: unknown;
    updated_at: unknown;
  };
  /**
   * CatalogV2UpdateTypeSchemaResponseBody
   * @example {
   *   "catalog_type": {
   *     "annotations": {
   *       "incident.io/catalog-importer/id": "id-of-config"
   *     },
   *     "color": "slate",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Represents Kubernetes clusters that we run inside of GKE.",
   *     "estimated_count": 7,
   *     "external_type": "PagerDutyService",
   *     "icon": "bolt",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "is_editable": false,
   *     "name": "Kubernetes Cluster",
   *     "ranked": true,
   *     "required_integrations": [
   *       "pager_duty"
   *     ],
   *     "schema": {
   *       "attributes": [
   *         {
   *           "array": false,
   *           "id": "01GW2G3V0S59R238FAHPDS1R66",
   *           "name": "tier",
   *           "type": "Custom[\"Service\"]"
   *         }
   *       ],
   *       "version": 1
   *     },
   *     "semantic_type": "custom",
   *     "type_name": "Custom[\"BackstageGroup\"]",
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  CatalogV2UpdateTypeSchemaResponseBody: {
    catalog_type: definitions['CatalogTypeV2ResponseBody'];
  };
  /**
   * CustomFieldEntryPayloadV1RequestBody
   * @example {
   *   "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "values": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "value_link": "https://google.com/",
   *       "value_numeric": "123.456",
   *       "value_option_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "value_text": "This is my text field, I hope you like it",
   *       "value_timestamp": ""
   *     }
   *   ]
   * }
   */
  CustomFieldEntryPayloadV1RequestBody: {
    /**
     * @description ID of the custom field this entry is linked against
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    custom_field_id: string;
    /**
     * @description List of values to associate with this entry
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "value_link": "https://google.com/",
     *     "value_numeric": "123.456",
     *     "value_option_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "value_text": "This is my text field, I hope you like it",
     *     "value_timestamp": ""
     *   }
     * ]
     */
    values: definitions['CustomFieldValuePayloadV1RequestBody'][];
  };
  /**
   * CustomFieldEntryPayloadV2RequestBody
   * @example {
   *   "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "values": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "value_link": "https://google.com/",
   *       "value_numeric": "123.456",
   *       "value_option_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "value_text": "This is my text field, I hope you like it",
   *       "value_timestamp": ""
   *     }
   *   ]
   * }
   */
  CustomFieldEntryPayloadV2RequestBody: {
    /**
     * @description ID of the custom field this entry is linked against
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    custom_field_id: string;
    /**
     * @description List of values to associate with this entry
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "value_link": "https://google.com/",
     *     "value_numeric": "123.456",
     *     "value_option_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "value_text": "This is my text field, I hope you like it",
     *     "value_timestamp": ""
     *   }
     * ]
     */
    values: definitions['CustomFieldValuePayloadV2RequestBody'][];
  };
  /**
   * CustomFieldEntryV1ResponseBody
   * @example {
   *   "custom_field": {
   *     "description": "Which team is impacted by this issue",
   *     "field_type": "single_select",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "name": "Affected Team",
   *     "options": [
   *       {
   *         "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "sort_key": 10,
   *         "value": "Product"
   *       }
   *     ]
   *   },
   *   "values": [
   *     {
   *       "value_link": "https://google.com/",
   *       "value_numeric": "123.456",
   *       "value_option": {
   *         "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "sort_key": 10,
   *         "value": "Product"
   *       },
   *       "value_text": "This is my text field, I hope you like it"
   *     }
   *   ]
   * }
   */
  CustomFieldEntryV1ResponseBody: {
    custom_field: definitions['CustomFieldTypeInfoV1ResponseBody'];
    /**
     * @description List of custom field values set on this entry
     * @example [
     *   {
     *     "value_link": "https://google.com/",
     *     "value_numeric": "123.456",
     *     "value_option": {
     *       "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *       "sort_key": 10,
     *       "value": "Product"
     *     },
     *     "value_text": "This is my text field, I hope you like it"
     *   }
     * ]
     */
    values: definitions['CustomFieldValueV1ResponseBody'][];
  };
  /**
   * CustomFieldEntryV2ResponseBody
   * @example {
   *   "custom_field": {
   *     "description": "Which team is impacted by this issue",
   *     "field_type": "single_select",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "name": "Affected Team",
   *     "options": [
   *       {
   *         "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "sort_key": 10,
   *         "value": "Product"
   *       }
   *     ]
   *   },
   *   "values": [
   *     {
   *       "value_link": "https://google.com/",
   *       "value_numeric": "123.456",
   *       "value_option": {
   *         "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "sort_key": 10,
   *         "value": "Product"
   *       },
   *       "value_text": "This is my text field, I hope you like it"
   *     }
   *   ]
   * }
   */
  CustomFieldEntryV2ResponseBody: {
    custom_field: definitions['CustomFieldTypeInfoV2ResponseBody'];
    /**
     * @description List of custom field values set on this entry
     * @example [
     *   {
     *     "value_link": "https://google.com/",
     *     "value_numeric": "123.456",
     *     "value_option": {
     *       "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *       "sort_key": 10,
     *       "value": "Product"
     *     },
     *     "value_text": "This is my text field, I hope you like it"
     *   }
     * ]
     */
    values: definitions['CustomFieldValueV2ResponseBody'][];
  };
  /**
   * CustomFieldOptionV1ResponseBody
   * @example {
   *   "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "sort_key": 10,
   *   "value": "Product"
   * }
   */
  CustomFieldOptionV1ResponseBody: {
    /**
     * @description ID of the custom field this option belongs to
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    custom_field_id: string;
    /**
     * @description Unique identifier for the custom field option
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    id: string;
    /**
     * Format: int64
     * @description Sort key used to order the custom field options correctly
     * @default 1000
     * @example 10
     */
    sort_key: number;
    /**
     * @description Human readable name for the custom field option
     * @example Product
     */
    value: string;
  };
  /**
   * CustomFieldOptionV2ResponseBody
   * @example {
   *   "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "sort_key": 10,
   *   "value": "Product"
   * }
   */
  CustomFieldOptionV2ResponseBody: {
    /**
     * @description ID of the custom field this option belongs to
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    custom_field_id: string;
    /**
     * @description Unique identifier for the custom field option
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    id: string;
    /**
     * Format: int64
     * @description Sort key used to order the custom field options correctly
     * @default 1000
     * @example 10
     */
    sort_key: number;
    /**
     * @description Human readable name for the custom field option
     * @example Product
     */
    value: string;
  };
  /**
   * CustomFieldOptionsV1CreateRequestBody
   * @example {
   *   "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "sort_key": 10,
   *   "value": "Product"
   * }
   */
  CustomFieldOptionsV1CreateRequestBody: {
    /**
     * @description ID of the custom field this option belongs to
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    custom_field_id: string;
    /**
     * Format: int64
     * @description Sort key used to order the custom field options correctly
     * @default 1000
     * @example 10
     */
    sort_key?: number;
    /**
     * @description Human readable name for the custom field option
     * @example Product
     */
    value: string;
  };
  /**
   * CustomFieldOptionsV1CreateResponseBody
   * @example {
   *   "custom_field_option": {
   *     "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "sort_key": 10,
   *     "value": "Product"
   *   }
   * }
   */
  CustomFieldOptionsV1CreateResponseBody: {
    custom_field_option: definitions['CustomFieldOptionV1ResponseBody'];
  };
  /**
   * CustomFieldOptionsV1ListResponseBody
   * @example {
   *   "custom_field_options": [
   *     {
   *       "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "sort_key": 10,
   *       "value": "Product"
   *     }
   *   ]
   * }
   */
  CustomFieldOptionsV1ListResponseBody: {
    /**
     * @example [
     *   {
     *     "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "sort_key": 10,
     *     "value": "Product"
     *   }
     * ]
     */
    custom_field_options: definitions['CustomFieldOptionV1ResponseBody'][];
  };
  /**
   * CustomFieldOptionsV1ShowResponseBody
   * @example {
   *   "custom_field_option": {
   *     "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "sort_key": 10,
   *     "value": "Product"
   *   }
   * }
   */
  CustomFieldOptionsV1ShowResponseBody: {
    custom_field_option: definitions['CustomFieldOptionV1ResponseBody'];
  };
  /**
   * CustomFieldOptionsV1UpdateRequestBody
   * @example {
   *   "sort_key": 10,
   *   "value": "Product"
   * }
   */
  CustomFieldOptionsV1UpdateRequestBody: {
    /**
     * Format: int64
     * @description Sort key used to order the custom field options correctly
     * @default 1000
     * @example 10
     */
    sort_key: number;
    /**
     * @description Human readable name for the custom field option
     * @example Product
     */
    value: string;
  } & {
    custom_field_id: unknown;
  };
  /**
   * CustomFieldOptionsV1UpdateResponseBody
   * @example {
   *   "custom_field_option": {
   *     "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "sort_key": 10,
   *     "value": "Product"
   *   }
   * }
   */
  CustomFieldOptionsV1UpdateResponseBody: {
    custom_field_option: definitions['CustomFieldOptionV1ResponseBody'];
  };
  /**
   * CustomFieldTypeInfoV1ResponseBody
   * @example {
   *   "description": "Which team is impacted by this issue",
   *   "field_type": "single_select",
   *   "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "name": "Affected Team",
   *   "options": [
   *     {
   *       "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "sort_key": 10,
   *       "value": "Product"
   *     }
   *   ]
   * }
   */
  CustomFieldTypeInfoV1ResponseBody: {
    /**
     * @description Description of the custom field
     * @example Which team is impacted by this issue
     */
    description: string;
    /**
     * @description Type of custom field
     * @example single_select
     * @enum {string}
     */
    field_type: 'single_select' | 'multi_select' | 'text' | 'link' | 'numeric';
    /**
     * @description Unique identifier for the custom field
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    id: string;
    /**
     * @description Human readable name for the custom field
     * @example Affected Team
     */
    name: string;
    /**
     * @description What options are available for this custom field, if this field has options
     * @example [
     *   {
     *     "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "sort_key": 10,
     *     "value": "Product"
     *   }
     * ]
     */
    options: definitions['CustomFieldOptionV1ResponseBody'][];
  } & {
    organisation_id: unknown;
    dynamic_options: unknown;
    rank: unknown;
    required: unknown;
    show_before_creation: unknown;
    show_before_closure: unknown;
    show_before_update: unknown;
    is_usable: unknown;
    conditions: unknown;
    created_at: unknown;
    updated_at: unknown;
  };
  /**
   * CustomFieldTypeInfoV2ResponseBody
   * @example {
   *   "description": "Which team is impacted by this issue",
   *   "field_type": "single_select",
   *   "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "name": "Affected Team",
   *   "options": [
   *     {
   *       "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "sort_key": 10,
   *       "value": "Product"
   *     }
   *   ]
   * }
   */
  CustomFieldTypeInfoV2ResponseBody: {
    /**
     * @description Description of the custom field
     * @example Which team is impacted by this issue
     */
    description: string;
    /**
     * @description Type of custom field
     * @example single_select
     * @enum {string}
     */
    field_type: 'single_select' | 'multi_select' | 'text' | 'link' | 'numeric';
    /**
     * @description Unique identifier for the custom field
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    id: string;
    /**
     * @description Human readable name for the custom field
     * @example Affected Team
     */
    name: string;
    /**
     * @description What options are available for this custom field, if this field has options
     * @example [
     *   {
     *     "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "sort_key": 10,
     *     "value": "Product"
     *   }
     * ]
     */
    options: definitions['CustomFieldOptionV2ResponseBody'][];
  } & {
    organisation_id: unknown;
    dynamic_options: unknown;
    rank: unknown;
    required: unknown;
    show_before_creation: unknown;
    show_before_closure: unknown;
    show_before_update: unknown;
    is_usable: unknown;
    conditions: unknown;
    created_at: unknown;
    updated_at: unknown;
  };
  /**
   * CustomFieldV1ResponseBody
   * @example {
   *   "created_at": "2021-08-17T13:28:57.801578Z",
   *   "description": "Which team is impacted by this issue",
   *   "field_type": "single_select",
   *   "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "name": "Affected Team",
   *   "options": [
   *     {
   *       "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "sort_key": 10,
   *       "value": "Product"
   *     }
   *   ],
   *   "required": "never",
   *   "show_before_closure": true,
   *   "show_before_creation": true,
   *   "show_before_update": true,
   *   "show_in_announcement_post": true,
   *   "updated_at": "2021-08-17T13:28:57.801578Z"
   * }
   */
  CustomFieldV1ResponseBody: {
    /**
     * Format: date-time
     * @description When the action was created
     * @example 2021-08-17T13:28:57.801578Z
     */
    created_at: string;
    /**
     * @description Description of the custom field
     * @example Which team is impacted by this issue
     */
    description: string;
    /**
     * @description Type of custom field
     * @example single_select
     * @enum {string}
     */
    field_type: 'single_select' | 'multi_select' | 'text' | 'link' | 'numeric';
    /**
     * @description Unique identifier for the custom field
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    id: string;
    /**
     * @description Human readable name for the custom field
     * @example Affected Team
     */
    name: string;
    /**
     * @description What options are available for this custom field, if this field has options
     * @example [
     *   {
     *     "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "sort_key": 10,
     *     "value": "Product"
     *   }
     * ]
     */
    options: definitions['CustomFieldOptionV1ResponseBody'][];
    /**
     * @description When this custom field must be set during the incident lifecycle.
     * @example never
     * @enum {string}
     */
    required: 'never' | 'before_closure' | 'always';
    /**
     * @description Whether a custom field should be shown in the incident close modal. If this custom field is required before closure, but no value has been set for it, the field will be shown in the closure modal whatever the value of this setting.
     * @example true
     */
    show_before_closure: boolean;
    /**
     * @description Whether a custom field should be shown in the incident creation modal. This must be true if the field is always required.
     * @example true
     */
    show_before_creation: boolean;
    /**
     * @description Whether a custom field should be shown in the incident update modal.
     * @example true
     */
    show_before_update: boolean;
    /**
     * @description Whether a custom field should be shown in the list of fields as part of the announcement post when set.
     * @example true
     */
    show_in_announcement_post?: boolean;
    /**
     * Format: date-time
     * @description When the action was last updated
     * @example 2021-08-17T13:28:57.801578Z
     */
    updated_at: string;
  };
  /**
   * CustomFieldValuePayloadV1RequestBody
   * @example {
   *   "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "value_link": "https://google.com/",
   *   "value_numeric": "123.456",
   *   "value_option_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "value_text": "This is my text field, I hope you like it",
   *   "value_timestamp": ""
   * }
   */
  CustomFieldValuePayloadV1RequestBody: {
    /**
     * @description Unique identifier for the custom field value
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    id?: string;
    /**
     * @description If the custom field type is 'link', this will contain the value assigned.
     * @example https://google.com/
     */
    value_link?: string;
    /**
     * @description If the custom field type is 'numeric', this will contain the value assigned.
     * @example 123.456
     */
    value_numeric?: string;
    /**
     * @description ID of the custom field option
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    value_option_id?: string;
    /**
     * @description If the custom field type is 'text', this will contain the value assigned.
     * @example This is my text field, I hope you like it
     */
    value_text?: string;
    /**
     * @description Deprecated: please use incident timestamp values instead
     * @example
     */
    value_timestamp?: string;
  };
  /**
   * CustomFieldValuePayloadV2RequestBody
   * @example {
   *   "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "value_link": "https://google.com/",
   *   "value_numeric": "123.456",
   *   "value_option_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "value_text": "This is my text field, I hope you like it",
   *   "value_timestamp": ""
   * }
   */
  CustomFieldValuePayloadV2RequestBody: {
    /**
     * @description Unique identifier for the custom field value
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    id?: string;
    /**
     * @description If the custom field type is 'link', this will contain the value assigned.
     * @example https://google.com/
     */
    value_link?: string;
    /**
     * @description If the custom field type is 'numeric', this will contain the value assigned.
     * @example 123.456
     */
    value_numeric?: string;
    /**
     * @description ID of the custom field option
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    value_option_id?: string;
    /**
     * @description If the custom field type is 'text', this will contain the value assigned.
     * @example This is my text field, I hope you like it
     */
    value_text?: string;
    /**
     * @description Deprecated: please use incident timestamp values instead
     * @example
     */
    value_timestamp?: string;
  };
  /**
   * CustomFieldValueV1ResponseBody
   * @example {
   *   "value_link": "https://google.com/",
   *   "value_numeric": "123.456",
   *   "value_option": {
   *     "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "sort_key": 10,
   *     "value": "Product"
   *   },
   *   "value_text": "This is my text field, I hope you like it"
   * }
   */
  CustomFieldValueV1ResponseBody: {
    /**
     * @description If the custom field type is 'link', this will contain the value assigned.
     * @example https://google.com/
     */
    value_link?: string;
    /**
     * @description If the custom field type is 'numeric', this will contain the value assigned.
     * @example 123.456
     */
    value_numeric?: string;
    value_option?: definitions['CustomFieldOptionV1ResponseBody'];
    /**
     * @description If the custom field type is 'text', this will contain the value assigned.
     * @example This is my text field, I hope you like it
     */
    value_text?: string;
  };
  /**
   * CustomFieldValueV2ResponseBody
   * @example {
   *   "value_link": "https://google.com/",
   *   "value_numeric": "123.456",
   *   "value_option": {
   *     "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "sort_key": 10,
   *     "value": "Product"
   *   },
   *   "value_text": "This is my text field, I hope you like it"
   * }
   */
  CustomFieldValueV2ResponseBody: {
    /**
     * @description If the custom field type is 'link', this will contain the value assigned.
     * @example https://google.com/
     */
    value_link?: string;
    /**
     * @description If the custom field type is 'numeric', this will contain the value assigned.
     * @example 123.456
     */
    value_numeric?: string;
    value_option?: definitions['CustomFieldOptionV2ResponseBody'];
    /**
     * @description If the custom field type is 'text', this will contain the value assigned.
     * @example This is my text field, I hope you like it
     */
    value_text?: string;
  };
  /**
   * CustomFieldsV1CreateRequestBody
   * @example {
   *   "description": "Which team is impacted by this issue",
   *   "field_type": "single_select",
   *   "name": "Affected Team",
   *   "required": "never",
   *   "show_before_closure": true,
   *   "show_before_creation": true,
   *   "show_before_update": true,
   *   "show_in_announcement_post": true
   * }
   */
  CustomFieldsV1CreateRequestBody: {
    /**
     * @description Description of the custom field
     * @example Which team is impacted by this issue
     */
    description: string;
    /**
     * @description Type of custom field
     * @example single_select
     * @enum {string}
     */
    field_type: 'single_select' | 'multi_select' | 'text' | 'link' | 'numeric';
    /**
     * @description Human readable name for the custom field
     * @example Affected Team
     */
    name: string;
    /**
     * @description When this custom field must be set during the incident lifecycle.
     * @example never
     * @enum {string}
     */
    required: 'never' | 'before_closure' | 'always';
    /**
     * @description Whether a custom field should be shown in the incident close modal. If this custom field is required before closure, but no value has been set for it, the field will be shown in the closure modal whatever the value of this setting.
     * @example true
     */
    show_before_closure: boolean;
    /**
     * @description Whether a custom field should be shown in the incident creation modal. This must be true if the field is always required.
     * @example true
     */
    show_before_creation: boolean;
    /**
     * @description Whether a custom field should be shown in the incident update modal.
     * @example true
     */
    show_before_update: boolean;
    /**
     * @description Whether a custom field should be shown in the list of fields as part of the announcement post when set.
     * @example true
     */
    show_in_announcement_post?: boolean;
  } & {
    id: unknown;
    options: unknown;
    created_at: unknown;
    updated_at: unknown;
  };
  /**
   * CustomFieldsV1CreateResponseBody
   * @example {
   *   "custom_field": {
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Which team is impacted by this issue",
   *     "field_type": "single_select",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "name": "Affected Team",
   *     "options": [
   *       {
   *         "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "sort_key": 10,
   *         "value": "Product"
   *       }
   *     ],
   *     "required": "never",
   *     "show_before_closure": true,
   *     "show_before_creation": true,
   *     "show_before_update": true,
   *     "show_in_announcement_post": true,
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  CustomFieldsV1CreateResponseBody: {
    custom_field: definitions['CustomFieldV1ResponseBody'];
  };
  /**
   * CustomFieldsV1ListResponseBody
   * @example {
   *   "custom_fields": [
   *     {
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Which team is impacted by this issue",
   *       "field_type": "single_select",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Affected Team",
   *       "options": [
   *         {
   *           "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "sort_key": 10,
   *           "value": "Product"
   *         }
   *       ],
   *       "required": "never",
   *       "show_before_closure": true,
   *       "show_before_creation": true,
   *       "show_before_update": true,
   *       "show_in_announcement_post": true,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     }
   *   ]
   * }
   */
  CustomFieldsV1ListResponseBody: {
    /**
     * @example [
     *   {
     *     "created_at": "2021-08-17T13:28:57.801578Z",
     *     "description": "Which team is impacted by this issue",
     *     "field_type": "single_select",
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Affected Team",
     *     "options": [
     *       {
     *         "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *         "sort_key": 10,
     *         "value": "Product"
     *       }
     *     ],
     *     "required": "never",
     *     "show_before_closure": true,
     *     "show_before_creation": true,
     *     "show_before_update": true,
     *     "show_in_announcement_post": true,
     *     "updated_at": "2021-08-17T13:28:57.801578Z"
     *   }
     * ]
     */
    custom_fields: definitions['CustomFieldV1ResponseBody'][];
  };
  /**
   * CustomFieldsV1ShowResponseBody
   * @example {
   *   "custom_field": {
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Which team is impacted by this issue",
   *     "field_type": "single_select",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "name": "Affected Team",
   *     "options": [
   *       {
   *         "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "sort_key": 10,
   *         "value": "Product"
   *       }
   *     ],
   *     "required": "never",
   *     "show_before_closure": true,
   *     "show_before_creation": true,
   *     "show_before_update": true,
   *     "show_in_announcement_post": true,
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  CustomFieldsV1ShowResponseBody: {
    custom_field: definitions['CustomFieldV1ResponseBody'];
  };
  /**
   * CustomFieldsV1UpdateRequestBody
   * @example {
   *   "description": "Which team is impacted by this issue",
   *   "name": "Affected Team",
   *   "required": "never",
   *   "show_before_closure": true,
   *   "show_before_creation": true,
   *   "show_before_update": true,
   *   "show_in_announcement_post": true
   * }
   */
  CustomFieldsV1UpdateRequestBody: {
    /**
     * @description Description of the custom field
     * @example Which team is impacted by this issue
     */
    description: string;
    /**
     * @description Human readable name for the custom field
     * @example Affected Team
     */
    name: string;
    /**
     * @description When this custom field must be set during the incident lifecycle.
     * @example never
     * @enum {string}
     */
    required: 'never' | 'before_closure' | 'always';
    /**
     * @description Whether a custom field should be shown in the incident close modal. If this custom field is required before closure, but no value has been set for it, the field will be shown in the closure modal whatever the value of this setting.
     * @example true
     */
    show_before_closure: boolean;
    /**
     * @description Whether a custom field should be shown in the incident creation modal. This must be true if the field is always required.
     * @example true
     */
    show_before_creation: boolean;
    /**
     * @description Whether a custom field should be shown in the incident update modal.
     * @example true
     */
    show_before_update: boolean;
    /**
     * @description Whether a custom field should be shown in the list of fields as part of the announcement post when set.
     * @example true
     */
    show_in_announcement_post?: boolean;
  } & {
    field_type: unknown;
    options: unknown;
    created_at: unknown;
    updated_at: unknown;
  };
  /**
   * CustomFieldsV1UpdateResponseBody
   * @example {
   *   "custom_field": {
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Which team is impacted by this issue",
   *     "field_type": "single_select",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "name": "Affected Team",
   *     "options": [
   *       {
   *         "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "sort_key": 10,
   *         "value": "Product"
   *       }
   *     ],
   *     "required": "never",
   *     "show_before_closure": true,
   *     "show_before_creation": true,
   *     "show_before_update": true,
   *     "show_in_announcement_post": true,
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  CustomFieldsV1UpdateResponseBody: {
    custom_field: definitions['CustomFieldV1ResponseBody'];
  };
  /**
   * ExternalIssueReferenceV1ResponseBody
   * @example {
   *   "issue_name": "INC-123",
   *   "issue_permalink": "https://linear.app/incident-io/issue/INC-1609/find-copywriter-to-write-up",
   *   "provider": "asana"
   * }
   */
  ExternalIssueReferenceV1ResponseBody: {
    /**
     * @description Human readable ID for the issue
     * @example INC-123
     */
    issue_name?: string;
    /**
     * @description URL linking directly to the action in the issue tracker
     * @example https://linear.app/incident-io/issue/INC-1609/find-copywriter-to-write-up
     */
    issue_permalink?: string;
    /**
     * @description ID of the issue tracker provider
     * @example asana
     * @enum {string}
     */
    provider?:
      | 'asana'
      | 'linear'
      | 'jira'
      | 'jira_server'
      | 'github'
      | 'shortcut';
  };
  /**
   * ExternalIssueReferenceV2ResponseBody
   * @example {
   *   "issue_name": "INC-123",
   *   "issue_permalink": "https://linear.app/incident-io/issue/INC-1609/find-copywriter-to-write-up",
   *   "provider": "asana"
   * }
   */
  ExternalIssueReferenceV2ResponseBody: {
    /**
     * @description Human readable ID for the issue
     * @example INC-123
     */
    issue_name: string;
    /**
     * @description URL linking directly to the action in the issue tracker
     * @example https://linear.app/incident-io/issue/INC-1609/find-copywriter-to-write-up
     */
    issue_permalink: string;
    /**
     * @description ID of the issue tracker provider
     * @example asana
     * @enum {string}
     */
    provider:
      | 'asana'
      | 'linear'
      | 'jira'
      | 'jira_server'
      | 'github'
      | 'shortcut';
  } & {
    issue_id: unknown;
  };
  /**
   * ExternalResourceV1ResponseBody
   * @example {
   *   "external_id": "123",
   *   "permalink": "https://my.pagerduty.com/incidents/ABC",
   *   "resource_type": "pager_duty_incident",
   *   "title": "The database has gone down"
   * }
   */
  ExternalResourceV1ResponseBody: {
    /**
     * @description ID of the resource in the external system
     * @example 123
     */
    external_id: string;
    /**
     * @description URL of the resource
     * @example https://my.pagerduty.com/incidents/ABC
     */
    permalink: string;
    /**
     * @description E.g. PagerDuty: the external system that holds the resource
     * @example pager_duty_incident
     * @enum {string}
     */
    resource_type:
      | 'pager_duty_incident'
      | 'opsgenie_alert'
      | 'datadog_monitor_alert'
      | 'github_pull_request'
      | 'sentry_issue'
      | 'atlassian_statuspage_incident'
      | 'zendesk_ticket'
      | 'statuspage_incident';
    /**
     * @description Title of resource
     * @example The database has gone down
     */
    title: string;
  } & {
    id: unknown;
    resource_type_label: unknown;
    created_at: unknown;
    updated_at: unknown;
  };
  /**
   * IdentityV1ResponseBody
   * @example {
   *   "name": "Alertmanager token",
   *   "roles": [
   *     "incident_creator"
   *   ]
   * }
   */
  IdentityV1ResponseBody: {
    /**
     * @description The name assigned to the current API Key
     * @example Alertmanager token
     */
    name: string;
    /**
     * @description Which roles have been enabled for this key
     * @example [
     *   "incident_creator"
     * ]
     */
    roles: (
      | 'viewer'
      | 'incident_creator'
      | 'incident_editor'
      | 'manage_settings'
      | 'global_access'
      | 'catalog_viewer'
      | 'catalog_editor'
    )[];
  };
  /**
   * IncidentAttachmentV1ResponseBody
   * @example {
   *   "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *   "incident_id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *   "resource": {
   *     "external_id": "123",
   *     "permalink": "https://my.pagerduty.com/incidents/ABC",
   *     "resource_type": "pager_duty_incident",
   *     "title": "The database has gone down"
   *   }
   * }
   */
  IncidentAttachmentV1ResponseBody: {
    /**
     * @description Unique identifier of this incident membership
     * @example 01FCNDV6P870EA6S7TK1DSYD5H
     */
    id: string;
    /**
     * @description Unique identifier of the incident
     * @example 01FCNDV6P870EA6S7TK1DSYD5H
     */
    incident_id: string;
    resource: definitions['ExternalResourceV1ResponseBody'];
  } & {
    organisation_id: unknown;
    creator: unknown;
    created_at: unknown;
  };
  /**
   * IncidentAttachmentsV1CreateRequestBody
   * @example {
   *   "incident_id": "01FDAG4SAP5TYPT98WGR2N7W91",
   *   "resource": {
   *     "external_id": "123",
   *     "resource_type": "pager_duty_incident"
   *   }
   * }
   */
  IncidentAttachmentsV1CreateRequestBody: {
    /**
     * @description ID of the incident to add an attachment to
     * @example 01FDAG4SAP5TYPT98WGR2N7W91
     */
    incident_id: string;
    /**
     * @example {
     *   "external_id": "123",
     *   "resource_type": "pager_duty_incident"
     * }
     */
    resource: {
      /**
       * @description ID of the resource in the external system
       * @example 123
       */
      external_id: string;
      /**
       * @description E.g. PagerDuty: the external system that holds the resource
       * @example pager_duty_incident
       * @enum {string}
       */
      resource_type:
        | 'pager_duty_incident'
        | 'opsgenie_alert'
        | 'datadog_monitor_alert'
        | 'github_pull_request'
        | 'sentry_issue'
        | 'atlassian_statuspage_incident'
        | 'zendesk_ticket'
        | 'statuspage_incident';
    } & {
      id: unknown;
      permalink: unknown;
      title: unknown;
      resource_type_label: unknown;
      created_at: unknown;
      updated_at: unknown;
    };
  };
  /**
   * IncidentAttachmentsV1CreateResponseBody
   * @example {
   *   "incident_attachment": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *     "incident_id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *     "resource": {
   *       "external_id": "123",
   *       "permalink": "https://my.pagerduty.com/incidents/ABC",
   *       "resource_type": "pager_duty_incident",
   *       "title": "The database has gone down"
   *     }
   *   }
   * }
   */
  IncidentAttachmentsV1CreateResponseBody: {
    incident_attachment: definitions['IncidentAttachmentV1ResponseBody'];
  };
  /**
   * IncidentAttachmentsV1ListResponseBody
   * @example {
   *   "incident_attachments": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *       "incident_id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *       "resource": {
   *         "external_id": "123",
   *         "permalink": "https://my.pagerduty.com/incidents/ABC",
   *         "resource_type": "pager_duty_incident",
   *         "title": "The database has gone down"
   *       }
   *     }
   *   ]
   * }
   */
  IncidentAttachmentsV1ListResponseBody: {
    /**
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYD5H",
     *     "incident_id": "01FCNDV6P870EA6S7TK1DSYD5H",
     *     "resource": {
     *       "external_id": "123",
     *       "permalink": "https://my.pagerduty.com/incidents/ABC",
     *       "resource_type": "pager_duty_incident",
     *       "title": "The database has gone down"
     *     }
     *   }
     * ]
     */
    incident_attachments: definitions['IncidentAttachmentV1ResponseBody'][];
  };
  /**
   * IncidentEditPayloadV2RequestBody
   * @example {
   *   "custom_field_entries": [
   *     {
   *       "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "values": [
   *         {
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "value_link": "https://google.com/",
   *           "value_numeric": "123.456",
   *           "value_option_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "value_text": "This is my text field, I hope you like it",
   *           "value_timestamp": ""
   *         }
   *       ]
   *     }
   *   ],
   *   "incident_timestamp_values": [
   *     {
   *       "incident_timestamp_id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *       "value": "2021-08-17T13:28:57.801578Z"
   *     }
   *   ],
   *   "name": "Our database is sad",
   *   "severity_id": "01FH5TZRWMNAFB0DZ23FD1TV96",
   *   "summary": "Our database is really really sad, and we don't know why yet."
   * }
   */
  IncidentEditPayloadV2RequestBody: {
    /**
     * @description Set the incident's custom fields to these values
     * @example [
     *   {
     *     "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "values": [
     *       {
     *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *         "value_link": "https://google.com/",
     *         "value_numeric": "123.456",
     *         "value_option_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *         "value_text": "This is my text field, I hope you like it",
     *         "value_timestamp": ""
     *       }
     *     ]
     *   }
     * ]
     */
    custom_field_entries?: definitions['CustomFieldEntryPayloadV2RequestBody'][];
    /**
     * @description Assign the incident's timestamps to these values
     * @example [
     *   {
     *     "incident_timestamp_id": "01FCNDV6P870EA6S7TK1DSYD5H",
     *     "value": "2021-08-17T13:28:57.801578Z"
     *   }
     * ]
     */
    incident_timestamp_values?: definitions['IncidentTimestampValuePayloadV2RequestBody'][];
    /**
     * @description Explanation of the incident
     * @example Our database is sad
     */
    name?: string;
    /**
     * @description Severity to change incident to
     * @example 01FH5TZRWMNAFB0DZ23FD1TV96
     */
    severity_id?: string;
    /**
     * @description Detailed description of the incident
     * @example Our database is really really sad, and we don't know why yet.
     */
    summary?: string;
  };
  /**
   * IncidentRoleAssignmentPayloadV1RequestBody
   * @example {
   *   "assignee": {
   *     "email": "bob@example.com",
   *     "id": "01G0J1EXE7AXZ2C93K61WBPYEH",
   *     "slack_user_id": "USER123"
   *   },
   *   "incident_role_id": "01FH5TZRWMNAFB0DZ23FD1TV96"
   * }
   */
  IncidentRoleAssignmentPayloadV1RequestBody: {
    assignee: definitions['UserReferencePayloadV1RequestBody'];
    /**
     * @description Unique ID of an incident role
     * @example 01FH5TZRWMNAFB0DZ23FD1TV96
     */
    incident_role_id: string;
  };
  /**
   * IncidentRoleAssignmentPayloadV2RequestBody
   * @example {
   *   "assignee": {
   *     "email": "bob@example.com",
   *     "id": "01G0J1EXE7AXZ2C93K61WBPYEH",
   *     "slack_user_id": "USER123"
   *   },
   *   "incident_role_id": "01FH5TZRWMNAFB0DZ23FD1TV96"
   * }
   */
  IncidentRoleAssignmentPayloadV2RequestBody: {
    assignee?: definitions['UserReferencePayloadV2RequestBody'];
    /**
     * @description Unique ID of an incident role
     * @example 01FH5TZRWMNAFB0DZ23FD1TV96
     */
    incident_role_id: string;
  };
  /**
   * IncidentRoleAssignmentV1ResponseBody
   * @example {
   *   "assignee": {
   *     "email": "lisa@incident.io",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "name": "Lisa Karlin Curtis",
   *     "role": "viewer",
   *     "slack_user_id": "U02AYNF2XJM"
   *   },
   *   "role": {
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "The person currently coordinating the incident",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
   *     "name": "Incident Lead",
   *     "required": true,
   *     "role_type": "lead",
   *     "shortform": "lead",
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  IncidentRoleAssignmentV1ResponseBody: {
    assignee?: definitions['UserV1ResponseBody'];
    role: definitions['IncidentRoleV1ResponseBody'];
  };
  /**
   * IncidentRoleAssignmentV2ResponseBody
   * @example {
   *   "assignee": {
   *     "email": "lisa@incident.io",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "name": "Lisa Karlin Curtis",
   *     "role": "viewer",
   *     "slack_user_id": "U02AYNF2XJM"
   *   },
   *   "role": {
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "The person currently coordinating the incident",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
   *     "name": "Incident Lead",
   *     "required": true,
   *     "role_type": "lead",
   *     "shortform": "lead",
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  IncidentRoleAssignmentV2ResponseBody: {
    assignee?: definitions['UserV2ResponseBody'];
    role: definitions['IncidentRoleV2ResponseBody'];
  };
  /**
   * IncidentRoleV1ResponseBody
   * @example {
   *   "created_at": "2021-08-17T13:28:57.801578Z",
   *   "description": "The person currently coordinating the incident",
   *   "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
   *   "name": "Incident Lead",
   *   "required": true,
   *   "role_type": "lead",
   *   "shortform": "lead",
   *   "updated_at": "2021-08-17T13:28:57.801578Z"
   * }
   */
  IncidentRoleV1ResponseBody: {
    /**
     * Format: date-time
     * @description When the action was created
     * @example 2021-08-17T13:28:57.801578Z
     */
    created_at: string;
    /**
     * @description Describes the purpose of the role
     * @example The person currently coordinating the incident
     */
    description: string;
    /**
     * @description Unique identifier for the role
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    id: string;
    /**
     * @description Provided to whoever is nominated for the role
     * @example Take point on the incident; Make sure people are clear on responsibilities
     */
    instructions: string;
    /**
     * @description Human readable name of the incident role
     * @example Incident Lead
     */
    name: string;
    /**
     * @description Whether incident require this role to be set
     * @example true
     */
    required: boolean;
    /**
     * @description Type of incident role
     * @example lead
     * @enum {string}
     */
    role_type: 'lead' | 'reporter' | 'custom';
    /**
     * @description Short human readable name for Slack
     * @example lead
     */
    shortform: string;
    /**
     * Format: date-time
     * @description When the action was last updated
     * @example 2021-08-17T13:28:57.801578Z
     */
    updated_at: string;
  } & {
    conditions: unknown;
  };
  /**
   * IncidentRoleV2ResponseBody
   * @example {
   *   "created_at": "2021-08-17T13:28:57.801578Z",
   *   "description": "The person currently coordinating the incident",
   *   "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
   *   "name": "Incident Lead",
   *   "required": true,
   *   "role_type": "lead",
   *   "shortform": "lead",
   *   "updated_at": "2021-08-17T13:28:57.801578Z"
   * }
   */
  IncidentRoleV2ResponseBody: {
    /**
     * Format: date-time
     * @description When the action was created
     * @example 2021-08-17T13:28:57.801578Z
     */
    created_at: string;
    /**
     * @description Describes the purpose of the role
     * @example The person currently coordinating the incident
     */
    description: string;
    /**
     * @description Unique identifier for the role
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    id: string;
    /**
     * @description Provided to whoever is nominated for the role
     * @example Take point on the incident; Make sure people are clear on responsibilities
     */
    instructions: string;
    /**
     * @description Human readable name of the incident role
     * @example Incident Lead
     */
    name: string;
    /**
     * @description Whether incident require this role to be set
     * @example true
     */
    required: boolean;
    /**
     * @description Type of incident role
     * @example lead
     * @enum {string}
     */
    role_type: 'lead' | 'reporter' | 'custom';
    /**
     * @description Short human readable name for Slack
     * @example lead
     */
    shortform: string;
    /**
     * Format: date-time
     * @description When the action was last updated
     * @example 2021-08-17T13:28:57.801578Z
     */
    updated_at: string;
  } & {
    conditions: unknown;
  };
  /**
   * IncidentRolesV1CreateRequestBody
   * @example {
   *   "description": "The person currently coordinating the incident",
   *   "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
   *   "name": "Incident Lead",
   *   "required": true,
   *   "shortform": "lead"
   * }
   */
  IncidentRolesV1CreateRequestBody: {
    /**
     * @description Describes the purpose of the role
     * @example The person currently coordinating the incident
     */
    description: string;
    /**
     * @description Provided to whoever is nominated for the role
     * @example Take point on the incident; Make sure people are clear on responsibilities
     */
    instructions: string;
    /**
     * @description Human readable name of the incident role
     * @example Incident Lead
     */
    name: string;
    /**
     * @description Whether incident require this role to be set
     * @example true
     */
    required: boolean;
    /**
     * @description Short human readable name for Slack
     * @example lead
     */
    shortform: string;
  } & {
    conditions: unknown;
    id: unknown;
    role_type: unknown;
    created_at: unknown;
    updated_at: unknown;
  };
  /**
   * IncidentRolesV1CreateResponseBody
   * @example {
   *   "incident_role": {
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "The person currently coordinating the incident",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
   *     "name": "Incident Lead",
   *     "required": true,
   *     "role_type": "lead",
   *     "shortform": "lead",
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  IncidentRolesV1CreateResponseBody: {
    incident_role: definitions['IncidentRoleV1ResponseBody'];
  };
  /**
   * IncidentRolesV1ListResponseBody
   * @example {
   *   "incident_roles": [
   *     {
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "The person currently coordinating the incident",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
   *       "name": "Incident Lead",
   *       "required": true,
   *       "role_type": "lead",
   *       "shortform": "lead",
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     }
   *   ]
   * }
   */
  IncidentRolesV1ListResponseBody: {
    /**
     * @example [
     *   {
     *     "created_at": "2021-08-17T13:28:57.801578Z",
     *     "description": "The person currently coordinating the incident",
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
     *     "name": "Incident Lead",
     *     "required": true,
     *     "role_type": "lead",
     *     "shortform": "lead",
     *     "updated_at": "2021-08-17T13:28:57.801578Z"
     *   }
     * ]
     */
    incident_roles: definitions['IncidentRoleV1ResponseBody'][];
  };
  /**
   * IncidentRolesV1ShowResponseBody
   * @example {
   *   "incident_role": {
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "The person currently coordinating the incident",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
   *     "name": "Incident Lead",
   *     "required": true,
   *     "role_type": "lead",
   *     "shortform": "lead",
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  IncidentRolesV1ShowResponseBody: {
    incident_role: definitions['IncidentRoleV1ResponseBody'];
  };
  /**
   * IncidentRolesV1UpdateRequestBody
   * @example {
   *   "description": "The person currently coordinating the incident",
   *   "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
   *   "name": "Incident Lead",
   *   "required": true,
   *   "shortform": "lead"
   * }
   */
  IncidentRolesV1UpdateRequestBody: {
    /**
     * @description Describes the purpose of the role
     * @example The person currently coordinating the incident
     */
    description: string;
    /**
     * @description Provided to whoever is nominated for the role
     * @example Take point on the incident; Make sure people are clear on responsibilities
     */
    instructions: string;
    /**
     * @description Human readable name of the incident role
     * @example Incident Lead
     */
    name: string;
    /**
     * @description Whether incident require this role to be set
     * @example true
     */
    required: boolean;
    /**
     * @description Short human readable name for Slack
     * @example lead
     */
    shortform: string;
  } & {
    conditions: unknown;
    role_type: unknown;
    created_at: unknown;
    updated_at: unknown;
  };
  /**
   * IncidentRolesV1UpdateResponseBody
   * @example {
   *   "incident_role": {
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "The person currently coordinating the incident",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
   *     "name": "Incident Lead",
   *     "required": true,
   *     "role_type": "lead",
   *     "shortform": "lead",
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  IncidentRolesV1UpdateResponseBody: {
    incident_role: definitions['IncidentRoleV1ResponseBody'];
  };
  /**
   * IncidentStatusV1ResponseBody
   * @example {
   *   "category": "triage",
   *   "created_at": "2021-08-17T13:28:57.801578Z",
   *   "description": "Impact has been **fully mitigated**, and we're ready to learn from this incident.",
   *   "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *   "name": "Closed",
   *   "rank": 4,
   *   "updated_at": "2021-08-17T13:28:57.801578Z"
   * }
   */
  IncidentStatusV1ResponseBody: {
    /**
     * @description Whether this status is a live or closed status. If you have enabled auto-create, there will also be 'triage' and 'declined' statuses, which cannot be modified.
     * @example triage
     * @enum {string}
     */
    category: 'triage' | 'declined' | 'merged' | 'live' | 'closed';
    /**
     * Format: date-time
     * @example 2021-08-17T13:28:57.801578Z
     */
    created_at: string;
    /**
     * @description Rich text description of the incident status
     * @example Impact has been **fully mitigated**, and we're ready to learn from this incident.
     */
    description: string;
    /**
     * @description Unique ID of this incident status
     * @example 01FCNDV6P870EA6S7TK1DSYD5H
     */
    id: string;
    /**
     * @description Unique name of this status
     * @example Closed
     */
    name: string;
    /**
     * Format: int64
     * @description Order of this incident status
     * @example 4
     */
    rank: number;
    /**
     * Format: date-time
     * @example 2021-08-17T13:28:57.801578Z
     */
    updated_at: string;
  };
  /**
   * IncidentStatusV2ResponseBody
   * @example {
   *   "category": "triage",
   *   "created_at": "2021-08-17T13:28:57.801578Z",
   *   "description": "Impact has been **fully mitigated**, and we're ready to learn from this incident.",
   *   "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *   "name": "Closed",
   *   "rank": 4,
   *   "updated_at": "2021-08-17T13:28:57.801578Z"
   * }
   */
  IncidentStatusV2ResponseBody: {
    /**
     * @description Whether this status is a live or closed status. If you have enabled auto-create, there will also be 'triage' and 'declined' statuses, which cannot be modified.
     * @example triage
     * @enum {string}
     */
    category: 'triage' | 'declined' | 'merged' | 'live' | 'closed';
    /**
     * Format: date-time
     * @example 2021-08-17T13:28:57.801578Z
     */
    created_at: string;
    /**
     * @description Rich text description of the incident status
     * @example Impact has been **fully mitigated**, and we're ready to learn from this incident.
     */
    description: string;
    /**
     * @description Unique ID of this incident status
     * @example 01FCNDV6P870EA6S7TK1DSYD5H
     */
    id: string;
    /**
     * @description Unique name of this status
     * @example Closed
     */
    name: string;
    /**
     * Format: int64
     * @description Order of this incident status
     * @example 4
     */
    rank: number;
    /**
     * Format: date-time
     * @example 2021-08-17T13:28:57.801578Z
     */
    updated_at: string;
  };
  /**
   * IncidentStatusesV1CreateRequestBody
   * @example {
   *   "category": "live",
   *   "description": "Impact has been **fully mitigated**, and we're ready to learn from this incident.",
   *   "name": "Closed"
   * }
   */
  IncidentStatusesV1CreateRequestBody: {
    /**
     * @description Whether the status should be considered 'live' or 'closed'. The triage and declined statuses cannot be created or modified.
     * @example live
     * @enum {string}
     */
    category: 'live' | 'closed';
    /**
     * @description Rich text description of the incident status
     * @example Impact has been **fully mitigated**, and we're ready to learn from this incident.
     */
    description: string;
    /**
     * @description Unique name of this status
     * @example Closed
     */
    name: string;
  } & {
    id: unknown;
    rank: unknown;
    created_at: unknown;
    updated_at: unknown;
  };
  /**
   * IncidentStatusesV1CreateResponseBody
   * @example {
   *   "incident_status": {
   *     "category": "triage",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Impact has been **fully mitigated**, and we're ready to learn from this incident.",
   *     "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *     "name": "Closed",
   *     "rank": 4,
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  IncidentStatusesV1CreateResponseBody: {
    incident_status: definitions['IncidentStatusV1ResponseBody'];
  };
  /**
   * IncidentStatusesV1ListResponseBody
   * @example {
   *   "incident_statuses": [
   *     {
   *       "category": "triage",
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Impact has been **fully mitigated**, and we're ready to learn from this incident.",
   *       "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *       "name": "Closed",
   *       "rank": 4,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     }
   *   ]
   * }
   */
  IncidentStatusesV1ListResponseBody: {
    /**
     * @example [
     *   {
     *     "category": "triage",
     *     "created_at": "2021-08-17T13:28:57.801578Z",
     *     "description": "Impact has been **fully mitigated**, and we're ready to learn from this incident.",
     *     "id": "01FCNDV6P870EA6S7TK1DSYD5H",
     *     "name": "Closed",
     *     "rank": 4,
     *     "updated_at": "2021-08-17T13:28:57.801578Z"
     *   }
     * ]
     */
    incident_statuses: definitions['IncidentStatusV1ResponseBody'][];
  };
  /**
   * IncidentStatusesV1ShowResponseBody
   * @example {
   *   "incident_status": {
   *     "category": "triage",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Impact has been **fully mitigated**, and we're ready to learn from this incident.",
   *     "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *     "name": "Closed",
   *     "rank": 4,
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  IncidentStatusesV1ShowResponseBody: {
    incident_status: definitions['IncidentStatusV1ResponseBody'];
  };
  /**
   * IncidentStatusesV1UpdateRequestBody
   * @example {
   *   "description": "Impact has been **fully mitigated**, and we're ready to learn from this incident.",
   *   "name": "Closed"
   * }
   */
  IncidentStatusesV1UpdateRequestBody: {
    /**
     * @description Rich text description of the incident status
     * @example Impact has been **fully mitigated**, and we're ready to learn from this incident.
     */
    description: string;
    /**
     * @description Unique name of this status
     * @example Closed
     */
    name: string;
  } & {
    rank: unknown;
    category: unknown;
    created_at: unknown;
    updated_at: unknown;
  };
  /**
   * IncidentStatusesV1UpdateResponseBody
   * @example {
   *   "incident_status": {
   *     "category": "triage",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Impact has been **fully mitigated**, and we're ready to learn from this incident.",
   *     "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *     "name": "Closed",
   *     "rank": 4,
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  IncidentStatusesV1UpdateResponseBody: {
    incident_status: definitions['IncidentStatusV1ResponseBody'];
  };
  /**
   * IncidentTimestampV1ResponseBody
   * @example {
   *   "last_occurred_at": "2021-08-17T13:28:57.801578Z",
   *   "name": "last_activity"
   * }
   */
  IncidentTimestampV1ResponseBody: {
    /**
     * Format: date-time
     * @description When this last occurred, if it did
     * @example 2021-08-17T13:28:57.801578Z
     */
    last_occurred_at?: string;
    /**
     * @description Name of the lifecycle event
     * @example last_activity
     */
    name: string;
  };
  /**
   * IncidentTimestampV2ResponseBody
   * @example {
   *   "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *   "name": "Impact started",
   *   "rank": 1
   * }
   */
  IncidentTimestampV2ResponseBody: {
    /**
     * @description Unique ID of this incident timestamp
     * @example 01FCNDV6P870EA6S7TK1DSYD5H
     */
    id: string;
    /**
     * @description Unique name of this timestamp
     * @example Impact started
     */
    name: string;
    /**
     * Format: int64
     * @description Order in which this timestamp should be shown
     * @example 1
     */
    rank: number;
  } & {
    description: unknown;
    required: unknown;
    show_before_creation: unknown;
    show_before_closure: unknown;
    show_in_announcement_post: unknown;
    set_on_transition: unknown;
    set_on_visit: unknown;
    set_on_creation: unknown;
    timestamp_type: unknown;
    created_at: unknown;
    updated_at: unknown;
  };
  /**
   * IncidentTimestampValuePayloadV2RequestBody
   * @example {
   *   "incident_timestamp_id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *   "value": "2021-08-17T13:28:57.801578Z"
   * }
   */
  IncidentTimestampValuePayloadV2RequestBody: {
    /**
     * @description The id of the incident timestamp that this incident timestamp value is associated with.
     * @example 01FCNDV6P870EA6S7TK1DSYD5H
     */
    incident_timestamp_id: string;
    /**
     * Format: date-time
     * @description The current value of this timestamp, for this incident
     * @example 2021-08-17T13:28:57.801578Z
     */
    value?: string;
  } & {
    id: unknown;
    incident_id: unknown;
    created_at: unknown;
  };
  /**
   * IncidentTimestampValueV2ResponseBody
   * @example {
   *   "value": "2021-08-17T13:28:57.801578Z"
   * }
   */
  IncidentTimestampValueV2ResponseBody: {
    /**
     * Format: date-time
     * @description The current value of this timestamp, for this incident
     * @example 2021-08-17T13:28:57.801578Z
     */
    value?: string;
  } & {
    id: unknown;
    incident_id: unknown;
    incident_timestamp_id: unknown;
    created_at: unknown;
  };
  /**
   * IncidentTimestampWithValueV2ResponseBody
   * @example {
   *   "incident_timestamp": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *     "name": "Impact started",
   *     "rank": 1
   *   },
   *   "value": {
   *     "value": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  IncidentTimestampWithValueV2ResponseBody: {
    incident_timestamp: definitions['IncidentTimestampV2ResponseBody'];
    value?: definitions['IncidentTimestampValueV2ResponseBody'];
  };
  /**
   * IncidentTimestampsV2ListResponseBody
   * @example {
   *   "incident_timestamps": [
   *     {
   *       "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *       "name": "Impact started",
   *       "rank": 1
   *     }
   *   ]
   * }
   */
  IncidentTimestampsV2ListResponseBody: {
    /**
     * @example [
     *   {
     *     "id": "01FCNDV6P870EA6S7TK1DSYD5H",
     *     "name": "Impact started",
     *     "rank": 1
     *   }
     * ]
     */
    incident_timestamps: definitions['IncidentTimestampV2ResponseBody'][];
  };
  /**
   * IncidentTimestampsV2ShowResponseBody
   * @example {
   *   "incident_timestamp": {
   *     "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *     "name": "Impact started",
   *     "rank": 1
   *   }
   * }
   */
  IncidentTimestampsV2ShowResponseBody: {
    incident_timestamp: definitions['IncidentTimestampV2ResponseBody'];
  };
  /**
   * IncidentTypeV1ResponseBody
   * @example {
   *   "create_in_triage": "always",
   *   "created_at": "2021-08-17T13:28:57.801578Z",
   *   "description": "Customer facing production outages",
   *   "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "is_default": false,
   *   "name": "Production Outage",
   *   "private_incidents_only": false,
   *   "updated_at": "2021-08-17T13:28:57.801578Z"
   * }
   */
  IncidentTypeV1ResponseBody: {
    /**
     * @description Whether incidents of this must always, or can optionally, be created in triage
     * @example always
     * @enum {string}
     */
    create_in_triage: 'always' | 'optional';
    /**
     * Format: date-time
     * @description When this resource was created
     * @example 2021-08-17T13:28:57.801578Z
     */
    created_at: string;
    /**
     * @description What is this incident type for?
     * @example Customer facing production outages
     */
    description: string;
    /**
     * @description Unique identifier for this Incident Type
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    id: string;
    /**
     * @description The default Incident Type is used when no other type is explicitly specified
     * @example false
     */
    is_default: boolean;
    /**
     * @description The name of this Incident Type
     * @example Production Outage
     */
    name: string;
    /**
     * @description Should all incidents created with this Incident Type be private?
     * @example false
     */
    private_incidents_only: boolean;
    /**
     * Format: date-time
     * @description When this resource was last updated
     * @example 2021-08-17T13:28:57.801578Z
     */
    updated_at: string;
  } & {
    severity_aliases: unknown;
    rank: unknown;
    update_template_mode: unknown;
  };
  /**
   * IncidentTypeV2ResponseBody
   * @example {
   *   "create_in_triage": "always",
   *   "created_at": "2021-08-17T13:28:57.801578Z",
   *   "description": "Customer facing production outages",
   *   "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "is_default": false,
   *   "name": "Production Outage",
   *   "private_incidents_only": false,
   *   "updated_at": "2021-08-17T13:28:57.801578Z"
   * }
   */
  IncidentTypeV2ResponseBody: {
    /**
     * @description Whether incidents of this must always, or can optionally, be created in triage
     * @example always
     * @enum {string}
     */
    create_in_triage: 'always' | 'optional';
    /**
     * Format: date-time
     * @description When this resource was created
     * @example 2021-08-17T13:28:57.801578Z
     */
    created_at: string;
    /**
     * @description What is this incident type for?
     * @example Customer facing production outages
     */
    description: string;
    /**
     * @description Unique identifier for this Incident Type
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    id: string;
    /**
     * @description The default Incident Type is used when no other type is explicitly specified
     * @example false
     */
    is_default: boolean;
    /**
     * @description The name of this Incident Type
     * @example Production Outage
     */
    name: string;
    /**
     * @description Should all incidents created with this Incident Type be private?
     * @example false
     */
    private_incidents_only: boolean;
    /**
     * Format: date-time
     * @description When this resource was last updated
     * @example 2021-08-17T13:28:57.801578Z
     */
    updated_at: string;
  } & {
    severity_aliases: unknown;
    rank: unknown;
    update_template_mode: unknown;
  };
  /**
   * IncidentTypesV1ListResponseBody
   * @example {
   *   "incident_types": [
   *     {
   *       "create_in_triage": "always",
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Customer facing production outages",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "is_default": false,
   *       "name": "Production Outage",
   *       "private_incidents_only": false,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     }
   *   ]
   * }
   */
  IncidentTypesV1ListResponseBody: {
    /**
     * @example [
     *   {
     *     "create_in_triage": "always",
     *     "created_at": "2021-08-17T13:28:57.801578Z",
     *     "description": "Customer facing production outages",
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "is_default": false,
     *     "name": "Production Outage",
     *     "private_incidents_only": false,
     *     "updated_at": "2021-08-17T13:28:57.801578Z"
     *   }
     * ]
     */
    incident_types: definitions['IncidentTypeV1ResponseBody'][];
  };
  /**
   * IncidentTypesV1ShowResponseBody
   * @example {
   *   "incident_type": {
   *     "create_in_triage": "always",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Customer facing production outages",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "is_default": false,
   *     "name": "Production Outage",
   *     "private_incidents_only": false,
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  IncidentTypesV1ShowResponseBody: {
    incident_type: definitions['IncidentTypeV1ResponseBody'];
  };
  /**
   * IncidentUpdateV2ResponseBody
   * @example {
   *   "created_at": "2021-08-17T13:28:57.801578Z",
   *   "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "incident_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "message": "The cat is getting irritable, best rescue it soon",
   *   "new_incident_status": {
   *     "category": "triage",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Impact has been **fully mitigated**, and we're ready to learn from this incident.",
   *     "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *     "name": "Closed",
   *     "rank": 4,
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   },
   *   "new_severity": {
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Issues with **low impact**.",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "name": "Minor",
   *     "rank": 1,
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   },
   *   "updater": {
   *     "api_key": {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "My test API key"
   *     },
   *     "user": {
   *       "email": "lisa@incident.io",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Lisa Karlin Curtis",
   *       "role": "viewer",
   *       "slack_user_id": "U02AYNF2XJM"
   *     }
   *   }
   * }
   */
  IncidentUpdateV2ResponseBody: {
    /**
     * Format: date-time
     * @description When the update was created
     * @example 2021-08-17T13:28:57.801578Z
     */
    created_at: string;
    /**
     * @description Unique identifier for this incident update
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    id: string;
    /**
     * @description The incident this update relates to
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    incident_id: string;
    /**
     * @description Message that explains the context behind the update
     * @example The cat is getting irritable, best rescue it soon
     */
    message?: string;
    new_incident_status: definitions['IncidentStatusV2ResponseBody'];
    new_severity?: definitions['SeverityV2ResponseBody'];
    updater: definitions['ActorV2ResponseBody'];
  } & {
    next_update_in_minutes: unknown;
  };
  /**
   * IncidentUpdatesV2ListResponseBody
   * @example {
   *   "incident_updates": [
   *     {
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "incident_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "message": "The cat is getting irritable, best rescue it soon",
   *       "new_incident_status": {
   *         "category": "triage",
   *         "created_at": "2021-08-17T13:28:57.801578Z",
   *         "description": "Impact has been **fully mitigated**, and we're ready to learn from this incident.",
   *         "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *         "name": "Closed",
   *         "rank": 4,
   *         "updated_at": "2021-08-17T13:28:57.801578Z"
   *       },
   *       "new_severity": {
   *         "created_at": "2021-08-17T13:28:57.801578Z",
   *         "description": "Issues with **low impact**.",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "Minor",
   *         "rank": 1,
   *         "updated_at": "2021-08-17T13:28:57.801578Z"
   *       },
   *       "updater": {
   *         "api_key": {
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "name": "My test API key"
   *         },
   *         "user": {
   *           "email": "lisa@incident.io",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "name": "Lisa Karlin Curtis",
   *           "role": "viewer",
   *           "slack_user_id": "U02AYNF2XJM"
   *         }
   *       }
   *     }
   *   ],
   *   "pagination_meta": {
   *     "after": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "page_size": 25
   *   }
   * }
   */
  IncidentUpdatesV2ListResponseBody: {
    /**
     * @example [
     *   {
     *     "created_at": "2021-08-17T13:28:57.801578Z",
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "incident_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "message": "The cat is getting irritable, best rescue it soon",
     *     "new_incident_status": {
     *       "category": "triage",
     *       "created_at": "2021-08-17T13:28:57.801578Z",
     *       "description": "Impact has been **fully mitigated**, and we're ready to learn from this incident.",
     *       "id": "01FCNDV6P870EA6S7TK1DSYD5H",
     *       "name": "Closed",
     *       "rank": 4,
     *       "updated_at": "2021-08-17T13:28:57.801578Z"
     *     },
     *     "new_severity": {
     *       "created_at": "2021-08-17T13:28:57.801578Z",
     *       "description": "Issues with **low impact**.",
     *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *       "name": "Minor",
     *       "rank": 1,
     *       "updated_at": "2021-08-17T13:28:57.801578Z"
     *     },
     *     "updater": {
     *       "api_key": {
     *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *         "name": "My test API key"
     *       },
     *       "user": {
     *         "email": "lisa@incident.io",
     *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *         "name": "Lisa Karlin Curtis",
     *         "role": "viewer",
     *         "slack_user_id": "U02AYNF2XJM"
     *       }
     *     }
     *   }
     * ]
     */
    incident_updates: definitions['IncidentUpdateV2ResponseBody'][];
    pagination_meta?: definitions['PaginationMetaResultResponseBody'];
  };
  /**
   * IncidentV1ResponseBody
   * @example {
   *   "call_url": "https://zoom.us/foo",
   *   "created_at": "2021-08-17T13:28:57.801578Z",
   *   "creator": {
   *     "api_key": {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "My test API key"
   *     },
   *     "user": {
   *       "email": "lisa@incident.io",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Lisa Karlin Curtis",
   *       "role": "viewer",
   *       "slack_user_id": "U02AYNF2XJM"
   *     }
   *   },
   *   "custom_field_entries": [
   *     {
   *       "custom_field": {
   *         "description": "Which team is impacted by this issue",
   *         "field_type": "single_select",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "Affected Team",
   *         "options": [
   *           {
   *             "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *             "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *             "sort_key": 10,
   *             "value": "Product"
   *           }
   *         ]
   *       },
   *       "values": [
   *         {
   *           "value_link": "https://google.com/",
   *           "value_numeric": "123.456",
   *           "value_option": {
   *             "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *             "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *             "sort_key": 10,
   *             "value": "Product"
   *           },
   *           "value_text": "This is my text field, I hope you like it"
   *         }
   *       ]
   *     }
   *   ],
   *   "id": "01FDAG4SAP5TYPT98WGR2N7W91",
   *   "incident_role_assignments": [
   *     {
   *       "assignee": {
   *         "email": "lisa@incident.io",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "Lisa Karlin Curtis",
   *         "role": "viewer",
   *         "slack_user_id": "U02AYNF2XJM"
   *       },
   *       "role": {
   *         "created_at": "2021-08-17T13:28:57.801578Z",
   *         "description": "The person currently coordinating the incident",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
   *         "name": "Incident Lead",
   *         "required": true,
   *         "role_type": "lead",
   *         "shortform": "lead",
   *         "updated_at": "2021-08-17T13:28:57.801578Z"
   *       }
   *     }
   *   ],
   *   "incident_type": {
   *     "create_in_triage": "always",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Customer facing production outages",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "is_default": false,
   *     "name": "Production Outage",
   *     "private_incidents_only": false,
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   },
   *   "mode": "real",
   *   "name": "Our database is sad",
   *   "permalink": "https://app.incident.io/incidents/123",
   *   "postmortem_document_url": "https://docs.google.com/my_doc_id",
   *   "reference": "INC-123",
   *   "severity": {
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Issues with **low impact**.",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "name": "Minor",
   *     "rank": 1,
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   },
   *   "slack_channel_id": "C02AW36C1M5",
   *   "slack_channel_name": "inc-165-green-parrot",
   *   "slack_team_id": "T02A1FSLE8J",
   *   "status": "triage",
   *   "summary": "Our database is really really sad, and we don't know why yet.",
   *   "timestamps": [
   *     {
   *       "last_occurred_at": "2021-08-17T13:28:57.801578Z",
   *       "name": "last_activity"
   *     }
   *   ],
   *   "updated_at": "2021-08-17T13:28:57.801578Z",
   *   "visibility": "public"
   * }
   */
  IncidentV1ResponseBody: {
    /**
     * @description The call URL attached to this incident
     * @example https://zoom.us/foo
     */
    call_url?: string;
    /**
     * Format: date-time
     * @description When the incident was created
     * @example 2021-08-17T13:28:57.801578Z
     */
    created_at: string;
    creator: definitions['ActorV1ResponseBody'];
    /**
     * @description Custom field entries for this incident
     * @example [
     *   {
     *     "custom_field": {
     *       "description": "Which team is impacted by this issue",
     *       "field_type": "single_select",
     *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *       "name": "Affected Team",
     *       "options": [
     *         {
     *           "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *           "sort_key": 10,
     *           "value": "Product"
     *         }
     *       ]
     *     },
     *     "values": [
     *       {
     *         "value_link": "https://google.com/",
     *         "value_numeric": "123.456",
     *         "value_option": {
     *           "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *           "sort_key": 10,
     *           "value": "Product"
     *         },
     *         "value_text": "This is my text field, I hope you like it"
     *       }
     *     ]
     *   }
     * ]
     */
    custom_field_entries: definitions['CustomFieldEntryV1ResponseBody'][];
    /**
     * @description Unique identifier for the incident
     * @example 01FDAG4SAP5TYPT98WGR2N7W91
     */
    id: string;
    /**
     * @description A list of who is assigned to each role for this incident
     * @example [
     *   {
     *     "assignee": {
     *       "email": "lisa@incident.io",
     *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *       "name": "Lisa Karlin Curtis",
     *       "role": "viewer",
     *       "slack_user_id": "U02AYNF2XJM"
     *     },
     *     "role": {
     *       "created_at": "2021-08-17T13:28:57.801578Z",
     *       "description": "The person currently coordinating the incident",
     *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *       "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
     *       "name": "Incident Lead",
     *       "required": true,
     *       "role_type": "lead",
     *       "shortform": "lead",
     *       "updated_at": "2021-08-17T13:28:57.801578Z"
     *     }
     *   }
     * ]
     */
    incident_role_assignments: definitions['IncidentRoleAssignmentV1ResponseBody'][];
    incident_type?: definitions['IncidentTypeV1ResponseBody'];
    /**
     * @description Whether the incident is real, a test, a tutorial, or importing as a retrospective incident
     * @example real
     * @enum {string}
     */
    mode: 'real' | 'test' | 'tutorial';
    /**
     * @description Explanation of the incident
     * @example Our database is sad
     */
    name: string;
    /**
     * @description A permanent link to the homepage for this incident
     * @example https://app.incident.io/incidents/123
     */
    permalink?: string;
    /**
     * @description Description of the incident
     * @example https://docs.google.com/my_doc_id
     */
    postmortem_document_url?: string;
    /**
     * @description Reference to this incident, as displayed across the product
     * @example INC-123
     */
    reference: string;
    severity?: definitions['SeverityV1ResponseBody'];
    /**
     * @description ID of the Slack channel in the organisation Slack workspace
     * @example C02AW36C1M5
     */
    slack_channel_id: string;
    /**
     * @description Name of the slack channel
     * @example inc-165-green-parrot
     */
    slack_channel_name?: string;
    /**
     * @description ID of the Slack team / workspace
     * @example T02A1FSLE8J
     */
    slack_team_id: string;
    /**
     * @description Current status of the incident
     * @example triage
     * @enum {string}
     */
    status:
      | 'triage'
      | 'investigating'
      | 'fixing'
      | 'monitoring'
      | 'closed'
      | 'declined';
    /**
     * @description Detailed description of the incident
     * @example Our database is really really sad, and we don't know why yet.
     */
    summary?: string;
    /**
     * @description Incident lifecycle events and when they last occurred
     * @example [
     *   {
     *     "last_occurred_at": "2021-08-17T13:28:57.801578Z",
     *     "name": "last_activity"
     *   }
     * ]
     */
    timestamps?: definitions['IncidentTimestampV1ResponseBody'][];
    /**
     * Format: date-time
     * @description When the incident was last updated
     * @example 2021-08-17T13:28:57.801578Z
     */
    updated_at: string;
    /**
     * @description Whether the incident should be open to anyone in your Slack workspace (public), or invite-only (private). For more information on Private Incidents see our [help centre](https://help.incident.io/en/articles/5947963-can-we-mark-incidents-as-sensitive-and-restrict-access).
     * @example public
     * @enum {string}
     */
    visibility: 'public' | 'private';
  } & {
    external_id: unknown;
    incident_status: unknown;
    idempotency_key: unknown;
    organisation_id: unknown;
    last_activity_at: unknown;
    active_participants: unknown;
    passive_participants: unknown;
    reported_at: unknown;
  };
  /**
   * IncidentV2ResponseBody
   * @example {
   *   "call_url": "https://zoom.us/foo",
   *   "created_at": "2021-08-17T13:28:57.801578Z",
   *   "creator": {
   *     "api_key": {
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "My test API key"
   *     },
   *     "user": {
   *       "email": "lisa@incident.io",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Lisa Karlin Curtis",
   *       "role": "viewer",
   *       "slack_user_id": "U02AYNF2XJM"
   *     }
   *   },
   *   "custom_field_entries": [
   *     {
   *       "custom_field": {
   *         "description": "Which team is impacted by this issue",
   *         "field_type": "single_select",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "Affected Team",
   *         "options": [
   *           {
   *             "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *             "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *             "sort_key": 10,
   *             "value": "Product"
   *           }
   *         ]
   *       },
   *       "values": [
   *         {
   *           "value_link": "https://google.com/",
   *           "value_numeric": "123.456",
   *           "value_option": {
   *             "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *             "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *             "sort_key": 10,
   *             "value": "Product"
   *           },
   *           "value_text": "This is my text field, I hope you like it"
   *         }
   *       ]
   *     }
   *   ],
   *   "external_issue_reference": {
   *     "issue_name": "INC-123",
   *     "issue_permalink": "https://linear.app/incident-io/issue/INC-1609/find-copywriter-to-write-up",
   *     "provider": "asana"
   *   },
   *   "id": "01FDAG4SAP5TYPT98WGR2N7W91",
   *   "incident_role_assignments": [
   *     {
   *       "assignee": {
   *         "email": "lisa@incident.io",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "Lisa Karlin Curtis",
   *         "role": "viewer",
   *         "slack_user_id": "U02AYNF2XJM"
   *       },
   *       "role": {
   *         "created_at": "2021-08-17T13:28:57.801578Z",
   *         "description": "The person currently coordinating the incident",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
   *         "name": "Incident Lead",
   *         "required": true,
   *         "role_type": "lead",
   *         "shortform": "lead",
   *         "updated_at": "2021-08-17T13:28:57.801578Z"
   *       }
   *     }
   *   ],
   *   "incident_status": {
   *     "category": "triage",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Impact has been **fully mitigated**, and we're ready to learn from this incident.",
   *     "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *     "name": "Closed",
   *     "rank": 4,
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   },
   *   "incident_timestamp_values": [
   *     {
   *       "incident_timestamp": {
   *         "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *         "name": "Impact started",
   *         "rank": 1
   *       },
   *       "value": {
   *         "value": "2021-08-17T13:28:57.801578Z"
   *       }
   *     }
   *   ],
   *   "incident_type": {
   *     "create_in_triage": "always",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Customer facing production outages",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "is_default": false,
   *     "name": "Production Outage",
   *     "private_incidents_only": false,
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   },
   *   "mode": "standard",
   *   "name": "Our database is sad",
   *   "permalink": "https://app.incident.io/incidents/123",
   *   "postmortem_document_url": "https://docs.google.com/my_doc_id",
   *   "reference": "INC-123",
   *   "severity": {
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Issues with **low impact**.",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "name": "Minor",
   *     "rank": 1,
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   },
   *   "slack_channel_id": "C02AW36C1M5",
   *   "slack_channel_name": "inc-165-green-parrot",
   *   "slack_team_id": "T02A1FSLE8J",
   *   "summary": "Our database is really really sad, and we don't know why yet.",
   *   "updated_at": "2021-08-17T13:28:57.801578Z",
   *   "visibility": "public"
   * }
   */
  IncidentV2ResponseBody: {
    /**
     * @description The call URL attached to this incident
     * @example https://zoom.us/foo
     */
    call_url?: string;
    /**
     * Format: date-time
     * @description When the incident was created
     * @example 2021-08-17T13:28:57.801578Z
     */
    created_at: string;
    creator: definitions['ActorV2ResponseBody'];
    /**
     * @description Custom field entries for this incident
     * @example [
     *   {
     *     "custom_field": {
     *       "description": "Which team is impacted by this issue",
     *       "field_type": "single_select",
     *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *       "name": "Affected Team",
     *       "options": [
     *         {
     *           "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *           "sort_key": 10,
     *           "value": "Product"
     *         }
     *       ]
     *     },
     *     "values": [
     *       {
     *         "value_link": "https://google.com/",
     *         "value_numeric": "123.456",
     *         "value_option": {
     *           "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *           "sort_key": 10,
     *           "value": "Product"
     *         },
     *         "value_text": "This is my text field, I hope you like it"
     *       }
     *     ]
     *   }
     * ]
     */
    custom_field_entries: definitions['CustomFieldEntryV2ResponseBody'][];
    external_issue_reference?: definitions['ExternalIssueReferenceV2ResponseBody'];
    /**
     * @description Unique identifier for the incident
     * @example 01FDAG4SAP5TYPT98WGR2N7W91
     */
    id: string;
    /**
     * @description A list of who is assigned to each role for this incident
     * @example [
     *   {
     *     "assignee": {
     *       "email": "lisa@incident.io",
     *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *       "name": "Lisa Karlin Curtis",
     *       "role": "viewer",
     *       "slack_user_id": "U02AYNF2XJM"
     *     },
     *     "role": {
     *       "created_at": "2021-08-17T13:28:57.801578Z",
     *       "description": "The person currently coordinating the incident",
     *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *       "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
     *       "name": "Incident Lead",
     *       "required": true,
     *       "role_type": "lead",
     *       "shortform": "lead",
     *       "updated_at": "2021-08-17T13:28:57.801578Z"
     *     }
     *   }
     * ]
     */
    incident_role_assignments: definitions['IncidentRoleAssignmentV2ResponseBody'][];
    incident_status: definitions['IncidentStatusV2ResponseBody'];
    /**
     * @description Incident lifecycle events and when they occurred
     * @example [
     *   {
     *     "incident_timestamp": {
     *       "id": "01FCNDV6P870EA6S7TK1DSYD5H",
     *       "name": "Impact started",
     *       "rank": 1
     *     },
     *     "value": {
     *       "value": "2021-08-17T13:28:57.801578Z"
     *     }
     *   }
     * ]
     */
    incident_timestamp_values?: definitions['IncidentTimestampWithValueV2ResponseBody'][];
    incident_type?: definitions['IncidentTypeV2ResponseBody'];
    /**
     * @description Whether the incident is real, a test, a tutorial, or importing as a retrospective incident
     * @example standard
     * @enum {string}
     */
    mode: 'standard' | 'retrospective' | 'test' | 'tutorial';
    /**
     * @description Explanation of the incident
     * @example Our database is sad
     */
    name: string;
    /**
     * @description A permanent link to the homepage for this incident
     * @example https://app.incident.io/incidents/123
     */
    permalink?: string;
    /**
     * @description Description of the incident
     * @example https://docs.google.com/my_doc_id
     */
    postmortem_document_url?: string;
    /**
     * @description Reference to this incident, as displayed across the product
     * @example INC-123
     */
    reference: string;
    severity?: definitions['SeverityV2ResponseBody'];
    /**
     * @description ID of the Slack channel in the organisation Slack workspace
     * @example C02AW36C1M5
     */
    slack_channel_id: string;
    /**
     * @description Name of the slack channel
     * @example inc-165-green-parrot
     */
    slack_channel_name?: string;
    /**
     * @description ID of the Slack team / workspace
     * @example T02A1FSLE8J
     */
    slack_team_id: string;
    /**
     * @description Detailed description of the incident
     * @example Our database is really really sad, and we don't know why yet.
     */
    summary?: string;
    /**
     * Format: date-time
     * @description When the incident was last updated
     * @example 2021-08-17T13:28:57.801578Z
     */
    updated_at: string;
    /**
     * @description Whether the incident should be open to anyone in your Slack workspace (public), or invite-only (private). For more information on Private Incidents see our [help centre](https://help.incident.io/en/articles/5947963-can-we-mark-incidents-as-sensitive-and-restrict-access).
     * @example public
     * @enum {string}
     */
    visibility: 'public' | 'private';
  } & {
    external_id: unknown;
    idempotency_key: unknown;
    organisation_id: unknown;
    last_activity_at: unknown;
    active_participants: unknown;
    passive_participants: unknown;
    reported_at: unknown;
  };
  /**
   * IncidentsV1CreateRequestBody
   * @example {
   *   "custom_field_entries": [
   *     {
   *       "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "values": [
   *         {
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "value_link": "https://google.com/",
   *           "value_numeric": "123.456",
   *           "value_option_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "value_text": "This is my text field, I hope you like it",
   *           "value_timestamp": ""
   *         }
   *       ]
   *     }
   *   ],
   *   "idempotency_key": "alert-uuid",
   *   "incident_role_assignments": [
   *     {
   *       "assignee": {
   *         "email": "bob@example.com",
   *         "id": "01G0J1EXE7AXZ2C93K61WBPYEH",
   *         "slack_user_id": "USER123"
   *       },
   *       "incident_role_id": "01FH5TZRWMNAFB0DZ23FD1TV96"
   *     }
   *   ],
   *   "incident_type_id": "01FH5TZRWMNAFB0DZ23FD1TV96",
   *   "mode": "real",
   *   "name": "Our database is sad",
   *   "severity_id": "01FH5TZRWMNAFB0DZ23FD1TV96",
   *   "slack_team_id": "T02A1FSLE8J",
   *   "source_message_channel_id": "C02AW36C1M5",
   *   "source_message_timestamp": "1653650280.526509",
   *   "status": "triage",
   *   "summary": "Our database is really really sad, and we don't know why yet.",
   *   "visibility": "public"
   * }
   */
  IncidentsV1CreateRequestBody: {
    /**
     * @description Set the incident's custom fields to these values
     * @example [
     *   {
     *     "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "values": [
     *       {
     *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *         "value_link": "https://google.com/",
     *         "value_numeric": "123.456",
     *         "value_option_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *         "value_text": "This is my text field, I hope you like it",
     *         "value_timestamp": ""
     *       }
     *     ]
     *   }
     * ]
     */
    custom_field_entries?: definitions['CustomFieldEntryPayloadV1RequestBody'][];
    /**
     * @description Unique string used to de-duplicate incident create requests
     * @example alert-uuid
     */
    idempotency_key: string;
    /**
     * @description Assign incident roles to these people
     * @example [
     *   {
     *     "assignee": {
     *       "email": "bob@example.com",
     *       "id": "01G0J1EXE7AXZ2C93K61WBPYEH",
     *       "slack_user_id": "USER123"
     *     },
     *     "incident_role_id": "01FH5TZRWMNAFB0DZ23FD1TV96"
     *   }
     * ]
     */
    incident_role_assignments?: definitions['IncidentRoleAssignmentPayloadV1RequestBody'][];
    /**
     * @description Incident type to create this incident as
     * @example 01FH5TZRWMNAFB0DZ23FD1TV96
     */
    incident_type_id?: string;
    /**
     * @description Whether the incident is real or test
     * @example real
     * @enum {string}
     */
    mode?: 'real' | 'test';
    /**
     * @description Explanation of the incident
     * @example Our database is sad
     */
    name?: string;
    /**
     * @description Severity to create incident as
     * @example 01FH5TZRWMNAFB0DZ23FD1TV96
     */
    severity_id?: string;
    /**
     * @description ID of the Slack team / workspace
     * @example T02A1FSLE8J
     */
    slack_team_id?: string;
    /**
     * @description Channel ID of the source message, if this incident was created from one
     * @example C02AW36C1M5
     */
    source_message_channel_id?: string;
    /**
     * @description Timestamp of the source message, if this incident was created from one
     * @example 1653650280.526509
     */
    source_message_timestamp?: string;
    /**
     * @description Current status of the incident
     * @example triage
     * @enum {string}
     */
    status?:
      | 'triage'
      | 'investigating'
      | 'fixing'
      | 'monitoring'
      | 'closed'
      | 'declined';
    /**
     * @description Detailed description of the incident
     * @example Our database is really really sad, and we don't know why yet.
     */
    summary?: string;
    /**
     * @description Whether the incident should be open to anyone in your Slack workspace (public), or invite-only (private). For more information on Private Incidents see our [help centre](https://help.incident.io/en/articles/5947963-can-we-mark-incidents-as-sensitive-and-restrict-access).
     * @example public
     * @enum {string}
     */
    visibility: 'public' | 'private';
  };
  /**
   * IncidentsV1CreateResponseBody
   * @example {
   *   "incident": {
   *     "call_url": "https://zoom.us/foo",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "creator": {
   *       "api_key": {
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "My test API key"
   *       },
   *       "user": {
   *         "email": "lisa@incident.io",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "Lisa Karlin Curtis",
   *         "role": "viewer",
   *         "slack_user_id": "U02AYNF2XJM"
   *       }
   *     },
   *     "custom_field_entries": [
   *       {
   *         "custom_field": {
   *           "description": "Which team is impacted by this issue",
   *           "field_type": "single_select",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "name": "Affected Team",
   *           "options": [
   *             {
   *               "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "sort_key": 10,
   *               "value": "Product"
   *             }
   *           ]
   *         },
   *         "values": [
   *           {
   *             "value_link": "https://google.com/",
   *             "value_numeric": "123.456",
   *             "value_option": {
   *               "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "sort_key": 10,
   *               "value": "Product"
   *             },
   *             "value_text": "This is my text field, I hope you like it"
   *           }
   *         ]
   *       }
   *     ],
   *     "id": "01FDAG4SAP5TYPT98WGR2N7W91",
   *     "incident_role_assignments": [
   *       {
   *         "assignee": {
   *           "email": "lisa@incident.io",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "name": "Lisa Karlin Curtis",
   *           "role": "viewer",
   *           "slack_user_id": "U02AYNF2XJM"
   *         },
   *         "role": {
   *           "created_at": "2021-08-17T13:28:57.801578Z",
   *           "description": "The person currently coordinating the incident",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
   *           "name": "Incident Lead",
   *           "required": true,
   *           "role_type": "lead",
   *           "shortform": "lead",
   *           "updated_at": "2021-08-17T13:28:57.801578Z"
   *         }
   *       }
   *     ],
   *     "incident_type": {
   *       "create_in_triage": "always",
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Customer facing production outages",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "is_default": false,
   *       "name": "Production Outage",
   *       "private_incidents_only": false,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     },
   *     "mode": "real",
   *     "name": "Our database is sad",
   *     "permalink": "https://app.incident.io/incidents/123",
   *     "postmortem_document_url": "https://docs.google.com/my_doc_id",
   *     "reference": "INC-123",
   *     "severity": {
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Issues with **low impact**.",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Minor",
   *       "rank": 1,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     },
   *     "slack_channel_id": "C02AW36C1M5",
   *     "slack_channel_name": "inc-165-green-parrot",
   *     "slack_team_id": "T02A1FSLE8J",
   *     "status": "triage",
   *     "summary": "Our database is really really sad, and we don't know why yet.",
   *     "timestamps": [
   *       {
   *         "last_occurred_at": "2021-08-17T13:28:57.801578Z",
   *         "name": "last_activity"
   *       }
   *     ],
   *     "updated_at": "2021-08-17T13:28:57.801578Z",
   *     "visibility": "public"
   *   }
   * }
   */
  IncidentsV1CreateResponseBody: {
    incident: definitions['IncidentV1ResponseBody'];
  };
  /**
   * IncidentsV1ListResponseBody
   * @example {
   *   "incidents": [
   *     {
   *       "call_url": "https://zoom.us/foo",
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "creator": {
   *         "api_key": {
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "name": "My test API key"
   *         },
   *         "user": {
   *           "email": "lisa@incident.io",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "name": "Lisa Karlin Curtis",
   *           "role": "viewer",
   *           "slack_user_id": "U02AYNF2XJM"
   *         }
   *       },
   *       "custom_field_entries": [
   *         {
   *           "custom_field": {
   *             "description": "Which team is impacted by this issue",
   *             "field_type": "single_select",
   *             "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *             "name": "Affected Team",
   *             "options": [
   *               {
   *                 "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *                 "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *                 "sort_key": 10,
   *                 "value": "Product"
   *               }
   *             ]
   *           },
   *           "values": [
   *             {
   *               "value_link": "https://google.com/",
   *               "value_numeric": "123.456",
   *               "value_option": {
   *                 "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *                 "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *                 "sort_key": 10,
   *                 "value": "Product"
   *               },
   *               "value_text": "This is my text field, I hope you like it"
   *             }
   *           ]
   *         }
   *       ],
   *       "id": "01FDAG4SAP5TYPT98WGR2N7W91",
   *       "incident_role_assignments": [
   *         {
   *           "assignee": {
   *             "email": "lisa@incident.io",
   *             "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *             "name": "Lisa Karlin Curtis",
   *             "role": "viewer",
   *             "slack_user_id": "U02AYNF2XJM"
   *           },
   *           "role": {
   *             "created_at": "2021-08-17T13:28:57.801578Z",
   *             "description": "The person currently coordinating the incident",
   *             "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *             "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
   *             "name": "Incident Lead",
   *             "required": true,
   *             "role_type": "lead",
   *             "shortform": "lead",
   *             "updated_at": "2021-08-17T13:28:57.801578Z"
   *           }
   *         }
   *       ],
   *       "incident_type": {
   *         "create_in_triage": "always",
   *         "created_at": "2021-08-17T13:28:57.801578Z",
   *         "description": "Customer facing production outages",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "is_default": false,
   *         "name": "Production Outage",
   *         "private_incidents_only": false,
   *         "updated_at": "2021-08-17T13:28:57.801578Z"
   *       },
   *       "mode": "real",
   *       "name": "Our database is sad",
   *       "permalink": "https://app.incident.io/incidents/123",
   *       "postmortem_document_url": "https://docs.google.com/my_doc_id",
   *       "reference": "INC-123",
   *       "severity": {
   *         "created_at": "2021-08-17T13:28:57.801578Z",
   *         "description": "Issues with **low impact**.",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "Minor",
   *         "rank": 1,
   *         "updated_at": "2021-08-17T13:28:57.801578Z"
   *       },
   *       "slack_channel_id": "C02AW36C1M5",
   *       "slack_channel_name": "inc-165-green-parrot",
   *       "slack_team_id": "T02A1FSLE8J",
   *       "status": "triage",
   *       "summary": "Our database is really really sad, and we don't know why yet.",
   *       "timestamps": [
   *         {
   *           "last_occurred_at": "2021-08-17T13:28:57.801578Z",
   *           "name": "last_activity"
   *         }
   *       ],
   *       "updated_at": "2021-08-17T13:28:57.801578Z",
   *       "visibility": "public"
   *     }
   *   ],
   *   "pagination_meta": {
   *     "after": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "page_size": 25,
   *     "total_record_count": 238
   *   }
   * }
   */
  IncidentsV1ListResponseBody: {
    /**
     * @example [
     *   {
     *     "call_url": "https://zoom.us/foo",
     *     "created_at": "2021-08-17T13:28:57.801578Z",
     *     "creator": {
     *       "api_key": {
     *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *         "name": "My test API key"
     *       },
     *       "user": {
     *         "email": "lisa@incident.io",
     *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *         "name": "Lisa Karlin Curtis",
     *         "role": "viewer",
     *         "slack_user_id": "U02AYNF2XJM"
     *       }
     *     },
     *     "custom_field_entries": [
     *       {
     *         "custom_field": {
     *           "description": "Which team is impacted by this issue",
     *           "field_type": "single_select",
     *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *           "name": "Affected Team",
     *           "options": [
     *             {
     *               "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *               "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *               "sort_key": 10,
     *               "value": "Product"
     *             }
     *           ]
     *         },
     *         "values": [
     *           {
     *             "value_link": "https://google.com/",
     *             "value_numeric": "123.456",
     *             "value_option": {
     *               "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *               "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *               "sort_key": 10,
     *               "value": "Product"
     *             },
     *             "value_text": "This is my text field, I hope you like it"
     *           }
     *         ]
     *       }
     *     ],
     *     "id": "01FDAG4SAP5TYPT98WGR2N7W91",
     *     "incident_role_assignments": [
     *       {
     *         "assignee": {
     *           "email": "lisa@incident.io",
     *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *           "name": "Lisa Karlin Curtis",
     *           "role": "viewer",
     *           "slack_user_id": "U02AYNF2XJM"
     *         },
     *         "role": {
     *           "created_at": "2021-08-17T13:28:57.801578Z",
     *           "description": "The person currently coordinating the incident",
     *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *           "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
     *           "name": "Incident Lead",
     *           "required": true,
     *           "role_type": "lead",
     *           "shortform": "lead",
     *           "updated_at": "2021-08-17T13:28:57.801578Z"
     *         }
     *       }
     *     ],
     *     "incident_type": {
     *       "create_in_triage": "always",
     *       "created_at": "2021-08-17T13:28:57.801578Z",
     *       "description": "Customer facing production outages",
     *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *       "is_default": false,
     *       "name": "Production Outage",
     *       "private_incidents_only": false,
     *       "updated_at": "2021-08-17T13:28:57.801578Z"
     *     },
     *     "mode": "real",
     *     "name": "Our database is sad",
     *     "permalink": "https://app.incident.io/incidents/123",
     *     "postmortem_document_url": "https://docs.google.com/my_doc_id",
     *     "reference": "INC-123",
     *     "severity": {
     *       "created_at": "2021-08-17T13:28:57.801578Z",
     *       "description": "Issues with **low impact**.",
     *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *       "name": "Minor",
     *       "rank": 1,
     *       "updated_at": "2021-08-17T13:28:57.801578Z"
     *     },
     *     "slack_channel_id": "C02AW36C1M5",
     *     "slack_channel_name": "inc-165-green-parrot",
     *     "slack_team_id": "T02A1FSLE8J",
     *     "status": "triage",
     *     "summary": "Our database is really really sad, and we don't know why yet.",
     *     "timestamps": [
     *       {
     *         "last_occurred_at": "2021-08-17T13:28:57.801578Z",
     *         "name": "last_activity"
     *       }
     *     ],
     *     "updated_at": "2021-08-17T13:28:57.801578Z",
     *     "visibility": "public"
     *   }
     * ]
     */
    incidents: definitions['IncidentV1ResponseBody'][];
    pagination_meta?: definitions['PaginationMetaResultWithTotalResponseBody'];
  };
  /**
   * IncidentsV1ShowResponseBody
   * @example {
   *   "incident": {
   *     "call_url": "https://zoom.us/foo",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "creator": {
   *       "api_key": {
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "My test API key"
   *       },
   *       "user": {
   *         "email": "lisa@incident.io",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "Lisa Karlin Curtis",
   *         "role": "viewer",
   *         "slack_user_id": "U02AYNF2XJM"
   *       }
   *     },
   *     "custom_field_entries": [
   *       {
   *         "custom_field": {
   *           "description": "Which team is impacted by this issue",
   *           "field_type": "single_select",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "name": "Affected Team",
   *           "options": [
   *             {
   *               "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "sort_key": 10,
   *               "value": "Product"
   *             }
   *           ]
   *         },
   *         "values": [
   *           {
   *             "value_link": "https://google.com/",
   *             "value_numeric": "123.456",
   *             "value_option": {
   *               "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "sort_key": 10,
   *               "value": "Product"
   *             },
   *             "value_text": "This is my text field, I hope you like it"
   *           }
   *         ]
   *       }
   *     ],
   *     "id": "01FDAG4SAP5TYPT98WGR2N7W91",
   *     "incident_role_assignments": [
   *       {
   *         "assignee": {
   *           "email": "lisa@incident.io",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "name": "Lisa Karlin Curtis",
   *           "role": "viewer",
   *           "slack_user_id": "U02AYNF2XJM"
   *         },
   *         "role": {
   *           "created_at": "2021-08-17T13:28:57.801578Z",
   *           "description": "The person currently coordinating the incident",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
   *           "name": "Incident Lead",
   *           "required": true,
   *           "role_type": "lead",
   *           "shortform": "lead",
   *           "updated_at": "2021-08-17T13:28:57.801578Z"
   *         }
   *       }
   *     ],
   *     "incident_type": {
   *       "create_in_triage": "always",
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Customer facing production outages",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "is_default": false,
   *       "name": "Production Outage",
   *       "private_incidents_only": false,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     },
   *     "mode": "real",
   *     "name": "Our database is sad",
   *     "permalink": "https://app.incident.io/incidents/123",
   *     "postmortem_document_url": "https://docs.google.com/my_doc_id",
   *     "reference": "INC-123",
   *     "severity": {
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Issues with **low impact**.",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Minor",
   *       "rank": 1,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     },
   *     "slack_channel_id": "C02AW36C1M5",
   *     "slack_channel_name": "inc-165-green-parrot",
   *     "slack_team_id": "T02A1FSLE8J",
   *     "status": "triage",
   *     "summary": "Our database is really really sad, and we don't know why yet.",
   *     "timestamps": [
   *       {
   *         "last_occurred_at": "2021-08-17T13:28:57.801578Z",
   *         "name": "last_activity"
   *       }
   *     ],
   *     "updated_at": "2021-08-17T13:28:57.801578Z",
   *     "visibility": "public"
   *   }
   * }
   */
  IncidentsV1ShowResponseBody: {
    incident: definitions['IncidentV1ResponseBody'];
  };
  /**
   * IncidentsV2CreateRequestBody
   * @example {
   *   "custom_field_entries": [
   *     {
   *       "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "values": [
   *         {
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "value_link": "https://google.com/",
   *           "value_numeric": "123.456",
   *           "value_option_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "value_text": "This is my text field, I hope you like it",
   *           "value_timestamp": ""
   *         }
   *       ]
   *     }
   *   ],
   *   "id": "01FDAG4SAP5TYPT98WGR2N7W91",
   *   "idempotency_key": "alert-uuid",
   *   "incident_role_assignments": [
   *     {
   *       "assignee": {
   *         "email": "bob@example.com",
   *         "id": "01G0J1EXE7AXZ2C93K61WBPYEH",
   *         "slack_user_id": "USER123"
   *       },
   *       "incident_role_id": "01FH5TZRWMNAFB0DZ23FD1TV96"
   *     }
   *   ],
   *   "incident_status_id": "01G0J1EXE7AXZ2C93K61WBPYEH",
   *   "incident_timestamp_values": [
   *     {
   *       "incident_timestamp_id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *       "value": "2021-08-17T13:28:57.801578Z"
   *     }
   *   ],
   *   "incident_type_id": "01FH5TZRWMNAFB0DZ23FD1TV96",
   *   "mode": "standard",
   *   "name": "Our database is sad",
   *   "retrospective_incident_options": {
   *     "slack_channel_id": "abc123"
   *   },
   *   "severity_id": "01FH5TZRWMNAFB0DZ23FD1TV96",
   *   "slack_team_id": "T02A1FSLE8J",
   *   "summary": "Our database is really really sad, and we don't know why yet.",
   *   "visibility": "public"
   * }
   */
  IncidentsV2CreateRequestBody: {
    /**
     * @description Set the incident's custom fields to these values
     * @example [
     *   {
     *     "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "values": [
     *       {
     *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *         "value_link": "https://google.com/",
     *         "value_numeric": "123.456",
     *         "value_option_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *         "value_text": "This is my text field, I hope you like it",
     *         "value_timestamp": ""
     *       }
     *     ]
     *   }
     * ]
     */
    custom_field_entries?: definitions['CustomFieldEntryPayloadV2RequestBody'][];
    /**
     * @description Unique identifier for the incident
     * @example 01FDAG4SAP5TYPT98WGR2N7W91
     */
    id?: string;
    /**
     * @description Unique string used to de-duplicate incident create requests
     * @example alert-uuid
     */
    idempotency_key: string;
    /**
     * @description Assign incident roles to these people
     * @example [
     *   {
     *     "assignee": {
     *       "email": "bob@example.com",
     *       "id": "01G0J1EXE7AXZ2C93K61WBPYEH",
     *       "slack_user_id": "USER123"
     *     },
     *     "incident_role_id": "01FH5TZRWMNAFB0DZ23FD1TV96"
     *   }
     * ]
     */
    incident_role_assignments?: definitions['IncidentRoleAssignmentPayloadV2RequestBody'][];
    /**
     * @description Incident status to assign to the incident
     * @example 01G0J1EXE7AXZ2C93K61WBPYEH
     */
    incident_status_id?: string;
    /**
     * @description Assign the incident's timestamps to these values
     * @example [
     *   {
     *     "incident_timestamp_id": "01FCNDV6P870EA6S7TK1DSYD5H",
     *     "value": "2021-08-17T13:28:57.801578Z"
     *   }
     * ]
     */
    incident_timestamp_values?: definitions['IncidentTimestampValuePayloadV2RequestBody'][];
    /**
     * @description Incident type to create this incident as
     * @example 01FH5TZRWMNAFB0DZ23FD1TV96
     */
    incident_type_id?: string;
    /**
     * @description Whether the incident is real, a test, a tutorial, or importing as a retrospective incident
     * @example standard
     * @enum {string}
     */
    mode?: 'standard' | 'retrospective' | 'test' | 'tutorial';
    /**
     * @description Explanation of the incident
     * @example Our database is sad
     */
    name?: string;
    retrospective_incident_options?: definitions['RetrospectiveIncidentOptionsV2RequestBody'];
    /**
     * @description Severity to create incident as
     * @example 01FH5TZRWMNAFB0DZ23FD1TV96
     */
    severity_id?: string;
    /**
     * @description Slack Team to create the incident in
     * @example T02A1FSLE8J
     */
    slack_team_id?: string;
    /**
     * @description Detailed description of the incident
     * @example Our database is really really sad, and we don't know why yet.
     */
    summary?: string;
    /**
     * @description Whether the incident should be open to anyone in your Slack workspace (public), or invite-only (private). For more information on Private Incidents see our [help centre](https://help.incident.io/en/articles/5947963-can-we-mark-incidents-as-sensitive-and-restrict-access).
     * @example public
     * @enum {string}
     */
    visibility: 'public' | 'private';
  };
  /**
   * IncidentsV2CreateResponseBody
   * @example {
   *   "incident": {
   *     "call_url": "https://zoom.us/foo",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "creator": {
   *       "api_key": {
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "My test API key"
   *       },
   *       "user": {
   *         "email": "lisa@incident.io",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "Lisa Karlin Curtis",
   *         "role": "viewer",
   *         "slack_user_id": "U02AYNF2XJM"
   *       }
   *     },
   *     "custom_field_entries": [
   *       {
   *         "custom_field": {
   *           "description": "Which team is impacted by this issue",
   *           "field_type": "single_select",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "name": "Affected Team",
   *           "options": [
   *             {
   *               "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "sort_key": 10,
   *               "value": "Product"
   *             }
   *           ]
   *         },
   *         "values": [
   *           {
   *             "value_link": "https://google.com/",
   *             "value_numeric": "123.456",
   *             "value_option": {
   *               "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "sort_key": 10,
   *               "value": "Product"
   *             },
   *             "value_text": "This is my text field, I hope you like it"
   *           }
   *         ]
   *       }
   *     ],
   *     "external_issue_reference": {
   *       "issue_name": "INC-123",
   *       "issue_permalink": "https://linear.app/incident-io/issue/INC-1609/find-copywriter-to-write-up",
   *       "provider": "asana"
   *     },
   *     "id": "01FDAG4SAP5TYPT98WGR2N7W91",
   *     "incident_role_assignments": [
   *       {
   *         "assignee": {
   *           "email": "lisa@incident.io",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "name": "Lisa Karlin Curtis",
   *           "role": "viewer",
   *           "slack_user_id": "U02AYNF2XJM"
   *         },
   *         "role": {
   *           "created_at": "2021-08-17T13:28:57.801578Z",
   *           "description": "The person currently coordinating the incident",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
   *           "name": "Incident Lead",
   *           "required": true,
   *           "role_type": "lead",
   *           "shortform": "lead",
   *           "updated_at": "2021-08-17T13:28:57.801578Z"
   *         }
   *       }
   *     ],
   *     "incident_status": {
   *       "category": "triage",
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Impact has been **fully mitigated**, and we're ready to learn from this incident.",
   *       "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *       "name": "Closed",
   *       "rank": 4,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     },
   *     "incident_timestamp_values": [
   *       {
   *         "incident_timestamp": {
   *           "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *           "name": "Impact started",
   *           "rank": 1
   *         },
   *         "value": {
   *           "value": "2021-08-17T13:28:57.801578Z"
   *         }
   *       }
   *     ],
   *     "incident_type": {
   *       "create_in_triage": "always",
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Customer facing production outages",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "is_default": false,
   *       "name": "Production Outage",
   *       "private_incidents_only": false,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     },
   *     "mode": "standard",
   *     "name": "Our database is sad",
   *     "permalink": "https://app.incident.io/incidents/123",
   *     "postmortem_document_url": "https://docs.google.com/my_doc_id",
   *     "reference": "INC-123",
   *     "severity": {
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Issues with **low impact**.",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Minor",
   *       "rank": 1,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     },
   *     "slack_channel_id": "C02AW36C1M5",
   *     "slack_channel_name": "inc-165-green-parrot",
   *     "slack_team_id": "T02A1FSLE8J",
   *     "summary": "Our database is really really sad, and we don't know why yet.",
   *     "updated_at": "2021-08-17T13:28:57.801578Z",
   *     "visibility": "public"
   *   }
   * }
   */
  IncidentsV2CreateResponseBody: {
    incident: definitions['IncidentV2ResponseBody'];
  };
  /**
   * IncidentsV2EditRequestBody
   * @example {
   *   "incident": {
   *     "custom_field_entries": [
   *       {
   *         "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "values": [
   *           {
   *             "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *             "value_link": "https://google.com/",
   *             "value_numeric": "123.456",
   *             "value_option_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *             "value_text": "This is my text field, I hope you like it",
   *             "value_timestamp": ""
   *           }
   *         ]
   *       }
   *     ],
   *     "incident_timestamp_values": [
   *       {
   *         "incident_timestamp_id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *         "value": "2021-08-17T13:28:57.801578Z"
   *       }
   *     ],
   *     "name": "Our database is sad",
   *     "severity_id": "01FH5TZRWMNAFB0DZ23FD1TV96",
   *     "summary": "Our database is really really sad, and we don't know why yet."
   *   },
   *   "notify_incident_channel": true
   * }
   */
  IncidentsV2EditRequestBody: {
    incident: definitions['IncidentEditPayloadV2RequestBody'];
    /**
     * @description Should we send Slack channel notifications to inform responders of this update? Note that this won't work if the Slack channel has already been archived.
     * @example true
     */
    notify_incident_channel: boolean;
  };
  /**
   * IncidentsV2EditResponseBody
   * @example {
   *   "incident": {
   *     "call_url": "https://zoom.us/foo",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "creator": {
   *       "api_key": {
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "My test API key"
   *       },
   *       "user": {
   *         "email": "lisa@incident.io",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "Lisa Karlin Curtis",
   *         "role": "viewer",
   *         "slack_user_id": "U02AYNF2XJM"
   *       }
   *     },
   *     "custom_field_entries": [
   *       {
   *         "custom_field": {
   *           "description": "Which team is impacted by this issue",
   *           "field_type": "single_select",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "name": "Affected Team",
   *           "options": [
   *             {
   *               "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "sort_key": 10,
   *               "value": "Product"
   *             }
   *           ]
   *         },
   *         "values": [
   *           {
   *             "value_link": "https://google.com/",
   *             "value_numeric": "123.456",
   *             "value_option": {
   *               "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "sort_key": 10,
   *               "value": "Product"
   *             },
   *             "value_text": "This is my text field, I hope you like it"
   *           }
   *         ]
   *       }
   *     ],
   *     "external_issue_reference": {
   *       "issue_name": "INC-123",
   *       "issue_permalink": "https://linear.app/incident-io/issue/INC-1609/find-copywriter-to-write-up",
   *       "provider": "asana"
   *     },
   *     "id": "01FDAG4SAP5TYPT98WGR2N7W91",
   *     "incident_role_assignments": [
   *       {
   *         "assignee": {
   *           "email": "lisa@incident.io",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "name": "Lisa Karlin Curtis",
   *           "role": "viewer",
   *           "slack_user_id": "U02AYNF2XJM"
   *         },
   *         "role": {
   *           "created_at": "2021-08-17T13:28:57.801578Z",
   *           "description": "The person currently coordinating the incident",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
   *           "name": "Incident Lead",
   *           "required": true,
   *           "role_type": "lead",
   *           "shortform": "lead",
   *           "updated_at": "2021-08-17T13:28:57.801578Z"
   *         }
   *       }
   *     ],
   *     "incident_status": {
   *       "category": "triage",
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Impact has been **fully mitigated**, and we're ready to learn from this incident.",
   *       "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *       "name": "Closed",
   *       "rank": 4,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     },
   *     "incident_timestamp_values": [
   *       {
   *         "incident_timestamp": {
   *           "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *           "name": "Impact started",
   *           "rank": 1
   *         },
   *         "value": {
   *           "value": "2021-08-17T13:28:57.801578Z"
   *         }
   *       }
   *     ],
   *     "incident_type": {
   *       "create_in_triage": "always",
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Customer facing production outages",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "is_default": false,
   *       "name": "Production Outage",
   *       "private_incidents_only": false,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     },
   *     "mode": "standard",
   *     "name": "Our database is sad",
   *     "permalink": "https://app.incident.io/incidents/123",
   *     "postmortem_document_url": "https://docs.google.com/my_doc_id",
   *     "reference": "INC-123",
   *     "severity": {
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Issues with **low impact**.",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Minor",
   *       "rank": 1,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     },
   *     "slack_channel_id": "C02AW36C1M5",
   *     "slack_channel_name": "inc-165-green-parrot",
   *     "slack_team_id": "T02A1FSLE8J",
   *     "summary": "Our database is really really sad, and we don't know why yet.",
   *     "updated_at": "2021-08-17T13:28:57.801578Z",
   *     "visibility": "public"
   *   }
   * }
   */
  IncidentsV2EditResponseBody: {
    incident: definitions['IncidentV2ResponseBody'];
  };
  /**
   * IncidentsV2ListResponseBody
   * @example {
   *   "incidents": [
   *     {
   *       "call_url": "https://zoom.us/foo",
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "creator": {
   *         "api_key": {
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "name": "My test API key"
   *         },
   *         "user": {
   *           "email": "lisa@incident.io",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "name": "Lisa Karlin Curtis",
   *           "role": "viewer",
   *           "slack_user_id": "U02AYNF2XJM"
   *         }
   *       },
   *       "custom_field_entries": [
   *         {
   *           "custom_field": {
   *             "description": "Which team is impacted by this issue",
   *             "field_type": "single_select",
   *             "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *             "name": "Affected Team",
   *             "options": [
   *               {
   *                 "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *                 "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *                 "sort_key": 10,
   *                 "value": "Product"
   *               }
   *             ]
   *           },
   *           "values": [
   *             {
   *               "value_link": "https://google.com/",
   *               "value_numeric": "123.456",
   *               "value_option": {
   *                 "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *                 "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *                 "sort_key": 10,
   *                 "value": "Product"
   *               },
   *               "value_text": "This is my text field, I hope you like it"
   *             }
   *           ]
   *         }
   *       ],
   *       "external_issue_reference": {
   *         "issue_name": "INC-123",
   *         "issue_permalink": "https://linear.app/incident-io/issue/INC-1609/find-copywriter-to-write-up",
   *         "provider": "asana"
   *       },
   *       "id": "01FDAG4SAP5TYPT98WGR2N7W91",
   *       "incident_role_assignments": [
   *         {
   *           "assignee": {
   *             "email": "lisa@incident.io",
   *             "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *             "name": "Lisa Karlin Curtis",
   *             "role": "viewer",
   *             "slack_user_id": "U02AYNF2XJM"
   *           },
   *           "role": {
   *             "created_at": "2021-08-17T13:28:57.801578Z",
   *             "description": "The person currently coordinating the incident",
   *             "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *             "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
   *             "name": "Incident Lead",
   *             "required": true,
   *             "role_type": "lead",
   *             "shortform": "lead",
   *             "updated_at": "2021-08-17T13:28:57.801578Z"
   *           }
   *         }
   *       ],
   *       "incident_status": {
   *         "category": "triage",
   *         "created_at": "2021-08-17T13:28:57.801578Z",
   *         "description": "Impact has been **fully mitigated**, and we're ready to learn from this incident.",
   *         "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *         "name": "Closed",
   *         "rank": 4,
   *         "updated_at": "2021-08-17T13:28:57.801578Z"
   *       },
   *       "incident_timestamp_values": [
   *         {
   *           "incident_timestamp": {
   *             "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *             "name": "Impact started",
   *             "rank": 1
   *           },
   *           "value": {
   *             "value": "2021-08-17T13:28:57.801578Z"
   *           }
   *         }
   *       ],
   *       "incident_type": {
   *         "create_in_triage": "always",
   *         "created_at": "2021-08-17T13:28:57.801578Z",
   *         "description": "Customer facing production outages",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "is_default": false,
   *         "name": "Production Outage",
   *         "private_incidents_only": false,
   *         "updated_at": "2021-08-17T13:28:57.801578Z"
   *       },
   *       "mode": "standard",
   *       "name": "Our database is sad",
   *       "permalink": "https://app.incident.io/incidents/123",
   *       "postmortem_document_url": "https://docs.google.com/my_doc_id",
   *       "reference": "INC-123",
   *       "severity": {
   *         "created_at": "2021-08-17T13:28:57.801578Z",
   *         "description": "Issues with **low impact**.",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "Minor",
   *         "rank": 1,
   *         "updated_at": "2021-08-17T13:28:57.801578Z"
   *       },
   *       "slack_channel_id": "C02AW36C1M5",
   *       "slack_channel_name": "inc-165-green-parrot",
   *       "slack_team_id": "T02A1FSLE8J",
   *       "summary": "Our database is really really sad, and we don't know why yet.",
   *       "updated_at": "2021-08-17T13:28:57.801578Z",
   *       "visibility": "public"
   *     }
   *   ],
   *   "pagination_meta": {
   *     "after": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "page_size": 25,
   *     "total_record_count": 238
   *   }
   * }
   */
  IncidentsV2ListResponseBody: {
    /**
     * @example [
     *   {
     *     "call_url": "https://zoom.us/foo",
     *     "created_at": "2021-08-17T13:28:57.801578Z",
     *     "creator": {
     *       "api_key": {
     *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *         "name": "My test API key"
     *       },
     *       "user": {
     *         "email": "lisa@incident.io",
     *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *         "name": "Lisa Karlin Curtis",
     *         "role": "viewer",
     *         "slack_user_id": "U02AYNF2XJM"
     *       }
     *     },
     *     "custom_field_entries": [
     *       {
     *         "custom_field": {
     *           "description": "Which team is impacted by this issue",
     *           "field_type": "single_select",
     *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *           "name": "Affected Team",
     *           "options": [
     *             {
     *               "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *               "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *               "sort_key": 10,
     *               "value": "Product"
     *             }
     *           ]
     *         },
     *         "values": [
     *           {
     *             "value_link": "https://google.com/",
     *             "value_numeric": "123.456",
     *             "value_option": {
     *               "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *               "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *               "sort_key": 10,
     *               "value": "Product"
     *             },
     *             "value_text": "This is my text field, I hope you like it"
     *           }
     *         ]
     *       }
     *     ],
     *     "external_issue_reference": {
     *       "issue_name": "INC-123",
     *       "issue_permalink": "https://linear.app/incident-io/issue/INC-1609/find-copywriter-to-write-up",
     *       "provider": "asana"
     *     },
     *     "id": "01FDAG4SAP5TYPT98WGR2N7W91",
     *     "incident_role_assignments": [
     *       {
     *         "assignee": {
     *           "email": "lisa@incident.io",
     *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *           "name": "Lisa Karlin Curtis",
     *           "role": "viewer",
     *           "slack_user_id": "U02AYNF2XJM"
     *         },
     *         "role": {
     *           "created_at": "2021-08-17T13:28:57.801578Z",
     *           "description": "The person currently coordinating the incident",
     *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *           "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
     *           "name": "Incident Lead",
     *           "required": true,
     *           "role_type": "lead",
     *           "shortform": "lead",
     *           "updated_at": "2021-08-17T13:28:57.801578Z"
     *         }
     *       }
     *     ],
     *     "incident_status": {
     *       "category": "triage",
     *       "created_at": "2021-08-17T13:28:57.801578Z",
     *       "description": "Impact has been **fully mitigated**, and we're ready to learn from this incident.",
     *       "id": "01FCNDV6P870EA6S7TK1DSYD5H",
     *       "name": "Closed",
     *       "rank": 4,
     *       "updated_at": "2021-08-17T13:28:57.801578Z"
     *     },
     *     "incident_timestamp_values": [
     *       {
     *         "incident_timestamp": {
     *           "id": "01FCNDV6P870EA6S7TK1DSYD5H",
     *           "name": "Impact started",
     *           "rank": 1
     *         },
     *         "value": {
     *           "value": "2021-08-17T13:28:57.801578Z"
     *         }
     *       }
     *     ],
     *     "incident_type": {
     *       "create_in_triage": "always",
     *       "created_at": "2021-08-17T13:28:57.801578Z",
     *       "description": "Customer facing production outages",
     *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *       "is_default": false,
     *       "name": "Production Outage",
     *       "private_incidents_only": false,
     *       "updated_at": "2021-08-17T13:28:57.801578Z"
     *     },
     *     "mode": "standard",
     *     "name": "Our database is sad",
     *     "permalink": "https://app.incident.io/incidents/123",
     *     "postmortem_document_url": "https://docs.google.com/my_doc_id",
     *     "reference": "INC-123",
     *     "severity": {
     *       "created_at": "2021-08-17T13:28:57.801578Z",
     *       "description": "Issues with **low impact**.",
     *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *       "name": "Minor",
     *       "rank": 1,
     *       "updated_at": "2021-08-17T13:28:57.801578Z"
     *     },
     *     "slack_channel_id": "C02AW36C1M5",
     *     "slack_channel_name": "inc-165-green-parrot",
     *     "slack_team_id": "T02A1FSLE8J",
     *     "summary": "Our database is really really sad, and we don't know why yet.",
     *     "updated_at": "2021-08-17T13:28:57.801578Z",
     *     "visibility": "public"
     *   }
     * ]
     */
    incidents: definitions['IncidentV2ResponseBody'][];
    pagination_meta?: definitions['PaginationMetaResultWithTotalResponseBody'];
  };
  /**
   * IncidentsV2ShowResponseBody
   * @example {
   *   "incident": {
   *     "call_url": "https://zoom.us/foo",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "creator": {
   *       "api_key": {
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "My test API key"
   *       },
   *       "user": {
   *         "email": "lisa@incident.io",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "Lisa Karlin Curtis",
   *         "role": "viewer",
   *         "slack_user_id": "U02AYNF2XJM"
   *       }
   *     },
   *     "custom_field_entries": [
   *       {
   *         "custom_field": {
   *           "description": "Which team is impacted by this issue",
   *           "field_type": "single_select",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "name": "Affected Team",
   *           "options": [
   *             {
   *               "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "sort_key": 10,
   *               "value": "Product"
   *             }
   *           ]
   *         },
   *         "values": [
   *           {
   *             "value_link": "https://google.com/",
   *             "value_numeric": "123.456",
   *             "value_option": {
   *               "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "sort_key": 10,
   *               "value": "Product"
   *             },
   *             "value_text": "This is my text field, I hope you like it"
   *           }
   *         ]
   *       }
   *     ],
   *     "external_issue_reference": {
   *       "issue_name": "INC-123",
   *       "issue_permalink": "https://linear.app/incident-io/issue/INC-1609/find-copywriter-to-write-up",
   *       "provider": "asana"
   *     },
   *     "id": "01FDAG4SAP5TYPT98WGR2N7W91",
   *     "incident_role_assignments": [
   *       {
   *         "assignee": {
   *           "email": "lisa@incident.io",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "name": "Lisa Karlin Curtis",
   *           "role": "viewer",
   *           "slack_user_id": "U02AYNF2XJM"
   *         },
   *         "role": {
   *           "created_at": "2021-08-17T13:28:57.801578Z",
   *           "description": "The person currently coordinating the incident",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
   *           "name": "Incident Lead",
   *           "required": true,
   *           "role_type": "lead",
   *           "shortform": "lead",
   *           "updated_at": "2021-08-17T13:28:57.801578Z"
   *         }
   *       }
   *     ],
   *     "incident_status": {
   *       "category": "triage",
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Impact has been **fully mitigated**, and we're ready to learn from this incident.",
   *       "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *       "name": "Closed",
   *       "rank": 4,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     },
   *     "incident_timestamp_values": [
   *       {
   *         "incident_timestamp": {
   *           "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *           "name": "Impact started",
   *           "rank": 1
   *         },
   *         "value": {
   *           "value": "2021-08-17T13:28:57.801578Z"
   *         }
   *       }
   *     ],
   *     "incident_type": {
   *       "create_in_triage": "always",
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Customer facing production outages",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "is_default": false,
   *       "name": "Production Outage",
   *       "private_incidents_only": false,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     },
   *     "mode": "standard",
   *     "name": "Our database is sad",
   *     "permalink": "https://app.incident.io/incidents/123",
   *     "postmortem_document_url": "https://docs.google.com/my_doc_id",
   *     "reference": "INC-123",
   *     "severity": {
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Issues with **low impact**.",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Minor",
   *       "rank": 1,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     },
   *     "slack_channel_id": "C02AW36C1M5",
   *     "slack_channel_name": "inc-165-green-parrot",
   *     "slack_team_id": "T02A1FSLE8J",
   *     "summary": "Our database is really really sad, and we don't know why yet.",
   *     "updated_at": "2021-08-17T13:28:57.801578Z",
   *     "visibility": "public"
   *   }
   * }
   */
  IncidentsV2ShowResponseBody: {
    incident: definitions['IncidentV2ResponseBody'];
  };
  /**
   * PaginationMetaResultResponseBody
   * @example {
   *   "after": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "page_size": 25
   * }
   */
  PaginationMetaResultResponseBody: {
    /**
     * @description If provided, pass this as the 'after' param to load the next page
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    after?: string;
    /**
     * Format: int64
     * @description What was the maximum number of results requested
     * @default 25
     * @example 25
     */
    page_size: number;
  };
  /**
   * PaginationMetaResultWithTotalResponseBody
   * @example {
   *   "after": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "page_size": 25,
   *   "total_record_count": 238
   * }
   */
  PaginationMetaResultWithTotalResponseBody: {
    /**
     * @description If provided, pass this as the 'after' param to load the next page
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    after?: string;
    /**
     * Format: int64
     * @description What was the maximum number of results requested
     * @default 25
     * @example 25
     */
    page_size: number;
    /**
     * Format: int64
     * @description How many matching records were there in total, if known
     * @example 238
     */
    total_record_count?: number;
  };
  /**
   * RetrospectiveIncidentOptionsV2RequestBody
   * @example {
   *   "slack_channel_id": "abc123"
   * }
   */
  RetrospectiveIncidentOptionsV2RequestBody: {
    /**
     * @description If the incident mode is 'retrospective', pass the ID of a Slack channel in your workspace to attach the incident to an existing channel, rather than creating a new one
     * @example abc123
     */
    slack_channel_id?: string;
  };
  /**
   * SeveritiesV1CreateRequestBody
   * @example {
   *   "description": "Issues with **low impact**.",
   *   "name": "Minor",
   *   "rank": 1
   * }
   */
  SeveritiesV1CreateRequestBody: {
    /**
     * @description Description of the severity
     * @example Issues with **low impact**.
     */
    description: string;
    /**
     * @description Human readable name of the severity
     * @example Minor
     */
    name: string;
    /**
     * Format: int64
     * @description Rank to help sort severities (lower numbers are less severe)
     * @example 1
     */
    rank?: number;
  };
  /**
   * SeveritiesV1CreateResponseBody
   * @example {
   *   "severity": {
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Issues with **low impact**.",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "name": "Minor",
   *     "rank": 1,
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  SeveritiesV1CreateResponseBody: {
    severity: definitions['SeverityV1ResponseBody'];
  };
  /**
   * SeveritiesV1ListResponseBody
   * @example {
   *   "severities": [
   *     {
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Issues with **low impact**.",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Minor",
   *       "rank": 1,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     }
   *   ]
   * }
   */
  SeveritiesV1ListResponseBody: {
    /**
     * @example [
     *   {
     *     "created_at": "2021-08-17T13:28:57.801578Z",
     *     "description": "Issues with **low impact**.",
     *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
     *     "name": "Minor",
     *     "rank": 1,
     *     "updated_at": "2021-08-17T13:28:57.801578Z"
     *   }
     * ]
     */
    severities: definitions['SeverityV1ResponseBody'][];
  };
  /**
   * SeveritiesV1ShowResponseBody
   * @example {
   *   "severity": {
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Issues with **low impact**.",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "name": "Minor",
   *     "rank": 1,
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  SeveritiesV1ShowResponseBody: {
    severity: definitions['SeverityV1ResponseBody'];
  };
  /**
   * SeveritiesV1UpdateRequestBody
   * @example {
   *   "description": "Issues with **low impact**.",
   *   "name": "Minor",
   *   "rank": 1
   * }
   */
  SeveritiesV1UpdateRequestBody: {
    /**
     * @description Description of the severity
     * @example Issues with **low impact**.
     */
    description: string;
    /**
     * @description Human readable name of the severity
     * @example Minor
     */
    name: string;
    /**
     * Format: int64
     * @description Rank to help sort severities (lower numbers are less severe)
     * @example 1
     */
    rank?: number;
  };
  /**
   * SeveritiesV1UpdateResponseBody
   * @example {
   *   "severity": {
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Issues with **low impact**.",
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "name": "Minor",
   *     "rank": 1,
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  SeveritiesV1UpdateResponseBody: {
    severity: definitions['SeverityV1ResponseBody'];
  };
  /**
   * SeverityV1ResponseBody
   * @example {
   *   "created_at": "2021-08-17T13:28:57.801578Z",
   *   "description": "Issues with **low impact**.",
   *   "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "name": "Minor",
   *   "rank": 1,
   *   "updated_at": "2021-08-17T13:28:57.801578Z"
   * }
   */
  SeverityV1ResponseBody: {
    /**
     * Format: date-time
     * @description When the action was created
     * @example 2021-08-17T13:28:57.801578Z
     */
    created_at: string;
    /**
     * @description Description of the severity
     * @example Issues with **low impact**.
     */
    description: string;
    /**
     * @description Unique identifier of the severity
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    id: string;
    /**
     * @description Human readable name of the severity
     * @example Minor
     */
    name: string;
    /**
     * Format: int64
     * @description Rank to help sort severities (lower numbers are less severe)
     * @example 1
     */
    rank: number;
    /**
     * Format: date-time
     * @description When the action was last updated
     * @example 2021-08-17T13:28:57.801578Z
     */
    updated_at: string;
  };
  /**
   * SeverityV2ResponseBody
   * @example {
   *   "created_at": "2021-08-17T13:28:57.801578Z",
   *   "description": "Issues with **low impact**.",
   *   "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "name": "Minor",
   *   "rank": 1,
   *   "updated_at": "2021-08-17T13:28:57.801578Z"
   * }
   */
  SeverityV2ResponseBody: {
    /**
     * Format: date-time
     * @description When the action was created
     * @example 2021-08-17T13:28:57.801578Z
     */
    created_at: string;
    /**
     * @description Description of the severity
     * @example Issues with **low impact**.
     */
    description: string;
    /**
     * @description Unique identifier of the severity
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    id: string;
    /**
     * @description Human readable name of the severity
     * @example Minor
     */
    name: string;
    /**
     * Format: int64
     * @description Rank to help sort severities (lower numbers are less severe)
     * @example 1
     */
    rank: number;
    /**
     * Format: date-time
     * @description When the action was last updated
     * @example 2021-08-17T13:28:57.801578Z
     */
    updated_at: string;
  };
  /**
   * UserReferencePayloadV1RequestBody
   * @example {
   *   "email": "bob@example.com",
   *   "id": "01G0J1EXE7AXZ2C93K61WBPYEH",
   *   "slack_user_id": "USER123"
   * }
   */
  UserReferencePayloadV1RequestBody: {
    /**
     * @description The user's email address, matching the email on their Slack account
     * @example bob@example.com
     */
    email?: string;
    /**
     * @description The incident.io ID of a user
     * @example 01G0J1EXE7AXZ2C93K61WBPYEH
     */
    id?: string;
    /**
     * @description The ID of the user's Slack account.
     * @example USER123
     */
    slack_user_id?: string;
  };
  /**
   * UserReferencePayloadV2RequestBody
   * @example {
   *   "email": "bob@example.com",
   *   "id": "01G0J1EXE7AXZ2C93K61WBPYEH",
   *   "slack_user_id": "USER123"
   * }
   */
  UserReferencePayloadV2RequestBody: {
    /**
     * @description The user's email address, matching the email on their Slack account
     * @example bob@example.com
     */
    email?: string;
    /**
     * @description The incident.io ID of a user
     * @example 01G0J1EXE7AXZ2C93K61WBPYEH
     */
    id?: string;
    /**
     * @description The ID of the user's Slack account.
     * @example USER123
     */
    slack_user_id?: string;
  };
  /**
   * UserV1ResponseBody
   * @example {
   *   "email": "lisa@incident.io",
   *   "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "name": "Lisa Karlin Curtis",
   *   "role": "viewer",
   *   "slack_user_id": "U02AYNF2XJM"
   * }
   */
  UserV1ResponseBody: {
    /**
     * @description Email address of the user.
     * @example lisa@incident.io
     */
    email?: string;
    /**
     * @description Unique identifier of the user
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    id: string;
    /**
     * @description Name of the user
     * @example Lisa Karlin Curtis
     */
    name: string;
    /**
     * @description DEPRECATED: Role of the user as of March 9th 2023, this value is no longer updated.
     * @example viewer
     * @enum {string}
     */
    role: 'viewer' | 'responder' | 'administrator' | 'owner' | 'unset';
    /**
     * @description Slack ID of the user
     * @example U02AYNF2XJM
     */
    slack_user_id?: string;
  } & {
    slack_role: unknown;
    deprecated_base_role: unknown;
    organisation_id: unknown;
  };
  /**
   * UserV2ResponseBody
   * @example {
   *   "email": "lisa@incident.io",
   *   "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *   "name": "Lisa Karlin Curtis",
   *   "role": "viewer",
   *   "slack_user_id": "U02AYNF2XJM"
   * }
   */
  UserV2ResponseBody: {
    /**
     * @description Email address of the user.
     * @example lisa@incident.io
     */
    email?: string;
    /**
     * @description Unique identifier of the user
     * @example 01FCNDV6P870EA6S7TK1DSYDG0
     */
    id: string;
    /**
     * @description Name of the user
     * @example Lisa Karlin Curtis
     */
    name: string;
    /**
     * @description DEPRECATED: Role of the user as of March 9th 2023, this value is no longer updated.
     * @example viewer
     * @enum {string}
     */
    role: 'viewer' | 'responder' | 'administrator' | 'owner' | 'unset';
    /**
     * @description Slack ID of the user
     * @example U02AYNF2XJM
     */
    slack_user_id?: string;
  } & {
    slack_role: unknown;
    deprecated_base_role: unknown;
    organisation_id: unknown;
  };
  /**
   * UtilitiesV1IdentityResponseBody
   * @example {
   *   "identity": {
   *     "name": "Alertmanager token",
   *     "roles": [
   *       "incident_creator"
   *     ]
   *   }
   * }
   */
  UtilitiesV1IdentityResponseBody: {
    identity: definitions['IdentityV1ResponseBody'];
  };
  /**
   * WebhooksAllResponseBody
   * @example {
   *   "event_type": "public_incident.incident_created_v2",
   *   "private_incident.follow_up_created_v1": {
   *     "id": "abc123"
   *   },
   *   "private_incident.follow_up_updated_v1": {
   *     "id": "abc123"
   *   },
   *   "private_incident.incident_created_v2": {
   *     "id": "abc123"
   *   },
   *   "private_incident.incident_updated_v2": {
   *     "id": "abc123"
   *   },
   *   "public_incident.follow_up_created_v1": {
   *     "assignee": {
   *       "email": "lisa@incident.io",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Lisa Karlin Curtis",
   *       "role": "viewer",
   *       "slack_user_id": "U02AYNF2XJM"
   *     },
   *     "completed_at": "2021-08-17T13:28:57.801578Z",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Call the fire brigade",
   *     "external_issue_reference": {
   *       "issue_name": "INC-123",
   *       "issue_permalink": "https://linear.app/incident-io/issue/INC-1609/find-copywriter-to-write-up",
   *       "provider": "asana"
   *     },
   *     "follow_up": true,
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "incident_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "status": "outstanding",
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   },
   *   "public_incident.follow_up_updated_v1": {
   *     "assignee": {
   *       "email": "lisa@incident.io",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Lisa Karlin Curtis",
   *       "role": "viewer",
   *       "slack_user_id": "U02AYNF2XJM"
   *     },
   *     "completed_at": "2021-08-17T13:28:57.801578Z",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Call the fire brigade",
   *     "external_issue_reference": {
   *       "issue_name": "INC-123",
   *       "issue_permalink": "https://linear.app/incident-io/issue/INC-1609/find-copywriter-to-write-up",
   *       "provider": "asana"
   *     },
   *     "follow_up": true,
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "incident_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "status": "outstanding",
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   },
   *   "public_incident.incident_created_v2": {
   *     "call_url": "https://zoom.us/foo",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "creator": {
   *       "api_key": {
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "My test API key"
   *       },
   *       "user": {
   *         "email": "lisa@incident.io",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "Lisa Karlin Curtis",
   *         "role": "viewer",
   *         "slack_user_id": "U02AYNF2XJM"
   *       }
   *     },
   *     "custom_field_entries": [
   *       {
   *         "custom_field": {
   *           "description": "Which team is impacted by this issue",
   *           "field_type": "single_select",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "name": "Affected Team",
   *           "options": [
   *             {
   *               "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "sort_key": 10,
   *               "value": "Product"
   *             }
   *           ]
   *         },
   *         "values": [
   *           {
   *             "value_link": "https://google.com/",
   *             "value_numeric": "123.456",
   *             "value_option": {
   *               "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "sort_key": 10,
   *               "value": "Product"
   *             },
   *             "value_text": "This is my text field, I hope you like it"
   *           }
   *         ]
   *       }
   *     ],
   *     "external_issue_reference": {
   *       "issue_name": "INC-123",
   *       "issue_permalink": "https://linear.app/incident-io/issue/INC-1609/find-copywriter-to-write-up",
   *       "provider": "asana"
   *     },
   *     "id": "01FDAG4SAP5TYPT98WGR2N7W91",
   *     "incident_role_assignments": [
   *       {
   *         "assignee": {
   *           "email": "lisa@incident.io",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "name": "Lisa Karlin Curtis",
   *           "role": "viewer",
   *           "slack_user_id": "U02AYNF2XJM"
   *         },
   *         "role": {
   *           "created_at": "2021-08-17T13:28:57.801578Z",
   *           "description": "The person currently coordinating the incident",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
   *           "name": "Incident Lead",
   *           "required": true,
   *           "role_type": "lead",
   *           "shortform": "lead",
   *           "updated_at": "2021-08-17T13:28:57.801578Z"
   *         }
   *       }
   *     ],
   *     "incident_status": {
   *       "category": "triage",
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Impact has been **fully mitigated**, and we're ready to learn from this incident.",
   *       "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *       "name": "Closed",
   *       "rank": 4,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     },
   *     "incident_timestamp_values": [
   *       {
   *         "incident_timestamp": {
   *           "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *           "name": "Impact started",
   *           "rank": 1
   *         },
   *         "value": {
   *           "value": "2021-08-17T13:28:57.801578Z"
   *         }
   *       }
   *     ],
   *     "incident_type": {
   *       "create_in_triage": "always",
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Customer facing production outages",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "is_default": false,
   *       "name": "Production Outage",
   *       "private_incidents_only": false,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     },
   *     "mode": "standard",
   *     "name": "Our database is sad",
   *     "permalink": "https://app.incident.io/incidents/123",
   *     "postmortem_document_url": "https://docs.google.com/my_doc_id",
   *     "reference": "INC-123",
   *     "severity": {
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Issues with **low impact**.",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Minor",
   *       "rank": 1,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     },
   *     "slack_channel_id": "C02AW36C1M5",
   *     "slack_channel_name": "inc-165-green-parrot",
   *     "slack_team_id": "T02A1FSLE8J",
   *     "summary": "Our database is really really sad, and we don't know why yet.",
   *     "updated_at": "2021-08-17T13:28:57.801578Z",
   *     "visibility": "public"
   *   },
   *   "public_incident.incident_updated_v2": {
   *     "call_url": "https://zoom.us/foo",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "creator": {
   *       "api_key": {
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "My test API key"
   *       },
   *       "user": {
   *         "email": "lisa@incident.io",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "Lisa Karlin Curtis",
   *         "role": "viewer",
   *         "slack_user_id": "U02AYNF2XJM"
   *       }
   *     },
   *     "custom_field_entries": [
   *       {
   *         "custom_field": {
   *           "description": "Which team is impacted by this issue",
   *           "field_type": "single_select",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "name": "Affected Team",
   *           "options": [
   *             {
   *               "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "sort_key": 10,
   *               "value": "Product"
   *             }
   *           ]
   *         },
   *         "values": [
   *           {
   *             "value_link": "https://google.com/",
   *             "value_numeric": "123.456",
   *             "value_option": {
   *               "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "sort_key": 10,
   *               "value": "Product"
   *             },
   *             "value_text": "This is my text field, I hope you like it"
   *           }
   *         ]
   *       }
   *     ],
   *     "external_issue_reference": {
   *       "issue_name": "INC-123",
   *       "issue_permalink": "https://linear.app/incident-io/issue/INC-1609/find-copywriter-to-write-up",
   *       "provider": "asana"
   *     },
   *     "id": "01FDAG4SAP5TYPT98WGR2N7W91",
   *     "incident_role_assignments": [
   *       {
   *         "assignee": {
   *           "email": "lisa@incident.io",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "name": "Lisa Karlin Curtis",
   *           "role": "viewer",
   *           "slack_user_id": "U02AYNF2XJM"
   *         },
   *         "role": {
   *           "created_at": "2021-08-17T13:28:57.801578Z",
   *           "description": "The person currently coordinating the incident",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
   *           "name": "Incident Lead",
   *           "required": true,
   *           "role_type": "lead",
   *           "shortform": "lead",
   *           "updated_at": "2021-08-17T13:28:57.801578Z"
   *         }
   *       }
   *     ],
   *     "incident_status": {
   *       "category": "triage",
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Impact has been **fully mitigated**, and we're ready to learn from this incident.",
   *       "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *       "name": "Closed",
   *       "rank": 4,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     },
   *     "incident_timestamp_values": [
   *       {
   *         "incident_timestamp": {
   *           "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *           "name": "Impact started",
   *           "rank": 1
   *         },
   *         "value": {
   *           "value": "2021-08-17T13:28:57.801578Z"
   *         }
   *       }
   *     ],
   *     "incident_type": {
   *       "create_in_triage": "always",
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Customer facing production outages",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "is_default": false,
   *       "name": "Production Outage",
   *       "private_incidents_only": false,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     },
   *     "mode": "standard",
   *     "name": "Our database is sad",
   *     "permalink": "https://app.incident.io/incidents/123",
   *     "postmortem_document_url": "https://docs.google.com/my_doc_id",
   *     "reference": "INC-123",
   *     "severity": {
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Issues with **low impact**.",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Minor",
   *       "rank": 1,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     },
   *     "slack_channel_id": "C02AW36C1M5",
   *     "slack_channel_name": "inc-165-green-parrot",
   *     "slack_team_id": "T02A1FSLE8J",
   *     "summary": "Our database is really really sad, and we don't know why yet.",
   *     "updated_at": "2021-08-17T13:28:57.801578Z",
   *     "visibility": "public"
   *   }
   * }
   */
  WebhooksAllResponseBody: {
    /**
     * @description What type of event is this webhook for?
     * @example public_incident.incident_created_v2
     * @enum {string}
     */
    event_type:
      | 'public_incident.incident_created_v2'
      | 'private_incident.incident_created_v2'
      | 'public_incident.incident_updated_v2'
      | 'private_incident.incident_updated_v2'
      | 'public_incident.follow_up_created_v1'
      | 'private_incident.follow_up_created_v1'
      | 'public_incident.follow_up_updated_v1'
      | 'private_incident.follow_up_updated_v1';
    'private_incident.follow_up_created_v1'?: definitions['webhook_private_resourceV2ResponseBody'];
    'private_incident.follow_up_updated_v1'?: definitions['webhook_private_resourceV2ResponseBody'];
    'private_incident.incident_created_v2'?: definitions['webhook_private_resourceV2ResponseBody'];
    'private_incident.incident_updated_v2'?: definitions['webhook_private_resourceV2ResponseBody'];
    'public_incident.follow_up_created_v1'?: definitions['ActionV1ResponseBody'];
    'public_incident.follow_up_updated_v1'?: definitions['ActionV1ResponseBody'];
    'public_incident.incident_created_v2'?: definitions['IncidentV2ResponseBody'];
    'public_incident.incident_updated_v2'?: definitions['IncidentV2ResponseBody'];
  };
  /**
   * WebhooksPrivateIncidentFollowUpCreatedV1ResponseBody
   * @example {
   *   "event_type": "private_incident.follow_up_created_v1",
   *   "private_incident.follow_up_created_v1": {
   *     "id": "abc123"
   *   }
   * }
   */
  WebhooksPrivateIncidentFollowUpCreatedV1ResponseBody: {
    /**
     * @description What type of event is this webhook for?
     * @example private_incident.follow_up_created_v1
     * @enum {string}
     */
    event_type:
      | 'public_incident.incident_created_v2'
      | 'private_incident.incident_created_v2'
      | 'public_incident.incident_updated_v2'
      | 'private_incident.incident_updated_v2'
      | 'public_incident.follow_up_created_v1'
      | 'private_incident.follow_up_created_v1'
      | 'public_incident.follow_up_updated_v1'
      | 'private_incident.follow_up_updated_v1';
    'private_incident.follow_up_created_v1': definitions['webhook_private_resourceV2ResponseBody'];
  };
  /**
   * WebhooksPrivateIncidentFollowUpUpdatedV1ResponseBody
   * @example {
   *   "event_type": "private_incident.follow_up_updated_v1",
   *   "private_incident.follow_up_updated_v1": {
   *     "id": "abc123"
   *   }
   * }
   */
  WebhooksPrivateIncidentFollowUpUpdatedV1ResponseBody: {
    /**
     * @description What type of event is this webhook for?
     * @example private_incident.follow_up_updated_v1
     * @enum {string}
     */
    event_type:
      | 'public_incident.incident_created_v2'
      | 'private_incident.incident_created_v2'
      | 'public_incident.incident_updated_v2'
      | 'private_incident.incident_updated_v2'
      | 'public_incident.follow_up_created_v1'
      | 'private_incident.follow_up_created_v1'
      | 'public_incident.follow_up_updated_v1'
      | 'private_incident.follow_up_updated_v1';
    'private_incident.follow_up_updated_v1': definitions['webhook_private_resourceV2ResponseBody'];
  };
  /**
   * WebhooksPrivateIncidentIncidentCreatedV2ResponseBody
   * @example {
   *   "event_type": "private_incident.incident_created_v2",
   *   "private_incident.incident_created_v2": {
   *     "id": "abc123"
   *   }
   * }
   */
  WebhooksPrivateIncidentIncidentCreatedV2ResponseBody: {
    /**
     * @description What type of event is this webhook for?
     * @example private_incident.incident_created_v2
     * @enum {string}
     */
    event_type:
      | 'public_incident.incident_created_v2'
      | 'private_incident.incident_created_v2'
      | 'public_incident.incident_updated_v2'
      | 'private_incident.incident_updated_v2'
      | 'public_incident.follow_up_created_v1'
      | 'private_incident.follow_up_created_v1'
      | 'public_incident.follow_up_updated_v1'
      | 'private_incident.follow_up_updated_v1';
    'private_incident.incident_created_v2': definitions['webhook_private_resourceV2ResponseBody'];
  };
  /**
   * WebhooksPrivateIncidentIncidentUpdatedV2ResponseBody
   * @example {
   *   "event_type": "private_incident.incident_updated_v2",
   *   "private_incident.incident_updated_v2": {
   *     "id": "abc123"
   *   }
   * }
   */
  WebhooksPrivateIncidentIncidentUpdatedV2ResponseBody: {
    /**
     * @description What type of event is this webhook for?
     * @example private_incident.incident_updated_v2
     * @enum {string}
     */
    event_type:
      | 'public_incident.incident_created_v2'
      | 'private_incident.incident_created_v2'
      | 'public_incident.incident_updated_v2'
      | 'private_incident.incident_updated_v2'
      | 'public_incident.follow_up_created_v1'
      | 'private_incident.follow_up_created_v1'
      | 'public_incident.follow_up_updated_v1'
      | 'private_incident.follow_up_updated_v1';
    'private_incident.incident_updated_v2': definitions['webhook_private_resourceV2ResponseBody'];
  };
  /**
   * WebhooksPublicIncidentFollowUpCreatedV1ResponseBody
   * @example {
   *   "event_type": "public_incident.follow_up_created_v1",
   *   "public_incident.follow_up_created_v1": {
   *     "assignee": {
   *       "email": "lisa@incident.io",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Lisa Karlin Curtis",
   *       "role": "viewer",
   *       "slack_user_id": "U02AYNF2XJM"
   *     },
   *     "completed_at": "2021-08-17T13:28:57.801578Z",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Call the fire brigade",
   *     "external_issue_reference": {
   *       "issue_name": "INC-123",
   *       "issue_permalink": "https://linear.app/incident-io/issue/INC-1609/find-copywriter-to-write-up",
   *       "provider": "asana"
   *     },
   *     "follow_up": true,
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "incident_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "status": "outstanding",
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  WebhooksPublicIncidentFollowUpCreatedV1ResponseBody: {
    /**
     * @description What type of event is this webhook for?
     * @example public_incident.follow_up_created_v1
     * @enum {string}
     */
    event_type:
      | 'public_incident.incident_created_v2'
      | 'private_incident.incident_created_v2'
      | 'public_incident.incident_updated_v2'
      | 'private_incident.incident_updated_v2'
      | 'public_incident.follow_up_created_v1'
      | 'private_incident.follow_up_created_v1'
      | 'public_incident.follow_up_updated_v1'
      | 'private_incident.follow_up_updated_v1';
    'public_incident.follow_up_created_v1': definitions['ActionV1ResponseBody'];
  };
  /**
   * WebhooksPublicIncidentFollowUpUpdatedV1ResponseBody
   * @example {
   *   "event_type": "public_incident.follow_up_updated_v1",
   *   "public_incident.follow_up_updated_v1": {
   *     "assignee": {
   *       "email": "lisa@incident.io",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Lisa Karlin Curtis",
   *       "role": "viewer",
   *       "slack_user_id": "U02AYNF2XJM"
   *     },
   *     "completed_at": "2021-08-17T13:28:57.801578Z",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "description": "Call the fire brigade",
   *     "external_issue_reference": {
   *       "issue_name": "INC-123",
   *       "issue_permalink": "https://linear.app/incident-io/issue/INC-1609/find-copywriter-to-write-up",
   *       "provider": "asana"
   *     },
   *     "follow_up": true,
   *     "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "incident_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *     "status": "outstanding",
   *     "updated_at": "2021-08-17T13:28:57.801578Z"
   *   }
   * }
   */
  WebhooksPublicIncidentFollowUpUpdatedV1ResponseBody: {
    /**
     * @description What type of event is this webhook for?
     * @example public_incident.follow_up_updated_v1
     * @enum {string}
     */
    event_type:
      | 'public_incident.incident_created_v2'
      | 'private_incident.incident_created_v2'
      | 'public_incident.incident_updated_v2'
      | 'private_incident.incident_updated_v2'
      | 'public_incident.follow_up_created_v1'
      | 'private_incident.follow_up_created_v1'
      | 'public_incident.follow_up_updated_v1'
      | 'private_incident.follow_up_updated_v1';
    'public_incident.follow_up_updated_v1': definitions['ActionV1ResponseBody'];
  };
  /**
   * WebhooksPublicIncidentIncidentCreatedV2ResponseBody
   * @example {
   *   "event_type": "public_incident.incident_created_v2",
   *   "public_incident.incident_created_v2": {
   *     "call_url": "https://zoom.us/foo",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "creator": {
   *       "api_key": {
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "My test API key"
   *       },
   *       "user": {
   *         "email": "lisa@incident.io",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "Lisa Karlin Curtis",
   *         "role": "viewer",
   *         "slack_user_id": "U02AYNF2XJM"
   *       }
   *     },
   *     "custom_field_entries": [
   *       {
   *         "custom_field": {
   *           "description": "Which team is impacted by this issue",
   *           "field_type": "single_select",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "name": "Affected Team",
   *           "options": [
   *             {
   *               "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "sort_key": 10,
   *               "value": "Product"
   *             }
   *           ]
   *         },
   *         "values": [
   *           {
   *             "value_link": "https://google.com/",
   *             "value_numeric": "123.456",
   *             "value_option": {
   *               "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "sort_key": 10,
   *               "value": "Product"
   *             },
   *             "value_text": "This is my text field, I hope you like it"
   *           }
   *         ]
   *       }
   *     ],
   *     "external_issue_reference": {
   *       "issue_name": "INC-123",
   *       "issue_permalink": "https://linear.app/incident-io/issue/INC-1609/find-copywriter-to-write-up",
   *       "provider": "asana"
   *     },
   *     "id": "01FDAG4SAP5TYPT98WGR2N7W91",
   *     "incident_role_assignments": [
   *       {
   *         "assignee": {
   *           "email": "lisa@incident.io",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "name": "Lisa Karlin Curtis",
   *           "role": "viewer",
   *           "slack_user_id": "U02AYNF2XJM"
   *         },
   *         "role": {
   *           "created_at": "2021-08-17T13:28:57.801578Z",
   *           "description": "The person currently coordinating the incident",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
   *           "name": "Incident Lead",
   *           "required": true,
   *           "role_type": "lead",
   *           "shortform": "lead",
   *           "updated_at": "2021-08-17T13:28:57.801578Z"
   *         }
   *       }
   *     ],
   *     "incident_status": {
   *       "category": "triage",
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Impact has been **fully mitigated**, and we're ready to learn from this incident.",
   *       "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *       "name": "Closed",
   *       "rank": 4,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     },
   *     "incident_timestamp_values": [
   *       {
   *         "incident_timestamp": {
   *           "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *           "name": "Impact started",
   *           "rank": 1
   *         },
   *         "value": {
   *           "value": "2021-08-17T13:28:57.801578Z"
   *         }
   *       }
   *     ],
   *     "incident_type": {
   *       "create_in_triage": "always",
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Customer facing production outages",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "is_default": false,
   *       "name": "Production Outage",
   *       "private_incidents_only": false,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     },
   *     "mode": "standard",
   *     "name": "Our database is sad",
   *     "permalink": "https://app.incident.io/incidents/123",
   *     "postmortem_document_url": "https://docs.google.com/my_doc_id",
   *     "reference": "INC-123",
   *     "severity": {
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Issues with **low impact**.",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Minor",
   *       "rank": 1,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     },
   *     "slack_channel_id": "C02AW36C1M5",
   *     "slack_channel_name": "inc-165-green-parrot",
   *     "slack_team_id": "T02A1FSLE8J",
   *     "summary": "Our database is really really sad, and we don't know why yet.",
   *     "updated_at": "2021-08-17T13:28:57.801578Z",
   *     "visibility": "public"
   *   }
   * }
   */
  WebhooksPublicIncidentIncidentCreatedV2ResponseBody: {
    /**
     * @description What type of event is this webhook for?
     * @example public_incident.incident_created_v2
     * @enum {string}
     */
    event_type:
      | 'public_incident.incident_created_v2'
      | 'private_incident.incident_created_v2'
      | 'public_incident.incident_updated_v2'
      | 'private_incident.incident_updated_v2'
      | 'public_incident.follow_up_created_v1'
      | 'private_incident.follow_up_created_v1'
      | 'public_incident.follow_up_updated_v1'
      | 'private_incident.follow_up_updated_v1';
    'public_incident.incident_created_v2': definitions['IncidentV2ResponseBody'];
  };
  /**
   * WebhooksPublicIncidentIncidentUpdatedV2ResponseBody
   * @example {
   *   "event_type": "public_incident.incident_updated_v2",
   *   "public_incident.incident_updated_v2": {
   *     "call_url": "https://zoom.us/foo",
   *     "created_at": "2021-08-17T13:28:57.801578Z",
   *     "creator": {
   *       "api_key": {
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "My test API key"
   *       },
   *       "user": {
   *         "email": "lisa@incident.io",
   *         "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *         "name": "Lisa Karlin Curtis",
   *         "role": "viewer",
   *         "slack_user_id": "U02AYNF2XJM"
   *       }
   *     },
   *     "custom_field_entries": [
   *       {
   *         "custom_field": {
   *           "description": "Which team is impacted by this issue",
   *           "field_type": "single_select",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "name": "Affected Team",
   *           "options": [
   *             {
   *               "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "sort_key": 10,
   *               "value": "Product"
   *             }
   *           ]
   *         },
   *         "values": [
   *           {
   *             "value_link": "https://google.com/",
   *             "value_numeric": "123.456",
   *             "value_option": {
   *               "custom_field_id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *               "sort_key": 10,
   *               "value": "Product"
   *             },
   *             "value_text": "This is my text field, I hope you like it"
   *           }
   *         ]
   *       }
   *     ],
   *     "external_issue_reference": {
   *       "issue_name": "INC-123",
   *       "issue_permalink": "https://linear.app/incident-io/issue/INC-1609/find-copywriter-to-write-up",
   *       "provider": "asana"
   *     },
   *     "id": "01FDAG4SAP5TYPT98WGR2N7W91",
   *     "incident_role_assignments": [
   *       {
   *         "assignee": {
   *           "email": "lisa@incident.io",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "name": "Lisa Karlin Curtis",
   *           "role": "viewer",
   *           "slack_user_id": "U02AYNF2XJM"
   *         },
   *         "role": {
   *           "created_at": "2021-08-17T13:28:57.801578Z",
   *           "description": "The person currently coordinating the incident",
   *           "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *           "instructions": "Take point on the incident; Make sure people are clear on responsibilities",
   *           "name": "Incident Lead",
   *           "required": true,
   *           "role_type": "lead",
   *           "shortform": "lead",
   *           "updated_at": "2021-08-17T13:28:57.801578Z"
   *         }
   *       }
   *     ],
   *     "incident_status": {
   *       "category": "triage",
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Impact has been **fully mitigated**, and we're ready to learn from this incident.",
   *       "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *       "name": "Closed",
   *       "rank": 4,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     },
   *     "incident_timestamp_values": [
   *       {
   *         "incident_timestamp": {
   *           "id": "01FCNDV6P870EA6S7TK1DSYD5H",
   *           "name": "Impact started",
   *           "rank": 1
   *         },
   *         "value": {
   *           "value": "2021-08-17T13:28:57.801578Z"
   *         }
   *       }
   *     ],
   *     "incident_type": {
   *       "create_in_triage": "always",
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Customer facing production outages",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "is_default": false,
   *       "name": "Production Outage",
   *       "private_incidents_only": false,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     },
   *     "mode": "standard",
   *     "name": "Our database is sad",
   *     "permalink": "https://app.incident.io/incidents/123",
   *     "postmortem_document_url": "https://docs.google.com/my_doc_id",
   *     "reference": "INC-123",
   *     "severity": {
   *       "created_at": "2021-08-17T13:28:57.801578Z",
   *       "description": "Issues with **low impact**.",
   *       "id": "01FCNDV6P870EA6S7TK1DSYDG0",
   *       "name": "Minor",
   *       "rank": 1,
   *       "updated_at": "2021-08-17T13:28:57.801578Z"
   *     },
   *     "slack_channel_id": "C02AW36C1M5",
   *     "slack_channel_name": "inc-165-green-parrot",
   *     "slack_team_id": "T02A1FSLE8J",
   *     "summary": "Our database is really really sad, and we don't know why yet.",
   *     "updated_at": "2021-08-17T13:28:57.801578Z",
   *     "visibility": "public"
   *   }
   * }
   */
  WebhooksPublicIncidentIncidentUpdatedV2ResponseBody: {
    /**
     * @description What type of event is this webhook for?
     * @example public_incident.incident_updated_v2
     * @enum {string}
     */
    event_type:
      | 'public_incident.incident_created_v2'
      | 'private_incident.incident_created_v2'
      | 'public_incident.incident_updated_v2'
      | 'private_incident.incident_updated_v2'
      | 'public_incident.follow_up_created_v1'
      | 'private_incident.follow_up_created_v1'
      | 'public_incident.follow_up_updated_v1'
      | 'private_incident.follow_up_updated_v1';
    'public_incident.incident_updated_v2': definitions['IncidentV2ResponseBody'];
  };
  /**
   * webhook_private_resourceV2ResponseBody
   * @example {
   *   "id": "abc123"
   * }
   */
  webhook_private_resourceV2ResponseBody: {
    /**
     * @description The ID of the resource
     * @example abc123
     */
    id: string;
  };
}

export interface operations {
  /** List all actions for an organisation. */
  'Actions V1#List': {
    parameters: {
      query: {
        /** Find actions related to this incident */
        incident_id?: string;
        /** Filter to actions marked as being follow up actions */
        is_follow_up?: boolean;
        /** Filter to actions from incidents of the given mode. If not set, only actions from `real` incidents are returned */
        incident_mode?: 'real' | 'test' | 'tutorial';
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['ActionsV1ListResponseBody'];
      };
    };
  };
  /** Get a single incident action. */
  'Actions V1#Show': {
    parameters: {
      path: {
        /** Unique identifier for the action */
        id: string;
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['ActionsV1ShowResponseBody'];
      };
    };
  };
  /** Show custom field options for a custom field */
  'Custom Field Options V1#List': {
    parameters: {
      query: {
        /** number of records to return */
        page_size?: number;
        /** A custom field option's ID. This endpoint will return a list of custom field options created after this option. */
        after?: string;
        /** The custom field to list options for. */
        custom_field_id: string;
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['CustomFieldOptionsV1ListResponseBody'];
      };
    };
  };
  /** Create a custom field option. If the sort key is not supplied, it'll default to 1000, so the option appears near the end of the list. */
  'Custom Field Options V1#Create': {
    parameters: {
      body: {
        CreateRequestBody: definitions['CustomFieldOptionsV1CreateRequestBody'];
      };
    };
    responses: {
      /** Created response. */
      201: {
        schema: definitions['CustomFieldOptionsV1CreateResponseBody'];
      };
    };
  };
  /** Get a single custom field option */
  'Custom Field Options V1#Show': {
    parameters: {
      path: {
        /** Unique identifier for the custom field option */
        id: string;
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['CustomFieldOptionsV1ShowResponseBody'];
      };
    };
  };
  /** Update a custom field option */
  'Custom Field Options V1#Update': {
    parameters: {
      path: {
        /** Unique identifier for the custom field option */
        id: string;
      };
      body: {
        UpdateRequestBody: definitions['CustomFieldOptionsV1UpdateRequestBody'];
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['CustomFieldOptionsV1UpdateResponseBody'];
      };
    };
  };
  /** Delete a custom field option */
  'Custom Field Options V1#Delete': {
    parameters: {
      path: {
        /** Unique identifier for the custom field option */
        id: string;
      };
    };
    responses: {
      /** No Content response. */
      204: never;
    };
  };
  /** List all custom fields for an organisation. */
  'Custom Fields V1#List': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['CustomFieldsV1ListResponseBody'];
      };
    };
  };
  /** Create a new custom field */
  'Custom Fields V1#Create': {
    parameters: {
      body: {
        CreateRequestBody: definitions['CustomFieldsV1CreateRequestBody'];
      };
    };
    responses: {
      /** Created response. */
      201: {
        schema: definitions['CustomFieldsV1CreateResponseBody'];
      };
    };
  };
  /** Get a single custom field. */
  'Custom Fields V1#Show': {
    parameters: {
      path: {
        /** Unique identifier for the custom field */
        id: string;
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['CustomFieldsV1ShowResponseBody'];
      };
    };
  };
  /** Update the details of a custom field */
  'Custom Fields V1#Update': {
    parameters: {
      path: {
        /** Unique identifier for the custom field */
        id: string;
      };
      body: {
        UpdateRequestBody: definitions['CustomFieldsV1UpdateRequestBody'];
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['CustomFieldsV1UpdateResponseBody'];
      };
    };
  };
  /** Delete a custom field */
  'Custom Fields V1#Delete': {
    parameters: {
      path: {
        /** Unique identifier for the custom field */
        id: string;
      };
    };
    responses: {
      /** No Content response. */
      204: never;
    };
  };
  /** Test if your API key is valid, and which roles it has. */
  'Utilities V1#Identity': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['UtilitiesV1IdentityResponseBody'];
      };
    };
  };
  /** List all incident attachements for a given external resource or incident. You must provide either a specific incident ID or a specific external resource type and external ID. */
  'Incident Attachments V1#List': {
    parameters: {
      query: {
        /** Incident that this attachment is against */
        incident_id?: string;
        /** ID of the resource in the external system */
        external_id?: string;
        /** E.g. PagerDuty: the external system that holds the resource */
        resource_type?:
          | 'pager_duty_incident'
          | 'opsgenie_alert'
          | 'datadog_monitor_alert'
          | 'github_pull_request'
          | 'sentry_issue'
          | 'atlassian_statuspage_incident'
          | 'zendesk_ticket'
          | 'statuspage_incident';
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['IncidentAttachmentsV1ListResponseBody'];
      };
    };
  };
  /** Attaches an external resource to an incident */
  'Incident Attachments V1#Create': {
    parameters: {
      body: {
        CreateRequestBody: definitions['IncidentAttachmentsV1CreateRequestBody'];
      };
    };
    responses: {
      /** Created response. */
      201: {
        schema: definitions['IncidentAttachmentsV1CreateResponseBody'];
      };
    };
  };
  /** Unattaches an external resouce from an incident */
  'Incident Attachments V1#Delete': {
    parameters: {
      path: {
        /** Unique identifier of this incident membership */
        id: string;
      };
    };
    responses: {
      /** No Content response. */
      204: never;
    };
  };
  /** List all incident roles for an organisation. */
  'Incident Roles V1#List': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['IncidentRolesV1ListResponseBody'];
      };
    };
  };
  /** Create a new incident role */
  'Incident Roles V1#Create': {
    parameters: {
      body: {
        CreateRequestBody: definitions['IncidentRolesV1CreateRequestBody'];
      };
    };
    responses: {
      /** Created response. */
      201: {
        schema: definitions['IncidentRolesV1CreateResponseBody'];
      };
    };
  };
  /** Get a single incident role. */
  'Incident Roles V1#Show': {
    parameters: {
      path: {
        /** Unique identifier for the role */
        id: string;
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['IncidentRolesV1ShowResponseBody'];
      };
    };
  };
  /** Update an existing incident role */
  'Incident Roles V1#Update': {
    parameters: {
      path: {
        /** Unique identifier for the role */
        id: string;
      };
      body: {
        UpdateRequestBody: definitions['IncidentRolesV1UpdateRequestBody'];
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['IncidentRolesV1UpdateResponseBody'];
      };
    };
  };
  /** Removes an existing role */
  'Incident Roles V1#Delete': {
    parameters: {
      path: {
        /** Unique identifier for the role */
        id: string;
      };
    };
    responses: {
      /** No Content response. */
      204: never;
    };
  };
  /** List all incident statuses for an organisation. */
  'IncidentStatuses V1#List': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['IncidentStatusesV1ListResponseBody'];
      };
    };
  };
  /** Create a new incident status */
  'IncidentStatuses V1#Create': {
    parameters: {
      body: {
        CreateRequestBody: definitions['IncidentStatusesV1CreateRequestBody'];
      };
    };
    responses: {
      /** Created response. */
      201: {
        schema: definitions['IncidentStatusesV1CreateResponseBody'];
      };
    };
  };
  /** Get a single incident status. */
  'IncidentStatuses V1#Show': {
    parameters: {
      path: {
        /** Unique ID of this incident status */
        id: string;
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['IncidentStatusesV1ShowResponseBody'];
      };
    };
  };
  /** Update an existing incident status */
  'IncidentStatuses V1#Update': {
    parameters: {
      path: {
        /** Unique ID of this incident status */
        id: string;
      };
      body: {
        UpdateRequestBody: definitions['IncidentStatusesV1UpdateRequestBody'];
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['IncidentStatusesV1UpdateResponseBody'];
      };
    };
  };
  /** Delete an incident status */
  'IncidentStatuses V1#Delete': {
    parameters: {
      path: {
        /** Unique ID of this incident status */
        id: string;
      };
    };
    responses: {
      /** Accepted response. */
      202: unknown;
    };
  };
  /** List all incident types for an organisation. */
  'Incident Types V1#List': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['IncidentTypesV1ListResponseBody'];
      };
    };
  };
  /** Get a single incident type. */
  'Incident Types V1#Show': {
    parameters: {
      path: {
        /** Unique identifier for this Incident Type */
        id: string;
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['IncidentTypesV1ShowResponseBody'];
      };
    };
  };
  /** List all incidents for an organisation. */
  'Incidents V1#List': {
    parameters: {
      query: {
        /** Integer number of records to return */
        page_size?: number;
        /** An record's ID. This endpoint will return a list of records after this ID in relation to the API response order. */
        after?: string;
        /** Filter for incidents in these statuses */
        status?: string[];
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['IncidentsV1ListResponseBody'];
      };
    };
  };
  /** Create a new incident. */
  'Incidents V1#Create': {
    parameters: {
      body: {
        CreateRequestBody: definitions['IncidentsV1CreateRequestBody'];
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['IncidentsV1CreateResponseBody'];
      };
    };
  };
  /** Get a single incident. */
  'Incidents V1#Show': {
    parameters: {
      path: {
        /** Unique identifier for the incident */
        id: string;
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['IncidentsV1ShowResponseBody'];
      };
    };
  };
  /** Get the OpenAPI (v2) definition. */
  'Utilities V1#OpenAPI': {
    responses: {
      /** OK response. */
      200: {
        schema: string;
      };
    };
  };
  /** List all incident severities for an organisation. */
  'Severities V1#List': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['SeveritiesV1ListResponseBody'];
      };
    };
  };
  /** Create a new severity */
  'Severities V1#Create': {
    parameters: {
      body: {
        CreateRequestBody: definitions['SeveritiesV1CreateRequestBody'];
      };
    };
    responses: {
      /** Created response. */
      201: {
        schema: definitions['SeveritiesV1CreateResponseBody'];
      };
    };
  };
  /** Get a single incident severity. */
  'Severities V1#Show': {
    parameters: {
      path: {
        /** Unique identifier of the severity */
        id: string;
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['SeveritiesV1ShowResponseBody'];
      };
    };
  };
  /** Update an existing severity */
  'Severities V1#Update': {
    parameters: {
      path: {
        /** Unique identifier of the severity */
        id: string;
      };
      body: {
        UpdateRequestBody: definitions['SeveritiesV1UpdateRequestBody'];
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['SeveritiesV1UpdateResponseBody'];
      };
    };
  };
  /** Delete a severity */
  'Severities V1#Delete': {
    parameters: {
      path: {
        /** Unique identifier of the severity */
        id: string;
      };
    };
    responses: {
      /** Accepted response. */
      202: unknown;
    };
  };
  /** List entries for a catalog type. */
  'Catalog V2#ListEntries': {
    parameters: {
      query: {
        /** ID of this catalog type */
        catalog_type_id: string;
        /** Integer number of records to return */
        page_size?: number;
        /** An record's ID. This endpoint will return a list of records after this ID in relation to the API response order. */
        after?: string;
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['CatalogV2ListEntriesResponseBody'];
      };
    };
  };
  /** Create an entry for a type in the catalog. */
  'Catalog V2#CreateEntry': {
    parameters: {
      body: {
        CreateEntryRequestBody: definitions['CatalogV2CreateEntryRequestBody'];
      };
    };
    responses: {
      /** Created response. */
      201: {
        schema: definitions['CatalogV2CreateEntryResponseBody'];
      };
    };
  };
  /** Show a single catalog entry. */
  'Catalog V2#ShowEntry': {
    parameters: {
      path: {
        /** ID of this resource */
        id: string;
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['CatalogV2ShowEntryResponseBody'];
      };
    };
  };
  /** Updates an existing catalog entry. */
  'Catalog V2#UpdateEntry': {
    parameters: {
      path: {
        /** ID of this resource */
        id: string;
      };
      body: {
        UpdateEntryRequestBody: definitions['CatalogV2UpdateEntryRequestBody'];
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['CatalogV2UpdateEntryResponseBody'];
      };
    };
  };
  /** Archives a catalog entry. */
  'Catalog V2#DestroyEntry': {
    parameters: {
      path: {
        /** ID of this resource */
        id: string;
      };
    };
    responses: {
      /** No Content response. */
      204: never;
    };
  };
  /** List available engine resources for the catalog */
  'Catalog V2#ListResources': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['CatalogV2ListResourcesResponseBody'];
      };
    };
  };
  /** List all catalog types for an organisation, including those synced from external resources. */
  'Catalog V2#ListTypes': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['CatalogV2ListTypesResponseBody'];
      };
    };
  };
  /** Create a catalog type. */
  'Catalog V2#CreateType': {
    parameters: {
      body: {
        CreateTypeRequestBody: definitions['CatalogV2CreateTypeRequestBody'];
      };
    };
    responses: {
      /** Created response. */
      201: {
        schema: definitions['CatalogV2CreateTypeResponseBody'];
      };
    };
  };
  /** Show a single catalog type. */
  'Catalog V2#ShowType': {
    parameters: {
      path: {
        /** ID of this resource */
        id: string;
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['CatalogV2ShowTypeResponseBody'];
      };
    };
  };
  /** Updates an existing catalog type. */
  'Catalog V2#UpdateType': {
    parameters: {
      path: {
        /** ID of this resource */
        id: string;
      };
      body: {
        UpdateTypeRequestBody: definitions['CatalogV2UpdateTypeRequestBody'];
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['CatalogV2UpdateTypeResponseBody'];
      };
    };
  };
  /** Archives a catalog type and associated entries. */
  'Catalog V2#DestroyType': {
    parameters: {
      path: {
        /** ID of this resource */
        id: string;
      };
    };
    responses: {
      /** No Content response. */
      204: never;
    };
  };
  /** Update an existing catalog types schema, adding or removing attributes. */
  'Catalog V2#UpdateTypeSchema': {
    parameters: {
      path: {
        /** ID of this resource */
        id: string;
      };
      body: {
        UpdateTypeSchemaRequestBody: definitions['CatalogV2UpdateTypeSchemaRequestBody'];
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['CatalogV2UpdateTypeSchemaResponseBody'];
      };
    };
  };
  /** List all incident timestamps for an organisation. */
  'Incident Timestamps V2#List': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['IncidentTimestampsV2ListResponseBody'];
      };
    };
  };
  /** Get a single incident timestamp. */
  'Incident Timestamps V2#Show': {
    parameters: {
      path: {
        /** Unique ID of this incident timestamp */
        id: string;
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['IncidentTimestampsV2ShowResponseBody'];
      };
    };
  };
  /** List all incident updates for an organisation, or for a specific incident. */
  'Incident Updates V2#List': {
    parameters: {
      query: {
        /** Incident whose updates you want to list */
        incident_id?: string;
        /** Integer number of records to return */
        page_size?: number;
        /** An record's ID. This endpoint will return a list of records after this ID in relation to the API response order. */
        after?: string;
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['IncidentUpdatesV2ListResponseBody'];
      };
    };
  };
  /**
   * List all incidents for an organisation.
   *
   * This endpoint supports a number of filters, which can help find incidents matching certain
   * criteria.
   *
   * Filters are provided as query parameters, but due to the dynamic nature of what you can
   * query by (different accounts have different custom fields, statuses, etc) they are more
   * complex than most.
   *
   * To help, here are some exemplar curl requests with a human description of what they search
   * for.
   *
   * Note that:
   * - Filters may be used together, and the result will be incidents that match all filters.
   * - IDs are normally in UUID format, but have been replaced with shorter strings to improve
   * readability.
   * - All query parameters must be URI encoded.
   *
   * ### By status
   *
   * With status of id=ABC, find all incidents that are set to that status:
   *
   * 		curl --get 'https://api.incident.io/v2/incidents' \
   * 			--data 'status[one_of]=ABC'
   *
   * Or all incidents that are not set to status with id=ABC:
   *
   * 		curl --get 'https://api.incident.io/v2/incidents' \
   * 			--data 'status[not_in]=ABC'
   *
   * ### By severity
   *
   * With severity of id=ABC, find all incidents that are set to that severity:
   *
   * 		curl --get 'https://api.incident.io/v2/incidents' \
   * 			--data 'severity[one_of]=ABC'
   *
   * Or all incidents where severity rank is greater-than-or-equal-to the rank of severity
   * id=ABC:
   *
   * 		curl --get 'https://api.incident.io/v2/incidents' \
   * 			--data 'severity[gte]=ABC'
   *
   * Or all incidents where severity rank is less-than-or-equal-to the rank of severity id=ABC:
   *
   * 		curl --get 'https://api.incident.io/v2/incidents' \
   * 			--data 'severity[lte]=ABC'
   *
   * ### By incident type
   *
   * With incident type of id=ABC, find all incidents that are of that type:
   *
   * 		curl --get 'https://api.incident.io/v2/incidents' \
   * 			--data 'incident_type[one_of]=ABC'
   *
   * Or all incidents not of that type:
   *
   * 		curl --get 'https://api.incident.io/v2/incidents' \
   * 			--data 'incident_type[not_in]=ABC'
   *
   * ### By incident role
   *
   * Roles and custom fields have another nested layer in the query parameter, to account for
   * operations against any of the roles or custom fields created in the account.
   *
   * With incident role id=ABC, find all incidents where that role is unset:
   *
   * 		curl --get 'https://api.incident.io/v2/incidents' \
   * 			--data 'incident_role[ABC][is_blank]=true'
   *
   * Or where the role has been set:
   *
   * 		curl --get 'https://api.incident.io/v2/incidents' \
   * 			--data 'incident_role[ABC][is_blank]=false'
   *
   * ### By option custom fields
   *
   * With an option custom field id=ABC, all incidents that have field ABC set to the custom
   * field option of id=XYZ:
   *
   * 		curl \
   * 			--get 'https://api.incident.io/v2/incidents' \
   * 			--data 'custom_field[ABC][one_of]=XYZ'
   *
   * Or all incidents that do not have custom field id=ABC set to option id=XYZ:
   *
   * 		curl \
   * 			--get 'https://api.incident.io/v2/incidents' \
   * 			--data 'custom_field[ABC][not_in]=XYZ'
   */
  'Incidents V2#List': {
    parameters: {
      query: {
        /** number of records to return */
        page_size?: number;
        /** An incident's ID. This endpoint will return a list of incidents after this ID in relation to the API response order. */
        after?: string;
        /** Filter on incident status. The accepted operators are 'one_of', or 'not_in'. */
        status?: unknown;
        /** Filter on incident severity. The accepted operators are 'one_of', 'not_in', 'gte', 'lte'. */
        severity?: unknown;
        /** Filter on incident type. The accepted operator is 'one_of'. */
        incident_type?: unknown;
        /** Filter on an incident role. Role ID should be sent, followed by the operator and values. The accepted operators are 'one_of', 'is_blank'. */
        incident_role?: unknown;
        /** Filter on an incident custom field. Custom field ID should be sent, followed by the operator and values. Accepted operator will depend on the custom field type. */
        custom_field?: unknown;
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['IncidentsV2ListResponseBody'];
      };
    };
  };
  /**
   * Create a new incident.
   *
   * Note that if the incident mode is set to "retrospective" then the new incident
   * will not be announced in Slack.
   */
  'Incidents V2#Create': {
    parameters: {
      body: {
        CreateRequestBody: definitions['IncidentsV2CreateRequestBody'];
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['IncidentsV2CreateResponseBody'];
      };
    };
  };
  /** Get a single incident. */
  'Incidents V2#Show': {
    parameters: {
      path: {
        /** Unique identifier for the incident */
        id: string;
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['IncidentsV2ShowResponseBody'];
      };
    };
  };
  /**
   * Edit an existing incident.
   *
   * This endpoint allows you to edit the properties of an existing incident: e.g. set the severity or update custom fields.
   *
   * When using this endpoint, only fields that are provided will be edited (omitted fields
   * will be ignored).
   */
  'Incidents V2#Edit': {
    parameters: {
      path: {
        /** The unique identifier of the incident that you want to edit */
        id: string;
      };
      body: {
        EditRequestBody: definitions['IncidentsV2EditRequestBody'];
      };
    };
    responses: {
      /** OK response. */
      200: {
        schema: definitions['IncidentsV2EditResponseBody'];
      };
    };
  };
  /** This entry is created whenever a announcement rule is created */
  'Audit logs#AnnouncementRuleCreatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsAnnouncementRuleCreatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a announcement rule is deleted */
  'Audit logs#AnnouncementRuleDeletedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsAnnouncementRuleDeletedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a announcement rule is updated */
  'Audit logs#AnnouncementRuleUpdatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsAnnouncementRuleUpdatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a api key is created */
  'Audit logs#ApiKeyCreatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsAPIKeyCreatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a api key is deleted */
  'Audit logs#ApiKeyDeletedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsAPIKeyDeletedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a custom field is created */
  'Audit logs#CustomFieldCreatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsCustomFieldCreatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a custom field is deleted */
  'Audit logs#CustomFieldDeletedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsCustomFieldDeletedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a custom field is updated */
  'Audit logs#CustomFieldUpdatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsCustomFieldUpdatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a follow up priority is created */
  'Audit logs#FollowUpPriorityCreatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsFollowUpPriorityCreatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a follow up priority is deleted */
  'Audit logs#FollowUpPriorityDeletedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsFollowUpPriorityDeletedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a follow up priority is updated */
  'Audit logs#FollowUpPriorityUpdatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsFollowUpPriorityUpdatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a incident duration metric is created */
  'Audit logs#IncidentDurationMetricCreatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsIncidentDurationMetricCreatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a incident duration metric is deleted */
  'Audit logs#IncidentDurationMetricDeletedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsIncidentDurationMetricDeletedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a incident duration metric is updated */
  'Audit logs#IncidentDurationMetricUpdatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsIncidentDurationMetricUpdatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a incident role is created */
  'Audit logs#IncidentRoleCreatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsIncidentRoleCreatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a incident role is deleted */
  'Audit logs#IncidentRoleDeletedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsIncidentRoleDeletedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a incident role is updated */
  'Audit logs#IncidentRoleUpdatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsIncidentRoleUpdatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a incident status is created */
  'Audit logs#IncidentStatusCreatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsIncidentStatusCreatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a incident status is deleted */
  'Audit logs#IncidentStatusDeletedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsIncidentStatusDeletedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a incident status is updated */
  'Audit logs#IncidentStatusUpdatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsIncidentStatusUpdatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a incident timestamp is created */
  'Audit logs#IncidentTimestampCreatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsIncidentTimestampCreatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a incident timestamp is deleted */
  'Audit logs#IncidentTimestampDeletedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsIncidentTimestampDeletedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a incident timestamp is updated */
  'Audit logs#IncidentTimestampUpdatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsIncidentTimestampUpdatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a incident type is created */
  'Audit logs#IncidentTypeCreatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsIncidentTypeCreatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a incident type is deleted */
  'Audit logs#IncidentTypeDeletedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsIncidentTypeDeletedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a incident type is updated */
  'Audit logs#IncidentTypeUpdatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsIncidentTypeUpdatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever an integration is installed */
  'Audit logs#IntegrationInstalledV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsIntegrationInstalledV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever an integration is uninstalled */
  'Audit logs#IntegrationUninstalledV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsIntegrationUninstalledV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a policy is created */
  'Audit logs#PolicyCreatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsPolicyCreatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a policy is deleted */
  'Audit logs#PolicyDeletedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsPolicyDeletedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a policy is updated */
  'Audit logs#PolicyUpdatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsPolicyUpdatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever someone attempts to access a private incident. */
  'Audit logs#PrivateIncidentAccessAttemptedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsPrivateIncidentAccessAttemptedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever someone requests access to a private incident. */
  'Audit logs#PrivateIncidentAccessRequestedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsPrivateIncidentAccessRequestedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever someone is granted access to a private incident. If they have the 'manage private incidents' permission, then it'll appear that the system has given them access to the incident. */
  'Audit logs#PrivateIncidentMembershipGrantedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsPrivateIncidentMembershipGrantedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever someone's access to a private incident is revoked. */
  'Audit logs#PrivateIncidentMembershipRevokedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsPrivateIncidentMembershipRevokedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a rbac role is created */
  'Audit logs#RbacRoleCreatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsRbacRoleCreatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a rbac role is deleted */
  'Audit logs#RbacRoleDeletedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsRbacRoleDeletedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a rbac role is updated */
  'Audit logs#RbacRoleUpdatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsRbacRoleUpdatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a SCIM group is mapped to a new RBAC role */
  'Audit logs#ScimGroupRoleMappingsUpdatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsScimGroupRoleMappingsUpdatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a severity is created */
  'Audit logs#SeverityCreatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsSeverityCreatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a severity is deleted */
  'Audit logs#SeverityDeletedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsSeverityDeletedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a severity is updated */
  'Audit logs#SeverityUpdatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsSeverityUpdatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a status page is created */
  'Audit logs#StatusPageCreatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsStatusPageCreatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a status page is deleted */
  'Audit logs#StatusPageDeletedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsStatusPageDeletedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a status page has its configuration updated */
  'Audit logs#StatusPageUpdatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsStatusPageUpdatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a status page template is created */
  'Audit logs#StatusPageTemplateCreatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsStatusPageTemplateCreatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a status page template is deleted */
  'Audit logs#StatusPageTemplateDeletedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsStatusPageTemplateDeletedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a status page template is updated */
  'Audit logs#StatusPageTemplateUpdatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsStatusPageTemplateUpdatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a user is created */
  'Audit logs#UserCreatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsUserCreatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a user is deactivated */
  'Audit logs#UserDeactivatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsUserDeactivatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created when a user is reinstated after being deactivated */
  'Audit logs#UserReinstatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsUserReinstatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a user's role memberships are changed. */
  'Audit logs#UserRoleMembershipsUpdatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsUserRoleMembershipsUpdatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a user is updated */
  'Audit logs#UserUpdatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsUserUpdatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a workflow is created */
  'Audit logs#WorkflowCreatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsWorkflowCreatedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a workflow is deleted */
  'Audit logs#WorkflowDeletedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsWorkflowDeletedV1ResponseBody'];
      };
    };
  };
  /** This entry is created whenever a workflow is updated */
  'Audit logs#WorkflowUpdatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['AuditLogsWorkflowUpdatedV1ResponseBody'];
      };
    };
  };
  /** Enables us to generate a type for all webhook types, so we can use a single serializer. */
  'Webhooks#All': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['WebhooksAllResponseBody'];
      };
    };
  };
  /** This webhook is emitted whenever a follow-up for a private incident is created. */
  'Webhooks#PrivateIncidentFollowUpCreatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['WebhooksPrivateIncidentFollowUpCreatedV1ResponseBody'];
      };
    };
  };
  /** This webhook is emitted whenever a follow-up for a private incident is updated. */
  'Webhooks#PrivateIncidentFollowUpUpdatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['WebhooksPrivateIncidentFollowUpUpdatedV1ResponseBody'];
      };
    };
  };
  /** This webhook is emitted whenever a new private incident is created. */
  'Webhooks#PrivateIncidentIncidentCreatedV2': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['WebhooksPrivateIncidentIncidentCreatedV2ResponseBody'];
      };
    };
  };
  /** This webhook is emitted whenever a private incident is updated. */
  'Webhooks#PrivateIncidentIncidentUpdatedV2': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['WebhooksPrivateIncidentIncidentUpdatedV2ResponseBody'];
      };
    };
  };
  /** This webhook is emitted whenever a follow-up is created. */
  'Webhooks#PublicIncidentFollowUpCreatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['WebhooksPublicIncidentFollowUpCreatedV1ResponseBody'];
      };
    };
  };
  /** This webhook is emitted whenever a follow-up is updated. */
  'Webhooks#PublicIncidentFollowUpUpdatedV1': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['WebhooksPublicIncidentFollowUpUpdatedV1ResponseBody'];
      };
    };
  };
  /** This webhook is emitted whenever a new incident is created. */
  'Webhooks#PublicIncidentIncidentCreatedV2': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['WebhooksPublicIncidentIncidentCreatedV2ResponseBody'];
      };
    };
  };
  /** This webhook is emitted whenever an incident is updated. */
  'Webhooks#PublicIncidentIncidentUpdatedV2': {
    responses: {
      /** OK response. */
      200: {
        schema: definitions['WebhooksPublicIncidentIncidentUpdatedV2ResponseBody'];
      };
    };
  };
}

export interface external {}
