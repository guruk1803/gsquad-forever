# Git & GitHub Setup Guide

## 📦 Why Commit to GitHub Before Deployment?

**Yes, you should commit to GitHub!** Here's why:
- ✅ Version control - track changes
- ✅ Easy deployment - services like Vercel/Railway connect to GitHub
- ✅ Backup - your code is safe in the cloud
- ✅ Collaboration - work with others
- ✅ Rollback - easily revert if something breaks

---

## 🚀 Step-by-Step: Setting Up GitHub Repository

### Step 1: Create GitHub Repository

1. **Go to GitHub**: https://github.com
2. **Sign in** (or create account if needed)
3. **Click the "+" icon** (top right) → **"New repository"**
4. **Fill in details**:
   - **Repository name**: `gsquad-forever` (or your preferred name)
   - **Description**: "Universal Celebration Platform - Gsquad Forever"
   - **Visibility**: 
     - ✅ **Public** (free, anyone can see)
     - 🔒 **Private** (requires paid plan, or free for students)
   - **DO NOT** check "Initialize with README" (we already have files)
   - **DO NOT** add .gitignore or license (we have them)
5. **Click "Create repository"**

### Step 2: Copy Repository URL

After creating, GitHub will show you a page with commands. **Copy the repository URL**:
- It will look like: `https://github.com/yourusername/gsquad-forever.git`
- Or SSH: `git@github.com:yourusername/gsquad-forever.git`

**Keep this URL handy!**

---

## 💻 Step 3: Initialize Git Locally

Open your terminal in the project folder (`d:\projects\gsquadwed`):

### Check if Git is Installed

```bash
git --version
```

If you see a version number, Git is installed. If not:
- **Download**: https://git-scm.com/download/win
- **Install** and restart terminal

### Initialize Git Repository

```bash
# Make sure you're in the project folder
cd d:\projects\gsquadwed

# Initialize git
git init
```

### Configure Git (if first time)

```bash
# Set your name
git config --global user.name "Your Name"

# Set your email (use GitHub email)
git config --global user.email "your.email@example.com"
```

---

## 📝 Step 4: Add Files and Make First Commit

### Check What Files Will Be Committed

```bash
git status
```

You should see a list of untracked files.

### Add All Files

```bash
# Add all files
git add .
```

### Make Your First Commit

```bash
git commit -m "Initial commit: Gsquad Forever - Universal Celebration Platform"
```

**Commit message tips:**
- Be descriptive
- Use present tense ("Add feature" not "Added feature")
- Keep it concise

---

## 🔗 Step 5: Connect to GitHub

### Add Remote Repository

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual values:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

**Example:**
```bash
git remote add origin https://github.com/johndoe/gsquad-forever.git
```

### Verify Remote

```bash
git remote -v
```

Should show:
```
origin  https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git (fetch)
origin  https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git (push)
```

---

## 📤 Step 6: Push to GitHub

### Push Your Code

```bash
# Rename default branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

**First time?** GitHub will ask for authentication:
- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (not your password)

### Create Personal Access Token

If you need a token:

1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **"Generate new token (classic)"**
3. **Name**: `gsquad-forever-deployment`
4. **Expiration**: Choose duration (90 days recommended)
5. **Scopes**: Check **`repo`** (full control)
6. Click **"Generate token"**
7. **Copy the token** (you won't see it again!)
8. Use this token as your password when pushing

---

## ✅ Step 7: Verify on GitHub

1. **Refresh your GitHub repository page**
2. **You should see all your files!**
3. **Check that `.env` files are NOT there** (they're in `.gitignore`)

---

## 🔄 Future Commits (After Initial Setup)

Once set up, future commits are easy:

```bash
# 1. Check what changed
git status

# 2. Add changed files
git add .

# 3. Commit with message
git commit -m "Description of changes"

# 4. Push to GitHub
git push
```

---

## 📋 Quick Command Reference

```bash
# Check status
git status

# Add all files
git add .

# Add specific file
git add filename.js

# Commit
git commit -m "Your message"

# Push to GitHub
git push

# Pull latest changes
git pull

# See commit history
git log

# See what changed
git diff
```

---

## 🛡️ Important: What NOT to Commit

Your `.gitignore` already excludes these, but double-check:

**Never commit:**
- ❌ `.env` files (contain secrets)
- ❌ `node_modules/` (too large, reinstall with `npm install`)
- ❌ Build folders (`dist/`, `build/`)
- ❌ Database files
- ❌ Personal credentials

**Always commit:**
- ✅ Source code (`.js`, `.jsx`, `.ts`, etc.)
- ✅ Configuration files (`.json`, `.config.js`)
- ✅ Documentation (`.md` files)
- ✅ `.gitignore`
- ✅ `README.md`

---

## 🚨 Troubleshooting

### "fatal: not a git repository"

**Fix:**
```bash
cd d:\projects\gsquadwed
git init
```

### "remote origin already exists"

**Fix:**
```bash
# Remove existing remote
git remote remove origin

# Add correct remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### "Authentication failed"

**Fix:**
- Use Personal Access Token instead of password
- Make sure token has `repo` scope
- Check username is correct

### "Permission denied"

**Fix:**
- Verify repository URL is correct
- Check you have write access to the repository
- Try using SSH instead of HTTPS

### "Large files" error

**Fix:**
- Make sure `node_modules/` is in `.gitignore`
- Remove large files: `git rm --cached largefile.ext`
- Commit again

---

## 🎯 Next Steps After Committing

Once your code is on GitHub:

1. **Deploy to Vercel/Netlify** (frontend)
   - Connect GitHub repository
   - Auto-deploys on every push

2. **Deploy to Railway/Render** (backend)
   - Connect GitHub repository
   - Auto-deploys on every push

3. **Set up CI/CD** (optional)
   - Automatic testing
   - Automatic deployment

---

## 📚 Best Practices

### Commit Messages

**Good:**
```
✅ "Add image upload functionality"
✅ "Fix slug URL generation issue"
✅ "Update admin dashboard with statistics"
```

**Bad:**
```
❌ "fix"
❌ "update"
❌ "changes"
```

### Commit Frequency

- ✅ Commit after completing a feature
- ✅ Commit before deployment
- ✅ Commit when fixing bugs
- ❌ Don't commit broken code
- ❌ Don't commit every single small change

### Branch Strategy (Advanced)

For larger projects:
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push branch
git push -u origin feature/new-feature

# Merge to main later via GitHub Pull Request
```

---

## ✅ Checklist

Before pushing to GitHub:

- [ ] Git is installed
- [ ] GitHub repository created
- [ ] `.gitignore` is correct (check it excludes `.env`, `node_modules`)
- [ ] All code is working locally
- [ ] No sensitive data in files (check for passwords, API keys)
- [ ] README.md is updated
- [ ] Commit message is descriptive

---

## 🎉 You're Done!

Your code is now on GitHub and ready for deployment! 

**Next**: Follow `DEPLOYMENT.md` to deploy your application.

---

**Need Help?**
- Git Documentation: https://git-scm.com/doc
- GitHub Help: https://docs.github.com
- Git Cheat Sheet: https://education.github.com/git-cheat-sheet-education.pdf


