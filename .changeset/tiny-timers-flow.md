---
'@backstage/plugin-scaffolder-backend': patch
---

Avoid double encoded cookiecutter URLs

When using bitbucket and a relative cookiecutter URL with special characters, the fetch will fail
due to a URL which is encoded twice. The fix ensures that the fetchContents will treat absolute
and relative URLs the same way.
