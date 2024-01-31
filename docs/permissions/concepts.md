---
id: concepts
title: Concepts
description: A list of important permission framework concepts
---

### Policy decision versus enforcement

Two important responsibilities of any authorization system are to decide if a user can do something, and to enforce that decision. In the Backstage permission framework, policies are responsible for decisions and plugins (typically backends) are responsible for enforcing them.

### Resources and rules

In many cases, a permission represents a user's interaction with another object. This object likely has information that policy authors can use to define more granular access. The permission framework introduces two abstractions to account for this: [resources](../references/glossary.md#resource-permission-plugin) and [rules](../references/glossary.md#rule-permission-plugin). For example, the catalog plugin defines a resource for catalog entities and a rule to check if an entity has a given annotation.

### Conditional decisions

[Rules](../references/glossary.md#rule-permission-plugin) need additional data before they can be used in a decision. Once a [rule](../references/glossary.md#rule-permission-plugin) is bound to relevant information it forms a [condition](../references/glossary.md#condition-permission-plugin). Conditional decisions tell the [permission framework](#permission) to delegate evaluation to the [plugin](#plugin) that owns the corresponding [resource](#resource-permission-plugin). Permission requests that result in a conditional decision are allowed if all of the provided conditions evaluate to be true.

A good example would be the catalog plugin's "has annotation" rule which needs to know what annotation to look for on a given entity. The permission framework would respond to a request by the catalog plugin in this case with a condition decision. The catalog plugin would then need to correctly filter for entities matching the "has annotations" condition. This conditional behavior avoids coupling between policies and resource schemas, and allows plugins to evaluate complex rules in an efficient way. For example, a plugin may convert a conditional decision to a database query instead of loading and filtering objects in memory.
