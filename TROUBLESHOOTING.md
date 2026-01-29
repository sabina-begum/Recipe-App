# Troubleshooting Guide

This guide helps you resolve common development issues with the CULINARIA app.

## Quick Fixes

### 1. **React Null/Undefined Errors**

```bash
# Clear browser cache and restart dev server
npm run dev:clean
```

### 2. **Module Import Errors**

```bash
# Full cleanup and reinstall
npm run dev:fresh
```

### 3. **Build Errors**

```bash
# Clear all caches and check for issues
npm run troubleshoot
```

## Common Issues & Solutions

### 🔴 "Cannot read properties of null (reading 'useState')"

**Cause:** React is null due to circular dependencies or cached modules.

**Solutions:**

1. **Clear browser cache** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Clear Vite cache:**
   ```bash
   npm run cleanup
   ```
3. **Check for circular dependencies** in your imports
4. **Use defensive imports** (see `src/utils/safeImports.tsx`)

### 🔴 "Cannot read properties of null (reading 'useContext')"

**Cause:** Context provider not available or React import issues.

**Solutions:**

1. **Check provider order** in `main.tsx`
2. **Use safe context hooks** (see `src/components/Navbar.tsx`)
3. **Clear browser data** completely
4. **Restart development server**

### 🔴 "Module not found" Errors

**Cause:** Missing dependencies or corrupted node_modules.

**Solutions:**

1. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
2. **Check package.json** for missing dependencies
3. **Clear npm cache:**
   ```bash
   npm cache clean --force
   ```

### 🔴 Hot Module Replacement (HMR) Issues

**Cause:** Stale cache or module conflicts.

**Solutions:**

1. **Clear Vite cache:**
   ```bash
   npm run cleanup
   ```
2. **Hard refresh browser** (Ctrl+Shift+R)
3. **Restart dev server:**
   ```bash
   npm run dev
   ```

### 🔴 Build Failures

**Cause:** Type errors, missing files, or configuration issues.

**Solutions:**

1. **Check for TypeScript errors:**
   ```bash
   npm run type-check
   ```
2. **Run linter:**
   ```bash
   npm run lint
   ```
3. **Check for missing environment variables**

## Development Scripts

### Cache Management

```bash
# Quick cache cleanup
npm run cleanup

# Full cleanup (including package-lock.json)
npm run cleanup:full

# Check for common issues
npm run cleanup:check
```

### Health Checks

```bash
# Run module health check
npm run health-check

# Full troubleshooting
npm run troubleshoot
```

### Development with Cleanup

```bash
# Start dev server with cache cleanup
npm run dev:clean

# Fresh start (full cleanup + reinstall)
npm run dev:fresh
```

## Best Practices

### 1. **Import Structure**

- Use absolute imports when possible
- Avoid circular dependencies
- Use defensive imports for critical modules

### 2. **Error Handling**

- Always wrap context usage in try-catch
- Provide fallback values for missing modules
- Use error boundaries for component errors

### 3. **Development Workflow**

- Clear cache regularly during development
- Use `npm run dev:clean` for fresh starts
- Check console for health check warnings

### 4. **Module Health**

- Run health checks when adding new dependencies
- Monitor for circular dependency warnings
- Keep dependencies up to date

## Debugging Tools

### 1. **Browser DevTools**

- Check Console for error messages
- Monitor Network tab for failed requests
- Use React DevTools for component debugging

### 2. **Vite DevTools**

- Check HMR status
- Monitor module loading
- View build analysis

### 3. **Health Check Utility**

```javascript
import moduleHealthCheck from "./src/utils/moduleHealthCheck.ts";

// Run health check
moduleHealthCheck.logHealthCheck();
```

## Environment Setup

### Required Environment Variables

```bash
# Copy from example
cp env.example .env

# Required variables:
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
```

### Node.js Version

- **Required:** Node.js >= 18.0.0
- **Recommended:** Node.js >= 20.0.0

### Package Manager

- **Recommended:** npm >= 8.0.0
- **Alternative:** yarn or pnpm

## Getting Help

### 1. **Check Error Messages**

- Look for specific error codes
- Check stack traces for file locations
- Note any module names mentioned

### 2. **Run Diagnostics**

```bash
npm run troubleshoot
```

### 3. **Check Logs**

- Browser console logs
- Terminal output
- Vite build logs

### 4. **Common Solutions**

- Clear all caches
- Restart development server
- Check for circular dependencies
- Verify environment variables

## Prevention

### 1. **Regular Maintenance**

- Run `npm run cleanup` weekly
- Update dependencies monthly
- Monitor for deprecation warnings

### 2. **Code Quality**

- Use ESLint for code quality
- Run type checks regularly
- Follow import best practices

### 3. **Testing**

- Test components in isolation
- Verify context providers work
- Check for memory leaks

---

**Need more help?** Check the console for specific error messages and run `npm run troubleshoot` for automated diagnostics.
