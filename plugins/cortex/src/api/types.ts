/*
 * Copyright 2022 The Backstage Authors
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

import { createApiRef } from "@backstage/core-plugin-api";

export type Endpoints = {
    reply: EndpointReply;
}
export type EndpointReply = {
    total_count: number;
    result_count: number
    endpoints: Endpoint[]
    restricted_incident_ids: string[]
}

export type Endpoint = {
    endpoint_id: string;
    endpoint_name: string;
    endpointTags: string;
    endpoint_type: string;
    endpoint_status: string;
    os_type: string;
    os_version: string;
    ip: string[];
    ipv6: string[];
    public_ip: string;
    users: string[];
    domain: string;
    alias: string;
    first_seen: string;
    last_seen: string;
    content_version: string;
    installation_package: string;
    active_directory: string;
    install_date: string;
    endpoint_version: string;
    is_isolated: string;
    isolated_date: string;
    group_name: string[];
    operational_status: string;
    operational_status_description: string[];
    operational_status_details: string[];
    scan_status: string;
    content_release_timestamp: string;
    last_content_update_time: string;
    content_status: string;
    operating_system: string;
    mac_address: string[];
    assigned_prevention_policy: string;
    assigned_extensions_policy: string;
    token_hash: string;
    tags: TagsContainer;
}

export type TagsContainer = {
    server_tags: string[];
    endpoint_tags: string[];
}

// Security Incidents
export type SecurityIncidents = {
    reply: SecurityIncidentsReply;
}

export type SecurityIncidentsReply = {
    total_count: number;
    result_count: number;
    incidents: Incident[];
    restricted_incident_ids: string[]
}

export type Incident = {
    incident_id?: string;
    incident_name?: string;
    creation_time: number;
    modification_time?: number;
    detection_time?: number;
    status?: string;
    severity: string;
    description: string;
    assigned_user_mail?: string;
    assigned_user_pretty_name?: string;
    alert_count?: number;
    low_severity_alert_count?: number;
    med_severity_alert_count?: number;
    high_severity_alert_count?: number;
    critical_severity_alert_count?: number;
    user_count?: number;
    host_count?: number;
    notes?: string;
    resolve_comment?: string;
    resolved_timestamp?: number;
    manual_severity?: string;
    manual_description?: string;
    xdr_url?: string;
    starred?: boolean;
    hosts: string[];
    users?: string[];
    incident_sources?: string[];
    rule_based_score?: number;
    manual_score?: number;
    wildfire_hits?: number;
    alerts_grouping_status?: string;
    mitre_tactics_ids_and_names?: string[];
    mitre_techniques_ids_and_names?: string[];
    alert_categories?: string[];
    original_tags?: string[];
    tags?: string[];
}

// Alerts
export type Alerts = {
    reply: AlertsReply;
}

export type AlertsReply = {
    total_count: number;
    result_count: number;
    alerts: Alert[];
}

export type Alert = {
    external_id?: string;
    severity: string;
    matching_status?: string;
    end_match_attempt_ts?: number;
    local_insert_ts?: number; 
    bioc_indicator?: string;
    matching_service_rule_id?: string;
    attempt_counter?: number;
    bioc_category_enum_key?: string;
    is_whitelisted?: boolean; 
    starred?: boolean;
    deduplicate_tokens?: string;
    filter_rule_id?: string;
    mitre_technique_id_and_name?: string;
    mitre_tactic_id_and_name?: string;
    agent_version?: string;
    agent_device_domain?: string;
    agent_fqdn?: string;
    agent_os_type?: string;
    agent_os_sub_type?: string;
    agent_data_collection_status?: boolean;
    mac?: string;
    mac_address?: string[];
    agent_is_vdi?: string;
    contains_featured_host?: boolean;
    contains_featured_user?: boolean;
    contains_featured_ip?: boolean;
    events?: Event[];
    alert_id?: string;
    detection_timestamp: number;
    name?: string;
    category?: string;
    endpoint_id?: string;
    description: string;
    host_ip?: string;
    host_name?: string;
    source?: string;
    action?: string;
    action_pretty?: string;
}

export type Event = {
    agent_install_type: string;
    agent_host_boot_time: string;
    event_sub_type: string;
    module_id: string;
    association_strength: string;
    dst_association_strength: string;
    story_id: string;
    event_id: string;
    event_type: string;
    event_timestamp: number;
    actor_process_instance_id: string;
    actor_process_image_path: string;
    actor_process_image_name: string;
    actor_process_command_line: string;
    actor_process_signature_status: string;
    actor_process_signature_vendor: string;
    actor_process_image_sha256: string;
    actor_process_image_md5: string;
    actor_process_causality_id: string;
    actor_causality_id: string;
    actor_process_os_pid: string;
    actor_thread_thread_id: string;
    causality_actor_process_image_name: string;
    causality_actor_process_command_line: string;
    causality_actor_process_image_path: string;
    causality_actor_process_signature_vendor: string;
    causality_actor_process_signature_status: string;
    causality_actor_causality_id: string;
    causality_actor_process_execution_time: string;
    causality_actor_process_image_md5: string;
    causality_actor_process_image_sha256: string;
    action_file_path: string;
    action_file_name: string;
    action_file_md5: string;
    action_file_sha256: string;
    action_file_macro_sha256: string;
    action_registry_data: string;
    action_registry_key_name: string;
    action_registry_value_name: string;
    action_registry_full_key: string;
    action_local_ip: string;
    action_local_port: string;
    action_remote_ip: string;
    action_remote_port: string;
    action_external_hostname: string;
    action_country: string;
    action_process_instance_id: string;
    action_process_causality_id: string;
    action_process_image_name: string;
    action_process_image_sha256: string;
    action_process_image_command_line: string;
    action_process_signature_status: string;
    action_process_signature_vendor: string;
    os_actor_effective_username: string;
    os_actor_process_instance_id: string;
    os_actor_process_image_path: string;
    os_actor_process_image_name: string;
    os_actor_process_command_line: string;
    os_actor_process_signature_status: string;
    os_actor_process_signature_vendor: string;
    os_actor_process_image_sha256: string;
    os_actor_process_causality_id: string;
    os_actor_causality_id: string;
    os_actor_process_os_pid: string;
    os_actor_thread_thread_id: string;
    fw_app_id: string;
    fw_interface_from: string;
    fw_interface_to: string;
    fw_rule: string;
    fw_rule_id: string;
    fw_device_name: string;
    fw_serial_number: string;
    fw_url_domain: string;
    fw_email_subject: string;
    fw_email_sender: string;
    fw_email_recipient: string;
    fw_app_subcategory: string;
    fw_app_category: string;
    fw_app_technology: string;
    fw_vsys: string;
    fw_xff: string;
    fw_misc: string;
    fw_is_phishing: string;
    dst_agent_id: string;
    dst_causality_actor_process_execution_time: string;
    dns_query_name: string;
    dst_action_external_hostname: string;
    dst_action_country: string;
    dst_action_external_port: string;
    user_name: string;
}

export const CortexApiRef = createApiRef<CortexApi>({
    id: 'plugin.cortex.service',
});

export type CortexApi = {
    getCortexEntityEndpoint(
        entityName: string,
    ): Promise<Endpoint[] | undefined>;

    getCortexSecurityIncidents(
        host: string
    ): Promise<Incident[] | undefined>;

    getCortexAlerts(
        host: string
    ): Promise<Alert[] | undefined>;
};
