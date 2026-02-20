---
id: sustainable-plugin-development
sidebar_label: Sustainable plugin development
title: Sustainably developing plugins in Backstage
---

Plugins are not created in a vacuum, they generally solve a customer ask, be that

- a business problem, like showing cloud spend
- a new integration, like showing data from an external vendor such as Pagerduty
- a developer pain point, like organizing information from disjoint or disorganized systems.

To ensure that your plugin lives the test of time, you'll need to figure out how to keep it up-to-date,

### Identifying stakeholders

Stakeholders are the people who use, benefit from, or are impacted by your plugin. Understanding who your stakeholders are can help guide decisions about plugin development and maintenance.

**Types of stakeholders:**

- **Primary users**: Developers, engineers, or teams who directly interact with your plugin in their daily work
- **Decision makers**: Engineering managers or platform teams who decide which plugins to adopt
- **Contributors**: Other developers who might extend or maintain your plugin
- **Dependent teams**: Teams whose workflows depend on the data or functionality your plugin provides

**Identifying stakeholders:**

1. **Track usage**: Monitor plugin usage metrics, if available, to see who is actively using your plugin
2. **Gather feedback**: Pay attention to GitHub issues, feature requests, and user feedback
3. **Engage in community channels**: Participate in [Backstage Discord](https://discord.gg/backstage-687207715902193673) and GitHub discussions to find users
4. **Review integrations**: If your plugin integrates with other systems, identify teams using those systems

**Stakeholder engagement:**

- Create a clear communication channel (GitHub Discussions, Discord, or issue templates)
- Regularly seek feedback on new features and improvements
- Share updates about plugin changes, deprecations, or breaking changes
- Build relationships with power users who can help test and validate changes

### Iterating on your plugin

In many cases, your first version of a plugin will cut a few corners - this is a good sign, you're more focused on delivering a strong use case to continue development than over-indexing on your initial code. It may be temporary after all, if you don't get the response you're looking for!

So, how do you decide when you should iterate on your plugin?

**When to iterate:**

- **User feedback**: Multiple users request similar features or report pain points
- **Technical debt**: Code becomes difficult to maintain or extend
- **Breaking changes in dependencies**: Core Backstage packages or dependencies introduce breaking changes
- **Performance issues**: The plugin becomes slow or resource-intensive
- **Security concerns**: Vulnerabilities are discovered in dependencies or the plugin itself
- **API evolution**: Backstage introduces new APIs or patterns that would improve your plugin

**Prioritizing changes:**

1. **Security and stability first**: Address security vulnerabilities and critical bugs before new features
2. **User impact**: Prioritize changes that affect the most users or solve the most common problems
3. **Technical foundation**: Invest in refactoring when it enables future improvements or reduces maintenance burden
4. **Dependency updates**: Keep dependencies updated to avoid accumulating technical debt

**Gathering feedback:**

- Create GitHub issues or discussions to gather input from stakeholders
- Share your iteration plans and ask for feedback
- Consider creating a roadmap or maintaining a public backlog
- Test changes with a small group of users before broader release

### Long-term maintenance

Maintaining a plugin over time involves ongoing maintenance and community engagement. The following practices can help keep your plugin healthy and valuable:

**Maintenance practices:**

- **Keep dependencies updated**: Regularly update Backstage packages and other dependencies to stay compatible with the latest releases. Use tools like `yarn backstage-cli versions:bump` to streamline this process
- **Monitor for breaking changes**: Stay informed about Backstage releases and deprecations through [release notes](https://backstage.io/docs/overview/roadmap) and changelogs
- **Fix bugs promptly**: Address reported issues in a timely manner to maintain user trust
- **Review and update documentation**: Keep your README, API documentation, and examples current

**Community involvement:**

- **Respond to issues and PRs**: Engage with users who report bugs or submit contributions
- **Share updates**: Announce significant changes, new features, or deprecations
- **Consider open sourcing**: If your plugin is internal, consider [publishing it](https://backstage.io/docs/plugins/publish-private) to the [community plugins repository](https://github.com/backstage/community-plugins) to benefit the broader community
- **Add to the Plugin Directory**: [Submit your plugin](https://backstage.io/docs/plugins/add-to-directory) to the [Backstage Plugin Directory](https://backstage.io/plugins) to increase visibility

**Tracking success:**

- Track usage metrics (if available)
- Monitor GitHub stars, forks, and downloads
- Gather qualitative feedback from users
- Measure the impact on developer productivity or workflow improvements

Remember, a successful plugin is one that continues to provide value to its users over time. Regular maintenance and community engagement are investments in that long-term success.
