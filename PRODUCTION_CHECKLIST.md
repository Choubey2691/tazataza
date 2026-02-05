# Production Deployment Checklists - Phase 0

## ✅ Supabase Production URL Config Checklist

- [ ] **Supabase Project URL**: Update `VITE_SUPABASE_URL` in production environment
- [ ] **Supabase Anon Key**: Ensure `VITE_SUPABASE_PUBLISHABLE_KEY` is set for production
- [ ] **Auth Redirect URLs**: Configure the following in Supabase Auth settings:
  - `https://tazataza.in` (production domain)
  - `http://localhost:8080` (development)
  - `http://192.168.X.X:8080` (network testing)
  - `com.tazataza.app://` (Capacitor deep link)
- [ ] **Site URL**: Set site URL to `https://tazataza.in` in Supabase project settings
- [ ] **Environment Variables**: Verify all required env vars are set in production hosting

## ✅ Google OAuth Production Config Checklist

- [ ] **Google Cloud Console**: Authorized origins include:
  - `https://tazataza.in`
  - `http://localhost:8080`
  - `http://192.168.X.X:8080`
- [ ] **Redirect URIs**: Include Supabase auth callback URLs:
  - `https://your-project.supabase.co/auth/v1/callback`
- [ ] **OAuth Consent Screen**: App name and logo configured
- [ ] **Client ID**: Correct client ID in Supabase Auth settings
- [ ] **Client Secret**: Correct client secret in Supabase Auth settings

## ✅ Domain Deployment Checklist

- [ ] **DNS Configuration**: Point `tazataza.in` to production hosting IP
- [ ] **SSL Certificate**: HTTPS enabled with valid certificate
- [ ] **Environment Variables**: Set production env vars on hosting platform:
  ```
  VITE_APP_ENV=production
  VITE_APP_DOMAIN=https://tazataza.in
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
  ```
- [ ] **Build Process**: Production build tested locally with `npm run build`
- [ ] **CORS Headers**: Hosting platform allows requests from `tazataza.in`
- [ ] **Redirect Rules**: Configure hosting for SPA routing (handle 404s → index.html)

## ✅ APK Production Build Checklist

- [ ] **Capacitor Config**: `capacitor.config.ts` has correct server URL:
  ```typescript
  server: {
    url: 'https://tazataza.in',
    cleartext: false
  }
  ```
- [ ] **Android Manifest**: Update `android/app/src/main/AndroidManifest.xml`:
  - Custom URL scheme: `com.tazataza.app`
  - Intent filters for OAuth redirects
- [ ] **Build Process**: Test APK build with `npx cap build android`
- [ ] **Signing Config**: Production keystore configured
- [ ] **App Store**: Prepare for Play Store submission
- [ ] **Version Bump**: Update version in `package.json` and `android/app/build.gradle`

## ✅ Security & Performance Checklist

- [ ] **No Hardcoded URLs**: All localhost references removed
- [ ] **Environment Variables**: No secrets in codebase
- [ ] **HTTPS Only**: All production URLs use HTTPS
- [ ] **CSP Headers**: Content Security Policy configured if needed
- [ ] **Error Handling**: Graceful error handling for auth failures
- [ ] **Session Security**: PKCE flow enabled for OAuth

## ✅ Testing Checklist

- [ ] **Local Development**: `VITE_APP_ENV=development` works
- [ ] **Network Testing**: `VITE_APP_ENV=network` with IP address works
- [ ] **Production Build**: `npm run build` succeeds
- [ ] **Mobile WebView**: Login works in Capacitor WebView
- [ ] **OAuth Flow**: Complete login/logout cycle tested
- [ ] **Redirect Prevention**: No localhost redirects in production

## Environment Setup Commands

```bash
# Development
cp .env.example .env
# Edit .env with development values

# Network Testing
VITE_APP_ENV=network VITE_NETWORK_URL=http://192.168.X.X:8080 npm run dev

# Production Build
npm run build
```

## Deployment Commands

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to hosting platform
# (Follow your hosting platform's deployment instructions)
```

## Rollback Plan

- [ ] **Environment Backup**: Keep previous working environment variables
- [ ] **Version Control**: Tag current working version
- [ ] **Quick Rollback**: Ability to revert to previous deployment within 5 minutes
- [ ] **Monitoring**: Set up error tracking (Sentry, LogRocket, etc.)
