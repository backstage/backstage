---
'@backstage/plugin-techdocs-react': patch
---

Add `toLowerEntityRefMaybe()` helper function for handling `techdocs.legacyUseCaseSensitiveTripletPaths` flag.
Pass modified `entityRef` to `TechDocsReaderPageContext` to handle the `techdocs.legacyUseCaseSensitiveTripletPaths` flag.
