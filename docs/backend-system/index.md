---
id: index
title: The Backend System
sidebar_label: Introduction
description: Introduction to Backstage's backend system and its documentation
---

## Overview

The Backstage backend system provides a flexible foundation for building and extending Backstage backends. It uses a modular architecture where you can create and customize plugins, modules, and service implementations. It's focused both around building your own features as well as installing third-party plugins and modules available in the Backstage ecosystem. The system is designed to be scalable and maintainable, making it work well for organizations of all sizes.

## Documentation Sections

This documentation is organized into several key areas, each focusing on different aspects of the backend system:

### [Architecture](./architecture/01-index.md)

The Architecture section explains the core building blocks and concepts of the Backstage backend system. It starts with backend instances, which serve as the main entry point for creating and wiring together backend features. You'll learn about plugins that provide the base features and operate independently as microservices, modules that extend plugins with additional capabilities through extension points, and services that provide shared functionality across plugins and modules. The section also covers feature loaders that enable programmatic selection and installation of features, as well as important naming patterns and conventions used throughout the backend system.

### [Building Backends](./building-backends/01-index.md)

This section covers how to set up and customize your own Backstage backend. You'll learn about the basic structure of a backend package, how to install plugins and modules, and ways to customize your installation through configuration and custom service implementations. The section also explains how to split your backend into multiple deployments for better scalability and security isolation.

### [Building Plugins and Modules](./building-plugins-and-modules/01-index.md)

The Building Plugins and Modules section shows you how to create and test backend plugins and modules. It covers creating new plugins using `yarn new`, implementing plugin functionality with services and extension points, and building modules that extend existing plugins. You'll learn how to test your plugins and modules using the test utilities in `@backstage/backend-test-utils`, including mocking services, testing HTTP endpoints, and working with databases. The section also explains how to enable users of your plugin to customize it through static configuration and extension points.

### [Core Services](./core-services/01-index.md)

The Core Services section documents the essential services that are available to all backend plugins. These include fundamental services like logging, configuration, and HTTP routing that plugins can depend on. Each service is documented with its interface, implementation details, and usage examples.
