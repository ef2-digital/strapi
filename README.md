# 🔄 Strapi Fork Upgrade Strategy

This project uses a forked version of Strapi.  
We maintain upgrades from the official Strapi repository while preserving custom changes.

---

## 🛠 Workflow

### 1. Keep `main` clean and synced with upstream

Always keep `main` updated with the official Strapi repo. No custom changes in `main`.

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

### 2\. Develop customizations in feature branches

Always use separate branches for customizations.

Example:

bash

KopiërenBewerken

`git checkout -b feature/my-custom-change`

---

### 3\. Upgrade process when a new Strapi version is released

- Sync `main` with upstream:

  bash

  KopiërenBewerken

  `git checkout main
git fetch upstream
git merge upstream/main
git push origin main`

- Create an upgrade branch:

  bash

  KopiërenBewerken

  `git checkout -b upgrade/strapi-x.y.z`

- Merge your custom feature branches.

- Resolve conflicts.

- Test the build:

  bash

  KopiërenBewerken

  `yarn build --clean
yarn develop`

- Push:

  bash

  KopiërenBewerken

  `git push origin upgrade/strapi-x.y.z`

---

## 📋 Branch Structure

| Branch                 | Purpose                             |
| ---------------------- | ----------------------------------- |
| `main`                 | Clean Strapi (synced with upstream) |
| `feature/*`            | Custom feature development          |
| `upgrade/strapi-x.y.z` | Upgrade merge branches              |

---

## 🚀 Best Practices

- Minimize direct core hacks.

- Prefer `extensions/` for overrides.

- Document important changes inside `/customizations/README.md`.

- Test Admin Panel after upgrade (`yarn build --clean`).

- Use GitHub draft PRs for major upgrades.

---

## 📬 (Optional) Notifications

Set up GitHub Actions to notify when Strapi releases new versions.

---

yaml

KopiërenBewerken

`✅ You can copy-paste that **directly** into GitHub and it will render properly!

---

# ✨ Bonus: **Super Short Summary Version**

If you want a **10-second version** for the **top** of your README:

```markdown
## 🔄 Quick Upgrade Guide

- Keep `main` synced with upstream Strapi (no custom changes).
- Always create `feature/*` branches for customizations.
- For new Strapi versions:
  - Sync `main`
  - Create `upgrade/strapi-x.y.z`
  - Merge features
  - Test and push
- Prefer `extensions/` over core hacks.
- Document custom changes separately.`

✅ You can place this **at the top** and the **full guide** at the bottom for developers who need more detail.

---
```
