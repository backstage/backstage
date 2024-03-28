---
id: ui-options-examples
title: ui:options Examples
description: The input props that can be specified under ui:options for different pickers
---

## EntityPicker

The input props that can be specified under `ui:options` for the `EntityPicker` field extension.

### `allowArbitraryValues`

Whether to allow arbitrary user input. Defaults to true.

`allowArbitraryValues` provides input validation when selecting an entity as the values you enter will correspond to a valid entity.

- Adding a valid entity with `allowArbitraryValues` as `false`

```yaml
entity:
  title: Entity
  type: string
  description: Entity of the component
  ui:field: EntityPicker
  ui:options:
    allowArbitraryValues: false
```

- Adding an arbitrary entity with `allowArbitraryValues` as `true` (default value)

```yaml
entity:
  title: Entity
  type: string
  description: Entity of the component
  ui:field: EntityPicker
  ui:options:
    allowArbitraryValues: true
```

### `allowedKinds`

DEPRECATED: Use `catalogFilter` instead.

### `catalogFilter`

`catalogFilter` supports filtering options by any field(s) of an entity.

- Get all entities of kind `Group`

```yaml
entity:
  title: Entity
  type: string
  description: Entity of the component
  ui:field: EntityPicker
  ui:options:
    catalogFilter:
      - kind: Group
```

- Get entities of kind `Group` and spec.type `team`

```yaml
entity:
  title: Entity
  type: string
  description: Entity of the component
  ui:field: EntityPicker
  ui:options:
    catalogFilter:
      - kind: Group
        spec.type: team
```

