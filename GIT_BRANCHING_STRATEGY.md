# Git Branching Strategy for BSI UMKM Centre
## Based on Conventional Branch Specification & Git Flow Best Practices

---

## 📚 **Branching Strategy Overview**

This project follows **Conventional Branch** naming specification combined with **Git Flow** workflow principles.

### **Main Branches**

1. **`main`** (Production)
   - Always stable, production-ready code
   - Protected branch - requires PR approval
   - Tagged with version numbers (v1.0.0, v1.1.0, etc.)

2. **`develop`** (Development Integration)
   - Integration branch for features
   - Pre-production testing happens here
   - Merges from feature branches

3. **`staging`** (Optional - Pre-production)
   - Mirror of production environment
   - Final testing before release

---

## 🌿 **Branch Types & Naming Convention**

### **Feature Branches**
**Format**: `feature/<description>` or `feat/<description>`

**Purpose**: New features or enhancements

**Examples**:
```bash
feature/woocommerce-api-integration
feature/user-authentication
feature/product-catalog
feature/shopping-cart
feature/checkout-process
feature/user-dashboard
```

**Workflow**:
```bash
# Create from develop
git checkout develop
git checkout -b feature/my-feature

# Work on feature
git add .
git commit -m "feat: implement my feature"

# Push to remote
git push -u origin feature/my-feature

# Merge back to develop via PR
```

---

### **Bugfix Branches**
**Format**: `bugfix/<description>` or `fix/<description>`

**Purpose**: Non-critical bug fixes

**Examples**:
```bash
bugfix/fix-cart-calculation
fix/product-image-loading
bugfix/authentication-redirect
```

**Workflow**:
```bash
git checkout develop
git checkout -b bugfix/fix-cart-issue
# Fix bug, commit, push
git push -u origin bugfix/fix-cart-issue
```

---

### **Hotfix Branches**
**Format**: `hotfix/<description>`

**Purpose**: Urgent production fixes

**Examples**:
```bash
hotfix/security-patch
hotfix/critical-payment-bug
hotfix/api-connection-failure
```

**Workflow**:
```bash
# Create from main (production)
git checkout main
git checkout -b hotfix/critical-bug

# Fix, commit, push
git push -u origin hotfix/critical-bug

# Merge to BOTH main AND develop
git checkout main
git merge hotfix/critical-bug
git checkout develop
git merge hotfix/critical-bug
```

---

### **Release Branches**
**Format**: `release/v<version>`

**Purpose**: Prepare for production release

**Examples**:
```bash
release/v1.0.0
release/v1.1.0
release/v2.0.0-beta.1
```

**Workflow**:
```bash
# Create from develop when ready for release
git checkout develop
git checkout -b release/v1.0.0

# Final testing, version bumps, minor fixes only
# No new features!

# Merge to main when ready
git checkout main
git merge release/v1.0.0
git tag -a v1.0.0 -m "Release version 1.0.0"

# Also merge back to develop
git checkout develop
git merge release/v1.0.0
```

---

### **Chore Branches**
**Format**: `chore/<description>`

**Purpose**: Maintenance tasks, dependencies, documentation

**Examples**:
```bash
chore/update-dependencies
chore/improve-documentation
chore/setup-ci-cd
chore/add-git-hooks
```

---

## 📋 **Branch Naming Rules**

### ✅ **VALID** Branch Names:
```bash
feature/add-payment-gateway
feat/user-profile
bugfix/fix-header-alignment
fix/memory-leak
hotfix/security-cve-2024
release/v1.2.0
chore/update-deps
```

### ❌ **INVALID** Branch Names:
```bash
Feature/NewLogin          # Uppercase not allowed
fix_header_bug            # Underscores not allowed
feature/-login            # Leading hyphen not allowed
release/v1.2.0.           # Trailing dot not allowed
feature/new--login        # Consecutive hyphens not allowed
my-random-branch          # No type prefix
```

### **Rules**:
1. ✅ Use lowercase only (`a-z`)
2. ✅ Numbers allowed (`0-9`)
3. ✅ Hyphens allowed (`-`)
4. ✅ Dots allowed (`.`) for versions
5. ❌ NO underscores
6. ❌ NO consecutive hyphens or dots
7. ❌ NO leading/trailing hyphens or dots
8. ✅ Must have type prefix (`feature/`, `fix/`, etc.)

---

## 🎯 **BSI UMKM Centre - Specific Branches**

### **Current Implementation Branches**:

```
main
│
├── develop
│   │
│   ├── feature/woocommerce-api-integration
│   │   └── Files: woocommerce-api.js, auth.js
│   │
│   ├── feature/user-authentication
│   │   └── Files: script-integrated.js, register-integrated.js
│   │
│   ├── feature/product-catalog
│   │   └── Files: products.html, products.js
│   │
│   ├── feature/shopping-cart
│   │   └── Files: cart.html, cart.js
│   │
│   ├── feature/documentation
│   │   └── Files: WOOCOMMERCE_SETUP_GUIDE.md, IMPLEMENTATION_STATUS.md, etc.
│   │
│   ├── feature/checkout-process (TODO)
│   │   └── Files: checkout.html, checkout.js
│   │
│   └── feature/user-dashboard (TODO)
│       └── Files: dashboard.html, dashboard.js
│
└── release/v1.0.0 (when ready)
```

