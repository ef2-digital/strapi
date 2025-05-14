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

`git checkout -b feature/my-custom-change`

---

### 3\. Upgrade process when a new Strapi version is released

- Sync `main` with upstream:

  bash

  `git checkout main
git fetch upstream
git merge upstream/main
git push origin main`

- Create an upgrade branch:

  bash

  `git checkout -b upgrade/strapi-x.y.z`

- Merge your custom feature branches.

- Resolve conflicts.

- Test the build:

  bash

  `yarn build --clean
yarn develop`

- Push:

  bash

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

# 🔄 Maintaining and Publishing the EF2 Strapi Fork

This project uses a customized fork of Strapi to extend functionality and optimize internal workflows.

---

## 🛠 Preparing the Fork for Publishing

Whenever updates are made to the fork (new Strapi versions, customizations, etc.), prepare the packages by running:

```bash

./scripts/prepare-fork.sh

```

This script will:

Rename all @strapi package names to @ef2.

Update repository, author, and license information.

Append a custom version suffix (e.g., -ef2.1) to all packages.

Note:
The script automatically moves to the project root before applying changes, so you can run it from anywhere.

---

## 🚀 Publishing the Forked Packages

After preparing the fork:

Ensure you are authenticated to the private NPM registry:

```bash

npm login

```

or (in CI/CD environments) make sure your NPM_TOKEN is set.

Publish the necessary packages by running:

```bash

./scripts/publish-all.sh

```

This script will publish the following packages:

@ef2/strapi

@ef2/plugin-users-permissions

@ef2/provider-email-mailgun

@ef2/provider-upload-aws-s3

All packages are published privately using --access=restricted.

---

## 📦 Installing Forked Packages

In your CMS projects, install the EF2 packages instead of the default Strapi ones:

```bash
yarn add @ef2/strapi @ef2/plugin-users-permissions @ef2/provider-email-mailgun @ef2/provider-upload-aws-s3
```

---

You can continue using public Strapi plugins (like @strapi/plugin-seo) unless they are also customized.

## 🧠 Important Notes

Always keep the original LICENSE (MIT) file inside the fork.

Always bump versions appropriately when upgrading (e.g., 5.13.0-ef2.2, 5.14.0-ef2.0).

Only publish packages actually used in production/staging environments.

CI/CD servers must have access to private NPM packages via authentication.
