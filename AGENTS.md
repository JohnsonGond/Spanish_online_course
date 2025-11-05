# Agent Working Notes

Scope: Entire repository.

- Shell invocation
  - Use `pwsh` without `-NoProfile` so the developer's UTF‑8 profile settings apply.
  - Default to UTF‑8. If needed for a single call, inline set encoding: `[Console]::OutputEncoding = [Text.Encoding]::UTF8; chcp 65001 | Out-Null`.

- Formatting and line endings
  - Repository defaults to CRLF (`.gitattributes`), with `*.sh`/`*.bash` forced to LF.
  - Prettier config in `.prettierrc` with `endOfLine: auto`, 4 spaces, semicolons, single quotes.

- Linting
  - ESLint v9 flat config in `eslint.config.js` with Prettier integration.
  - API (`api/**/*.js`) is CommonJS; rest is ESM.
  - Install dev deps before linting: `npm install` (requires `@eslint/js`, `globals`).
  - Run checks via `npm run lint`.

- CI
  - Non-blocking lint workflow in `.github/workflows/lint.yml` runs on push/PR to `main`.