---

## 🚀 **Workflow for This Project**

### **Step 1: Setup Base Branches**
```bash
# Ensure we're on main
git checkout main

# Create develop branch from main
git checkout -b develop
git push -u origin develop
```

### **Step 2: Create Feature Branches**
```bash
# Create each feature branch from develop
git checkout develop

# API Integration
git checkout -b feature/woocommerce-api-integration
git checkout develop

# Authentication
git checkout -b feature/user-authentication
git checkout develop

# Product Catalog
git checkout -b feature/product-catalog
git checkout develop

# Shopping Cart
git checkout -b feature/shopping-cart
git checkout develop

# Documentation
git checkout -b feature/documentation
```

### **Step 3: Add Files to Each Branch**
```bash
# Example for API Integration branch
git checkout feature/woocommerce-api-integration

# Add specific files
git add frontend/src/utils/woocommerce-api.js
git add frontend/src/utils/auth.js
git add frontend/.env.example

# Commit with conventional message
git commit -m "feat(api): add WooCommerce API integration layer

- Implement StoreAPI for public operations
- Implement AdminAPI for authenticated operations
- Add AuthManager for JWT token handling
- Add CartManager for cart state sync
- Configure environment variables
"

# Push to remote
git push -u origin feature/woocommerce-api-integration
```

### **Step 4: Merge to Develop**
```bash
# After each feature is complete, merge to develop
git checkout develop
git merge feature/woocommerce-api-integration
git push origin develop
```

### **Step 5: Create Release**
```bash
# When all features ready
git checkout develop
git checkout -b release/v1.0.0

# Final testing, version bumps
git commit -m "chore(release): prepare v1.0.0"
git push -u origin release/v1.0.0
```

### **Step 6: Merge to Main**
```bash
# After release testing
git checkout main
git merge release/v1.0.0
git tag -a v1.0.0 -m "BSI UMKM Centre v1.0.0 - Headless WooCommerce"
git push origin main
git push origin v1.0.0

# Merge back to develop
git checkout develop
git merge release/v1.0.0
git push origin develop
```

---

## 📝 **Commit Message Convention**

Follow **Conventional Commits** specification:

**Format**:
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples**:
```bash
feat(auth): implement JWT authentication system
fix(cart): resolve quantity update bug
docs(setup): add WooCommerce configuration guide
chore(deps): update dependencies to latest versions
```

---

## 🔒 **Branch Protection Rules**

### **Main Branch Protection**:
- ✅ Require pull request reviews (2 approvers)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ No force pushes
- ✅ No deletions
- ✅ Require linear history

### **Develop Branch Protection**:
- ✅ Require pull request reviews (1 approver)
- ✅ Require status checks to pass
- ✅ No force pushes

---

## 🎨 **Visual Workflow**

```
feature/woocommerce-api ──┐
feature/user-auth ─────────┼──> develop ──> release/v1.0.0 ──> main (v1.0.0)
feature/product-catalog ───┤                                      │
feature/shopping-cart ─────┤                                      │
feature/documentation ─────┘                                      │
                                                                  │
hotfix/critical-bug ──────────────────────────────────────────────┘
                    └──────────────────────────────────> develop
```

---

## 🛠️ **Git Hooks & Automation**

### **Pre-commit Hook** (Validate Branch Name):
```bash
#!/bin/bash
# .git/hooks/pre-commit

current_branch=$(git rev-parse --abbrev-ref HEAD)

# Skip validation for main branches
if [[ "$current_branch" =~ ^(main|master|develop|staging)$ ]]; then
  exit 0
fi

# Validate branch name
if ! [[ "$current_branch" =~ ^(feature|feat|bugfix|fix|hotfix|release|chore)\/ ]]; then
  echo "❌ Invalid branch name: $current_branch"
  echo "Use: feature/*, bugfix/*, hotfix/*, release/*, chore/*"
  exit 1
fi

echo "✅ Branch name valid: $current_branch"
exit 0
```

---

## 📊 **Branch Lifecycle**

| Branch Type | Created From | Merged To | Lifespan | Delete After Merge? |
|------------|--------------|-----------|----------|-------------------|
| `feature/*` | `develop` | `develop` | Days-Weeks | ✅ Yes |
| `bugfix/*` | `develop` | `develop` | Days | ✅ Yes |
| `hotfix/*` | `main` | `main` + `develop` | Hours-Days | ✅ Yes |
| `release/*` | `develop` | `main` + `develop` | Days | ✅ Yes |
| `chore/*` | `develop` | `develop` | Days | ✅ Yes |
| `main` | - | - | ♾️ Permanent | ❌ No |
| `develop` | `main` | - | ♾️ Permanent | ❌ No |

---

## 📚 **References**

- **Conventional Branch**: https://conventional-branch.github.io/
- **Git Flow**: https://nvie.com/posts/a-successful-git-branching-model/
- **Conventional Commits**: https://www.conventionalcommits.org/
- **Git Best Practices**: https://git-scm.com/book/en/v2

---

**Last Updated**: January 2025  
**Project**: BSI UMKM Centre - Headless WooCommerce  
**Version**: 1.0.0
