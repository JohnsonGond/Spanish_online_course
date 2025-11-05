# 开发日志 (Changelog)

## 2025-11-05: 工程化与规范化改进 (Tooling & Code Quality)

- 目标：稳定编码显示、统一代码规范、在不影响部署的前提下引入持续检查。

- 已完成：
  - 终端编码：明确 PowerShell 使用 UTF‑8（65001），问题来自终端显示而非文件内容。
  - 代码风格：新增 `./.prettierrc`（endOfLine: auto，4 空格、分号、单引号）。
  - 编辑器约定：新增 `./.editorconfig`（utf-8、CRLF、4 空格、末行换行、去尾随空格，Markdown 除外）。
  - Lint 配置：更新 `./eslint.config.js`，为 Prettier 增加 `endOfLine: 'auto'`；对 `api/**/*.js` 增加 CommonJS 覆盖。
  - 依赖声明：在 `package.json` 的 `devDependencies` 补充 `@eslint/js`、`globals`，保证新环境/CI 可复现。
  - Git 行尾：新增 `./.gitattributes`（默认 CRLF；`*.sh`/`*.bash` 强制 LF）。
  - 代码整理：使用 Prettier 格式化 `src/js/course-data.js` 与 `src/js/main.js`；当前 `eslint .` 为 0 错 0 警告。
  - CI 检查：新增 `./.github/workflows/lint.yml`，在 push/PR 到 `main` 时运行 ESLint，`continue-on-error: true`（不阻断部署）。

- 验证/查看：
  - 本地：`npm install` 后 `npm run lint`；浏览器访问页面并测试发音按钮。
  - CI：GitHub → Actions → Lint 工作流，或在 PR 页面查看状态与日志。

- 说明与建议：
  - `node_modules` 目前仍在仓库中；不影响 SWA 部署，但拉取体积大且依赖不可复现，建议后续清理：
    - `git rm -r --cached node_modules && git commit -m "Remove node_modules from repo"`
    - 依赖通过 `npm ci`/`npm install` 安装。`.gitignore` 已包含 `/node_modules`。

