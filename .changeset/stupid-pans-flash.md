---
'@backstage/plugin-scaffolder-backend-module-github': minor
---

Adding a new scaffolder action `github:issues:create` following the reference of `github:issues:label` with `dryRun` testing possibility

It can be used like this

```
  steps:
    - id: create-simple-issue
      name: Create Simple Issue
      action: github:issues:create
      input:
        repoUrl: ${{ parameters.repoUrl }}
        title: "[${{ parameters.projectName }}] Simple Bug Report"
        body: |
          ## Bug Description
          This is a simple bug report created by the scaffolder template.

          ### Steps to Reproduce
          1. Run the application
          2. Navigate to the main page
          3. Click on the problematic button

          ### Expected Behavior
          The button should work correctly.

          ### Actual Behavior
          The button does not respond to clicks.
  output:
    links:
      - title: Simple Issue
        url: ${{ steps['create-simple-issue'].output.issueUrl }}
```
