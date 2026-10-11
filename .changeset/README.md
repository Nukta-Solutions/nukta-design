# Changesets

Every PR that changes a published package (`@nukta-solutions/tokens`, `ui`, `config`) needs a changeset:

```bash
pnpm changeset
```

Pick the packages, the bump type (patch / minor / major) and write a one-line summary for the changelog.
On merge to `main`, the release workflow opens a "Version Packages" PR; merging that PR publishes to
GitHub Packages.
