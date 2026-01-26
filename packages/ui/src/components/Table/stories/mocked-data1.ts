/*
 * Copyright 2025 The Backstage Authors
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

export interface DataProps {
  id: string;
  name: string;
  owner: {
    name: string;
    profilePicture?: string;
    link?: string;
  };
  type: 'documentation' | 'library' | 'service' | 'website' | 'other';
  description?: string;
  tags?: string[];
  lifecycle: 'experimental' | 'production';
}

export const data: DataProps[] = [
  {
    id: 'authentication-and-authorization-service',
    name: 'authentication-and-authorization-service',
    owner: {
      name: 'security-team',
      profilePicture: 'https://github.com/security-team.png',
      link: 'https://github.com/orgs/company/teams/security-team',
    },
    type: 'service',
    description:
      'A comprehensive service handling user authentication and role-based access control across all applications.',
    tags: ['security', 'authentication', 'authorization'],
    lifecycle: 'production',
  },
  {
    id: 'user-interface-dashboard-and-analytics-platform',
    name: 'user-interface-dashboard-and-analytics-platform',
    owner: {
      name: 'frontend-team',
      profilePicture: 'https://github.com/frontend-team.png',
      link: 'https://github.com/orgs/company/teams/frontend-team',
    },
    type: 'website',
    description:
      'Interactive dashboard providing real-time analytics and data visualization for business metrics.',
    tags: ['analytics', 'visualization', 'dashboard'],
    lifecycle: 'production',
  },
  {
    id: 'payment-gateway',
    name: 'payment-gateway',
    owner: {
      name: 'finance-team',
      profilePicture: 'https://github.com/finance-team.png',
      link: 'https://github.com/orgs/company/teams/finance-team',
    },
    type: 'service',
    description:
      'Secure payment processing system supporting multiple payment methods and currencies.',
    tags: ['payments', 'security', 'finance'],
    lifecycle: 'production',
  },
  {
    id: 'real-time-analytics-processing-and-visualization-engine',
    name: 'real-time-analytics-processing-and-visualization-engine',
    owner: {
      name: 'data-team',
      profilePicture: 'https://github.com/data-team.png',
      link: 'https://github.com/orgs/company/teams/data-team',
    },
    type: 'service',
    description:
      'High-performance engine for processing and visualizing streaming data analytics.',
    tags: ['analytics', 'real-time', 'data-processing'],
    lifecycle: 'experimental',
  },
  {
    id: 'notification-center',
    name: 'notification-center',
    owner: {
      name: 'platform-team',
      profilePicture: 'https://github.com/platform-team.png',
      link: 'https://github.com/orgs/company/teams/platform-team',
    },
    type: 'service',
    description:
      'Centralized system for managing and delivering notifications across multiple channels.',
    tags: ['notifications', 'messaging'],
    lifecycle: 'production',
  },
  {
    id: 'administrative-control-panel-and-user-management-interface',
    name: 'administrative-control-panel-and-user-management-interface',
    owner: {
      name: 'frontend-team',
      profilePicture: 'https://github.com/frontend-team.png',
      link: 'https://github.com/orgs/company/teams/frontend-team',
    },
    type: 'website',
    description:
      'Admin interface for managing users, permissions, and system configurations.',
    tags: ['admin', 'user-management', 'configuration'],
    lifecycle: 'production',
  },
  {
    id: 'search-indexer',
    name: 'search-indexer',
    owner: {
      name: 'search-team',
      profilePicture: 'https://github.com/search-team.png',
      link: 'https://github.com/orgs/company/teams/search-team',
    },
    type: 'service',
    description:
      'Service responsible for indexing and updating searchable content across the platform.',
    tags: ['search', 'indexing'],
    lifecycle: 'production',
  },
  {
    id: 'cross-platform-mobile-application-framework',
    name: 'cross-platform-mobile-application-framework',
    owner: {
      name: 'mobile-team',
      profilePicture: 'https://github.com/mobile-team.png',
      link: 'https://github.com/orgs/company/teams/mobile-team',
    },
    type: 'website',
    description:
      'Framework enabling development of cross-platform mobile applications with shared codebase.',
    tags: ['mobile', 'framework', 'cross-platform'],
    lifecycle: 'experimental',
  },
  {
    id: 'database-migration',
    name: 'database-migration',
    owner: {
      name: 'devops-team',
      profilePicture: 'https://github.com/devops-team.png',
      link: 'https://github.com/orgs/company/teams/devops-team',
    },
    type: 'other',
    description:
      'Tools and scripts for managing database schema migrations and data transformations.',
    tags: ['database', 'migration', 'devops'],
    lifecycle: 'production',
  },
  {
    id: 'api-gateway',
    name: 'api-gateway',
    owner: {
      name: 'platform-team',
      profilePicture: 'https://github.com/platform-team.png',
      link: 'https://github.com/orgs/company/teams/platform-team',
    },
    type: 'service',
    description:
      'Central entry point for all API requests, handling routing, authentication, and rate limiting.',
    tags: ['api', 'gateway', 'security', 'routing'],
    lifecycle: 'production',
  },
  {
    id: 'content-management',
    name: 'content-management',
    owner: {
      name: 'content-team',
      profilePicture: 'https://github.com/content-team.png',
      link: 'https://github.com/orgs/company/teams/content-team',
    },
    type: 'service',
    description:
      'System for managing and delivering digital content across multiple channels.',
    tags: ['content', 'management', 'delivery'],
    lifecycle: 'production',
  },
  {
    id: 'enterprise-reporting-and-analytics-dashboard',
    name: 'enterprise-reporting-and-analytics-dashboard',
    owner: {
      name: 'analytics-team',
      profilePicture: 'https://github.com/analytics-team.png',
      link: 'https://github.com/orgs/company/teams/analytics-team',
    },
    type: 'website',
    description:
      'Comprehensive business intelligence platform for enterprise-wide reporting and analytics.',
    tags: ['analytics', 'reporting', 'business-intelligence'],
    lifecycle: 'production',
  },
  {
    id: 'image-processing-and-optimization-service',
    name: 'image-processing-and-optimization-service',
    owner: {
      name: 'media-team',
      profilePicture: 'https://github.com/media-team.png',
      link: 'https://github.com/orgs/company/teams/media-team',
    },
    type: 'service',
    description:
      'Service for processing, optimizing, and delivering images across different devices and networks.',
    tags: ['media', 'optimization', 'processing'],
    lifecycle: 'production',
  },
  {
    id: 'customer-portal',
    name: 'customer-portal',
    owner: {
      name: 'frontend-team',
      profilePicture: 'https://github.com/frontend-team.png',
      link: 'https://github.com/orgs/company/teams/frontend-team',
    },
    type: 'website',
    description:
      'Self-service portal for customers to manage their accounts and access services.',
    tags: ['customer', 'self-service'],
    lifecycle: 'production',
  },
  {
    id: 'log-aggregator',
    name: 'log-aggregator',
    owner: {
      name: 'devops-team',
      profilePicture: 'https://github.com/devops-team.png',
      link: 'https://github.com/orgs/company/teams/devops-team',
    },
    type: 'service',
    description:
      'Centralized logging system for collecting, processing, and analyzing application logs.',
    tags: ['logging', 'monitoring', 'devops'],
    lifecycle: 'production',
  },
  {
    id: 'identity-provider',
    name: 'identity-provider',
    owner: {
      name: 'security-team',
      profilePicture: 'https://github.com/security-team.png',
      link: 'https://github.com/orgs/company/teams/security-team',
    },
    type: 'service',
    description:
      'Service managing user identities and authentication across the organization.',
    tags: ['identity', 'security', 'authentication'],
    lifecycle: 'production',
  },
  {
    id: 'document-storage',
    name: 'document-storage',
    owner: {
      name: 'storage-team',
      profilePicture: 'https://github.com/storage-team.png',
      link: 'https://github.com/orgs/company/teams/storage-team',
    },
    type: 'service',
    description:
      'Secure and scalable document storage system with version control and access management.',
    tags: ['storage', 'documents', 'version-control'],
    lifecycle: 'production',
  },
  {
    id: 'workflow-engine',
    name: 'workflow-engine',
    owner: {
      name: 'platform-team',
      profilePicture: 'https://github.com/platform-team.png',
      link: 'https://github.com/orgs/company/teams/platform-team',
    },
    type: 'service',
    description:
      'Engine for defining and executing business processes and workflows.',
    tags: ['workflow', 'automation'],
    lifecycle: 'experimental',
  },
  {
    id: 'mobile-backend',
    name: 'mobile-backend',
    owner: {
      name: 'mobile-team',
      profilePicture: 'https://github.com/mobile-team.png',
      link: 'https://github.com/orgs/company/teams/mobile-team',
    },
    type: 'service',
    description:
      'Backend services supporting mobile applications with optimized APIs and data synchronization.',
    tags: ['mobile', 'backend', 'api'],
    lifecycle: 'production',
  },
  {
    id: 'system-monitoring-and-alerting-dashboard',
    name: 'system-monitoring-and-alerting-dashboard',
    owner: {
      name: 'devops-team',
      profilePicture: 'https://github.com/devops-team.png',
      link: 'https://github.com/orgs/company/teams/devops-team',
    },
    type: 'website',
    description:
      'Real-time monitoring and alerting system for infrastructure and application health.',
    tags: ['monitoring', 'alerting', 'devops', 'infrastructure'],
    lifecycle: 'production',
  },
  {
    id: 'email-service',
    name: 'email-service',
    owner: {
      name: 'communication-team',
      profilePicture: 'https://github.com/communication-team.png',
      link: 'https://github.com/orgs/company/teams/communication-team',
    },
    type: 'service',
    description:
      'Reliable email delivery service with templates and tracking capabilities.',
    tags: ['email', 'communication'],
    lifecycle: 'production',
  },
  {
    id: 'data-pipeline',
    name: 'data-pipeline',
    owner: {
      name: 'data-team',
      profilePicture: 'https://github.com/data-team.png',
      link: 'https://github.com/orgs/company/teams/data-team',
    },
    type: 'service',
    description:
      'ETL pipeline for processing and transforming large volumes of data.',
    tags: ['data', 'etl', 'pipeline'],
    lifecycle: 'production',
  },
  {
    id: 'configuration-manager',
    name: 'configuration-manager',
    owner: {
      name: 'platform-team',
      profilePicture: 'https://github.com/platform-team.png',
      link: 'https://github.com/orgs/company/teams/platform-team',
    },
    type: 'service',
    description:
      'Centralized system for managing application configurations across environments.',
    tags: ['configuration', 'management'],
    lifecycle: 'production',
  },
  {
    id: 'testing-framework',
    name: 'testing-framework',
    owner: {
      name: 'qa-team',
      profilePicture: 'https://github.com/qa-team.png',
      link: 'https://github.com/orgs/company/teams/qa-team',
    },
    type: 'library',
    description:
      'Comprehensive testing framework supporting various types of automated tests.',
    tags: ['testing', 'automation', 'qa'],
    lifecycle: 'production',
  },
  {
    id: 'cache-service',
    name: 'cache-service',
    owner: {
      name: 'platform-team',
      profilePicture: 'https://github.com/platform-team.png',
      link: 'https://github.com/orgs/company/teams/platform-team',
    },
    type: 'service',
    description:
      'Distributed caching service for improving application performance.',
    tags: ['caching', 'performance'],
    lifecycle: 'production',
  },
  {
    id: 'billing-system',
    name: 'billing-system',
    owner: {
      name: 'finance-team',
      profilePicture: 'https://github.com/finance-team.png',
      link: 'https://github.com/orgs/company/teams/finance-team',
    },
    type: 'service',
    description:
      'System for managing customer billing, invoicing, and payment processing.',
    tags: ['billing', 'finance', 'payments'],
    lifecycle: 'production',
  },
  {
    id: 'comprehensive-product-documentation-and-api-reference',
    name: 'comprehensive-product-documentation-and-api-reference',
    owner: {
      name: 'docs-team',
      profilePicture: 'https://github.com/docs-team.png',
      link: 'https://github.com/orgs/company/teams/docs-team',
    },
    type: 'documentation',
    description:
      'Complete documentation covering product features, APIs, and integration guides.',
    tags: ['documentation', 'api', 'reference'],
    lifecycle: 'production',
  },
  {
    id: 'queue-manager',
    name: 'queue-manager',
    owner: {
      name: 'platform-team',
      profilePicture: 'https://github.com/platform-team.png',
      link: 'https://github.com/orgs/company/teams/platform-team',
    },
    type: 'service',
    description:
      'Message queue system for asynchronous processing and event handling.',
    tags: ['queue', 'messaging', 'async'],
    lifecycle: 'production',
  },
  {
    id: 'security-scanner',
    name: 'security-scanner',
    owner: {
      name: 'security-team',
      profilePicture: 'https://github.com/security-team.png',
      link: 'https://github.com/orgs/company/teams/security-team',
    },
    type: 'other',
    description:
      'Automated security scanning tool for identifying vulnerabilities in code and infrastructure.',
    tags: ['security', 'scanning', 'vulnerability'],
    lifecycle: 'experimental',
  },
  {
    id: 'user-profile',
    name: 'user-profile',
    owner: {
      name: 'frontend-team',
      profilePicture: 'https://github.com/frontend-team.png',
      link: 'https://github.com/orgs/company/teams/frontend-team',
    },
    type: 'website',
    description:
      'User profile management interface with personalization features.',
    tags: ['user', 'profile', 'personalization'],
    lifecycle: 'production',
  },
  {
    id: 'data-warehouse',
    name: 'data-warehouse',
    owner: {
      name: 'data-team',
      profilePicture: 'https://github.com/data-team.png',
      link: 'https://github.com/orgs/company/teams/data-team',
    },
    type: 'service',
    description:
      'Centralized data repository for business intelligence and analytics.',
    tags: ['data', 'warehouse', 'analytics'],
    lifecycle: 'production',
  },
  {
    id: 'deployment-automation',
    name: 'deployment-automation',
    owner: {
      name: 'devops-team',
      profilePicture: 'https://github.com/devops-team.png',
      link: 'https://github.com/orgs/company/teams/devops-team',
    },
    type: 'other',
    description:
      'Automated deployment pipeline for continuous integration and delivery.',
    tags: ['deployment', 'automation', 'ci-cd', 'devops'],
    lifecycle: 'production',
  },
  {
    id: 'chat-service',
    name: 'chat-service',
    owner: {
      name: 'communication-team',
      profilePicture: 'https://github.com/communication-team.png',
      link: 'https://github.com/orgs/company/teams/communication-team',
    },
    type: 'service',
    description:
      'Real-time chat service supporting text, file sharing, and group conversations.',
    tags: ['chat', 'communication', 'real-time'],
    lifecycle: 'experimental',
  },
  {
    id: 'analytics-dashboard',
    name: 'analytics-dashboard',
    owner: {
      name: 'analytics-team',
      profilePicture: 'https://github.com/analytics-team.png',
      link: 'https://github.com/orgs/company/teams/analytics-team',
    },
    type: 'website',
    description:
      'Interactive dashboard for visualizing and analyzing business metrics.',
    tags: ['analytics', 'dashboard', 'visualization'],
    lifecycle: 'production',
  },
  {
    id: 'file-uploader',
    name: 'file-uploader',
    owner: {
      name: 'storage-team',
      profilePicture: 'https://github.com/storage-team.png',
      link: 'https://github.com/orgs/company/teams/storage-team',
    },
    type: 'service',
    description:
      'Service for handling secure file uploads with progress tracking and validation.',
    tags: ['storage', 'upload', 'files'],
    lifecycle: 'production',
  },
  {
    id: 'search-service',
    name: 'search-service',
    owner: {
      name: 'search-team',
      profilePicture: 'https://github.com/search-team.png',
      link: 'https://github.com/orgs/company/teams/search-team',
    },
    type: 'service',
    description:
      'Full-text search service with advanced filtering and ranking capabilities.',
    tags: ['search', 'full-text'],
    lifecycle: 'production',
  },
  {
    id: 'mobile-sdk',
    name: 'mobile-sdk',
    owner: {
      name: 'mobile-team',
      profilePicture: 'https://github.com/mobile-team.png',
      link: 'https://github.com/orgs/company/teams/mobile-team',
    },
    type: 'library',
    description:
      'Software development kit for building mobile applications with native features.',
    tags: ['mobile', 'sdk', 'development'],
    lifecycle: 'production',
  },
  {
    id: 'performance-monitor',
    name: 'performance-monitor',
    owner: {
      name: 'devops-team',
      profilePicture: 'https://github.com/devops-team.png',
      link: 'https://github.com/orgs/company/teams/devops-team',
    },
    type: 'service',
    description:
      'System for monitoring and analyzing application performance metrics.',
    tags: ['performance', 'monitoring', 'metrics'],
    lifecycle: 'production',
  },
  {
    id: 'content-delivery',
    name: 'content-delivery',
    owner: {
      name: 'media-team',
      profilePicture: 'https://github.com/media-team.png',
      link: 'https://github.com/orgs/company/teams/media-team',
    },
    type: 'service',
    description:
      'CDN service for optimized content delivery across global networks.',
    tags: ['cdn', 'content', 'delivery'],
    lifecycle: 'production',
  },
  {
    id: 'user-authentication',
    name: 'user-authentication',
    owner: {
      name: 'security-team',
      profilePicture: 'https://github.com/security-team.png',
      link: 'https://github.com/orgs/company/teams/security-team',
    },
    type: 'service',
    description:
      'Service handling user login, session management, and authentication flows.',
    tags: ['authentication', 'security', 'user'],
    lifecycle: 'production',
  },
  {
    id: 'data-export',
    name: 'data-export',
    owner: {
      name: 'data-team',
      profilePicture: 'https://github.com/data-team.png',
      link: 'https://github.com/orgs/company/teams/data-team',
    },
    type: 'service',
    description:
      'Service for exporting data in various formats with scheduling capabilities.',
    tags: ['data', 'export', 'scheduling'],
    lifecycle: 'production',
  },
  {
    id: 'admin-api',
    name: 'admin-api',
    owner: {
      name: 'platform-team',
      profilePicture: 'https://github.com/platform-team.png',
      link: 'https://github.com/orgs/company/teams/platform-team',
    },
    type: 'service',
    description:
      'API endpoints for administrative functions and system management.',
    tags: ['api', 'admin', 'management'],
    lifecycle: 'production',
  },
  {
    id: 'testing-dashboard',
    name: 'testing-dashboard',
    owner: {
      name: 'qa-team',
      profilePicture: 'https://github.com/qa-team.png',
      link: 'https://github.com/orgs/company/teams/qa-team',
    },
    type: 'website',
    description: 'Dashboard for monitoring test results and quality metrics.',
    tags: ['testing', 'dashboard', 'qa'],
    lifecycle: 'production',
  },
  {
    id: 'message-broker',
    name: 'message-broker',
    owner: {
      name: 'platform-team',
      profilePicture: 'https://github.com/platform-team.png',
      link: 'https://github.com/orgs/company/teams/platform-team',
    },
    type: 'service',
    description:
      'Message broker service for reliable event-driven communication between services.',
    tags: ['messaging', 'broker', 'event-driven'],
    lifecycle: 'production',
  },
  {
    id: 'payment-processor',
    name: 'payment-processor',
    owner: {
      name: 'finance-team',
      profilePicture: 'https://github.com/finance-team.png',
      link: 'https://github.com/orgs/company/teams/finance-team',
    },
    type: 'service',
    description:
      'Service for processing financial transactions and payment methods.',
    tags: ['payments', 'finance', 'processing'],
    lifecycle: 'production',
  },
  {
    id: 'document-viewer',
    name: 'document-viewer',
    owner: {
      name: 'frontend-team',
      profilePicture: 'https://github.com/frontend-team.png',
      link: 'https://github.com/orgs/company/teams/frontend-team',
    },
    type: 'website',
    description: 'Web-based document viewer supporting multiple file formats.',
    tags: ['documents', 'viewer'],
    lifecycle: 'production',
  },
  {
    id: 'load-balancer',
    name: 'load-balancer',
    owner: {
      name: 'devops-team',
      profilePicture: 'https://github.com/devops-team.png',
      link: 'https://github.com/orgs/company/teams/devops-team',
    },
    type: 'service',
    description:
      'Service for distributing network traffic across multiple servers.',
    tags: ['load-balancing', 'networking', 'infrastructure'],
    lifecycle: 'production',
  },
  {
    id: 'security-audit',
    name: 'security-audit',
    owner: {
      name: 'security-team',
      profilePicture: 'https://github.com/security-team.png',
      link: 'https://github.com/orgs/company/teams/security-team',
    },
    type: 'other',
    description:
      'Tools and processes for conducting security audits and compliance checks.',
    tags: ['security', 'audit', 'compliance'],
    lifecycle: 'production',
  },
  {
    id: 'user-settings',
    name: 'user-settings',
    owner: {
      name: 'frontend-team',
      profilePicture: 'https://github.com/frontend-team.png',
      link: 'https://github.com/orgs/company/teams/frontend-team',
    },
    type: 'website',
    description:
      'Interface for users to manage their preferences and account settings.',
    tags: ['user', 'settings', 'preferences'],
    lifecycle: 'production',
  },
  {
    id: 'data-import',
    name: 'data-import',
    owner: {
      name: 'data-team',
      profilePicture: 'https://github.com/data-team.png',
      link: 'https://github.com/orgs/company/teams/data-team',
    },
    type: 'service',
    description:
      'Service for importing and validating data from external sources.',
    tags: ['data', 'import', 'validation'],
    lifecycle: 'production',
  },
  {
    id: 'infrastructure-monitor',
    name: 'infrastructure-monitor',
    owner: {
      name: 'devops-team',
      profilePicture: 'https://github.com/devops-team.png',
      link: 'https://github.com/orgs/company/teams/devops-team',
    },
    type: 'service',
    description:
      'Monitoring system for infrastructure components and resources.',
    tags: ['monitoring', 'infrastructure', 'devops'],
    lifecycle: 'production',
  },
  {
    id: 'notification-manager',
    name: 'notification-manager',
    owner: {
      name: 'communication-team',
      profilePicture: 'https://github.com/communication-team.png',
      link: 'https://github.com/orgs/company/teams/communication-team',
    },
    type: 'service',
    description:
      'Service for managing and delivering notifications across multiple channels.',
    tags: ['notifications', 'management'],
    lifecycle: 'production',
  },
  {
    id: 'analytics-processor',
    name: 'analytics-processor',
    owner: {
      name: 'analytics-team',
      profilePicture: 'https://github.com/analytics-team.png',
      link: 'https://github.com/orgs/company/teams/analytics-team',
    },
    type: 'service',
    description:
      'Service for processing and analyzing business data and metrics.',
    tags: ['analytics', 'processing', 'metrics'],
    lifecycle: 'production',
  },
  {
    id: 'file-manager',
    name: 'file-manager',
    owner: {
      name: 'storage-team',
      profilePicture: 'https://github.com/storage-team.png',
      link: 'https://github.com/orgs/company/teams/storage-team',
    },
    type: 'website',
    description: 'Web interface for managing files and storage resources.',
    tags: ['files', 'storage', 'management'],
    lifecycle: 'production',
  },
  {
    id: 'search-index',
    name: 'search-index',
    owner: {
      name: 'search-team',
      profilePicture: 'https://github.com/search-team.png',
      link: 'https://github.com/orgs/company/teams/search-team',
    },
    type: 'service',
    description: 'Service for maintaining and updating search indices.',
    tags: ['search', 'indexing'],
    lifecycle: 'production',
  },
  {
    id: 'mobile-authentication',
    name: 'mobile-authentication',
    owner: {
      name: 'mobile-team',
      profilePicture: 'https://github.com/mobile-team.png',
      link: 'https://github.com/orgs/company/teams/mobile-team',
    },
    type: 'service',
    description:
      'Authentication service specifically designed for mobile applications.',
    tags: ['mobile', 'authentication', 'security'],
    lifecycle: 'experimental',
  },
  {
    id: 'system-monitor',
    name: 'system-monitor',
    owner: {
      name: 'devops-team',
      profilePicture: 'https://github.com/devops-team.png',
      link: 'https://github.com/orgs/company/teams/devops-team',
    },
    type: 'service',
    description:
      'Monitoring service for system health and performance metrics.',
    tags: ['monitoring', 'system', 'metrics'],
    lifecycle: 'production',
  },
  {
    id: 'media-processor',
    name: 'media-processor',
    owner: {
      name: 'media-team',
      profilePicture: 'https://github.com/media-team.png',
      link: 'https://github.com/orgs/company/teams/media-team',
    },
    type: 'service',
    description: 'Service for processing and optimizing media files.',
    tags: ['media', 'processing', 'optimization'],
    lifecycle: 'production',
  },
  {
    id: 'user-management',
    name: 'user-management',
    owner: {
      name: 'security-team',
      profilePicture: 'https://github.com/security-team.png',
      link: 'https://github.com/orgs/company/teams/security-team',
    },
    type: 'service',
    description: 'Service for managing user accounts and permissions.',
    tags: ['user', 'management', 'security'],
    lifecycle: 'production',
  },
  {
    id: 'data-transformer',
    name: 'data-transformer',
    owner: {
      name: 'data-team',
      profilePicture: 'https://github.com/data-team.png',
      link: 'https://github.com/orgs/company/teams/data-team',
    },
    type: 'service',
    description:
      'Service for transforming data between different formats and structures.',
    tags: ['data', 'transformation'],
    lifecycle: 'production',
  },
  {
    id: 'admin-dashboard',
    name: 'admin-dashboard',
    owner: {
      name: 'platform-team',
      profilePicture: 'https://github.com/platform-team.png',
      link: 'https://github.com/orgs/company/teams/platform-team',
    },
    type: 'website',
    description:
      'Administrative interface for system management and monitoring.',
    tags: ['admin', 'dashboard', 'management'],
    lifecycle: 'production',
  },
  {
    id: 'test-automation',
    name: 'test-automation',
    owner: {
      name: 'qa-team',
      profilePicture: 'https://github.com/qa-team.png',
      link: 'https://github.com/orgs/company/teams/qa-team',
    },
    type: 'other',
    description: 'Tools and frameworks for automating testing processes.',
    tags: ['testing', 'automation', 'qa'],
    lifecycle: 'production',
  },
  {
    id: 'event-bus',
    name: 'event-bus',
    owner: {
      name: 'platform-team',
      profilePicture: 'https://github.com/platform-team.png',
      link: 'https://github.com/orgs/company/teams/platform-team',
    },
    type: 'service',
    description: 'Event-driven communication system between services.',
    tags: ['events', 'messaging', 'communication'],
    lifecycle: 'production',
  },
  {
    id: 'invoice-generator',
    name: 'invoice-generator',
    owner: {
      name: 'finance-team',
      profilePicture: 'https://github.com/finance-team.png',
      link: 'https://github.com/orgs/company/teams/finance-team',
    },
    type: 'service',
    description: 'Service for generating and managing invoices.',
    tags: ['invoices', 'finance'],
    lifecycle: 'production',
  },
  {
    id: 'document-editor',
    name: 'document-editor',
    owner: {
      name: 'frontend-team',
      profilePicture: 'https://github.com/frontend-team.png',
      link: 'https://github.com/orgs/company/teams/frontend-team',
    },
    type: 'website',
    description: 'Web-based document editing interface.',
    tags: ['documents', 'editor'],
    lifecycle: 'experimental',
  },
  {
    id: 'service-discovery',
    name: 'service-discovery',
    owner: {
      name: 'devops-team',
      profilePicture: 'https://github.com/devops-team.png',
      link: 'https://github.com/orgs/company/teams/devops-team',
    },
    type: 'service',
    description: 'Service for discovering and registering available services.',
    tags: ['discovery', 'services', 'devops'],
    lifecycle: 'production',
  },
  {
    id: 'security-monitor',
    name: 'security-monitor',
    owner: {
      name: 'security-team',
      profilePicture: 'https://github.com/security-team.png',
      link: 'https://github.com/orgs/company/teams/security-team',
    },
    type: 'service',
    description: 'Service for monitoring security events and threats.',
    tags: ['security', 'monitoring', 'threats'],
    lifecycle: 'production',
  },
  {
    id: 'user-preferences',
    name: 'user-preferences',
    owner: {
      name: 'frontend-team',
      profilePicture: 'https://github.com/frontend-team.png',
      link: 'https://github.com/orgs/company/teams/frontend-team',
    },
    type: 'website',
    description: 'Interface for managing user preferences and settings.',
    tags: ['user', 'preferences'],
    lifecycle: 'production',
  },
  {
    id: 'data-validator',
    name: 'data-validator',
    owner: {
      name: 'data-team',
      profilePicture: 'https://github.com/data-team.png',
      link: 'https://github.com/orgs/company/teams/data-team',
    },
    type: 'service',
    description: 'Service for validating data integrity and format.',
    tags: ['data', 'validation'],
    lifecycle: 'production',
  },
  {
    id: 'infrastructure-automation',
    name: 'infrastructure-automation',
    owner: {
      name: 'devops-team',
      profilePicture: 'https://github.com/devops-team.png',
      link: 'https://github.com/orgs/company/teams/devops-team',
    },
    type: 'other',
    description:
      'Tools for automating infrastructure provisioning and management.',
    tags: ['infrastructure', 'automation', 'devops'],
    lifecycle: 'production',
  },
  {
    id: 'notification-dispatcher',
    name: 'notification-dispatcher',
    owner: {
      name: 'communication-team',
      profilePicture: 'https://github.com/communication-team.png',
      link: 'https://github.com/orgs/company/teams/communication-team',
    },
    type: 'service',
    description:
      'Service for dispatching notifications to appropriate channels.',
    tags: ['notifications', 'dispatch'],
    lifecycle: 'production',
  },
  {
    id: 'analytics-collector',
    name: 'analytics-collector',
    owner: {
      name: 'analytics-team',
      profilePicture: 'https://github.com/analytics-team.png',
      link: 'https://github.com/orgs/company/teams/analytics-team',
    },
    type: 'service',
    description: 'Service for collecting and aggregating analytics data.',
    tags: ['analytics', 'collection', 'aggregation'],
    lifecycle: 'production',
  },
  {
    id: 'file-processor',
    name: 'file-processor',
    owner: {
      name: 'storage-team',
      profilePicture: 'https://github.com/storage-team.png',
      link: 'https://github.com/orgs/company/teams/storage-team',
    },
    type: 'service',
    description: 'Service for processing and managing files.',
    tags: ['files', 'processing'],
    lifecycle: 'production',
  },
  {
    id: 'search-analyzer',
    name: 'search-analyzer',
    owner: {
      name: 'search-team',
      profilePicture: 'https://github.com/search-team.png',
      link: 'https://github.com/orgs/company/teams/search-team',
    },
    type: 'service',
    description: 'Service for analyzing search queries and results.',
    tags: ['search', 'analysis'],
    lifecycle: 'experimental',
  },
  {
    id: 'mobile-notifications',
    name: 'mobile-notifications',
    owner: {
      name: 'mobile-team',
      profilePicture: 'https://github.com/mobile-team.png',
      link: 'https://github.com/orgs/company/teams/mobile-team',
    },
    type: 'service',
    description: 'Service for sending notifications to mobile devices.',
    tags: ['mobile', 'notifications'],
    lifecycle: 'experimental',
  },
  {
    id: 'system-alerts',
    name: 'system-alerts',
    owner: {
      name: 'devops-team',
      profilePicture: 'https://github.com/devops-team.png',
      link: 'https://github.com/orgs/company/teams/devops-team',
    },
    type: 'service',
    description: 'Service for managing and dispatching system alerts.',
    tags: ['alerts', 'system', 'monitoring'],
    lifecycle: 'production',
  },
  {
    id: 'media-encoder',
    name: 'media-encoder',
    owner: {
      name: 'media-team',
      profilePicture: 'https://github.com/media-team.png',
      link: 'https://github.com/orgs/company/teams/media-team',
    },
    type: 'service',
    description: 'Service for encoding and processing media files.',
    tags: ['media', 'encoding'],
    lifecycle: 'production',
  },
  {
    id: 'user-authorization',
    name: 'user-authorization',
    owner: {
      name: 'security-team',
      profilePicture: 'https://github.com/security-team.png',
      link: 'https://github.com/orgs/company/teams/security-team',
    },
    type: 'service',
    description: 'Service for managing user permissions and access control.',
    tags: ['authorization', 'security', 'user'],
    lifecycle: 'production',
  },
  {
    id: 'data-aggregator',
    name: 'data-aggregator',
    owner: {
      name: 'data-team',
      profilePicture: 'https://github.com/data-team.png',
      link: 'https://github.com/orgs/company/teams/data-team',
    },
    type: 'service',
    description: 'Service for aggregating data from multiple sources.',
    tags: ['data', 'aggregation'],
    lifecycle: 'production',
  },
  {
    id: 'admin-authentication',
    name: 'admin-authentication',
    owner: {
      name: 'platform-team',
      profilePicture: 'https://github.com/platform-team.png',
      link: 'https://github.com/orgs/company/teams/platform-team',
    },
    type: 'service',
    description: 'Authentication service for administrative access.',
    tags: ['admin', 'authentication', 'security'],
    lifecycle: 'production',
  },
  {
    id: 'test-coverage',
    name: 'test-coverage',
    owner: {
      name: 'qa-team',
      profilePicture: 'https://github.com/qa-team.png',
      link: 'https://github.com/orgs/company/teams/qa-team',
    },
    type: 'other',
    description: 'Tools for measuring and reporting test coverage.',
    tags: ['testing', 'coverage', 'qa'],
    lifecycle: 'production',
  },
  {
    id: 'event-processor',
    name: 'event-processor',
    owner: {
      name: 'platform-team',
      profilePicture: 'https://github.com/platform-team.png',
      link: 'https://github.com/orgs/company/teams/platform-team',
    },
    type: 'service',
    description: 'Service for processing and handling events.',
    tags: ['events', 'processing'],
    lifecycle: 'production',
  },
  {
    id: 'payment-validator',
    name: 'payment-validator',
    owner: {
      name: 'finance-team',
      profilePicture: 'https://github.com/finance-team.png',
      link: 'https://github.com/orgs/company/teams/finance-team',
    },
    type: 'service',
    description: 'Service for validating payment transactions.',
    tags: ['payments', 'validation', 'finance'],
    lifecycle: 'production',
  },
  {
    id: 'document-converter',
    name: 'document-converter',
    owner: {
      name: 'frontend-team',
      profilePicture: 'https://github.com/frontend-team.png',
      link: 'https://github.com/orgs/company/teams/frontend-team',
    },
    type: 'service',
    description: 'Service for converting documents between different formats.',
    tags: ['documents', 'conversion'],
    lifecycle: 'experimental',
  },
  {
    id: 'service-health',
    name: 'service-health',
    owner: {
      name: 'devops-team',
      profilePicture: 'https://github.com/devops-team.png',
      link: 'https://github.com/orgs/company/teams/devops-team',
    },
    type: 'service',
    description: 'Service for monitoring and reporting service health status.',
    tags: ['health', 'monitoring', 'services'],
    lifecycle: 'production',
  },
  {
    id: 'security-logger',
    name: 'security-logger',
    owner: {
      name: 'security-team',
      profilePicture: 'https://github.com/security-team.png',
      link: 'https://github.com/orgs/company/teams/security-team',
    },
    type: 'service',
    description: 'Service for logging security-related events and activities.',
    tags: ['security', 'logging'],
    lifecycle: 'production',
  },
  {
    id: 'user-analytics',
    name: 'user-analytics',
    owner: {
      name: 'frontend-team',
      profilePicture: 'https://github.com/frontend-team.png',
      link: 'https://github.com/orgs/company/teams/frontend-team',
    },
    type: 'website',
    description:
      'Analytics dashboard for user behavior and engagement metrics.',
    tags: ['analytics', 'user', 'metrics'],
    lifecycle: 'experimental',
  },
  {
    id: 'data-cleaner',
    name: 'data-cleaner',
    owner: {
      name: 'data-team',
      profilePicture: 'https://github.com/data-team.png',
      link: 'https://github.com/orgs/company/teams/data-team',
    },
    type: 'service',
    description: 'Service for cleaning and standardizing data.',
    tags: ['data', 'cleaning'],
    lifecycle: 'production',
  },
  {
    id: 'infrastructure-deployer',
    name: 'infrastructure-deployer',
    owner: {
      name: 'devops-team',
      profilePicture: 'https://github.com/devops-team.png',
      link: 'https://github.com/orgs/company/teams/devops-team',
    },
    type: 'other',
    description: 'Tools for deploying and managing infrastructure resources.',
    tags: ['infrastructure', 'deployment', 'devops'],
    lifecycle: 'production',
  },
  {
    id: 'notification-queue',
    name: 'notification-queue',
    owner: {
      name: 'communication-team',
      profilePicture: 'https://github.com/communication-team.png',
      link: 'https://github.com/orgs/company/teams/communication-team',
    },
    type: 'service',
    description: 'Queue system for managing notification delivery.',
    tags: ['notifications', 'queue'],
    lifecycle: 'production',
  },
  {
    id: 'analytics-exporter',
    name: 'analytics-exporter',
    owner: {
      name: 'analytics-team',
      profilePicture: 'https://github.com/analytics-team.png',
      link: 'https://github.com/orgs/company/teams/analytics-team',
    },
    type: 'service',
    description: 'Service for exporting analytics data in various formats.',
    tags: ['analytics', 'export'],
    lifecycle: 'production',
  },
  {
    id: 'file-validator',
    name: 'file-validator',
    owner: {
      name: 'storage-team',
      profilePicture: 'https://github.com/storage-team.png',
      link: 'https://github.com/orgs/company/teams/storage-team',
    },
    type: 'service',
    description: 'Service for validating file integrity and format.',
    tags: ['files', 'validation'],
    lifecycle: 'production',
  },
  {
    id: 'search-optimizer',
    name: 'search-optimizer',
    owner: {
      name: 'search-team',
      profilePicture: 'https://github.com/search-team.png',
      link: 'https://github.com/orgs/company/teams/search-team',
    },
    type: 'service',
    description: 'Service for optimizing search performance and relevance.',
    tags: ['search', 'optimization'],
    lifecycle: 'experimental',
  },
  {
    id: 'mobile-analytics',
    name: 'mobile-analytics',
    owner: {
      name: 'mobile-team',
      profilePicture: 'https://github.com/mobile-team.png',
      link: 'https://github.com/orgs/company/teams/mobile-team',
    },
    type: 'service',
    description: 'Analytics service specifically for mobile applications.',
    tags: ['mobile', 'analytics'],
    lifecycle: 'experimental',
  },
  {
    id: 'system-logger',
    name: 'system-logger',
    owner: {
      name: 'devops-team',
      profilePicture: 'https://github.com/devops-team.png',
      link: 'https://github.com/orgs/company/teams/devops-team',
    },
    type: 'service',
    description: 'Service for logging system events and activities.',
    tags: ['logging', 'system'],
    lifecycle: 'production',
  },
  {
    id: 'media-validator',
    name: 'media-validator',
    owner: {
      name: 'media-team',
      profilePicture: 'https://github.com/media-team.png',
      link: 'https://github.com/orgs/company/teams/media-team',
    },
    type: 'service',
    description: 'Service for validating media files and formats.',
    tags: ['media', 'validation'],
    lifecycle: 'production',
  },
  {
    id: 'user-audit',
    name: 'user-audit',
    owner: {
      name: 'security-team',
      profilePicture: 'https://github.com/security-team.png',
      link: 'https://github.com/orgs/company/teams/security-team',
    },
    type: 'service',
    description: 'Service for auditing user activities and access.',
    tags: ['audit', 'user', 'security'],
    lifecycle: 'production',
  },
  {
    id: 'data-normalizer',
    name: 'data-normalizer',
    owner: {
      name: 'data-team',
      profilePicture: 'https://github.com/data-team.png',
      link: 'https://github.com/orgs/company/teams/data-team',
    },
    type: 'service',
    description: 'Service for normalizing data formats and structures.',
    tags: ['data', 'normalization'],
    lifecycle: 'production',
  },
  {
    id: 'admin-authorization',
    name: 'admin-authorization',
    owner: {
      name: 'platform-team',
      profilePicture: 'https://github.com/platform-team.png',
      link: 'https://github.com/orgs/company/teams/platform-team',
    },
    type: 'service',
    description: 'Authorization service for administrative functions.',
    tags: ['admin', 'authorization', 'security'],
    lifecycle: 'production',
  },
  {
    id: 'test-reporting',
    name: 'test-reporting',
    owner: {
      name: 'qa-team',
      profilePicture: 'https://github.com/qa-team.png',
      link: 'https://github.com/orgs/company/teams/qa-team',
    },
    type: 'other',
    description: 'Tools for generating and managing test reports.',
    tags: ['testing', 'reporting', 'qa'],
    lifecycle: 'production',
  },
];
