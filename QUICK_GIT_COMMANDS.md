# Quick Git Commands - Copy & Paste

## 🚀 First Time Setup (One-Time)

### 1. Create GitHub Repository First
- Go to https://github.com/new
- Name: `gsquad-forever`
- Click "Create repository"
- **Copy the repository URL** (you'll need it)

### 2. Run These Commands in Order

```bash
# Navigate to project folder
cd d:\projects\gsquadwed

# Initialize git
git init

# Configure git (replace with your info)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Add all files
git add .

# Make first commit
git commit -m "Initial commit: Gsquad Forever platform"

# Add GitHub repository (REPLACE with your URL)
git remote add origin https://github.com/YOUR_USERNAME/gsquad-forever.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**When prompted for password:** Use a GitHub Personal Access Token (not your password)

---

## 📝 Future Commits (After Setup)

```bash
# Check what changed
git status

# Add all changes
git add .

# Commit
git commit -m "Your commit message here"

# Push to GitHub
git push
```

---

## 🔑 Create Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: `gsquad-forever`
4. Check `repo` scope
5. Click "Generate"
6. **Copy the token** (use as password when pushing)

---

## ✅ Verify Everything is Committed

```bash
git status
```

Should show: `nothing to commit, working tree clean`

---

## 📖 Full Guide

See `GIT_SETUP_GUIDE.md` for detailed instructions and troubleshooting.

