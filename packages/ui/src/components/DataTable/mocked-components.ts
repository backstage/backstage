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
  name: string;
  owner: {
    name: string;
    profilePicture?: string;
    link?: string;
  };
  type: 'documentation' | 'library' | 'service' | 'website' | 'other';
  description?: string;
  tags?: string[];
}

export const data: DataProps[] = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
    name: 'testing-dashboard',
    owner: {
      name: 'qa-team',
      profilePicture: 'https://github.com/qa-team.png',
      link: 'https://github.com/orgs/company/teams/qa-team',
    },
    type: 'website',
    description: 'Dashboard for monitoring test results and quality metrics.',
    tags: ['testing', 'dashboard', 'qa'],
  },
  {
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
  },
  {
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
  },
  {
    name: 'document-viewer',
    owner: {
      name: 'frontend-team',
      profilePicture: 'https://github.com/frontend-team.png',
      link: 'https://github.com/orgs/company/teams/frontend-team',
    },
    type: 'website',
    description: 'Web-based document viewer supporting multiple file formats.',
    tags: ['documents', 'viewer'],
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
    name: 'file-manager',
    owner: {
      name: 'storage-team',
      profilePicture: 'https://github.com/storage-team.png',
      link: 'https://github.com/orgs/company/teams/storage-team',
    },
    type: 'website',
    description: 'Web interface for managing files and storage resources.',
    tags: ['files', 'storage', 'management'],
  },
  {
    name: 'search-index',
    owner: {
      name: 'search-team',
      profilePicture: 'https://github.com/search-team.png',
      link: 'https://github.com/orgs/company/teams/search-team',
    },
    type: 'service',
    description: 'Service for maintaining and updating search indices.',
    tags: ['search', 'indexing'],
  },
  {
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
  },
  {
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
  },
  {
    name: 'media-processor',
    owner: {
      name: 'media-team',
      profilePicture: 'https://github.com/media-team.png',
      link: 'https://github.com/orgs/company/teams/media-team',
    },
    type: 'service',
    description: 'Service for processing and optimizing media files.',
    tags: ['media', 'processing', 'optimization'],
  },
  {
    name: 'user-management',
    owner: {
      name: 'security-team',
      profilePicture: 'https://github.com/security-team.png',
      link: 'https://github.com/orgs/company/teams/security-team',
    },
    type: 'service',
    description: 'Service for managing user accounts and permissions.',
    tags: ['user', 'management', 'security'],
  },
  {
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
  },
  {
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
  },
  {
    name: 'test-automation',
    owner: {
      name: 'qa-team',
      profilePicture: 'https://github.com/qa-team.png',
      link: 'https://github.com/orgs/company/teams/qa-team',
    },
    type: 'other',
    description: 'Tools and frameworks for automating testing processes.',
    tags: ['testing', 'automation', 'qa'],
  },
  {
    name: 'event-bus',
    owner: {
      name: 'platform-team',
      profilePicture: 'https://github.com/platform-team.png',
      link: 'https://github.com/orgs/company/teams/platform-team',
    },
    type: 'service',
    description: 'Event-driven communication system between services.',
    tags: ['events', 'messaging', 'communication'],
  },
  {
    name: 'invoice-generator',
    owner: {
      name: 'finance-team',
      profilePicture: 'https://github.com/finance-team.png',
      link: 'https://github.com/orgs/company/teams/finance-team',
    },
    type: 'service',
    description: 'Service for generating and managing invoices.',
    tags: ['invoices', 'finance'],
  },
  {
    name: 'document-editor',
    owner: {
      name: 'frontend-team',
      profilePicture: 'https://github.com/frontend-team.png',
      link: 'https://github.com/orgs/company/teams/frontend-team',
    },
    type: 'website',
    description: 'Web-based document editing interface.',
    tags: ['documents', 'editor'],
  },
  {
    name: 'service-discovery',
    owner: {
      name: 'devops-team',
      profilePicture: 'https://github.com/devops-team.png',
      link: 'https://github.com/orgs/company/teams/devops-team',
    },
    type: 'service',
    description: 'Service for discovering and registering available services.',
    tags: ['discovery', 'services', 'devops'],
  },
  {
    name: 'security-monitor',
    owner: {
      name: 'security-team',
      profilePicture: 'https://github.com/security-team.png',
      link: 'https://github.com/orgs/company/teams/security-team',
    },
    type: 'service',
    description: 'Service for monitoring security events and threats.',
    tags: ['security', 'monitoring', 'threats'],
  },
  {
    name: 'user-preferences',
    owner: {
      name: 'frontend-team',
      profilePicture: 'https://github.com/frontend-team.png',
      link: 'https://github.com/orgs/company/teams/frontend-team',
    },
    type: 'website',
    description: 'Interface for managing user preferences and settings.',
    tags: ['user', 'preferences'],
  },
  {
    name: 'data-validator',
    owner: {
      name: 'data-team',
      profilePicture: 'https://github.com/data-team.png',
      link: 'https://github.com/orgs/company/teams/data-team',
    },
    type: 'service',
    description: 'Service for validating data integrity and format.',
    tags: ['data', 'validation'],
  },
  {
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
  },
  {
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
  },
  {
    name: 'analytics-collector',
    owner: {
      name: 'analytics-team',
      profilePicture: 'https://github.com/analytics-team.png',
      link: 'https://github.com/orgs/company/teams/analytics-team',
    },
    type: 'service',
    description: 'Service for collecting and aggregating analytics data.',
    tags: ['analytics', 'collection', 'aggregation'],
  },
  {
    name: 'file-processor',
    owner: {
      name: 'storage-team',
      profilePicture: 'https://github.com/storage-team.png',
      link: 'https://github.com/orgs/company/teams/storage-team',
    },
    type: 'service',
    description: 'Service for processing and managing files.',
    tags: ['files', 'processing'],
  },
  {
    name: 'search-analyzer',
    owner: {
      name: 'search-team',
      profilePicture: 'https://github.com/search-team.png',
      link: 'https://github.com/orgs/company/teams/search-team',
    },
    type: 'service',
    description: 'Service for analyzing search queries and results.',
    tags: ['search', 'analysis'],
  },
  {
    name: 'mobile-notifications',
    owner: {
      name: 'mobile-team',
      profilePicture: 'https://github.com/mobile-team.png',
      link: 'https://github.com/orgs/company/teams/mobile-team',
    },
    type: 'service',
    description: 'Service for sending notifications to mobile devices.',
    tags: ['mobile', 'notifications'],
  },
  {
    name: 'system-alerts',
    owner: {
      name: 'devops-team',
      profilePicture: 'https://github.com/devops-team.png',
      link: 'https://github.com/orgs/company/teams/devops-team',
    },
    type: 'service',
    description: 'Service for managing and dispatching system alerts.',
    tags: ['alerts', 'system', 'monitoring'],
  },
  {
    name: 'media-encoder',
    owner: {
      name: 'media-team',
      profilePicture: 'https://github.com/media-team.png',
      link: 'https://github.com/orgs/company/teams/media-team',
    },
    type: 'service',
    description: 'Service for encoding and processing media files.',
    tags: ['media', 'encoding'],
  },
  {
    name: 'user-authorization',
    owner: {
      name: 'security-team',
      profilePicture: 'https://github.com/security-team.png',
      link: 'https://github.com/orgs/company/teams/security-team',
    },
    type: 'service',
    description: 'Service for managing user permissions and access control.',
    tags: ['authorization', 'security', 'user'],
  },
  {
    name: 'data-aggregator',
    owner: {
      name: 'data-team',
      profilePicture: 'https://github.com/data-team.png',
      link: 'https://github.com/orgs/company/teams/data-team',
    },
    type: 'service',
    description: 'Service for aggregating data from multiple sources.',
    tags: ['data', 'aggregation'],
  },
  {
    name: 'admin-authentication',
    owner: {
      name: 'platform-team',
      profilePicture: 'https://github.com/platform-team.png',
      link: 'https://github.com/orgs/company/teams/platform-team',
    },
    type: 'service',
    description: 'Authentication service for administrative access.',
    tags: ['admin', 'authentication', 'security'],
  },
  {
    name: 'test-coverage',
    owner: {
      name: 'qa-team',
      profilePicture: 'https://github.com/qa-team.png',
      link: 'https://github.com/orgs/company/teams/qa-team',
    },
    type: 'other',
    description: 'Tools for measuring and reporting test coverage.',
    tags: ['testing', 'coverage', 'qa'],
  },
  {
    name: 'event-processor',
    owner: {
      name: 'platform-team',
      profilePicture: 'https://github.com/platform-team.png',
      link: 'https://github.com/orgs/company/teams/platform-team',
    },
    type: 'service',
    description: 'Service for processing and handling events.',
    tags: ['events', 'processing'],
  },
  {
    name: 'payment-validator',
    owner: {
      name: 'finance-team',
      profilePicture: 'https://github.com/finance-team.png',
      link: 'https://github.com/orgs/company/teams/finance-team',
    },
    type: 'service',
    description: 'Service for validating payment transactions.',
    tags: ['payments', 'validation', 'finance'],
  },
  {
    name: 'document-converter',
    owner: {
      name: 'frontend-team',
      profilePicture: 'https://github.com/frontend-team.png',
      link: 'https://github.com/orgs/company/teams/frontend-team',
    },
    type: 'service',
    description: 'Service for converting documents between different formats.',
    tags: ['documents', 'conversion'],
  },
  {
    name: 'service-health',
    owner: {
      name: 'devops-team',
      profilePicture: 'https://github.com/devops-team.png',
      link: 'https://github.com/orgs/company/teams/devops-team',
    },
    type: 'service',
    description: 'Service for monitoring and reporting service health status.',
    tags: ['health', 'monitoring', 'services'],
  },
  {
    name: 'security-logger',
    owner: {
      name: 'security-team',
      profilePicture: 'https://github.com/security-team.png',
      link: 'https://github.com/orgs/company/teams/security-team',
    },
    type: 'service',
    description: 'Service for logging security-related events and activities.',
    tags: ['security', 'logging'],
  },
  {
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
  },
  {
    name: 'data-cleaner',
    owner: {
      name: 'data-team',
      profilePicture: 'https://github.com/data-team.png',
      link: 'https://github.com/orgs/company/teams/data-team',
    },
    type: 'service',
    description: 'Service for cleaning and standardizing data.',
    tags: ['data', 'cleaning'],
  },
  {
    name: 'infrastructure-deployer',
    owner: {
      name: 'devops-team',
      profilePicture: 'https://github.com/devops-team.png',
      link: 'https://github.com/orgs/company/teams/devops-team',
    },
    type: 'other',
    description: 'Tools for deploying and managing infrastructure resources.',
    tags: ['infrastructure', 'deployment', 'devops'],
  },
  {
    name: 'notification-queue',
    owner: {
      name: 'communication-team',
      profilePicture: 'https://github.com/communication-team.png',
      link: 'https://github.com/orgs/company/teams/communication-team',
    },
    type: 'service',
    description: 'Queue system for managing notification delivery.',
    tags: ['notifications', 'queue'],
  },
  {
    name: 'analytics-exporter',
    owner: {
      name: 'analytics-team',
      profilePicture: 'https://github.com/analytics-team.png',
      link: 'https://github.com/orgs/company/teams/analytics-team',
    },
    type: 'service',
    description: 'Service for exporting analytics data in various formats.',
    tags: ['analytics', 'export'],
  },
  {
    name: 'file-validator',
    owner: {
      name: 'storage-team',
      profilePicture: 'https://github.com/storage-team.png',
      link: 'https://github.com/orgs/company/teams/storage-team',
    },
    type: 'service',
    description: 'Service for validating file integrity and format.',
    tags: ['files', 'validation'],
  },
  {
    name: 'search-optimizer',
    owner: {
      name: 'search-team',
      profilePicture: 'https://github.com/search-team.png',
      link: 'https://github.com/orgs/company/teams/search-team',
    },
    type: 'service',
    description: 'Service for optimizing search performance and relevance.',
    tags: ['search', 'optimization'],
  },
  {
    name: 'mobile-analytics',
    owner: {
      name: 'mobile-team',
      profilePicture: 'https://github.com/mobile-team.png',
      link: 'https://github.com/orgs/company/teams/mobile-team',
    },
    type: 'service',
    description: 'Analytics service specifically for mobile applications.',
    tags: ['mobile', 'analytics'],
  },
  {
    name: 'system-logger',
    owner: {
      name: 'devops-team',
      profilePicture: 'https://github.com/devops-team.png',
      link: 'https://github.com/orgs/company/teams/devops-team',
    },
    type: 'service',
    description: 'Service for logging system events and activities.',
    tags: ['logging', 'system'],
  },
  {
    name: 'media-validator',
    owner: {
      name: 'media-team',
      profilePicture: 'https://github.com/media-team.png',
      link: 'https://github.com/orgs/company/teams/media-team',
    },
    type: 'service',
    description: 'Service for validating media files and formats.',
    tags: ['media', 'validation'],
  },
  {
    name: 'user-audit',
    owner: {
      name: 'security-team',
      profilePicture: 'https://github.com/security-team.png',
      link: 'https://github.com/orgs/company/teams/security-team',
    },
    type: 'service',
    description: 'Service for auditing user activities and access.',
    tags: ['audit', 'user', 'security'],
  },
  {
    name: 'data-normalizer',
    owner: {
      name: 'data-team',
      profilePicture: 'https://github.com/data-team.png',
      link: 'https://github.com/orgs/company/teams/data-team',
    },
    type: 'service',
    description: 'Service for normalizing data formats and structures.',
    tags: ['data', 'normalization'],
  },
  {
    name: 'admin-authorization',
    owner: {
      name: 'platform-team',
      profilePicture: 'https://github.com/platform-team.png',
      link: 'https://github.com/orgs/company/teams/platform-team',
    },
    type: 'service',
    description: 'Authorization service for administrative functions.',
    tags: ['admin', 'authorization', 'security'],
  },
  {
    name: 'test-reporting',
    owner: {
      name: 'qa-team',
      profilePicture: 'https://github.com/qa-team.png',
      link: 'https://github.com/orgs/company/teams/qa-team',
    },
    type: 'other',
    description: 'Tools for generating and managing test reports.',
    tags: ['testing', 'reporting', 'qa'],
  },
  {
    name: 'event-aggregator',
    owner: {
      name: 'platform-team',
      profilePicture: 'https://github.com/platform-team.png',
      link: 'https://github.com/orgs/company/teams/platform-team',
    },
    type: 'service',
    description: 'Service for aggregating and processing events.',
    tags: ['events', 'aggregation'],
  },
  {
    name: 'payment-reconciler',
    owner: {
      name: 'finance-team',
      profilePicture: 'https://github.com/finance-team.png',
      link: 'https://github.com/orgs/company/teams/finance-team',
    },
    type: 'service',
    description: 'Service for reconciling payment transactions.',
    tags: ['payments', 'reconciliation', 'finance'],
  },
  {
    name: 'document-validator',
    owner: {
      name: 'frontend-team',
      profilePicture: 'https://github.com/frontend-team.png',
      link: 'https://github.com/orgs/company/teams/frontend-team',
    },
    type: 'service',
    description: 'Service for validating document formats and content.',
    tags: ['documents', 'validation'],
  },
  {
    name: 'service-monitor',
    owner: {
      name: 'devops-team',
      profilePicture: 'https://github.com/devops-team.png',
      link: 'https://github.com/orgs/company/teams/devops-team',
    },
    type: 'service',
    description: 'Service for monitoring service health and performance.',
    tags: ['monitoring', 'services', 'health'],
  },
  {
    name: 'security-validator',
    owner: {
      name: 'security-team',
      profilePicture: 'https://github.com/security-team.png',
      link: 'https://github.com/orgs/company/teams/security-team',
    },
    type: 'service',
    description: 'Service for validating security configurations and policies.',
    tags: ['security', 'validation'],
  },
];
