# Backstage Enhancement Proposals (BEPs)

A Backstage Enhancement Proposal (BEP) is a way to propose, communicate and coordinate on new efforts for the Backstage project.

## Quick start for the BEP process

1. Discuss the idea with the community and maintainers. Either here on GitHub, Discord, or during community sessions or SIG meetings.
   Make sure that others think the work is worth taking up and will help review the BEP and any code changes required.
1. Make a copy of the [BEP template](./NNNN-template/) directory as `beps/NNNN-short-descriptive-title`, where `NNNN` is the next available number padded with leading zeroes.
1. Fill out as much of the YAML metadata as you can.
1. Fill out the template as best you can.
1. If you want the BEP to be owned by a particular project area, add an entry for the BEP folder to [CODEOWNERS](../.github/CODEOWNERS).
1. Create a PR for the BEP. Title it "BEP: &lt;title&gt;". Aim to get the high level goals clarified and avoid getting hung up on specific details. The PR can be merged early and iterated on.
1. Once the BEP is ready to be merged, create a [feature issue](https://github.com/backstage/backstage/issues/new?template=feature.yaml) titled "BEP: &lt;title&gt;". Use the summary of the BEP as description and link to the BEP PR in the context section. Once the PR is merged, the issue should be updated to link to the BEP folder instead. This issue will serve as a general discussion issue for the BEP.
1. Once the initial BEP is merged you should keep iterating on it until it is ready to leave that `provisional` state. Leaving the `provisional` state is a decision made by the project area maintainers.

Just because a BEP is merged does not mean it is complete or approved for implementation. Any BEP marked as `provisional` is a working document and subject to change.

The authors of the BEP are also responsible for driving the BEP forward all the way to implementation. The approval of a BEP is not a commitment to implement it.

## FAQs

### Do I have to use the BEP process?

No, but it is recommended for larger changes and contributions that affect the Backstage framework or core features where you want to make design decisions upfront and iterate on them across several PRs.

### What is the difference between a BEP and an RFC issue?

An RFC issue is a good way to receive feedback on an idea. The BEP process may involve getting feedback on an idea, but it takes things further by making it easier to iterate on the design of a new feature, getting it approved by the owning project area maintainers, and tracking its implementation.

While anyone can open an RFC issue, the features added by a BEP need to be approved by the owners before it can be merged. The BEP will also contain the latest agreed upon design, whereas an RFC issue is more of a discussion forum.

Often a BEP can start out as an RFC issue, which may then be converted into a BEP once the idea has received an owner and been approved.

### Should I use the BEP process for new or existing Backstage plugins?

No, except for plugins that implement core features of Backstage. The BEP process is only intended for changes to the Backstage framework and core features.

### Can I update an existing BEP?

Yes! As long as the BEP is still in the `provisional` state you should keep iterating on it. Please keep each PR focused on a single topic and avoid long-running and overly broad PRs.

### Can I update a BEP that was submitted by someone else?

Yes! BEPs are living documents and anyone can suggest changes to them. We encourage to challenge the design decisions in a BEP and suggest alternatives. You can also help fill out details in a BEP that has not yet been fully fleshed out.

### What's the difference between a BEP and an [ADR](https://backstage.io/docs/architecture-decisions/)?

Architecture Decision Records (ADRs) are used to document decisions made for development within the Backstage project. They are not intended to be used for proposing new features or changes to Backstage.

### My FAQ isn't answered here!

The BEP process is still evolving!

If something is missing or not answered here feel free to reach out on our community [Discord](https://discord.gg/backstage-687207715902193673).
If you want to propose a change to the BEP process you can also open a PR directly with your proposal.

### BEP Metadata

At the start of each BEP is a YAML document that contains metadata about the BEP. These are the fields that should currently be provided:

| Field             | Description                                                                                                                                                                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **title**         | The title of the BEP in plain language. The title will also be used in the BEP filename. See the template for instructions and details.                                                                                                  |
| **status**        | The current state of the BEP, must be one of the values listed in the [BEP Status](#bep-status) section.                                                                                                                                 |
| **authors**       | A list of GitHub IDs for the authors of the BEP. Typically only the original authors are included, but additional authors can be added if significant contributions are made.                                                            |
| **owners**        | A list of GitHub IDs for the owners of the BEP. The owners are responsible for the implementation of the BEP, and are required for the BEP to move to the `implementable` status.                                                        |
| **project-areas** | The Project Areas closely associated with this BEP that need to approve it. For a list of existing project areas, see [OWNERS.md](../OWNERS.md). If the BEP is not related to any existing project area, use `core-maintainers` instead. |
| **creation-date** | The `yyyy-mm-dd` date that the BEP was first submitted in a PR.                                                                                                                                                                          |

## BEP Status

The BEP Status is critical to clearly communicate the status of each BEP. Each BEP must have its status field set to one of the following values:

- `provisional`: The BEP has been proposed and is actively being defined. The BEP as been approved by the owning project area maintainers as work to be done.
- `implementable`: The approvers have approved this BEP for implementation.
- `implemented`: The BEP has been implemented and is no longer actively changed.
- `deferred`: The BEP is proposed but not actively being worked on.
- `rejected`: The approvers and authors have decided that this BEP is not moving forward.
  The BEP is kept around as a historical document.
- `withdrawn`: The authors have withdrawn the BEP.
- `replaced`: The BEP has been replaced by a new BEP.

### Prior Art

The BEP process is heavily inspired by the [Kubernetes Enhancement Proposal (KEP) process](https://github.com/kubernetes/enhancements/blob/master/keps/README.md).