For the full details on the spec.\* values see [here](../software-catalog/descriptor-format.md#kind-group).

### `defaultKind`

The default entity kind.

```yaml
system:
  title: System
  type: string
  description: System of the component
  ui:field: EntityPicker
  ui:options:
    catalogFilter:
      kind: System
    defaultKind: System
```

### `defaultNamespace`

The ID of a namespace that the entity belongs to. The default value is `default`.

- Listing all entities in the `default` namespace (default value)

```yaml
entity:
  title: Entity
  type: string
  description: Entity of the component
  ui:field: EntityPicker
  ui:options:
    defaultNamespace: default
```

- Listing all entities in the `payment` namespace

```yaml
entity:
  title: Entity
  type: string
  description: Entity of the component
  ui:field: EntityPicker
  ui:options:
    defaultNamespace: payment
```

## MultiEntityPicker

The input props that can be specified under `ui:options` for the `MultiEntityPicker` field extension.

### `allowArbitraryValues`

Whether to allow arbitrary user input. Defaults to true.

`allowArbitraryValues` provides input validation when selecting an entity as the values you enter will correspond to a valid entity.

- Adding a valid entity with `allowArbitraryValues` as `false`

```yaml
entity:
  title: Entities
  type: array
  description: Entities of the component
  ui:field: MultiEntityPicker
  ui:options:
    allowArbitraryValues: false
```

- Adding an arbitrary entity with `allowArbitraryValues` as `true` (default value)

```yaml
entity:
  title: Entities
  type: array
  description: Entities of the component
  ui:field: MultiEntityPicker
  ui:options:
    allowArbitraryValues: true
```

### `catalogFilter`

`catalogFilter` supports filtering options by any field(s) of an entity.

- Get all entities of kind `Group`

```yaml
entity:
  title: Entities
  type: array
  description: Entities of the component
  ui:field: MultiEntityPicker
  ui:options:
    catalogFilter:
      - kind: Group
```

- Get entities of kind `Group` and spec.type `team`

```yaml
entity:
  title: Entities
  type: array
  description: Entities of the component
  ui:field: MultiEntityPicker
  ui:options:
    catalogFilter:
      - kind: Group
        spec.type: team
```

For the full details on the spec.\* values see [here](../software-catalog/descriptor-format.md#kind-group).

### `defaultKind`

The default entity kind.

```yaml
system:
  title: System
  type: array
  description: Systems of the component
  ui:field: MultiEntityPicker
  ui:options:
    catalogFilter:
      kind: System
    defaultKind: System
```

### `defaultNamespace`

The ID of a namespace that the entity belongs to. The default value is `default`.

- Listing all entities in the `default` namespace (default value)

```yaml
entity:
  title: Entity
  type: array
  description: Entities of the component
  ui:field: MultiEntityPicker
  ui:options:
    defaultNamespace: default
```

- Listing all entities in the `payment` namespace

```yaml
entity:
  title: Entity
  type: array
  description: Entities of the component
  ui:field: MultiEntityPicker
  ui:options:
    defaultNamespace: payment
```

## `OwnerPicker`

The input props that can be specified under `ui:options` for the `OwnerPicker` field extension.

### `allowArbitraryValues`

Whether to allow arbitrary user input. Defaults to true.

`allowArbitraryValues` provides input validation when selecting an owner as the values you enter will correspond to a valid owner.

- Adding a valid owner with `allowArbitraryValues` as `false`

```yaml
owner:
  title: Owner
  type: string
  description: Owner of the component
  ui:field: OwnerPicker
  ui:options:
    allowArbitraryValues: false
```

- Adding an arbitrary owner with `allowArbitraryValues` as `true` (default value)

```yaml
owner:
  title: Owner
  type: string
  description: Owner of the component
  ui:field: OwnerPicker
  ui:options:
    allowArbitraryValues: true
```

### `allowedKinds`

DEPRECATED: Use `catalogFilter` instead.

### `catalogFilter`

`catalogFilter` supports filtering options by any field(s) of an entity.

- Get all entities of kind `Group`

```yaml
owner:
  title: Owner
  type: string
  description: Owner of the component
  ui:field: OwnerPicker
  ui:options:
    catalogFilter:
      - kind: Group
```

- Get entities of kind `Group` and spec.type `team`

```yaml
owner:
  title: Owner
  type: string
  description: Owner of the component
  ui:field: OwnerPicker
  ui:options:
    catalogFilter:
      - kind: Group
        spec.type: team
```

For the full details on the spec.\* values see [here](../software-catalog/descriptor-format.md#kind-group).

### `defaultNamespace`

The ID of a namespace that the owner belongs to. The default value is `default`.

- Listing owners in the `default` namespace (default value)

```yaml
owner:
  title: Owner
  type: string
  description: Owner of the component
  ui:field: OwnerPicker
  ui:options:
    catalogFilter:
      - kind: Group
    defaultNamespace: default
```

- Listing owners in the `payment` namespace

```yaml
owner:
  title: Owner
  type: string
  description: Owner of the component
  ui:field: OwnerPicker
  ui:options:
    catalogFilter:
      - kind: Group
    defaultNamespace: payment
```

## RepoUrlPicker

The input props that can be specified under `ui:options` for the `RepoUrlPicker` field extension.

### `allowedHosts`

The `allowedHosts` part should be set to where you wish to enable this template
to publish to. And it can be any host that is listed in your integrations'
config in `app-config.yaml`.

- Publish only to repositories from `github.com`

```yaml
repoUrl:
  title: Repository Location
  type: string
  ui:field: RepoUrlPicker
  ui:options:
    allowedHosts:
      - github.com
```

### `allowedOrganizations`

List of allowed organizations in the given SCM platform. You can restrict the template to publish to a set of organizations.

- Publish only to repositories from organization `my_organization`

```yaml
repoUrl:
  title: Repository Location
  type: string
  ui:field: RepoUrlPicker
  ui:options:
    allowedOrganizations:
      - my_organization
```

### `allowedProjects`

List of allowed projects in the given SCM platform. You can restrict the template to publish to a set of projects.

- Publish only to repositories from project `project_1`

```yaml
repoUrl:
  title: Repository Location
  type: string
  ui:field: RepoUrlPicker
  ui:options:
    allowedProjects:
      - project_1
```

### `allowedRepos`

List of allowed repos in the given SCM platform. You can restrict the template to publish to a set of repository names.

- Publish to only `repo_1` and `repo_2` repositories

```yaml
repoUrl:
  title: Repository Location
  type: string
  ui:field: RepoUrlPicker
  ui:options:
    allowedRepos:
      - repo_1
      - repo_2
```

### `allowedOwners`

List of allowed owners in the given SCM platform. You can restrict the template to publish to repositories owned by specific users/groups by setting the `allowedOwners` option.

- Publish to only repositories from owner `owner_1` and `owner_2`

```yaml
repoUrl:
  title: Repository Location
  type: string
  ui:field: RepoUrlPicker
  ui:options:
    allowedOwners:
      - owner_1
      - owner_2
```

### `requestUserCredentials`

If defined will request user credentials to auth against the given SCM platform.

```yaml
repoUrl:
  title: Repository Location
  type: string
  ui:field: RepoUrlPicker
  ui:options:
    requestUserCredentials:
      secretsKey: USER_OAUTH_TOKEN
      additionalScopes:
        github:
          - workflow:write
```

`secretsKey` is the key used within the template secrets context to store the credential and `additionalScopes` is any additional permission scopes to request.

The supported `additionalScopes` values are `gerrit`, `github`, `gitlab`, `bitbucket`, and `azure`.
