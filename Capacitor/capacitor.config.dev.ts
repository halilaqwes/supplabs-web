import type { CapacitorConfig } from '@capacitor/cli';

// DEVELOPMENT CONFIGURATION (localhost)
// Bu dosya development için kullanılıyor

const config: CapacitorConfig = {
    appId: 'com.supplabs.app',
    appName: 'SuppLabs',
    webDir: 'www',
    bundledWebRuntime: false,
    server: {
        url: 'http://localhost:3000',
        cleartext: true,
        androidScheme: 'http'
    },
    android: {
        allowMixedContent: true,
        captureInput: true,
        webContentsDebuggingEnabled: true
    }
};

export default config;
