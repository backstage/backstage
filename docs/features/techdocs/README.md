---
id: techdocs-overview
title: TechDocs Documentation
sidebar_label: Overview
# prettier-ignore
description: TechDocs is Spotify’s homegrown docs-like-code solution built directly into Backstage
---

## What is it?

<!-- Intro, backstory, etc.: -->

TechDocs is Spotify’s homegrown docs-like-code solution built directly into
Backstage. This means engineers write their documentation in Markdown files
which live together with their code.

Today, it is one of the core products in Spotify’s developer experience offering
with 2,400+ documentation sites and 1,000+ engineers using it daily. Read more
about TechDocs and the philosophy in its
[announcement blog post](https://backstage.io/blog/2020/09/08/announcing-tech-docs).
🎉

## Features

- A centralized place to discover and read documentation.

- A clear end-to-end docs-like-code solution.

- A tightly coupled feedback loop with the developer workflow. (_Coming soon in
  V.3_)

- A developer ecosystem for creating extensions. (_Coming soon in V.3_)

## Project roadmap

| Version                 | Description                                                                                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [TechDocs V.0 ✅][v0]   | Read docs in Backstage - Enable anyone to get a reader experience working in Backstage. [See V.0 Use Cases.](#techdocs-v0)                                  |
| [TechDocs V.1 ✅][v1]   | TechDocs end to end (alpha) - Alpha of TechDocs that you can use end to end - and contribute to. [See V.1 Use Cases.](#techdocs-v1)                         |
| [TechDocs V.2 🔮⌛][v2] | Easy adoption of TechDocs (whatever environment you have) [See V.2 Use Cases.](#techdocs-v2)                                                                |
| [TechDocs V.3 🔮⌛][v3] | Build a widget (plugin) framework so that contributors can easily contribute features to TechDocs - that others can use. [See V.3 Use Cases.](#techdocs-v3) |

[v0]: https://github.com/backstage/backstage/milestone/15
[v1]: https://github.com/backstage/backstage/milestone/16
[v2]: https://github.com/backstage/backstage/milestone/22
[v3]: https://github.com/backstage/backstage/milestone/17

## Use Cases

#### TechDocs V.0

- As a user I can navigate to a manually curated docs explore page.
- As a user I can navigate to and read mock documentation that is manually
  uploaded by the TechDocs core team.

#### TechDocs V.1

- As a user I can run TechDocs locally and read documentation.
- As a user I can create a docs folder in my entity project and add a reference
  in the entity configuration file (of the owning entity) to my documentation.
- Backstage will automatically build my documentation and serve it in TechDocs.
- Documentation will be displayed under the docs tab in the service catalog.
- As a user I can create a docs only repository that will be standalone from any
  other service.
- As a user I can choose my own storage solution for the documentation (as
  example GCS/AWS/Azure etc)
- As a user I can define my own API to interface my own documentation solution.

Extra platform stability and compatibility improvements:

- As a user I can define the metadata generated for my documentation.
- As a user I will be able to browse metadata from within my documentation in
  Backstage.

#### TechDocs V.2

We have a TechDocs that works end-to-end. The next step is to make it super easy
for companies to adopt. This involves (something like) the following work items.

- “Solidify” work and “Mkdocs stabilization” work that has come out of our Q3
  end-to-end work.
- Improve/simplify the get up and running process.
- Introduce new documentation templates.
- Extend the already existing docs-template to have options of different
  documentation types.
- Enable companies to choose their own storage (S3 for example).
- Enable companies to choose their own source code hosting provider (GitHub,
  GitLab, and so).
- Share how to plug in TechDocs to your own CI.

#### TechDocs V.3

Build a widget (plugin) framework so that contributors can easily contribute
features to TechDocs - that others can use. And, also, so that we can easily
migrate Spotify's existing TechDocs features to open source.

## Platforms Supported

See [TechDocs Architecture](architecture.md) to get an overview of where these
providers are used.

| Source Code Hosting Provider | Support Status |
| ---------------------------- | -------------- |
| GitHub                       | Yes ✅         |
| GitHub Enterprise            | Yes ✅         |
| BitBucket                    | Yes ✅         |
| Azure DevOps                 | Yes ✅         |
| GitLab                       | Yes ✅         |
| GitLab Enterprise            | Yes ✅         |

| File Storage Provider             | Support Status |
| --------------------------------- | -------------- |
| Local Filesystem of Backstage app | Yes ✅         |
| Google Cloud Storage (GCS)        | Yes ✅         |
| Amazon Web Services (AWS) S3      | Yes ✅         |
| Azure Blob Storage                | Yes ✅         |

[Reach out to us](#feedback) if you want to request more platforms.

## Tech Stack

| Stack                                           | Location                                                 |
| ----------------------------------------------- | -------------------------------------------------------- |
| Frontend Plugin                                 | [`@backstage/plugin-techdocs`][techdocs/frontend]        |
| Backend Plugin                                  | [`@backstage/plugin-techdocs-backend`][techdocs/backend] |
| CLI (for local development and generating docs) | [`@techdocs/cli`][techdocs/cli]                          |
| Docker Container (for generating docs)          | [`techdocs-container`][techdocs/container]               |

[techdocs/frontend]:
  https://github.com/backstage/backstage/blob/master/plugins/techdocs
[techdocs/backend]:
  https://github.com/backstage/backstage/blob/master/plugins/techdocs-backend
[techdocs/container]: https://github.com/backstage/techdocs-container
[techdocs/cli]: https://github.com/backstage/techdocs-cli

## Feedback

We have created a sweet and short TechDocs user survey -
https://docs.google.com/forms/d/e/1FAIpQLSdn5Vn3MQhCdyYRuW8cMzZkMQF0bFxXYN168gZRvESLfJWVVg/viewform

This is to gather inputs from you (the Backstage community) which will help us
best serve TechDocs adopters and existing users. Your inputs will shape our
roadmap and we will share it in the open.

For any other general queries, reach out to us in the `#docs-like-code` channel
of our [Discord chatroom](https://github.com/backstage/backstage#community).
