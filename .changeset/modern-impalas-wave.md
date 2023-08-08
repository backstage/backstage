---
'@backstage/plugin-kubernetes': minor
---

**BREAKING**: Fixed typos in exported module attributes. Many users may see no changes, but if you have customized the plugin output, you may have to rename the following:

- Component attribute: `<ResourceUtilization totalFormated={} />` to `<ResourceUtilization totalFormatted={} />`
- Interface attribute: `DetectedError.occuranceCount` to `DetectedError.occurrenceCount`.
