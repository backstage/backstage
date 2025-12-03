---
id: search-catalog
title: Searching the Catalog
description: Searching the Catalog.
---

Audience: Developers

## Overview

The Catalog can be searched by any combination of owner, kind, type, lifecycle, processing status, namespace, and name. [Customize Filters](../features/software-catalog/catalog-customization.md#customize-filters) provides information on how to modify the available search criteria.

![Catalog search options](../assets/uiguide/catalog-search-options.png)

The [Technical Overview](../overview/technical-overview.md) provides greater detail, but the catalog displays two main types of entities:

- Core Entities

  - `Components` - Individual pieces of software that can be tracked in source control and can implement APIs for other components to consume.
  - `APIs` - Implemented by components and form the boundaries between different components. The API can be either public, restricted, or private.
  - `Resources` - The physical or virtual infrastructure needed to operate a component.

- Organizational Entities
  
  - `User` - A person, such as an employee, contractor, or similar.
  - `Group` - An organizational entity, such as a team, business unit, and so on.

There are three additional items that can be part of the system model:

- `Location` - A marker that references other places to look for catalog data.
- `Type` - It has no set meaning. You can assign your own types and use them as desired.
- `Template` - Describes both the parameters that are rendered in the frontend part of the scaffolding wizard, and the steps that are executed when scaffolding that component.

## Searching for an entity

You can search for an entity using a combination of the following:

- **Search by name**

  Enter one or more consecutive letters into the `Filter` field. As you type the letters, the entities whose names do not contain that string will be filtered out of the displayed list.

  ![Search catalog by name](../assets/uiguide/search-by-name.png)

- **Search by kind**

  Use the `Kind` dropdown list to select which kind of entity to show in the list:

  - API
  - Component
  - Group
  - Location
  - System
  - Template
  - User

- **Search by Type**

  Use the `Type` dropdown list to select which type of entity to show in the list. The selections available in the dropdown list depend on the kind of entity selected in the `Kind` list, and the types of entity you have registered for that kind.

- **Search by Owner**

  Use the`Owner` dropdown to filter the catalog list by who owns the entity.

- **Search by Lifecycle**

  Use the `Lifecycle` dropdown to filter the catalog list by lifecycle.

- **Search by Processing Status**

  Use the `Processing Status` dropdown to restrict the displayed list to only include those entities which are [orphaned](../features/software-catalog/life-of-an-entity.md#orphaning) or [in error](../features/software-catalog/life-of-an-entity.md#errors).

- **Search by Namespace**

  Use the `Namespace` dropdown to filter the catalog list by namespace associated with the entity.
