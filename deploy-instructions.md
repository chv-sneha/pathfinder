# Quick Deployment Fix

## For Vercel Deployment:

1. **Zip your project folder**
2. **Go to vercel.com/new**
3. **Drag and drop the zip file**
4. **Use these settings:**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

## Alternative - GitHub Method:

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/pathfinder-pro.git
git push -u origin main
```

2. **Import from GitHub on Vercel**

## If still getting runtime errors:

Delete `vercel.json` and let Vercel auto-detect the framework.

The app will work as frontend-only without the backend API.