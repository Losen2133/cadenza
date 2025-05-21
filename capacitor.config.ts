import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'cadenza',
  webDir: 'www',

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#4A4A4A',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      iosSpinnerStyle: 'small',
      splashFullScreen: true,
      splashImmersive: true,
    }
  }
};

export default config;
