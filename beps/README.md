# Backstage Enhancement Proposals (BEPs)

A Backstage Enhancement Proposal (BEP) is a way to propose, communicate and coordinate on new efforts for the Backstage project.

## Quick start for the BEP process

1. Discuss the idea with the community and maintainers. Either here on GitHub, Discord, or during community sessions or SIG meetings. Make sure that others think the work is worth taking up and will help review the BEP and any code changes required.
1. Make a copy of the [BEP template](./NNNN-template/) directory as `beps/NNNN-short-descriptive-title`, where `NNNN` is the next available number padded with leading zeroes.
1. Fill out as much of the YAML metadata as you can.
1. Fill out the template as best you can.
1. If you want the BEP to be owned by a particular project area, add an entry for the BEP folder to [CODEOWNERS](../.github/CODEOWNERS).
1. Create a PR for the BEP. Title it "BEP: &lt;title&gt;". Aim to get the high level goals clarified and avoid getting hung up on specific details. The PR can be iterated on until the BEP is ready to be merged.
1. The relevant maintainers will review the BEP and provide feedback. It can also be useful to join relevant SIG meetings to discuss the BEP, to help drive it forward faster.
1. Let the maintainers know when you think the BEP is ready to be merged. At this point the BEP should be fully filled out and ready for implementation, along with a clear owner for the work.

The merging of a BEP means that it is approved for implementation and has an owner that is responsible for said implementation. Up until that point, the author(s) of the BEP are responsible for driving the BEP forward.

While the BEP PR is open the owner can open separate PRs to ship experimental features in support of the BEP to help drive the design forward, and these may be merged pending usual PR review. If the BEP is withdrawn or rejected these features should generally be removed.

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

Yes! As long as the BEP is in the `implementable` state. Updates should however only be done based on new discoveries during the implementation phase. If you want to make a significant change to a BEP that has already been approved, you should open a new BEP to replace the old one.

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

- `implementable`: The BEP has been approved for implementation by the owning project area maintainers.
- `implemented`: The BEP has been implemented.
- `deferred`: The BEP was approved but is no longer being actively worked on. If anyone wishes to pick up the work they can move it back to the `implementable` state.
- `rejected`: The approvers and authors have decided that this BEP is not moving forward. The BEP is kept around as a historical document.
- `replaced`: The BEP has been replaced by a new BEP.

### Prior Art

The BEP process is heavily inspired by the [Kubernetes Enhancement Proposal (KEP) process](https://github.com/kubernetes/enhancements/blob/master/keps/README.md).
