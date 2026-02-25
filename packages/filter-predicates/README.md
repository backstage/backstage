# @backstage/filter-predicates

Contains types and implementations related to the concept of
[filter predicate expressions](https://backstage.io/docs/features/software-catalog/catalog-customization#entity-predicate-queries).

These allow you to uniformly express filters, including logical operators and
advanced matchers, for filtering through structured data.

Example:

```json
{
  "filter": {
    "kind": "Component",
    "spec.type": { "$in": ["service", "website"] }
  }
}
```
