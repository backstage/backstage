# MkDocs

Welcome to MkDocs. This is the TechDocs implementation of MkDocs.

**WIP: This is a work in progress. It is not ready for use yet. Follow our progress on [the Backstage Discord](https://discord.gg/MUpMjP2) under #docs-like-code or on [our GitHub Milestone](https://github.com/spotify/backstage/milestone/15).**

## Getting started

```
  docker build ./container -t mkdocs-container

  docker run -w /content -v $(pwd)/mock-docs:/content -p 8000:8000 -it mkdocs-container serve -a 0.0.0.0:8000
```
