import type { CapacitorConfig } from '@capacitor/cli';

// PRODUCTION CONFIGURATION
// Production ortamında kullanmak için bu dosyayı capacitor.config.ts ile değiştirin

const config: CapacitorConfig = {
    appId: 'com.supplabs.app',
    appName: 'SuppLabs',
    webDir: 'www',
    bundledWebRuntime: false,
    server: {
        // Production URL - SuppLabs website
        url: 'https://www.supplabs.xyz',
        cleartext: false,
        androidScheme: 'https'
    },
    android: {
        allowMixedContent: false,
        captureInput: true,
        webContentsDebuggingEnabled: false  // Production'da false olmalı
    }
};

export default config;
