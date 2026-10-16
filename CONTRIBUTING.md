# Contributing to AI Video Studio

Thank you for contributing to AI Video Studio. To maintain our high standards of architectural integrity, legal compliance, and test-driven reliability, all contributors (human engineers and AI agents) must adhere to these guidelines.

---

## 1. Clean-Room Legal Invariant (MANDATORY)

AI Video Studio follows a strict **Clean-Room Route B development model**. 
- **ABSOLUTELY ZERO CODE, TEMPLATES, OR ASSETS** from OpenChatCut (AGPL-3.0), Palmier Pro (GPL-3.0), or Pallaidium (GPL-3.0) may be copied, pasted, translated, or imported into this repository.
- We study published behavior and implement all components from scratch.
- Only dependencies with MIT, Apache-2.0, BSD, or approved commercial licenses may be added. Every new dependency is audited by automated license scanning before merge.

---

## 2. Git Branching & Commit Conventions

### Branch Strategy
- `main`: Production-ready code. All PRs target `main`.
- `feat/<task-id>-<short-description>`: Feature work corresponding to task breakdown in `tasks/todo.md`.
- `fix/<issue-id>-<short-description>`: Bug fixes and regressions.

### Conventional Commits
All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat(scope): add new capability`
- `fix(scope): resolve bug or regression`
- `test(scope): add or update test coverage`
- `chore(scope): build, config, or dependency update`
- `docs(scope): documentation updates`

*Allowed scopes:* `api`, `web`, `workers`, `remotion`, `shared-types`, `timeline`, `audio`, `render`, `billing`, `mcp`.

---

## 3. Test-Driven Development (TDD) Workflow

Every task in our implementation plan follows a strict 5-step TDD cycle:
1. **Step 1:** Write a failing test specifying the exact expected behavior and contract.
2. **Step 2:** Run the test to verify it fails for the expected reason.
3. **Step 3:** Implement the minimal code necessary to satisfy the test.
4. **Step 4:** Run the test suite to verify it passes cleanly.
5. **Step 5:** Commit atomically with a descriptive message.

### Testing Commands
```bash
# Frontend & Remotion tests
pnpm --filter @ai-video-studio/web test
pnpm --filter @ai-video-studio/remotion test

# API tests
pytest services/api/tests -v

# Worker pipeline tests
pytest services/workers/tests -v

# End-to-end golden render regression tests
pytest tests/e2e/test_full_pipeline.py -v
```

---

## 4. Code Quality & Review Gates

Before opening a pull request, verify:
- [ ] TypeScript compiles cleanly with zero errors (`pnpm type-check`).
- [ ] ESLint and Prettier checks pass (`pnpm lint`).
- [ ] Python code is formatted with Black and linted with Ruff (`ruff check services/`).
- [ ] No temporary files or secrets committed.
- [ ] All unit, integration, and golden render tests pass.
