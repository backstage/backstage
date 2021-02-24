# code-coverage

This is the backend part of the code-coverage plugin. It takes care of processing various coverage formats and standardizing them into a single json format, used by the frontend.

## Configuring your entity

In order to use this plugin, you must set the `backstage.io/code-coverage` annotation.

```yaml
backstage.io/code-coverage: enabled
```

There's a feature to only include files that are in VCS in the coverage report, this is helpful to not count generated files for example. To enable this set the `backstage.io/code-coverage` annotation to `scm-only`.

```yaml
backstage.io/code-coverage: scm-only
```

Note: This requires the [`backstage.io/source-location` annotation](https://backstage.io/docs/features/software-catalog/well-known-annotations#backstageiosource-location) to be set.

## API

### Adding cobertura report

POST a cobertura xml to `/:kind/:namespace/:name?coverageType=cobertura`

Example:

```json
// curl -X POST -H "Content-Type:text/xml" -d @cobertura.xml "localhost:7000/api/code-coverage/Component/default/entity-name?coverageType=cobertura"
{
  "links": [
    {
      "href": "http://localhost:7000/api/code-coverage/Component/default/entity-name",
      "rel": "coverage"
    }
  ]
}
```

### Adding jacoco report

POST a jacoco xml to `/:kind/:namespace/:name?coverageType=jacoco`

Example:

```json
// curl -X POST -H "Content-Type:text/xml" -d @jacoco.xml "localhost:7000/api/code-coverage/Component/default/entity-name?coverageType=jacoco"
{
  "links": [
    {
      "href": "http://localhost:7000/api/code-coverage/Component/default/entity-name",
      "rel": "coverage"
    }
  ]
}
```

### Reading json coverage

GET `/:kind/:namespace/:name`

Example:

```json
// curl localhost:7000/api/code-coverage/Component/default/entity-name
{
  "aggregate": {
    "branch": {
      "available": 0,
      "covered": 0,
      "missed": 0,
      "percentage": 0
    },
    "line": {
      "available": 5,
      "covered": 4,
      "missed": 1,
      "percentage": 80
    }
  },
  "entity": {
    "kind": "Component",
    "name": "entity-name",
    "namespace": "default"
  },
  "files": [
    {
      "branchHits": {},
      "filename": "main.go",
      "lineHits": {
        "117": 12,
        "142": 8,
        "34": 8,
        "42": 0,
        "58": 6
      }
    }
  ]
}
```

### Coverage history

GET `/:kind/:namespace/:name/history`

Example

```json
// curl localhost:7000/api/code-coverage/Component/default/entity-name/history
{
  "entity": {
    "kind": "Component",
    "name": "entity-name",
    "namespace": "default"
  },
  "history": [
    {
      "branch": {
        "available": 0,
        "covered": 0,
        "missed": 0,
        "percentage": 0
      },
      "line": {
        "available": 299,
        "covered": 116,
        "missed": 183,
        "percentage": 38.8
      },
      "timestamp": 1615490766141
    },
    {
      "branch": {
        "available": 0,
        "covered": 0,
        "missed": 0,
        "percentage": 0
      },
      "line": {
        "available": 299,
        "covered": 116,
        "missed": 183,
        "percentage": 38.8
      },
      "timestamp": 1615406307929
    }
  ]
}
```
