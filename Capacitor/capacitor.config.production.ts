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
        url: 'https://www.supplabs.com.tr/',
        allowNavigation: [
            'supplabs.com.tr',
            '*.supplabs.com.tr'
        ],
        cleartext: true,
        androidScheme: 'https'
    },
    android: {
        allowMixedContent: true,
        captureInput: true,
        webContentsDebuggingEnabled: false
    }
};

export default config;
