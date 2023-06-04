# @backstage/plugin-nomad

This plugin is a frontend for viewing Nomad job versions and allocations.

## Introduction

### Nomad

> A simple and flexible scheduler and orchestrator to deploy and manage containers and non-containerized applications across on-prem and clouds at scale.

### Features

At the time of writing, this plugin provides two components:

- a table to view recent [job versions](https://developer.hashicorp.com/nomad/docs/commands/job/history)
- a table to view [allocations for a job and/or group](https://developer.hashicorp.com/nomad/tutorials/manage-jobs/jobs-inspect)

## Getting Started

### Requirements

You will need a running Nomad cluster. You can follow [this tutorial](https://developer.hashicorp.com/nomad/tutorials/enterprise/production-deployment-guide-vm-with-consul) to learn how to deploy one.

If ACLs are enabled, you will need a `token` with at least [`list-jobs` and `read-jobs` capabilities](https://developer.hashicorp.com/nomad/tutorials/access-control/access-control-policies#namespace-rules). You can check [this tutorial](https://developer.hashicorp.com/nomad/tutorials/access-control/access-control-create-policy) for more info.

### Installation

```bash
# From your Backstage root directory
yarn add --cwd packages/app @backstage/plugin-nomad
```

### Configuration

Add configuration to your [`app-config.yaml`](https://github.com/backstage/backstage/blob/master/app-config.yaml). For example:

```yaml
nomad:
  addr: http://localhost:4646
  token: 70d707b6-3d45-472e-8639-6b15770c19b8
```

The `token` can be excluded if [ACLs are not enabled](https://developer.hashicorp.com/nomad/api-docs#authentication).

### Annotate Components

There are two annotations for Components in the Service Catalog:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  annotations:
    nomad.io/job-id: redis
    nomad.io/group: 'redis|prometheus-collector'
```

The `nomad.io/job-id` annotation's value is matched exactly. The `nomad.io/group` annotation's value is used as a regex pattern against `TaskGroup` using [Nomad's server-side filtering](https://developer.hashicorp.com/nomad/api-docs#filtering).

### Job Versions Card

The snippet below adds a card to the overview tab on the EntityPage. It shows versions of a Nomad job associated with a Component in the Catalog.

```typescript
// In packages/app/src/components/catalog/EntityPage.tsx

import { EntityNomadJobVersionListCard, isNomadJobIDAvailable } from '@backstage/plugin-nomad';

const overviewContent = (
  ...
  <EntitySwitch>
    <EntitySwitch.Case if={isNomadJobIDAvailable}>
      <Grid item md={6} xs={12}>
        <EntityNomadJobVersionListCard />
      </Grid>
    </EntitySwitch.Case>
  </EntitySwitch>
);
```

<div>
<img src="./img/job-versions-component.png" width="350em">
</div>

#### Requirements

- the `nomad.io/job-id` annotation must be set

### Allocations Table

The snippet below adds a `/nomad` tab to the EntityPage that displays all allocations associated the `nomad.io/job-id` and/or `nomad.io/group` of Component's annotations.

```typescript
// In packages/app/src/components/catalog/EntityPage.tsx

import { EntityNomadAllocationListTable, isNomadAllocationsAvailable } from '@backstage/plugin-nomad';

const serviceEntityPage = (
    ...
    <EntityLayout.Route
      if={isNomadAllocationsAvailable}
      path="/nomad"
      title="Nomad"
    >
      <EntityNomadAllocationListTable />
    </EntityLayout.Route>
)
```

<div>
<img src="./img/allocations-component.png" width="800em">
</div>

#### Requirements

- `nomad.io/job-id` and/or `nomad.io/group` annotations must be set
