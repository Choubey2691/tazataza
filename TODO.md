## Current Status
- React + Vite app with Supabase Auth and Google OAuth
- Capacitor Android app
- Currently running on localhost:8080 and network IP
- Issues: hardcoded localhost, inconsistent redirects, mobile login redirects to https://localhost

## Required Changes

### 1. Central App Config File
- Create `config/appConfig.ts`
- Include APP_URL, SUPABASE_URL, ENV detection, fallback handling
- Support DEV → localhost, NETWORK → window origin, PRODUCTION → domain

### 2. Universal Redirect Helper
- Create helper function for consistent redirect URLs
- Handle localhost, network, production, Capacitor scenarios
- Prevent https://localhost redirects

### 3. Update Supabase Auth Login Function
- Use universal redirect helper
- Ensure production-safe OAuth flow

### 4. Environment Variables Template
- Create `.env.example` with required variables
- Include VITE_APP_ENV, VITE_APP_DOMAIN, VITE_NETWORK_URL, VITE_LOCAL_URL

### 5. Production Safe Supabase Client
- Add error handling and session restore logic
- Mobile-safe initialization

### 6. Vite Config Updates
- Enable network hosting for development
- Environment separation

### 7. Capacitor Mobile Auth Handling
- Ensure login works in WebView
- Proper redirect after OAuth return
- Session restoration

### 8. Production Checklists
- Supabase Production URL Config
- Google OAuth Production Config
- Domain Deployment
- APK Production Build

## Implementation Steps
- [ ] Create config/appConfig.ts
- [ ] Create universal redirect helper
- [ ] Update LoginScreen.tsx with new auth function
- [ ] Create .env.example
- [ ] Update supabase client for production safety
- [ ] Update vite.config.ts for production readiness
- [ ] Verify Capacitor configuration
- [ ] Generate production checklists
=======
# Production Deployment Preparation - Phase 0 ✅ COMPLETED

## Current Status
- React + Vite app with Supabase Auth and Google OAuth
- Capacitor Android app
- Currently running on localhost:8080 and network IP
- Issues: hardcoded localhost, inconsistent redirects, mobile login redirects to https://localhost

## ✅ Completed Changes

### 1. Central App Config File
- ✅ Created `src/config/appConfig.ts`
- ✅ Includes APP_URL, SUPABASE_URL, ENV detection, fallback handling
- ✅ Supports DEV → localhost, NETWORK → window origin, PRODUCTION → domain

### 2. Universal Redirect Helper
- ✅ Created `getRedirectUrl()` function in appConfig.ts
- ✅ Handles localhost, network, production, Capacitor scenarios
- ✅ Prevents https://localhost redirects

### 3. Update Supabase Auth Login Function
- ✅ Created `src/lib/auth.ts` with `loginWithGoogle()` function
- ✅ Uses universal redirect helper
- ✅ Ensures production-safe OAuth flow

### 4. Environment Variables Template
- ✅ Created `.env.example` with required variables
- ✅ Includes VITE_APP_ENV, VITE_APP_DOMAIN, VITE_NETWORK_URL, VITE_LOCAL_URL

### 5. Production Safe Supabase Client
- ✅ Updated `src/integrations/supabase/client.ts`
- ✅ Added error handling and session restore logic
- ✅ Mobile-safe initialization with Capacitor support

### 6. Vite Config Updates
- ✅ Updated `vite.config.ts` for production readiness
- ✅ Enabled network hosting for development
- ✅ Added build optimizations and environment separation

### 7. Capacitor Mobile Auth Handling
- ✅ Verified Capacitor configuration in `capacitor.config.ts`
- ✅ Ensured login works in WebView
- ✅ Proper redirect after OAuth return with session restoration

### 8. Production Checklists
- ✅ Created `PRODUCTION_CHECKLIST.md`
- ✅ Supabase Production URL Config Checklist
- ✅ Google OAuth Production Config Checklist
- ✅ Domain Deployment Checklist
- ✅ APK Production Build Checklist

## ✅ Implementation Steps Completed
- [x] Create config/appConfig.ts
- [x] Create universal redirect helper
- [x] Update LoginScreen.tsx with new auth function
- [x] Create .env.example
- [x] Update supabase client for production safety
- [x] Update vite.config.ts for production readiness
- [x] Verify Capacitor configuration
- [x] Generate production checklists

## Next Steps
1. **Set up environment variables**: Copy `.env.example` to `.env` and configure for your environment
2. **Test locally**: Run `npm run dev` and verify login works
3. **Test network mode**: Set `VITE_APP_ENV=network` and test with mobile
4. **Build for production**: Run `npm run build` and test with `npm run preview`
5. **Deploy to domain**: Follow the deployment checklist in `PRODUCTION_CHECKLIST.md`
6. **Configure Supabase**: Update auth settings with production URLs
7. **Build APK**: Update Capacitor config and build for Android
