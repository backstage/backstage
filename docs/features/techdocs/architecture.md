---
id: architecture
title: Architecture
description: Documentation on Architecture
---

## Basic (out-of-the-box)

When you deploy Backstage (with TechDocs enabled by default), you get a basic
out-of-the box experience. This is how the architecture of it looks.

Note: See below for our recommended production architecture which takes care of
stability, scalability and speed.

![TechDocs Architecture diagram](../../assets/techdocs/architecture-basic.drawio.svg)

We store the timestamp in memory.

Publishing to external storage is also possible. But status: none of the cloud
storage solutions are supported yet.

Speed is a bottleneck if doc repositories are very large (>100MBs).

## Recommended deployment

This is how we recommend deploying TechDocs for potential production use.

![TechDocs Architecture diagram](../../assets/techdocs/architecture-recommended.drawio.svg)

TechDocs Backend: Responsible for access control and sending files over to
TechDocs.

Tokens (if possible): Read and Write tokens.

## FAQ

Q: Why don't use Backstage server to serve static files? A: Not scalable.
[Investigate more]

# Future work

Instead of storing frontend assets in cloud storage, it can only store texts and
images. And all of frontend rendering is handled by Backstage and TechDocs
reader.
