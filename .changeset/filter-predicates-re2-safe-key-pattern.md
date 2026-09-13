---
'@backstage/filter-predicates': patch
---

The JSON Schema exported for filter predicates can now be compiled by validators built on RE2 (for example Go's `regexp`, used by Amazon Bedrock AgentCore Gateway), which previously rejected the predicate key pattern and failed every call to tools such as `query-catalog-entities`. Accepted keys are unchanged, except that a key whose first character is U+2028 or U+2029 is no longer rejected.
