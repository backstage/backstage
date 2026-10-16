# Integrations

The todo plugin can already save TODOs, find TODO comments in source code, and
show TODOs in the frontend. The guides in this section connect that plugin to
other parts of Backstage. Complete them in order because each guide builds on
the previous one:

1. Connect each TODO to a Component in the Software Catalog.
2. Let only the Component's owning Group read and create its TODOs.
3. Let authorized users find those TODOs through Search.
4. Notify the owning Group when a TODO reminder is due.

The TODOs remain in the todo plugin's database. Each TODO stores the Catalog
reference of the Component it belongs to.

## Core integrations

### Catalog

Store `forEntityRef` on each TODO and query the todo backend from the catalog
entity page.

### Permissions

Use the referenced entity's current Catalog ownership to decide which users can
read each TODO.

### Search

Index TODOs and apply the same owner-based permission before returning search
results.

### Notifications

Resolve each due TODO's referenced entity and notify its current owning groups.

## Advanced integrations

After completing the core path, continue with two automation workflows:

### Scaffolder

Seed onboarding TODOs for an existing Catalog component from a Software Template.

### Actions and MCP

Register authorized TODO actions and expose them to MCP clients.
