# Fix GitHub Authentication Issue

## Problem
Git is trying to use wrong GitHub account credentials (`vjvenkat07` instead of `guruk1803`).

## Solution Options

### Option 1: Use Personal Access Token (Recommended)

1. **Create Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Name: `gsquad-forever-push`
   - Expiration: 90 days (or your preference)
   - **Scopes**: Check `repo` (full control of private repositories)
   - Click "Generate token"
   - **COPY THE TOKEN** (you won't see it again!)

2. **Push using token:**
   ```bash
   git push -u origin main
   ```
   - **Username**: `guruk1803`
   - **Password**: Paste your Personal Access Token (not your GitHub password)

### Option 2: Update Windows Credential Manager

1. **Open Windows Credential Manager:**
   - Press `Win + R`
   - Type: `control /name Microsoft.CredentialManager`
   - Press Enter

2. **Find GitHub credentials:**
   - Go to "Windows Credentials"
   - Look for `git:https://github.com`
   - Click to expand
   - Click "Edit" or "Remove"

3. **Remove old credentials:**
   - Click "Remove" to delete old credentials
   - Or "Edit" and update username to `guruk1803`

4. **Try pushing again:**
   ```bash
   git push -u origin main
   ```
   - Enter username: `guruk1803`
   - Enter Personal Access Token as password

### Option 3: Use SSH Instead of HTTPS

1. **Generate SSH key** (if you don't have one):
   ```bash
   ssh-keygen -t ed25519 -C "gurunathankaruppasamy33@gmail.com"
   ```
   - Press Enter to accept default location
   - Enter passphrase (optional)

2. **Add SSH key to GitHub:**
   - Copy public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste key and save

3. **Change remote to SSH:**
   ```bash
   git remote set-url origin git@github.com:guruk1803/gsquad-forever.git
   ```

4. **Push:**
   ```bash
   git push -u origin main
   ```

## Quick Fix (Try This First)

Run this command and use Personal Access Token when prompted:

```bash
git push -u origin main
```

When asked:
- **Username**: `guruk1803`
- **Password**: Your Personal Access Token (from https://github.com/settings/tokens)

## Verify After Push

After successful push, check:
- https://github.com/guruk1803/gsquad-forever
- You should see all your files!


