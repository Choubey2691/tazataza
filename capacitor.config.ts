const config: CapacitorConfig = {
  appId: 'com.tazataza.app',
  appName: 'Taza Taza',
  webDir: 'dist'
};

export default config;
=======
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tazataza.app',
  appName: 'Taza Taza',
  webDir: 'dist',
  server: {
    // Allow OAuth redirects to work properly
    allowNavigation: ['*'],
  },
  plugins: {
    // Ensure Capacitor handles OAuth redirects
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
