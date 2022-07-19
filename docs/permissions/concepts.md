---
id: concepts
title: Concepts
description: A list of important permission framework concepts
---

### Permission

Any action that a user performs within Backstage may be represented as a permission. More complex actions, like executing a software template, may require authorization for multiple permissions throughout the flow. Permissions are identified by a unique name and optionally include a set of attributes that describe the corresponding action. Plugins are responsible for defining and exposing the permissions they enforce.

### Policy

User permissions are authorized by a central, user-defined permission policy. At a high level, a policy is a function that receives a Backstage user and permission, and returns a decision to allow or deny. Policies are expressed as code, which decouples the framework from any particular authorization model, like role-based access control (RBAC) or attribute-based access control (ABAC).

### Policy decision versus enforcement

Two important responsibilities of any authorization system are to decide if a user can do something, and to enforce that decision. In the Backstage permission framework, policies are responsible for decisions and plugins (typically backends) are responsible for enforcing them.

### Resources and rules

In many cases, a permission represents a user's interaction with another object. This object likely has information that policy authors can use to define more granular access. The permission framework introduces two abstractions to account for this: resources and rules. Resources represent the objects that users interact with. Rules are predicate-based controls that tap into a resource's data. For example, the catalog plugin defines a resource for catalog entities and a rule to check if an entity has a given annotation.

### Conditional decisions

Rules need additional data before they can be used in a decision. For example, the catalog plugin's "has annotation" rule needs to know what annotation to look for on a given entity. Once a rule is bound to relevant information it forms a condition. Conditions are then used to return a conditional decision from a policy. Conditional decisions tell the permission framework to delegate evaluation to the plugin that owns the corresponding resource. Permission requests that result in a conditional decision are allowed if all of the provided conditions evaluate to be true. This conditional behavior avoids coupling between policies and resource schemas, and allows plugins to evaluate complex rules in an efficient way. For example, a plugin may convert a conditional decision to a database query instead of loading and filtering objects in memory.
