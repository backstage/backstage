---
'@backstage/plugin-techdocs': patch
---

Added missing i18n support for TechDocs plugin components including:

- Search components (placeholder text, no results message)
- Table components (column headers, pagination, toolbar, actions, empty states)
- Home page components (support button, page wrapper title/subtitle)
- Reader components (build logs, not found errors, state indicators, settings)
- Error messages and navigation labels

Also exported `techdocsTranslationRef` from the alpha entrypoint for external use.
